import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { GlobalOptions } from '../core/types.js';
import { resolveTarget, detectAgentFolders } from '../utils/resolve-target.js';
import { readLockfile, writeLockfile } from '../core/lockfile.js';
import { heading, success, warn, info, error as logError, list as logList } from '../utils/log.js';

// ---------------------------------------------------------------------------
// init — initialize an imperium lockfile in the current target
// ---------------------------------------------------------------------------

export async function initCommand(opts: GlobalOptions): Promise<void> {
  heading('Initializing imperium');

  const target = await resolveTarget(opts);

  if (existsSync(join(target.rootDir, 'imperium.lock.json')) && !opts.force) {
    warn(`Lockfile already exists at ${target.rootDir}/imperium.lock.json`);
    info('Use --force to reinitialize.');
    return;
  }

  const lock = readLockfile(target.rootDir);
  lock.preset = target.preset;
  lock.root = target.rootDir;

  if (opts.dryRun) {
    info(`Would create lockfile at ${target.rootDir}/imperium.lock.json`);
    return;
  }

  writeLockfile(target.rootDir, lock);
  success(`Initialized imperium at ${target.rootDir}`);
}

// ---------------------------------------------------------------------------
// validate — check installed skills against lockfile and manifest
// ---------------------------------------------------------------------------

export async function validateCommand(opts: GlobalOptions): Promise<void> {
  heading('Validating installation');

  const target = await resolveTarget(opts);
  const lock = readLockfile(target.rootDir);
  const entries = Object.values(lock.packages);

  if (entries.length === 0) {
    info('No packages in lockfile. Nothing to validate.');
    return;
  }

  let issues = 0;

  for (const entry of entries) {
    // Check that the installed path exists
    if (!existsSync(entry.installedPath)) {
      logError(`${entry.name}: installed path missing (${entry.installedPath})`);
      issues++;
      continue;
    }

    // Check that SKILL.md exists
    const skillMd = join(entry.installedPath, 'SKILL.md');
    if (!existsSync(skillMd)) {
      warn(`${entry.name}: SKILL.md not found at ${skillMd}`);
      issues++;
      continue;
    }

    // Parse and validate frontmatter
    try {
      const raw = readFileSync(skillMd, 'utf-8');
      const { data } = matter(raw);

      if (!data.name) {
        warn(`${entry.name}: SKILL.md missing 'name' field`);
        issues++;
      }
      if (!data.kind) {
        warn(`${entry.name}: SKILL.md missing 'kind' field`);
        issues++;
      }
      if (!data.version) {
        warn(`${entry.name}: SKILL.md missing 'version' field`);
        issues++;
      }
    } catch (err: any) {
      warn(`${entry.name}: failed to parse SKILL.md — ${err.message}`);
      issues++;
    }
  }

  if (issues === 0) {
    success(`All ${entries.length} package(s) valid.`);
  } else {
    warn(`${issues} issue(s) found across ${entries.length} package(s).`);
  }
}
