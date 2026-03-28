import type { GlobalOptions } from '../core/types.js';
import { fetchPackage, prefetchTree } from '../core/registry.js';
import { installPackage, removePackage } from '../core/installer.js';
import { readLockfile } from '../core/lockfile.js';
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

  // Pre-warm the tree cache for parallel fetching
  try {
    await prefetchTree();
  } catch {
    // non-fatal
  }

  // Fetch all packages in parallel with concurrency limit
  const CONCURRENCY = 10;
  const fetched: PromiseSettledResult<Awaited<ReturnType<typeof fetchPackage>>>[] = new Array(toUpdate.length);

  for (let i = 0; i < toUpdate.length; i += CONCURRENCY) {
    const batch = toUpdate.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map((name) => fetchPackage(name)));
    for (let j = 0; j < batchResults.length; j++) {
      fetched[i + j] = batchResults[j]!;
    }
  }

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < toUpdate.length; i++) {
    const name = toUpdate[i]!;

    if (!lock.packages[name]) {
      warn(`${name}: not installed, skipping.`);
      continue;
    }

    const result = fetched[i]!;

    if (result.status === 'rejected') {
      logError(`${name}: ${result.reason?.message ?? result.reason}`);
      failed++;
      continue;
    }

    try {
      const pkg = result.value;

      if (pkg.checksum === lock.packages[name].checksum) {
        verbose(`${name}: already up to date.`);
        continue;
      }

      const installResult = installPackage(pkg, target, { ...opts, force: true });

      if (installResult.installed) {
        success(`${name} updated to v${pkg.manifest.version}`);
        updated++;

        // Re-render native files
        const adapter = getAdapter(target.preset);
        adapter.generateNativeFiles(pkg, target);
      }
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
      failed++;
    }
  }

  if (toUpdate.length > 1) {
    const parts: string[] = [];
    if (updated > 0) parts.push(`✔ ${updated} updated`);
    if (failed > 0) parts.push(`✖ ${failed} failed`);
    if (parts.length > 0) info(`\n${parts.join('  ')}`);
  }

  if (failed > 0) {
    process.exitCode = 1;
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
