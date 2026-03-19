import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { input, select, confirm } from '@inquirer/prompts';
import { KNOWN_ROOTS, type PresetName, type ResolvedTarget, type GlobalOptions } from '../core/types/index.js';
import { info, warn } from './log.js';
import { fuzzyPreset } from './fuzzy.js';

const DETECTABLE_FOLDERS = ['.claude', '.github', '.windsurf', '.cursor', '.agents'];

function presetFromFolder(folder: string): PresetName {
  const map: Record<string, PresetName> = {
    '.claude': 'claude',
    '.github': 'github',
    '.windsurf': 'windsurf',
    '.cursor': 'cursor',
    '.agents': 'custom',
  };
  return map[folder] || 'custom';
}

/**
 * Detect existing agent folders in the current project directory.
 */
export function detectAgentFolders(cwd: string = process.cwd()): string[] {
  return DETECTABLE_FOLDERS.filter((f) => existsSync(resolve(cwd, f)));
}

/**
 * Resolve the target folder for installation.
 *
 * Priority:
 * 1. --root flag (explicit path)
 * 2. --target flag (preset name)
 * 3. Auto-detect existing folders
 * 4. Ask user
 */
export async function resolveTarget(
  opts: GlobalOptions,
  cwd: string = process.cwd(),
): Promise<ResolvedTarget> {
  // 1) Explicit root
  if (opts.root) {
    let rootDir = resolve(cwd, opts.root);
    const preset = opts.target || presetFromFolder(opts.root);

    // Fuzzy-correct the root if it doesn't exist
    if (!existsSync(rootDir) && !opts.noFuzzy) {
      const corrected = fuzzyPreset(opts.root);
      if (corrected && existsSync(resolve(cwd, corrected))) {
        warn(`'${opts.root}' not found — using '${corrected}' instead.`);
        rootDir = resolve(cwd, corrected);
      }
    }

    return {
      preset,
      rootDir,
      skillsDir: join(rootDir, 'skills'),
    };
  }

  // 2) Explicit target preset
  if (opts.target) {
    const rootFolder = KNOWN_ROOTS[opts.target] || `.${opts.target}`;
    const rootDir = resolve(cwd, rootFolder);
    return {
      preset: opts.target,
      rootDir,
      skillsDir: join(rootDir, 'skills'),
    };
  }

  // 3) Auto-detect
  const found = detectAgentFolders(cwd);

  if (found.length === 1) {
    if (!opts.yes) {
      const ok = await confirm({
        message: `Found ${found[0]}. Use it as the target?`,
        default: true,
      });
      if (!ok) {
        return await askForFolder(cwd);
      }
    }

    const rootDir = resolve(cwd, found[0]);
    return {
      preset: presetFromFolder(found[0]),
      rootDir,
      skillsDir: join(rootDir, 'skills'),
    };
  }

  if (found.length > 1) {
    if (opts.yes) {
      // Default to first found
      const rootDir = resolve(cwd, found[0]);
      return {
        preset: presetFromFolder(found[0]),
        rootDir,
        skillsDir: join(rootDir, 'skills'),
      };
    }

    const chosen = await select({
      message: `Found multiple agent folders. Which one should I use?`,
      choices: found.map((f) => ({ name: f, value: f })),
    });

    const rootDir = resolve(cwd, chosen);
    return {
      preset: presetFromFolder(chosen),
      rootDir,
      skillsDir: join(rootDir, 'skills'),
    };
  }

  // 4) Nothing found — ask
  if (opts.yes) {
    // Default to .claude when non-interactive
    const rootDir = resolve(cwd, '.claude');
    return {
      preset: 'claude',
      rootDir,
      skillsDir: join(rootDir, 'skills'),
    };
  }

  return await askForFolder(cwd);
}

async function askForFolder(cwd: string): Promise<ResolvedTarget> {
  const chosen = await select({
    message: 'No agent folder detected. Which preset should I set up?',
    choices: [
      { name: '.claude', value: '.claude' },
      { name: '.github', value: '.github' },
      { name: '.windsurf', value: '.windsurf' },
      { name: '.cursor', value: '.cursor' },
      { name: 'Custom folder', value: '__custom__' },
    ],
  });

  let folder = chosen;
  if (chosen === '__custom__') {
    folder = await input({
      message: 'Enter the folder name:',
      default: '.agents',
    });
  }

  const rootDir = resolve(cwd, folder);
  return {
    preset: presetFromFolder(folder),
    rootDir,
    skillsDir: join(rootDir, 'skills'),
  };
}
