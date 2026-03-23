import chalk from 'chalk';
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CURRENT_VERSION: string = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'),
).version;

const STATE_DIR = join(homedir(), '.imperium');
const VERSION_FILE = join(STATE_DIR, 'version');

// ---------------------------------------------------------------------------
// Changelog — add an entry for each release
// ---------------------------------------------------------------------------

const CHANGELOG: Record<string, string[]> = {
  '0.4.1': [
    'Postinstall welcome & update messages',
  ],
  '0.4.0': [
    'MCP server management  — list, add, remove, inspect MCPs',
    'Setup presets          — curated bundles of skills + MCPs + files',
    'New resource types     — commands now take: skills | mcps | presets',
    'Singular aliases       — skill / mcp / preset work alongside plural forms',
    'Colorized help         — guided, categorized --help output',
    'Claude adapter         — scaffolds 5 folders: rules, commands, agents, skills, todos',
  ],
  '0.3.3': [
    'Full command reference in top-level --help',
    'Setup --with flag to scaffold + install skills in one step',
  ],
  '0.3.1': [
    'Per-command curated flags and usage examples',
  ],
  '0.3.0': [
    'Pre-built registry index — list is now 100× faster',
    'Disk-based cache at ~/.imperium/cache/',
  ],
};

const c = {
  brand:   chalk.bold.magenta,
  heading: chalk.bold.cyan,
  dim:     chalk.dim,
  green:   chalk.green,
  cmd:     chalk.bold.white,
  bullet:  chalk.cyan('◆'),
};

function printWelcome() {
  console.log();
  console.log(c.brand('  ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗██╗   ██╗███╗   ███╗'));
  console.log(c.brand('  ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██║   ██║████╗ ████║'));
  console.log(c.brand('  ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║██║   ██║██╔████╔██║'));
  console.log(c.brand('  ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██║   ██║██║╚██╔╝██║'));
  console.log(c.brand('  ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║╚██████╔╝██║ ╚═╝ ██║'));
  console.log(c.brand('  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝'));
  console.log();
  console.log(`  ${c.heading('Welcome to the Imperium Agentic Ecosystem')}  ${c.dim(`v${CURRENT_VERSION}`)}`);
  console.log(`  ${c.dim('The package manager for AI agent context — skills, MCPs, and presets.')}`);
  console.log();
  console.log(`  ${c.bullet} ${c.dim('Browse skills:')}      ${c.cmd('imperium list skills')}`);
  console.log(`  ${c.bullet} ${c.dim('Scaffold a project:')} ${c.cmd('imperium setup claude')}`);
  console.log(`  ${c.bullet} ${c.dim('Apply a preset:')}     ${c.cmd('imperium setup claude --preset fullstack')}`);
  console.log(`  ${c.bullet} ${c.dim('Install a skill:')}    ${c.cmd('imperium add skills python-patterns')}`);
  console.log(`  ${c.bullet} ${c.dim('Add an MCP server:')}  ${c.cmd('imperium add mcps obsidian')}`);
  console.log();
  console.log(`  ${c.dim('Run')} ${c.cmd('imperium --help')} ${c.dim('to explore all commands.')}`);
  console.log();
}

function printUpdate(oldVersion: string) {
  console.log();
  console.log(`  ${c.heading('Imperium')} ${c.dim('updated')} ${c.dim(`v${oldVersion}`)} ${chalk.dim('→')} ${c.green(`v${CURRENT_VERSION}`)}`);
  console.log();

  const features = CHANGELOG[CURRENT_VERSION];
  if (features && features.length > 0) {
    console.log(`  ${c.heading("What's new in")} ${c.green(`v${CURRENT_VERSION}`)}`);
    for (const f of features) {
      console.log(`  ${c.green('+')} ${f}`);
    }
    console.log();
  }

  console.log(`  ${c.dim('Run')} ${c.cmd('imperium --help')} ${c.dim('to see all commands.')}`);
  console.log();
}

/**
 * On first run, ensure the npm global bin directory is in the user's PATH.
 */
function ensurePathSetup(): void {
  try {
    const npmBin = execSync('npm prefix -g', { encoding: 'utf-8' }).trim() + '/bin';
    const pathDirs = (process.env.PATH ?? '').split(':');
    if (pathDirs.some((d) => d === npmBin || d === npmBin + '/')) return;

    const home = homedir();
    const shell = process.env.SHELL ?? '';
    let profilePath: string;
    if (shell.includes('zsh')) {
      profilePath = join(home, '.zshrc');
    } else if (shell.includes('bash')) {
      profilePath = existsSync(join(home, '.bashrc'))
        ? join(home, '.bashrc')
        : join(home, '.bash_profile');
    } else if (shell.includes('fish')) {
      console.log(`  ${c.dim('Add npm global bin to your fish config:')}`);
      console.log(`  ${c.cmd(`set -Ua fish_user_paths ${npmBin}`)}`);
      console.log();
      return;
    } else {
      profilePath = join(home, '.profile');
    }

    const exportLine = `export PATH="${npmBin}:$PATH"`;
    if (existsSync(profilePath)) {
      const content = readFileSync(profilePath, 'utf-8');
      if (content.includes(npmBin)) return;
    }

    appendFileSync(profilePath, `\n# Added by imperium-cli — npm global bin\n${exportLine}\n`);
    console.log(`  ${c.green('✓')} Added npm global bin to PATH in ${profilePath}`);
    console.log(`    ${c.dim('Restart your terminal or run')} ${c.cmd(`source ${profilePath}`)}`);
    console.log();
  } catch {
    // Non-critical — skip silently
  }
}

/**
 * Show a welcome or update message once after install/upgrade.
 * Only shows on "info" invocations: `imperium`, `imperium --help`, `imperium -V`.
 * Skips for action commands (list, add, search, setup, etc.) so the user
 * isn't interrupted when running a real command right after install.
 */
export function greetIfNeeded(): void {
  // Don't pollute piped/scripted output
  if (!process.stdout.isTTY) return;

  // Only show greeting on bare/help/version invocations
  const args = process.argv.slice(2);
  const firstArg = args[0] ?? '';
  const isInfoCommand = args.length === 0
    || firstArg === '--help' || firstArg === '-h'
    || firstArg === '--version' || firstArg === '-V';
  if (!isInfoCommand) return;

  try {
    mkdirSync(STATE_DIR, { recursive: true });

    const raw = existsSync(VERSION_FILE)
      ? readFileSync(VERSION_FILE, 'utf-8').trim()
      : null;
    const stored = raw || null; // treat empty string as null

    if (stored === CURRENT_VERSION) return; // already greeted for this version

    if (stored === null) {
      printWelcome();
      ensurePathSetup();
    } else {
      printUpdate(stored);
    }

    writeFileSync(VERSION_FILE, CURRENT_VERSION, 'utf-8');
  } catch {
    // Never crash the CLI over a greeting
  }
}
