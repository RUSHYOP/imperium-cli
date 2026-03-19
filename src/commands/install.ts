import type { GlobalOptions } from '../core/types/index.js';
import { fetchPackage } from '../core/registry/index.js';
import { installPackage } from '../core/installer/index.js';
import { getAdapter } from '../adapters/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import { fuzzyMatch } from '../utils/fuzzy.js';
import { listPackages } from '../core/registry/index.js';
import { heading, success, warn, error as logError, info, verbose, list } from '../utils/log.js';
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
    await fetchPackage(name, opts.registry);
    return name;
  } catch {
    // Fuzzy match against registry
    try {
      const all = await listPackages(opts.registry, opts.kind);
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
// add / install — same logic, install also generates native files
// ---------------------------------------------------------------------------

export async function addCommand(
  names: string[],
  opts: GlobalOptions & { fromFile?: string; all?: boolean },
): Promise<void> {
  return installFlow(names, opts, false);
}

export async function installCommand(
  names: string[],
  opts: GlobalOptions & { fromFile?: string; all?: boolean },
): Promise<void> {
  return installFlow(names, opts, true);
}

export async function downloadCommand(
  names: string[],
  opts: GlobalOptions & { to?: string; all?: boolean },
): Promise<void> {
  // `download --to` maps to `--root`
  if (opts.to) opts.root = opts.to;
  return installFlow(names, opts, false);
}

async function installFlow(
  rawNames: string[],
  opts: GlobalOptions & { fromFile?: string; all?: boolean },
  renderNative: boolean,
): Promise<void> {
  let names: string[];

  if (opts.all) {
    const all = await listPackages(opts.registry, opts.kind);
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

  for (const name of resolved) {
    try {
      info(`Fetching ${name}...`);
      const pkg = await fetchPackage(name, opts.registry);

      const result = installPackage(pkg, target, opts);

      if (result.skipped) {
        warn(`${name}: ${result.reason}`);
        continue;
      }

      if (opts.dryRun) {
        info(`${name}: would write ${result.files.length} files:`);
        result.files.forEach((f) => verbose(`  ${f}`));
        continue;
      }

      success(`${name} v${pkg.manifest.version} installed (${result.files.length} files)`);

      // Generate native platform files if this is `install` (not just `add`)
      if (renderNative) {
        const adapter = getAdapter(target.preset);
        const nativeFiles = adapter.generateNativeFiles(pkg, target);
        if (nativeFiles.length > 0) {
          verbose(`Generated ${nativeFiles.length} native file(s) for ${target.preset}`);
        }
      }
    } catch (err: any) {
      logError(`${rawName}: ${err.message}`);
    }
  }
}
