import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { Lockfile, LockEntry, LockInstructionEntry, PresetName } from './types.js';
import { verbose, warn } from '../utils/log.js';

const LOCKFILE_NAME = 'imperium.lock.json';
const LOCK_STALE_MS = 10_000; // consider lock stale after 10s

function defaultLockfile(root: string, preset: PresetName | null): Lockfile {
  return {
    version: 1,
    preset,
    root,
    packages: {},
    instructions: {},
  };
}

/** Read the lockfile from a target root, or create a default one. */
export function readLockfile(rootDir: string): Lockfile {
  const lockPath = join(rootDir, LOCKFILE_NAME);
  if (!existsSync(lockPath)) {
    verbose(`No lockfile at ${lockPath}, will create on write.`);
    return defaultLockfile(rootDir, null);
  }

  try {
    const raw = readFileSync(lockPath, 'utf-8');
    const parsed = JSON.parse(raw) as Lockfile;
    // Backfill instructions field for lockfiles written before this feature
    if (!parsed.instructions) parsed.instructions = {};
    return parsed;
  } catch {
    warn(`Corrupt lockfile at ${lockPath} — backed up to ${lockPath}.backup`);
    try { copyFileSync(lockPath, lockPath + '.backup'); } catch { /* best effort */ }
    return defaultLockfile(rootDir, null);
  }
}

/** Acquire a simple advisory lock using mkdir (atomic on all OS). */
function acquireLock(lockPath: string): boolean {
  const lockDir = lockPath + '.lock';
  try {
    mkdirSync(lockDir);
    return true;
  } catch {
    // Check if stale (older than LOCK_STALE_MS)
    try {
      const s = statSync(lockDir);
      if (Date.now() - s.mtimeMs > LOCK_STALE_MS) {
        rmSync(lockDir, { recursive: true, force: true });
        mkdirSync(lockDir);
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }
}

function releaseLock(lockPath: string): void {
  try { rmSync(lockPath + '.lock', { recursive: true, force: true }); } catch { /* ignore */ }
}

/** Write the lockfile to disk with advisory file locking. */
export function writeLockfile(rootDir: string, lock: Lockfile): void {
  const lockPath = join(rootDir, LOCKFILE_NAME);
  mkdirSync(dirname(lockPath), { recursive: true });

  // Acquire advisory lock with retry
  let acquired = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (acquireLock(lockPath)) {
      acquired = true;
      break;
    }
    // Spin-wait briefly (sync — lockfile writes are fast)
    const start = Date.now();
    while (Date.now() - start < 200) { /* busy wait */ }
  }

  try {
    writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf-8');
    verbose(`Wrote lockfile to ${lockPath}`);
  } finally {
    if (acquired) releaseLock(lockPath);
  }
}

/** Add or update a package entry in the lockfile. */
export function upsertLockEntry(lock: Lockfile, entry: LockEntry): Lockfile {
  return {
    ...lock,
    packages: {
      ...lock.packages,
      [entry.name]: entry,
    },
  };
}

/** Remove a package entry from the lockfile. */
export function removeLockEntry(lock: Lockfile, name: string): Lockfile {
  const { [name]: _, ...rest } = lock.packages;
  return {
    ...lock,
    packages: rest,
  };
}

/** Check if a package is installed (by lockfile). */
export function isInstalled(lock: Lockfile, name: string): boolean {
  return name in lock.packages;
}

/** Get a single lock entry. */
export function getLockEntry(lock: Lockfile, name: string): LockEntry | undefined {
  return lock.packages[name];
}

/** Add or update an instruction entry in the lockfile. */
export function upsertInstructionEntry(
  lock: Lockfile,
  entry: LockInstructionEntry,
): Lockfile {
  return {
    ...lock,
    instructions: {
      ...lock.instructions,
      [entry.name]: entry,
    },
  };
}

/** Remove an instruction entry from the lockfile. */
export function removeInstructionEntry(lock: Lockfile, name: string): Lockfile {
  const { [name]: _, ...rest } = lock.instructions;
  return { ...lock, instructions: rest };
}

/** Check if an instruction is tracked in the lockfile. */
export function isInstructionInstalled(lock: Lockfile, name: string): boolean {
  return name in lock.instructions;
}
