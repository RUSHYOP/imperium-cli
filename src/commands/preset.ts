import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { GlobalOptions } from '../core/types.js';
import {
  listSetupPresets,
  searchSetupPresets,
  getSetupPreset,
  fetchPresetFile,
  type SetupPresetEntry,
} from '../core/registry.js';
import { heading, success, info, warn, error as logError, verbose } from '../utils/log.js';
import { addCommand } from './install.js';
import { addMcpsCommand } from './mcp.js';
import chalk from 'chalk';

// ---------------------------------------------------------------------------
// list presets
// ---------------------------------------------------------------------------

export async function listPresetsCommand(opts: GlobalOptions): Promise<void> {
  heading('Available setup presets');

  try {
    const presets = await listSetupPresets();

    if (presets.length === 0) {
      info('No setup presets available yet.');
      return;
    }

    for (const p of presets) {
      const privateBadge = p.source === 'private' ? chalk.magenta(' [private]') : '';
      info(`  ${p.name} (${p.adapter})${privateBadge}`);
      info(`    ${p.description}`);
      info(`    ${p.skills.length} skills, ${p.mcps.length} MCPs, ${p.files.length} files`);
    }

    info(`\n${presets.length} preset(s) available.`);
  } catch (err: any) {
    logError(`Failed to list presets: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// search presets
// ---------------------------------------------------------------------------

export async function searchPresetsCommand(
  query: string,
  opts: GlobalOptions,
): Promise<void> {
  heading(`Searching presets for "${query}"`);

  try {
    const results = await searchSetupPresets(query);

    if (results.length === 0) {
      info('No matching presets found.');
      return;
    }

    for (const p of results) {
      const privateBadge = p.source === 'private' ? chalk.magenta(' [private]') : '';
      info(`  ${p.name} (${p.adapter})${privateBadge}`);
      info(`    ${p.description}`);
    }

    info(`\n${results.length} result(s).`);
  } catch (err: any) {
    logError(`Failed to search presets: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// inspect preset
// ---------------------------------------------------------------------------

export async function inspectPresetCommand(
  name: string,
  opts: GlobalOptions,
): Promise<void> {
  try {
    const preset = await getSetupPreset(name);
    heading(`Setup Preset: ${preset.name}`);
    info(`  Description: ${preset.description}`);
    info(`  Adapter:     ${preset.adapter}`);

    if (preset.skills.length > 0) {
      info(`  Skills:`);
      for (const s of preset.skills) info(`    - ${s}`);
    }

    if (preset.mcps.length > 0) {
      info(`  MCPs:`);
      for (const m of preset.mcps) info(`    - ${m}`);
    }

    if (preset.files.length > 0) {
      info(`  Files:`);
      for (const f of preset.files) info(`    - ${f}`);
    }
  } catch (err: any) {
    logError(err.message);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// apply preset (called from setup command)
// ---------------------------------------------------------------------------

export async function applyPreset(
  preset: SetupPresetEntry,
  rootDir: string,
  opts: GlobalOptions,
): Promise<void> {
  // Ensure target adapter is passed through to child commands
  const childOpts: GlobalOptions = { ...opts, root: rootDir, target: (opts.target || preset.adapter) as any };

  // 1. Install skills
  if (preset.skills.length > 0) {
    heading(`Installing ${preset.skills.length} skill(s) from preset`);
    await addCommand(preset.skills, { ...childOpts, noFuzzy: true });
  }

  // 2. Configure MCPs
  if (preset.mcps.length > 0) {
    heading(`Configuring ${preset.mcps.length} MCP(s) from preset`);
    await addMcpsCommand(preset.mcps, childOpts);
  }

  // 3. Copy files (relative to project root, not rootDir)
  if (preset.files.length > 0) {
    heading(`Copying ${preset.files.length} file(s) from preset`);
    const projectRoot = dirname(rootDir);

    for (const filePath of preset.files) {
      try {
        const content = await fetchPresetFile(preset.name, filePath);
        const destPath = join(projectRoot, filePath);

        if (existsSync(destPath) && !opts.force) {
          warn(`${filePath} already exists — use --force to overwrite`);
          continue;
        }

        if (opts.dryRun) {
          info(`Would write: ${destPath}`);
          continue;
        }

        mkdirSync(dirname(destPath), { recursive: true });
        writeFileSync(destPath, content, 'utf-8');
        verbose(`  ${filePath}`);
      } catch (err: any) {
        logError(`  ${filePath}: ${err.message}`);
      }
    }

    if (!opts.dryRun) {
      success(`${preset.files.length} file(s) copied`);
    }
  }
}
