import type { GlobalOptions } from '../core/types.js';
import { fetchPackage, prefetchTree } from '../core/registry.js';
import { installPackage } from '../core/installer.js';
import { readLockfile, writeLockfile, upsertLockEntry } from '../core/lockfile.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { fuzzyMatch } from '../utils/fuzzy.js';
import { listPackages } from '../core/registry.js';
import { heading, success, warn, error as logError, info, verbose } from '../utils/log.js';
import { confirm } from '@inquirer/prompts';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Parse skill names: supports space-separated and comma-separated. */
function parseNames(args: string[]): string[] {
  return args.flatMap((a) => a.split(',')).map((s) => s.trim()).filter(Boolean);
}

async function resolveSkillName(
  name: string,
  opts: GlobalOptions,
): Promise<string> {
  if (opts.noFuzzy) return name;

  try {
    // Try exact fetch first
    await fetchPackage(name);
    return name;
  } catch {
    // Fuzzy match against registry
    const all = await listPackages(undefined, opts.kind);
    const candidates = all.map((e) => e.name);
    const matches = fuzzyMatch(name, candidates);

    if (matches.length === 0) {
      throw new Error(`Package '${name}' not found in registry.`);
    }

    if (matches.length === 1 && matches[0].distance <= 2) {
      warn(`'${name}' not found — using '${matches[0].match}' instead.`);
      return matches[0].match;
    }

    info(`'${name}' not found. Did you mean:`);
    matches.forEach((m, i) => info(`  ${i + 1}. ${m.match}`));

    if (opts.yes) return matches[0].match;

    const ok = await confirm({
      message: `Use '${matches[0].match}'?`,
      default: true,
    });

    if (ok) return matches[0].match;
    throw new Error(`No match selected for '${name}'.`);
  }
}

// ---------------------------------------------------------------------------
// add
// ---------------------------------------------------------------------------

export async function addCommand(
  names: string[],
  opts: GlobalOptions & { fromFile?: string; all?: boolean },
): Promise<void> {
  return installFlow(names, opts);
}



async function installFlow(
  rawNames: string[],
  opts: GlobalOptions & { fromFile?: string; all?: boolean },
): Promise<void> {
  let names: string[];

  if (opts.all) {
    const all = await listPackages(undefined, opts.kind);
    names = all.map((e) => e.name);
    heading(`Installing all ${names.length} packages`);
  } else if (opts.fromFile) {
    if (!existsSync(opts.fromFile)) {
      logError(`File not found: ${opts.fromFile}`);
      process.exitCode = 1;
      return;
    }
    const { readFileSync } = await import('node:fs');
    const raw = readFileSync(opts.fromFile, 'utf-8');
    names = raw.split('\n').map((s) => s.trim()).filter(Boolean);
  } else {
    names = parseNames(rawNames);
  }

  if (names.length === 0) {
    logError('No package names provided. Usage: imperium add <name...>');
    process.exitCode = 1;
    return;
  }

  // Deduplicate package names
  names = [...new Set(names)];

  // Resolve all skill names first (fuzzy match / validate) before prompting for target
  const resolved: string[] = [];
  for (const rawName of names) {
    try {
      resolved.push(await resolveSkillName(rawName, opts));
    } catch (err: any) {
      logError(`${rawName}: ${err.message}`);
    }
  }

  if (resolved.length === 0) {
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);

  // Fetch all packages with concurrency limit to avoid GitHub rate-limits
  const CONCURRENCY = 10;
  const isBatch = resolved.length > 1;

  // Show spinner for batch fetches
  let spinner: any = null;
  if (isBatch && !opts.silent) {
    const ora = (await import('ora')).default;
    spinner = ora({ text: `Fetching ${resolved.length} package(s)...`, spinner: 'dots' }).start();
  } else {
    info(`Fetching ${resolved.length} package(s)...`);
  }

  // Pre-warm the tree cache so parallel fetches don't all hit the API at once
  try {
    await prefetchTree();
  } catch {
    // non-fatal — individual fetches will retry
  }

  const fetched: PromiseSettledResult<Awaited<ReturnType<typeof fetchPackage>>>[] = new Array(resolved.length);
  let fetchedCount = 0;

  for (let i = 0; i < resolved.length; i += CONCURRENCY) {
    const batch = resolved.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map((name) => fetchPackage(name)));
    for (let j = 0; j < batchResults.length; j++) {
      fetched[i + j] = batchResults[j]!;
      fetchedCount++;
      if (spinner) spinner.text = `Fetching packages… (${fetchedCount}/${resolved.length})`;
    }
  }

  if (spinner) spinner.succeed(`Fetched ${resolved.length} package(s)`);

  // Install and track results — defer lockfile writes for batch efficiency
  let installed = 0;
  let skipped = 0;
  let failed = 0;
  let lock = isBatch ? readLockfile(target.rootDir) : undefined;

  for (let i = 0; i < resolved.length; i++) {
    const name = resolved[i]!;
    const result = fetched[i]!;

    if (result.status === 'rejected') {
      logError(`${name}: ${result.reason?.message ?? result.reason}`);
      failed++;
      continue;
    }

    const pkg = result.value;

    try {
      const installResult = installPackage(pkg, target, opts, isBatch);

      if (installResult.skipped) {
        warn(`${name}: ${installResult.reason}`);
        skipped++;
        continue;
      }

      if (opts.dryRun) {
        info(`${name}: would write ${installResult.files.length} files:`);
        installResult.files.forEach((f) => verbose(`  ${f}`));
        installed++;
        continue;
      }

      // Accumulate lockfile entries for batch write
      if (isBatch && lock) {
        const now = new Date().toISOString();
        const pkgDir = join(target.skillsDir, pkg.manifest.name);
        lock = upsertLockEntry(lock, {
          name: pkg.manifest.name,
          kind: pkg.manifest.kind,
          version: pkg.manifest.version,
          source: 'github:RUSHYOP/imperium-cli',
          checksum: pkg.checksum,
          installedPath: pkgDir,
          installedAt: now,
          lastSync: now,
        });
      }

      success(`${name} v${pkg.manifest.version} installed (${installResult.files.length} files)`);
      installed++;
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
      failed++;
    }
  }

  // Single lockfile write for batch installs
  if (isBatch && lock && !opts.dryRun && installed > 0) {
    lock.preset = lock.preset || target.preset;
    lock.root = target.rootDir;
    writeLockfile(target.rootDir, lock);
  }

  // Print summary for batch installs (>1 package)
  if (resolved.length > 1) {
    const parts: string[] = [];
    if (installed > 0) parts.push(`✔ ${installed} installed`);
    if (skipped > 0) parts.push(`⚠ ${skipped} skipped`);
    if (failed > 0) parts.push(`✖ ${failed} failed`);
    info(`\n${parts.join('  ')}`);
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}
