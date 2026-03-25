import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { homedir } from 'node:os';
import type { GlobalOptions } from '../core/types.js';
import { listMcps, searchMcps, getMcp, type McpEntry, type McpBundleInfo } from '../core/registry.js';
import { fetchMcpBundleFiles } from '../core/private-registry.js';
import { getSavedTokens, saveTokens, maskToken } from '../core/mcp-tokens.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { heading, success, info, warn, error as logError, list } from '../utils/log.js';
import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';

// ---------------------------------------------------------------------------
// list mcps
// ---------------------------------------------------------------------------

export async function listMcpsCommand(opts: GlobalOptions): Promise<void> {
  heading('Available MCPs');

  try {
    const mcps = await listMcps();

    for (const mcp of mcps) {
      const hasPlaceholders = mcp.placeholders && Object.keys(mcp.placeholders).length > 0;
      const badge = hasPlaceholders ? ' [requires config]' : '';
      const privateBadge = mcp.source === 'private' ? chalk.magenta(' [private]') : '';
      info(`  ${mcp.name}${badge}${privateBadge}`);
      info(`    ${mcp.description}`);
    }

    info(`\n${mcps.length} MCP(s) available.`);
  } catch (err: any) {
    logError(`Failed to list MCPs: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// search mcps
// ---------------------------------------------------------------------------

export async function searchMcpsCommand(query: string, opts: GlobalOptions): Promise<void> {
  heading(`Searching MCPs for "${query}"`);

  try {
    const results = await searchMcps(query);

    if (results.length === 0) {
      info('No matching MCPs found.');
      return;
    }

    for (const mcp of results) {
      const privateBadge = mcp.source === 'private' ? chalk.magenta(' [private]') : '';
      info(`  ${mcp.name}${privateBadge}`);
      info(`    ${mcp.description}`);
    }

    info(`\n${results.length} result(s).`);
  } catch (err: any) {
    logError(`Failed to search MCPs: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// inspect mcp
// ---------------------------------------------------------------------------

export async function inspectMcpCommand(name: string, opts: GlobalOptions): Promise<void> {
  try {
    const mcp = await getMcp(name);
    heading(`MCP: ${mcp.name}`);
    info(`  Description: ${mcp.description}`);
    info(`  Command:     ${mcp.command}`);
    info(`  Args:        ${mcp.args.join(' ')}`);

    if (mcp.env && Object.keys(mcp.env).length > 0) {
      info(`  Env vars:`);
      for (const [k, v] of Object.entries(mcp.env)) {
        info(`    ${k}: ${v}`);
      }
    }

    if (mcp.placeholders && Object.keys(mcp.placeholders).length > 0) {
      info(`  Required config:`);
      for (const [k, v] of Object.entries(mcp.placeholders)) {
        info(`    ${k} — ${v}`);
      }
    }
  } catch (err: any) {
    logError(err.message);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// add mcps
// ---------------------------------------------------------------------------

interface McpServerEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/** Standard .mcp.json format (Claude, Windsurf, Cursor, custom). */
interface StandardMcpConfig {
  mcpServers?: Record<string, McpServerEntry>;
  [key: string]: unknown;
}

/** GitHub Copilot .vscode/mcp.json format. */
interface GitHubMcpConfig {
  servers?: Record<string, McpServerEntry>;
  [key: string]: unknown;
}

type McpConfig = StandardMcpConfig | GitHubMcpConfig;

function isGitHubTarget(preset: string): boolean {
  return preset === 'github';
}

function getMcpConfigPath(rootDir: string, preset: string): string {
  if (isGitHubTarget(preset)) {
    // VS Code / GitHub Copilot: .vscode/mcp.json in project root
    return join(dirname(rootDir), '.vscode', 'mcp.json');
  }
  // All others: .mcp.json in project root (one level above .claude/.windsurf/.cursor)
  return join(dirname(rootDir), '.mcp.json');
}

function getServersKey(preset: string): 'servers' | 'mcpServers' {
  return isGitHubTarget(preset) ? 'servers' : 'mcpServers';
}

function readMcpConfig(configPath: string, preset: string): McpConfig {
  const key = getServersKey(preset);
  if (!existsSync(configPath)) return { [key]: {} };
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function writeMcpConfig(configPath: string, config: McpConfig): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

function getServers(config: McpConfig, preset: string): Record<string, McpServerEntry> {
  const key = getServersKey(preset);
  return (config as Record<string, unknown>)[key] as Record<string, McpServerEntry> ?? {};
}

function setServers(config: McpConfig, preset: string, servers: Record<string, McpServerEntry>): void {
  const key = getServersKey(preset);
  (config as Record<string, unknown>)[key] = servers;
}

async function resolvePlaceholders(
  mcp: McpEntry,
  opts: GlobalOptions,
): Promise<{ args: string[]; env: Record<string, string> }> {
  if (!mcp.placeholders || Object.keys(mcp.placeholders).length === 0) {
    return { args: [...mcp.args], env: mcp.env ? { ...mcp.env } : {} };
  }

  const saved = getSavedTokens(mcp.name);
  const values: Record<string, string> = {};

  for (const [key, description] of Object.entries(mcp.placeholders)) {
    if (opts.yes) {
      if (saved[key]) {
        values[key] = saved[key];
        info(`Using saved value for ${key}`);
      } else {
        warn(`Placeholder {{${key}}} left as-is (non-interactive mode)`);
        values[key] = `{{${key}}}`;
      }
    } else {
      const savedValue = saved[key];
      if (savedValue) {
        const answer = await input({
          message: `${key} (${description}) — press Enter to reuse [${maskToken(savedValue)}]`,
          default: '',
        });
        values[key] = answer || savedValue;
      } else {
        values[key] = await input({
          message: `${key}: ${description}`,
        });
      }
    }
  }

  // Persist resolved tokens for next time
  const toSave: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    if (!v.startsWith('{{')) toSave[k] = v;
  }
  if (Object.keys(toSave).length > 0) saveTokens(mcp.name, toSave);

  // Replace placeholders in args
  const args = mcp.args.map((arg) => {
    let result = arg;
    for (const [key, val] of Object.entries(values)) {
      result = result.replace(`{{${key}}}`, val);
    }
    return result;
  });

  // Replace placeholders in env
  const env: Record<string, string> = {};
  if (mcp.env) {
    for (const [envKey, envVal] of Object.entries(mcp.env)) {
      let result = envVal;
      for (const [key, val] of Object.entries(values)) {
        result = result.replace(`{{${key}}}`, val);
      }
      env[envKey] = result;
    }
  }

  return { args, env };
}

// ---------------------------------------------------------------------------
// MCP bundle installation
// ---------------------------------------------------------------------------

type InstallScope = 'project' | 'global';

const GLOBAL_MCP_DIR = join(homedir(), '.imperium', 'mcp-installs');

/** Build a map of bundle dest → actual install path based on scope. */
function buildBundlePathMap(
  mcpName: string,
  bundles: McpBundleInfo[],
  projectRoot: string,
  scope: InstallScope,
): Map<string, string> {
  const pathMap = new Map<string, string>();
  for (const bundle of bundles) {
    const destDir = scope === 'global'
      ? join(GLOBAL_MCP_DIR, mcpName, bundle.name)
      : join(projectRoot, bundle.dest);
    pathMap.set(bundle.dest, destDir);
  }
  return pathMap;
}

/** Rewrite a string value, replacing bundle dest references with actual paths. */
function rewriteBundlePaths(
  value: string,
  bundles: McpBundleInfo[],
  pathMap: Map<string, string>,
): string {
  let result = value;
  // Sort by dest length descending to avoid partial matches
  const sorted = [...bundles].sort((a, b) => b.dest.length - a.dest.length);
  for (const bundle of sorted) {
    const absPath = pathMap.get(bundle.dest);
    if (!absPath) continue;
    result = result.replaceAll(`./${bundle.dest}`, absPath);
    result = result.replaceAll(bundle.dest, absPath);
  }
  return result;
}

async function installMcpBundles(
  mcpName: string,
  mcp: McpEntry,
  projectRoot: string,
  scope: InstallScope,
): Promise<Map<string, string>> {
  const pathMap = new Map<string, string>();
  if (!mcp.bundles) return pathMap;

  const bundlePathMap = buildBundlePathMap(mcpName, mcp.bundles, projectRoot, scope);

  for (const bundle of mcp.bundles) {
    const destDir = bundlePathMap.get(bundle.dest)!;
    pathMap.set(bundle.dest, destDir);

    // Skip if already installed (directory exists with files)
    if (existsSync(destDir)) {
      const label = scope === 'global' ? destDir : `${bundle.dest}/`;
      info(`  Bundle ${bundle.name} already exists at ${label}, skipping`);
      continue;
    }

    info(`  Downloading bundle: ${bundle.name}...`);
    const files = await fetchMcpBundleFiles(mcpName, bundle.name);

    // Write all files
    for (const file of files) {
      const filePath = join(destDir, file.path);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, file.content, 'utf-8');
    }
    const label = scope === 'global' ? destDir : `${bundle.dest}/`;
    success(`  ${bundle.name}: ${files.length} files → ${label}`);

    // Run post-install command (e.g., npm install)
    if (bundle.postInstall) {
      info(`  Running: ${bundle.postInstall}...`);
      try {
        execSync(bundle.postInstall, {
          cwd: destDir,
          stdio: 'inherit',
          timeout: 120_000,
        });
        success(`  Post-install complete`);
      } catch (err: any) {
        warn(`  Post-install failed: ${err.message}`);
      }
    }
  }

  // Generate config file if specified (always project-level, rewrite paths for global)
  if (mcp.configFile) {
    const cfgPath = join(projectRoot, mcp.configFile.path);
    if (!existsSync(cfgPath)) {
      let content = mcp.configFile.content;
      if (scope === 'global') {
        const json = JSON.stringify(content);
        const rewritten = rewriteBundlePaths(json, mcp.bundles, pathMap);
        content = JSON.parse(rewritten);
      }
      writeFileSync(cfgPath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
      success(`  Config written: ${mcp.configFile.path}`);
    }
  }

  return pathMap;
}

export async function addMcpsCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  const parsed = names.flatMap((n) => n.split(',')).map((s) => s.trim()).filter(Boolean);

  if (parsed.length === 0) {
    logError('No MCP names provided. Usage: imperium add mcps <name...>');
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);
  const configPath = getMcpConfigPath(target.rootDir, target.preset);
  const projectRoot = dirname(target.rootDir);

  const config = readMcpConfig(configPath, target.preset);
  const servers = getServers(config, target.preset);

  for (const name of parsed) {
    try {
      const mcp = await getMcp(name);

      if (servers[name] && !opts.force) {
        warn(`${name} already configured — use --force to overwrite`);
        continue;
      }

      info(`Adding MCP: ${name}...`);

      // Determine install scope for MCPs with bundles
      let scope: InstallScope = 'project';
      let pathMap = new Map<string, string>();

      if (mcp.bundles && mcp.bundles.length > 0) {
        if (!opts.yes && !opts.dryRun) {
          scope = await select({
            message: 'Install MCP bundles at:',
            choices: [
              { name: 'Project level — files in this project only', value: 'project' as InstallScope },
              { name: `Global — shared across projects (~/.imperium/mcp-installs/)`, value: 'global' as InstallScope },
            ],
          });
        }

        if (!opts.dryRun) {
          pathMap = await installMcpBundles(name, mcp, projectRoot, scope);
        }
      }

      const { args, env } = await resolvePlaceholders(mcp, opts);

      // Rewrite args/env paths for global scope
      const finalArgs = scope === 'global' && mcp.bundles
        ? args.map((a) => rewriteBundlePaths(a, mcp.bundles!, pathMap))
        : args;
      const finalEnv: Record<string, string> = {};
      for (const [k, v] of Object.entries(env)) {
        finalEnv[k] = scope === 'global' && mcp.bundles
          ? rewriteBundlePaths(v, mcp.bundles!, pathMap)
          : v;
      }

      const entry: McpServerEntry = {
        command: mcp.command,
        args: finalArgs,
      };

      if (Object.keys(finalEnv).length > 0) {
        entry.env = finalEnv;
      }

      if (opts.dryRun) {
        info(`Would add to ${configPath}:`);
        info(`  "${name}": ${JSON.stringify(entry, null, 2)}`);
        if (mcp.bundles) {
          for (const b of mcp.bundles) {
            info(`  Would install bundle: ${b.name} → ${b.dest}/`);
          }
        }
        continue;
      }

      servers[name] = entry;
      success(`${name} added`);
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
    }
  }

  if (!opts.dryRun) {
    setServers(config, target.preset, servers);
    writeMcpConfig(configPath, config);
    success(`MCP config written to ${configPath}`);
  }
}

// ---------------------------------------------------------------------------
// remove mcps
// ---------------------------------------------------------------------------

export async function removeMcpsCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  const parsed = names.flatMap((n) => n.split(',')).map((s) => s.trim()).filter(Boolean);

  if (parsed.length === 0) {
    logError('No MCP names provided. Usage: imperium remove mcps <name...>');
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);
  const configPath = getMcpConfigPath(target.rootDir, target.preset);
  const configName = isGitHubTarget(target.preset) ? '.vscode/mcp.json' : '.mcp.json';

  if (!existsSync(configPath)) {
    logError(`No ${configName} found at ${configPath}`);
    process.exitCode = 1;
    return;
  }

  const config = readMcpConfig(configPath, target.preset);
  const servers = getServers(config, target.preset);

  for (const name of parsed) {
    if (!servers[name]) {
      warn(`${name} not found in ${configName}`);
      continue;
    }

    if (opts.dryRun) {
      info(`Would remove: ${name}`);
      continue;
    }

    delete servers[name];
    success(`${name} removed`);
  }

  if (!opts.dryRun) {
    setServers(config, target.preset, servers);
    writeMcpConfig(configPath, config);
    success(`MCP config updated at ${configPath}`);
  }
}
