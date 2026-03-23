import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, openSync, writeSync, closeSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const VERSION = process.env.npm_package_version ?? '?';
const OLD_VERSION = process.env.npm_old_version;
const IS_UPDATE = !!OLD_VERSION;

// ---------------------------------------------------------------------------
// Changelog — add an entry for each release
// ---------------------------------------------------------------------------

const CHANGELOG: Record<string, string[]> = {
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
    'Fixed --no-fuzzy flag resolution',
  ],
  '0.3.0': [
    'Pre-built registry.json index — list is now 100× faster',
    'Disk-based cache at ~/.imperium/cache/',
    'Parallel file fetching, minified bundle',
  ],
};

const c = {
  brand:   chalk.bold.magenta,
  heading: chalk.bold.cyan,
  dim:     chalk.dim,
  green:   chalk.green,
  yellow:  chalk.yellow,
  bullet:  chalk.cyan('◆'),
  cmd:     chalk.bold.white,
};

// npm v7+ suppresses stdout AND stderr from lifecycle scripts.
// Write directly to /dev/tty to bypass npm's output capture.
let ttyFd: number | null = null;
try { ttyFd = openSync('/dev/tty', 'w'); } catch { /* CI or no tty */ }

const log = (msg = '') => {
  const line = msg + '\n';
  if (ttyFd !== null) {
    writeSync(ttyFd, line);
  } else {
    process.stderr.write(line);
  }
};

// ---------------------------------------------------------------------------
// Fresh install banner
// ---------------------------------------------------------------------------

function printWelcome() {
  log();
  log(c.brand('  ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗██╗   ██╗███╗   ███╗'));
  log(c.brand('  ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██║   ██║████╗ ████║'));
  log(c.brand('  ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║██║   ██║██╔████╔██║'));
  log(c.brand('  ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██║   ██║██║╚██╔╝██║'));
  log(c.brand('  ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║╚██████╔╝██║ ╚═╝ ██║'));
  log(c.brand('  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝'));
  log();
  log(`  ${c.heading('Welcome to the Imperium Agentic Ecosystem')}  ${c.dim(`v${VERSION}`)}`);
  log(`  ${c.dim('The package manager for AI agent context — skills, MCPs, and presets.')}`);
  log();
  log(`  ${c.bullet} ${c.dim('Browse skills:')}      ${c.cmd('imperium list skills')}`);
  log(`  ${c.bullet} ${c.dim('Scaffold a project:')} ${c.cmd('imperium setup claude')}`);
  log(`  ${c.bullet} ${c.dim('Apply a preset:')}     ${c.cmd('imperium setup claude --preset fullstack')}`);
  log(`  ${c.bullet} ${c.dim('Install a skill:')}    ${c.cmd('imperium add skills python-patterns')}`);
  log(`  ${c.bullet} ${c.dim('Add an MCP server:')}  ${c.cmd('imperium add mcps obsidian')}`);
  log();
  log(`  ${c.dim('Run')} ${c.cmd('imperium --help')} ${c.dim('to explore all commands.')}`);
  log();
}

// ---------------------------------------------------------------------------
// Update banner
// ---------------------------------------------------------------------------

function printUpdate() {
  log();
  log(`  ${c.heading('Imperium')} ${c.dim('updated')} ${c.dim(`v${OLD_VERSION}`)} ${chalk.dim('→')} ${c.green(`v${VERSION}`)}`);
  log();

  // Show new features for this version
  const features = CHANGELOG[VERSION];
  if (features && features.length > 0) {
    log(`  ${c.heading("What's new in")} ${c.green(`v${VERSION}`)}`);
    for (const f of features) {
      log(`  ${c.green('+')} ${f}`);
    }
    log();
  }

  log(`  ${c.dim('Changed something? Run')} ${c.cmd('imperium --help')} ${c.dim('to see all commands.')}`);
  log();
}

// ---------------------------------------------------------------------------
// PATH check — ensure global npm bin is in PATH
// ---------------------------------------------------------------------------

function ensurePathSetup() {
  try {
    // Get the global npm bin directory
    const npmBin = execSync('npm prefix -g', { encoding: 'utf-8' }).trim() + '/bin';

    // Check if it's already in PATH
    const pathDirs = (process.env.PATH ?? '').split(':');
    if (pathDirs.some((d) => d === npmBin || d === npmBin + '/')) {
      return; // Already in PATH, nothing to do
    }

    // Determine the shell profile file
    const home = homedir();
    const shell = process.env.SHELL ?? '';
    let profilePath: string;
    if (shell.includes('zsh')) {
      profilePath = join(home, '.zshrc');
    } else if (shell.includes('bash')) {
      // Prefer .bashrc on macOS if it exists, otherwise .bash_profile
      profilePath = existsSync(join(home, '.bashrc'))
        ? join(home, '.bashrc')
        : join(home, '.bash_profile');
    } else if (shell.includes('fish')) {
      // Fish uses a different syntax, just print instructions
      log(`  ${c.yellow('⚠')} Add npm global bin to your fish config:`);
      log(`    ${c.cmd(`set -Ua fish_user_paths ${npmBin}`)}`);
      log();
      return;
    } else {
      profilePath = join(home, '.profile');
    }

    const exportLine = `export PATH="${npmBin}:$PATH"`;

    // Check if it's already in the profile file
    if (existsSync(profilePath)) {
      const content = readFileSync(profilePath, 'utf-8');
      if (content.includes(npmBin)) {
        // Already configured but not active in current session
        log(`  ${c.yellow('⚠')} PATH is configured in ${profilePath} but not active.`);
        log(`    ${c.dim('Run:')} ${c.cmd(`source ${profilePath}`)}`);
        log();
        return;
      }
    }

    // Append the export line
    appendFileSync(profilePath, `\n# Added by imperium-cli — npm global bin\n${exportLine}\n`);
    log(`  ${c.green('✓')} Added npm global bin to ${profilePath}`);
    log(`    ${c.dim('Run')} ${c.cmd(`source ${profilePath}`)} ${c.dim('or open a new terminal.')}`);
    log();
  } catch {
    // Silently skip — non-critical
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

if (IS_UPDATE) {
  printUpdate();
} else {
  printWelcome();
}

ensurePathSetup();

// Clean up tty file descriptor
if (ttyFd !== null) {
  try { closeSync(ttyFd); } catch { /* ignore */ }
}
