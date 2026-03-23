import chalk from 'chalk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

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
 * Show a welcome or update message once after install/upgrade.
 * Skips when stdout is not a TTY (piped output).
 */
export function greetIfNeeded(): void {
  // Don't pollute piped/scripted output
  if (!process.stdout.isTTY) return;

  try {
    mkdirSync(STATE_DIR, { recursive: true });

    const raw = existsSync(VERSION_FILE)
      ? readFileSync(VERSION_FILE, 'utf-8').trim()
      : null;
    const stored = raw || null; // treat empty string as null

    if (stored === CURRENT_VERSION) return; // already greeted for this version

    if (stored === null) {
      printWelcome();
    } else {
      printUpdate(stored);
    }

    writeFileSync(VERSION_FILE, CURRENT_VERSION, 'utf-8');
  } catch {
    // Never crash the CLI over a greeting
  }
}
