import type { GlobalOptions } from '../core/types/index.js';
import { fetchPackage } from '../core/registry/index.js';
import { installPackage, removePackage } from '../core/installer/index.js';
import { readLockfile, writeLockfile } from '../core/lockfile/index.js';
import { getAdapter } from '../adapters/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { heading, success, warn, info, error as logError, verbose } from '../utils/log.js';
import { confirm } from '@inquirer/prompts';

/** Parse skill names: supports space-separated and comma-separated. */
function parseNames(args: string[]): string[] {
  return args.flatMap((a) => a.split(',')).map((s) => s.trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------
// update
// ---------------------------------------------------------------------------

export async function updateCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  const target = await resolveTarget(opts);
  const lock = readLockfile(target.rootDir);
  const installed = Object.keys(lock.packages);

  const toUpdate = names.length > 0 ? parseNames(names) : installed;

  if (toUpdate.length === 0) {
    info('No packages installed to update.');
    return;
  }

  heading(`Updating ${toUpdate.length} package(s)`);

  for (const name of toUpdate) {
    if (!lock.packages[name]) {
      warn(`${name}: not installed, skipping.`);
      continue;
    }

    try {
      info(`Checking ${name}...`);
      const pkg = await fetchPackage(name, opts.registry);

      if (pkg.checksum === lock.packages[name].checksum) {
        verbose(`${name}: already up to date.`);
        continue;
      }

      const result = installPackage(pkg, target, { ...opts, force: true });

      if (result.installed) {
        success(`${name} updated to v${pkg.manifest.version}`);

        // Re-render native files
        const adapter = getAdapter(target.preset);
        adapter.generateNativeFiles(pkg, target);
      }
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------

export async function removeCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  const parsed = parseNames(names);

  if (parsed.length === 0) {
    logError('No package names provided. Usage: imperium remove <name...>');
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);

  for (const name of parsed) {
    // Confirm destructive action
    if (!opts.yes && !opts.force) {
      const ok = await confirm({
        message: `Remove '${name}' from ${target.rootDir}?`,
        default: false,
      });
      if (!ok) {
        info(`Skipped ${name}.`);
        continue;
      }
    }

    const result = removePackage(name, target, opts);

    if (result.removed) {
      success(`Removed ${name}`);
    } else {
      warn(`${name}: ${result.reason}`);
    }
  }
}
