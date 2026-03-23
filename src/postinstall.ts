import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync } from 'node:fs';
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

// ---------------------------------------------------------------------------
// Fresh install banner
// ---------------------------------------------------------------------------

function printWelcome() {
  console.log();
  console.log(c.brand('  ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗██╗   ██╗███╗   ███╗'));
  console.log(c.brand('  ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██║   ██║████╗ ████║'));
  console.log(c.brand('  ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║██║   ██║██╔████╔██║'));
  console.log(c.brand('  ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██║   ██║██║╚██╔╝██║'));
  console.log(c.brand('  ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║╚██████╔╝██║ ╚═╝ ██║'));
  console.log(c.brand('  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝'));
  console.log();
  console.log(`  ${c.heading('Welcome to the Imperium Agentic Ecosystem')}  ${c.dim(`v${VERSION}`)}`);
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

// ---------------------------------------------------------------------------
// Update banner
// ---------------------------------------------------------------------------

function printUpdate() {
  console.log();
  console.log(`  ${c.heading('Imperium')} ${c.dim('updated')} ${c.dim(`v${OLD_VERSION}`)} ${chalk.dim('→')} ${c.green(`v${VERSION}`)}`);
  console.log();

  // Show new features for this version
  const features = CHANGELOG[VERSION];
  if (features && features.length > 0) {
    console.log(`  ${c.heading("What's new in")} ${c.green(`v${VERSION}`)}`);
    for (const f of features) {
      console.log(`  ${c.green('+')} ${f}`);
    }
    console.log();
  }

  console.log(`  ${c.dim('Changed something? Run')} ${c.cmd('imperium --help')} ${c.dim('to see all commands.')}`);
  console.log();
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
      console.log(`  ${c.yellow('⚠')} Add npm global bin to your fish config:`);
      console.log(`    ${c.cmd(`set -Ua fish_user_paths ${npmBin}`)}`);
      console.log();
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
        console.log(`  ${c.yellow('⚠')} PATH is configured in ${profilePath} but not active.`);
        console.log(`    ${c.dim('Run:')} ${c.cmd(`source ${profilePath}`)}`);
        console.log();
        return;
      }
    }

    // Append the export line
    appendFileSync(profilePath, `\n# Added by imperium-cli — npm global bin\n${exportLine}\n`);
    console.log(`  ${c.green('✓')} Added npm global bin to ${profilePath}`);
    console.log(`    ${c.dim('Run')} ${c.cmd(`source ${profilePath}`)} ${c.dim('or open a new terminal.')}`);
    console.log();
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
