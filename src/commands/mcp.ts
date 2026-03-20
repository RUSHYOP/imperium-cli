import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { GlobalOptions } from '../core/types/index.js';
import { listMcps, searchMcps, getMcp, type McpEntry } from '../core/registry/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { heading, success, info, warn, error as logError, list } from '../utils/log.js';
import { input } from '@inquirer/prompts';

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
      info(`  ${mcp.name}${badge}`);
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
      info(`  ${mcp.name}`);
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

interface McpConfig {
  mcpServers?: Record<string, { command: string; args: string[]; env?: Record<string, string> }>;
  [key: string]: unknown;
}

function readMcpConfig(configPath: string): McpConfig {
  if (!existsSync(configPath)) return { mcpServers: {} };
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function writeMcpConfig(configPath: string, config: McpConfig): void {
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

async function resolvePlaceholders(
  mcp: McpEntry,
  opts: GlobalOptions,
): Promise<{ args: string[]; env: Record<string, string> }> {
  if (!mcp.placeholders || Object.keys(mcp.placeholders).length === 0) {
    return { args: [...mcp.args], env: mcp.env ? { ...mcp.env } : {} };
  }

  const values: Record<string, string> = {};

  for (const [key, description] of Object.entries(mcp.placeholders)) {
    if (opts.yes) {
      warn(`Placeholder {{${key}}} left as-is (non-interactive mode)`);
      values[key] = `{{${key}}}`;
    } else {
      values[key] = await input({
        message: `${key}: ${description}`,
      });
    }
  }

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
  const configPath = join(target.rootDir, '.mcp.json');

  const config = readMcpConfig(configPath);
  if (!config.mcpServers) config.mcpServers = {};

  for (const name of parsed) {
    try {
      const mcp = await getMcp(name);

      if (config.mcpServers[name] && !opts.force) {
        warn(`${name} already configured — use --force to overwrite`);
        continue;
      }

      info(`Adding MCP: ${name}...`);

      const { args, env } = await resolvePlaceholders(mcp, opts);

      const entry: { command: string; args: string[]; env?: Record<string, string> } = {
        command: mcp.command,
        args,
      };

      if (Object.keys(env).length > 0) {
        entry.env = env;
      }

      if (opts.dryRun) {
        info(`Would add to ${configPath}:`);
        info(`  "${name}": ${JSON.stringify(entry, null, 2)}`);
        continue;
      }

      config.mcpServers[name] = entry;
      success(`${name} added`);
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
    }
  }

  if (!opts.dryRun) {
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
  const configPath = join(target.rootDir, '.mcp.json');

  if (!existsSync(configPath)) {
    logError(`No .mcp.json found at ${configPath}`);
    process.exitCode = 1;
    return;
  }

  const config = readMcpConfig(configPath);
  if (!config.mcpServers) config.mcpServers = {};

  for (const name of parsed) {
    if (!config.mcpServers[name]) {
      warn(`${name} not found in .mcp.json`);
      continue;
    }

    if (opts.dryRun) {
      info(`Would remove: ${name}`);
      continue;
    }

    delete config.mcpServers[name];
    success(`${name} removed`);
  }

  if (!opts.dryRun) {
    writeMcpConfig(configPath, config);
    success(`MCP config updated at ${configPath}`);
  }
}
