import { mkdirSync } from 'node:fs';
import type { GlobalOptions } from '../core/types/index.js';
import { getAdapter } from '../adapters/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { writeLockfile, readLockfile } from '../core/lockfile/index.js';
import { heading, success, info, list, verbose } from '../utils/log.js';

const PRESET_NAMES = ['claude', 'github', 'windsurf', 'cursor', 'custom'] as const;

type PresetArg = (typeof PRESET_NAMES)[number] | string;

function normalizePreset(raw: string): PresetArg {
  // Strip leading dot: ".claude" → "claude"
  const cleaned = raw.replace(/^\./, '').toLowerCase();
  if (PRESET_NAMES.includes(cleaned as any)) return cleaned as PresetArg;
  return 'custom';
}

export async function setupCommand(preset: string, opts: GlobalOptions): Promise<void> {
  const presetName = normalizePreset(preset);

  // Resolve custom root if "custom" preset
  const isCustom = presetName === 'custom' || !PRESET_NAMES.includes(presetName as any);
  const resolvedOpts: GlobalOptions = {
    ...opts,
    target: isCustom ? 'custom' : (presetName as any),
    root: isCustom ? (opts.root || preset) : undefined,
  };

  const target = await resolveTarget(resolvedOpts);
  const adapter = getAdapter(target.preset);

  heading(`Setting up ${target.preset} preset`);

  if (opts.dryRun) {
    info(`Would create: ${target.rootDir}`);
    return;
  }

  // Create root
  mkdirSync(target.rootDir, { recursive: true });
  mkdirSync(target.skillsDir, { recursive: true });

  // Scaffold with adapter
  const dirs = adapter.scaffold(target.rootDir);
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
}
