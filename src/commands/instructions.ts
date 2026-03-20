import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import type { GlobalOptions } from '../core/types.js';
import {
  listInstructions,
  searchInstructions,
  getInstruction,
  fetchInstructionContent,
  type InstructionEntry,
} from '../core/registry.js';
import { getInstructionPath } from '../adapters/index.js';
import { resolveTarget } from '../utils/resolve-target.js';
import {
  readLockfile,
  writeLockfile,
  upsertInstructionEntry,
  removeInstructionEntry,
  isInstructionInstalled,
} from '../core/lockfile.js';
import { heading, success, info, warn, error as logError, list } from '../utils/log.js';
import { confirm } from '@inquirer/prompts';

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

export async function listInstructionsCommand(opts: GlobalOptions): Promise<void> {
  heading('Available Instructions');
  const entries = await listInstructions();

  if (entries.length === 0) {
    info('No instructions available in the registry.');
    return;
  }

  for (const entry of entries) {
    info(`  ${entry.name}  ${entry.description ? '— ' + entry.description : ''}`);
  }

  info(`\n  ${entries.length} instruction(s) available.`);
}

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------

export async function searchInstructionsCommand(
  query: string,
  opts: GlobalOptions,
): Promise<void> {
  heading(`Searching instructions for "${query}"`);
  const results = await searchInstructions(query);

  if (results.length === 0) {
    info('No matching instructions found.');
    return;
  }

  for (const entry of results) {
    info(`  ${entry.name}  ${entry.description ? '— ' + entry.description : ''}`);
  }
}

// ---------------------------------------------------------------------------
// inspect
// ---------------------------------------------------------------------------

export async function inspectInstructionCommand(
  name: string,
  opts: GlobalOptions,
): Promise<void> {
  const entry = await getInstruction(name);
  const { content, description } = await fetchInstructionContent(name);

  heading(entry.name);
  if (description) info(`Description: ${description}`);
  info('');
  info(content);
}

// ---------------------------------------------------------------------------
// add
// ---------------------------------------------------------------------------

export async function addInstructionsCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  if (names.length === 0) {
    logError('No instruction names provided. Usage: imperium add instructions <name...>');
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);

  for (const name of names) {
    try {
      info(`Fetching instruction "${name}"...`);
      const { content, description } = await fetchInstructionContent(name);
      const destPath = getInstructionPath(target.preset, target.rootDir, name);
      const contentChecksum = createHash('sha256').update(content).digest('hex').slice(0, 16);

      // Check lockfile for existing install
      const lock = readLockfile(target.rootDir);
      if (isInstructionInstalled(lock, name) && !opts.force && !opts.overwrite) {
        const existing = lock.instructions[name];
        if (existing.checksum === contentChecksum) {
          warn(`${name}: already installed (unchanged). Use --force to reinstall.`);
          continue;
        }
      }

      if (existsSync(destPath) && !opts.force && !opts.overwrite) {
        if (opts.yes) {
          warn(`Overwriting ${destPath}`);
        } else {
          const ok = await confirm({
            message: `${destPath} already exists. Overwrite?`,
            default: false,
          });
          if (!ok) {
            info(`Skipped ${name}.`);
            continue;
          }
        }
      }

      if (opts.dryRun) {
        info(`Would write: ${destPath}`);
        continue;
      }

      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, content + '\n', 'utf-8');

      // Track in lockfile
      const updatedLock = upsertInstructionEntry(readLockfile(target.rootDir), {
        name,
        description,
        source: 'github:RUSHYOP/imperium-cli',
        checksum: contentChecksum,
        installedPath: destPath,
        installedAt: new Date().toISOString(),
      });
      writeLockfile(target.rootDir, updatedLock);

      success(`Installed instruction "${name}" → ${destPath}`);
    } catch (err: any) {
      logError(`${name}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------

export async function removeInstructionsCommand(
  names: string[],
  opts: GlobalOptions,
): Promise<void> {
  if (names.length === 0) {
    logError('No instruction names provided. Usage: imperium remove instructions <name...>');
    process.exitCode = 1;
    return;
  }

  const target = await resolveTarget(opts);

  for (const name of names) {
    const destPath = getInstructionPath(target.preset, target.rootDir, name);

    if (!existsSync(destPath)) {
      warn(`Instruction file not found at ${destPath}, skipping.`);
      continue;
    }

    if (!opts.yes && !opts.force) {
      const ok = await confirm({
        message: `Remove instruction file ${destPath}?`,
        default: false,
      });
      if (!ok) {
        info(`Skipped ${name}.`);
        continue;
      }
    }

    if (opts.dryRun) {
      info(`Would remove: ${destPath}`);
      continue;
    }

    rmSync(destPath, { force: true });

    // Remove from lockfile
    const updatedLock = removeInstructionEntry(readLockfile(target.rootDir), name);
    writeLockfile(target.rootDir, updatedLock);

    success(`Removed instruction "${name}" from ${destPath}`);
  }
}
