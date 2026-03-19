import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { ResolvedTarget, GlobalOptions, LockEntry } from '../types/index.js';
import type { FetchedPackage } from '../registry/index.js';
import { readLockfile, writeLockfile, upsertLockEntry, removeLockEntry, isInstalled } from '../lockfile/index.js';
import { success, warn, verbose, error as logError } from '../../utils/log.js';

export interface InstallResult {
  name: string;
  installed: boolean;
  skipped: boolean;
  reason?: string;
  files: string[];
}

/**
 * Install a fetched package to the resolved target directory.
 */
export function installPackage(
  pkg: FetchedPackage,
  target: ResolvedTarget,
  opts: GlobalOptions,
): InstallResult {
  const pkgDir = join(target.skillsDir, pkg.manifest.name);
  const filePaths: string[] = [];

  // Check lockfile for existing install
  const lock = readLockfile(target.rootDir);
  if (isInstalled(lock, pkg.manifest.name) && !opts.force && !opts.overwrite) {
    const existing = lock.packages[pkg.manifest.name];
    if (existing.checksum === pkg.checksum) {
      return {
        name: pkg.manifest.name,
        installed: false,
        skipped: true,
        reason: `Already installed (v${existing.version}). Use --force to reinstall.`,
        files: [],
      };
    }

    if (opts.preserve) {
      return {
        name: pkg.manifest.name,
        installed: false,
        skipped: true,
        reason: `Updated version available but --preserve is set.`,
        files: [],
      };
    }
  }

  if (opts.dryRun) {
    const planned = pkg.files.map((f) => join(pkgDir, f.path));
    return {
      name: pkg.manifest.name,
      installed: false,
      skipped: false,
      reason: 'Dry run — no files written.',
      files: planned,
    };
  }

  // Write all files
  for (const file of pkg.files) {
    const filePath = join(pkgDir, file.path);
    const dir = dirname(filePath);

    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, file.content, 'utf-8');
    filePaths.push(filePath);
    verbose(`Wrote ${filePath}`);
  }

  // Update lockfile
  const now = new Date().toISOString();
  const entry: LockEntry = {
    name: pkg.manifest.name,
    kind: pkg.manifest.kind,
    version: pkg.manifest.version,
    source: 'github:RUSHYOP/imperium-cli',
    checksum: pkg.checksum,
    installedPath: pkgDir,
    installedAt: now,
    lastSync: now,
  };

  const updated = upsertLockEntry(lock, entry);
  updated.preset = updated.preset || target.preset;
  updated.root = target.rootDir;
  writeLockfile(target.rootDir, updated);

  return {
    name: pkg.manifest.name,
    installed: true,
    skipped: false,
    files: filePaths,
  };
}

/**
 * Remove a package from the target directory and lockfile.
 */
export function removePackage(
  name: string,
  target: ResolvedTarget,
  opts: GlobalOptions,
): { removed: boolean; reason?: string } {
  const lock = readLockfile(target.rootDir);

  if (!isInstalled(lock, name)) {
    return { removed: false, reason: `Package '${name}' is not installed.` };
  }

  const entry = lock.packages[name];
  const pkgDir = entry.installedPath;

  if (opts.dryRun) {
    return { removed: false, reason: `Dry run — would remove ${pkgDir}` };
  }

  if (existsSync(pkgDir)) {
    rmSync(pkgDir, { recursive: true });
    verbose(`Removed ${pkgDir}`);
  }

  const updated = removeLockEntry(lock, name);
  writeLockfile(target.rootDir, updated);

  return { removed: true };
}
