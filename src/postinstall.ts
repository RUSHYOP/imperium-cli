import chalk from 'chalk';

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
  console.log(`  ${c.bullet} ${c.dim('Apply a preset:')}     ${c.cmd('imperium setup claude --preset rxd')}`);
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
// Run
// ---------------------------------------------------------------------------

if (IS_UPDATE) {
  printUpdate();
} else {
  printWelcome();
}
