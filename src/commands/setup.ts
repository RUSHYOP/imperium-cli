import { mkdirSync } from 'node:fs';
import type { GlobalOptions, PresetName } from '../core/types.js';
import { getAdapter } from '../adapters/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { writeLockfile, readLockfile } from '../core/lockfile.js';
import { heading, success, info, list, verbose, error as logError } from '../utils/log.js';
import { addCommand } from './install.js';
import { getSetupPreset, type SetupPresetEntry } from '../core/registry.js';
import { applyPreset } from './preset.js';
import { addInstructionsCommand } from './instructions.js';

const ADAPTER_NAMES = ['claude', 'github', 'windsurf', 'cursor', 'custom'] as const;

type AdapterArg = (typeof ADAPTER_NAMES)[number] | string;

function normalizeAdapter(raw: string): AdapterArg {
  // Strip leading dot: ".claude" → "claude"
  const cleaned = raw.replace(/^\./, '').toLowerCase();
  if (ADAPTER_NAMES.includes(cleaned as any)) return cleaned as AdapterArg;
  return 'custom';
}

export async function setupCommand(
  adapter: string | undefined,
  opts: GlobalOptions & { with?: string[]; preset?: string; instructions?: string[] },
): Promise<void> {
  let adapterName: AdapterArg;
  let setupPreset: SetupPresetEntry | null = null;

  // Resolve setup preset if specified
  if (opts.preset) {
    try {
      setupPreset = await getSetupPreset(opts.preset);
    } catch (err: any) {
      logError(err.message);
      process.exitCode = 1;
      return;
    }
    adapterName = adapter ? normalizeAdapter(adapter) : setupPreset.adapter;
  } else if (adapter) {
    adapterName = normalizeAdapter(adapter);
  } else {
    logError(
      "Provide an adapter name or --preset. Usage: imperium setup <adapter> [--preset <name>]",
    );
    process.exitCode = 1;
    return;
  }

  // Resolve custom root if "custom" adapter
  const isCustom =
    adapterName === 'custom' || !ADAPTER_NAMES.includes(adapterName as any);
  const resolvedOpts: GlobalOptions = {
    ...opts,
    target: isCustom ? 'custom' : (adapterName as PresetName),
    root: isCustom ? (opts.root || adapter) : undefined,
  };

  const target = await resolveTarget(resolvedOpts);
  const adapterObj = getAdapter(target.preset);

  heading(`Setting up ${target.preset}${setupPreset ? ` with preset "${setupPreset.name}"` : ''}`);

  if (opts.dryRun) {
    info(`Would create: ${target.rootDir}`);
    if (setupPreset) {
      info(`Would apply preset: ${setupPreset.name}`);
      info(`  Skills: ${setupPreset.skills.join(', ') || 'none'}`);
      info(`  MCPs: ${setupPreset.mcps.join(', ') || 'none'}`);
      info(`  Files: ${setupPreset.files.length}`);
    }
    return;
  }

  // Create root
  mkdirSync(target.rootDir, { recursive: true });
  mkdirSync(target.skillsDir, { recursive: true });

  // Scaffold with adapter
  const dirs = adapterObj.scaffold(target.rootDir);
  verbose(`Created directories:`);
  dirs.forEach((d) => verbose(`  ${d}`));

  // Init lockfile
  const lock = readLockfile(target.rootDir);
  lock.preset = target.preset;
  lock.root = target.rootDir;
  writeLockfile(target.rootDir, lock);

  success(`${target.preset} project scaffolded at ${target.rootDir}`);
  list([
    `Skills directory: ${target.skillsDir}`,
    `Lockfile: ${target.rootDir}/imperium.lock.json`,
  ]);

  // Apply setup preset (skills, MCPs, files)
  if (setupPreset) {
    await applyPreset(setupPreset, target.rootDir, opts);
  }

  // Install additional --with skills
  if (opts.with && opts.with.length > 0) {
    await addCommand(opts.with, { ...opts, root: target.rootDir });
  }

  // Install instruction files via --instructions
  if (opts.instructions && opts.instructions.length > 0) {
    await addInstructionsCommand(opts.instructions, { ...opts, root: target.rootDir });
  }
}
