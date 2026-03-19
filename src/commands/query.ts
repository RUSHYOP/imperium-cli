import chalk from 'chalk';
import type { GlobalOptions, PackageKind } from '../core/types/index.js';
import { listPackages, searchPackages, inspectPackage } from '../core/registry/index.js';
import { readLockfile } from '../core/lockfile/index.js';
import { resolveTarget, detectAgentFolders } from '../utils/resolve-target.js';
import { heading, info, dim, list as logList, success, error as logError } from '../utils/log.js';

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

export async function listCommand(opts: GlobalOptions, description?: true | string[]): Promise<void> {
  heading('Available skills');

  try {
    const entries = await listPackages(opts.registry, opts.kind);

    if (entries.length === 0) {
      info('No packages found in registry.');
      return;
    }

    // Check which are installed locally
    let installed = new Set<string>();
    try {
      const target = await resolveTarget({ ...opts, yes: true });
      const lock = readLockfile(target.rootDir);
      installed = new Set(Object.keys(lock.packages));
    } catch {
      // no local target — fine, just don't mark any as installed
    }

    // Determine which skills should show descriptions
    const showDescAll = description === true;
    const descFilter = Array.isArray(description)
      ? new Set(description.map((s) => s.toLowerCase()))
      : null;

    for (const entry of entries) {
      const tag = installed.has(entry.name) ? chalk.green(' [installed]') : '';
      const kindBadge = chalk.dim(`[${entry.kind}]`);
      info(`  ${chalk.bold(entry.name)} ${kindBadge} v${entry.version}${tag}`);

      if (showDescAll || descFilter?.has(entry.name.toLowerCase())) {
        dim(`    ${entry.description}`);
      }
    }

    info(`\n${entries.length} package(s) available.`);
  } catch (err: any) {
    logError(`Failed to list packages: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

export async function searchCommand(query: string, opts: GlobalOptions): Promise<void> {
  heading(`Searching for "${query}"`);

  try {
    const results = await searchPackages(query, opts.registry);

    if (results.length === 0) {
      info('No matching packages found.');
      return;
    }

    for (const entry of results) {
      const kindBadge = chalk.dim(`[${entry.kind}]`);
      info(`  ${chalk.bold(entry.name)} ${kindBadge} v${entry.version}`);
      dim(`    ${entry.description}`);
    }

    info(`\n${results.length} result(s).`);
  } catch (err: any) {
    logError(`Search failed: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// inspect
// ---------------------------------------------------------------------------

export async function inspectCommand(name: string, opts: GlobalOptions): Promise<void> {
  heading(`Inspecting ${name}`);

  try {
    const { manifest, content } = await inspectPackage(name, opts.registry);

    info(`  Name:        ${chalk.bold(manifest.name)}`);
    info(`  Kind:        ${manifest.kind}`);
    info(`  Version:     ${manifest.version}`);
    info(`  Description: ${manifest.description}`);

    if (manifest.aliases?.length) {
      info(`  Aliases:     ${manifest.aliases.join(', ')}`);
    }
    if (manifest.tags?.length) {
      info(`  Tags:        ${manifest.tags.join(', ')}`);
    }
    if (manifest.targets?.length) {
      info(`  Targets:     ${manifest.targets.join(', ')}`);
    }
    if (manifest.dependencies?.length) {
      info(`  Deps:        ${manifest.dependencies.join(', ')}`);
    }
    if (manifest.author) {
      info(`  Author:      ${manifest.author}`);
    }
    if (manifest.license) {
      info(`  License:     ${manifest.license}`);
    }

    // Show install path preview
    try {
      const target = await resolveTarget({ ...opts, yes: true });
      info(`\n  Install to:  ${target.skillsDir}/${manifest.name}/`);
    } catch {
      // no target resolved
    }

    if (content.trim()) {
      info('\n' + chalk.dim('─'.repeat(60)));
      info(content.trim());
    }
  } catch (err: any) {
    logError(`Inspect failed: ${err.message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// detect
// ---------------------------------------------------------------------------

export async function detectCommand(opts: GlobalOptions): Promise<void> {
  heading('Detecting agent folders');

  const found = detectAgentFolders();

  if (found.length === 0) {
    info('No agent folders found in current directory.');
    return;
  }

  info(`Found ${found.length} agent folder(s):`);
  logList(found);
}
