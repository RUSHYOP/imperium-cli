import type { GlobalOptions } from '../core/types.js';
import { fetchPackage, prefetchTree } from '../core/registry.js';
import { installPackage } from '../core/installer.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { fuzzyMatch } from '../utils/fuzzy.js';
import { listPackages } from '../core/registry.js';
import { heading, success, warn, error as logError, info, verbose } from '../utils/log.js';
import { confirm } from '@inquirer/prompts';

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
    try {
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
    } catch (e) {
      throw e;
    }
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
  info(`Fetching ${resolved.length} package(s)...`);

  // Pre-warm the tree cache so parallel fetches don't all hit the API at once
  try {
    await prefetchTree();
  } catch {
    // non-fatal — individual fetches will retry
  }

  const fetched: PromiseSettledResult<Awaited<ReturnType<typeof fetchPackage>>>[] = new Array(resolved.length);

  for (let i = 0; i < resolved.length; i += CONCURRENCY) {
    const batch = resolved.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map((name) => fetchPackage(name)));
    for (let j = 0; j < batchResults.length; j++) {
      fetched[i + j] = batchResults[j]!;
    }
  }

  for (let i = 0; i < resolved.length; i++) {
    const name = resolved[i]!;
    const result = fetched[i]!;

    if (result.status === 'rejected') {
      logError(`${name}: ${result.reason?.message ?? result.reason}`);
      continue;
    }

    const pkg = result.value;

    try {
      const installResult = installPackage(pkg, target, opts);

      if (installResult.skipped) {
        warn(`${name}: ${installResult.reason}`);
        continue;
      }

      if (opts.dryRun) {
        info(`${name}: would write ${installResult.files.length} files:`);
        installResult.files.forEach((f) => verbose(`  ${f}`));
        continue;
      }

      success(`${name} v${pkg.manifest.version} installed (${installResult.files.length} files)`);
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
    }
  }
}
