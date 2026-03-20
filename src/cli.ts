import { Command } from 'commander';
import type { GlobalOptions, PackageKind, PresetName } from './core/types/index.js';
import { setLogOptions } from './utils/log.js';
import { fuzzyCommand } from './utils/fuzzy.js';
import { warn, error as logError, chalk } from './utils/log.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'));

// ---------------------------------------------------------------------------
// Color helpers for help output
// ---------------------------------------------------------------------------

const c = {
  h: chalk.bold.cyan,          // headings
  cmd: chalk.bold.white,       // command names
  arg: chalk.yellow,           // arguments / placeholders
  flag: chalk.green,           // flags
  dim: chalk.dim,              // hints, secondary info
  ex: chalk.gray,              // example commands
  brand: chalk.bold.magenta,   // brand / product name
  type: chalk.blue,            // resource types
};

/** Format a $ example line with colors. */
function ex(command: string, description?: string): string {
  const parts = command.split(/\s+/);
  const colored = parts.map((p) => {
    if (p === '$') return c.dim('$');
    if (p === 'imperium') return c.brand('imperium');
    if (p.startsWith('-')) return c.flag(p);
    if (p.startsWith('<') || p.startsWith('[')) return c.arg(p);
    return p;
  }).join(' ');
  if (description) return `  ${colored}  ${c.dim(description)}`;
  return `  ${colored}`;
}

// ---------------------------------------------------------------------------
// Program
// ---------------------------------------------------------------------------

const program = new Command();

// Override Commander's help formatting for color
program.configureHelp({
  subcommandTerm(cmd) {
    return c.cmd(cmd.name()) + (cmd.usage() ? ' ' + c.dim(cmd.usage()) : '');
  },
  optionTerm(opt) {
    return c.flag(opt.flags);
  },
  argumentTerm(arg) {
    return c.arg(arg.name());
  },
});

program
  .name('imperium')
  .description('A package manager for agent context — skills, MCPs, and presets.')
  .version(pkg.version)
  .addHelpText('after', () => [
    '',
    c.h('Getting Started'),
    `  ${c.cmd('imperium setup claude')}                    Scaffold a new Claude project`,
    `  ${c.cmd('imperium setup claude --preset rxd')}       Scaffold + apply a curated preset`,
    `  ${c.cmd('imperium list skills')}                     Browse available skills`,
    `  ${c.cmd('imperium add skills python-patterns')}      Install a skill`,
    '',
    c.h('Resource Types'),
    `  ${c.type('skills')}    Skill packs, reference packs, and presets`,
    `  ${c.type('mcps')}      MCP server configurations`,
    `  ${c.type('presets')}    Curated bundles (skills + MCPs + files)`,
    '',
    c.h('Explore'),
    `  ${c.cmd('imperium list')} ${c.type('<type>')}                   List all items of a type`,
    `  ${c.cmd('imperium search')} ${c.type('<type>')} ${c.arg('<query>')}         Search by keyword`,
    `  ${c.cmd('imperium inspect')} ${c.type('<type>')} ${c.arg('<name>')}         View full details`,
    '',
    c.h('Install & Manage'),
    `  ${c.cmd('imperium add')} ${c.type('<type>')} ${c.arg('<names...>')}         Add skills or MCPs`,
    `  ${c.cmd('imperium remove')} ${c.type('<type>')} ${c.arg('<names...>')}      Remove skills or MCPs`,
    `  ${c.cmd('imperium update')} ${c.arg('[skills...]')}              Update installed skills`,
    '',
    c.h('Project'),
    `  ${c.cmd('imperium setup')} ${c.arg('[adapter]')}                 Scaffold an adapter folder`,
    `  ${c.cmd('imperium init')}                             Init lockfile`,
    `  ${c.cmd('imperium detect')}                           Detect agent folders`,
    `  ${c.cmd('imperium validate')}                         Validate installed skills`,
    '',
    c.dim('  Run ') + c.cmd('imperium <command> --help') + c.dim(' for full options and examples.'),
    '',
  ].join('\n'));

// ---------------------------------------------------------------------------
// Flag groups — only attach what's relevant per command
// ---------------------------------------------------------------------------

/** Flags for target resolution (where to install). */
function addTargetFlags(cmd: Command): Command {
  return cmd
    .option('--root <path>', 'Custom folder root')
    .option('--target <preset>', 'Target preset: claude, github, windsurf, cursor, custom');
}

/** Flags for install/write operations. */
function addWriteFlags(cmd: Command): Command {
  return cmd
    .option('--force', 'Overwrite without asking')
    .option('--dry-run', 'Preview changes only')
    .option('-y, --yes', 'Skip confirmations')
    .option('--no-fuzzy', 'Disable typo correction')
    .option('--copy', 'Copy files instead of symlink')
    .option('--symlink', 'Symlink where possible')
    .option('--merge', 'Merge with existing files')
    .option('--overwrite', 'Replace existing files')
    .option('--preserve', 'Preserve user edits');
}

/** Flags for registry source selection. */
function addRegistryFlags(cmd: Command): Command {
  return cmd
    .option('--local <path>', 'Local registry path')
    .option('--tag <version>', 'Version pin')
    .option('--channel <channel>', 'Channel: stable, beta, dev');
}

/** Flags for querying / filtering. */
function addQueryFlags(cmd: Command): Command {
  return cmd
    .option('--kind <kind>', 'Filter by kind: skill, reference, preset')
    .option('--format <fmt>', 'Output format: md, yaml, json');
}

/** Flags for output verbosity. */
function addOutputFlags(cmd: Command): Command {
  return cmd
    .option('--verbose', 'Show file-by-file actions')
    .option('--silent', 'Minimal output');
}

/** File filter flags. */
function addFilterFlags(cmd: Command): Command {
  return cmd
    .option('--include <pattern>', 'Include files/folders matching pattern')
    .option('--exclude <pattern>', 'Exclude files/folders matching pattern');
}

function extractOpts(cmd: Command): GlobalOptions {
  const o = cmd.opts();
  const opts: GlobalOptions = {
    root: o.root,
    target: o.target as PresetName | undefined,
    force: o.force,
    dryRun: o.dryRun,
    yes: o.yes,
    noFuzzy: o.noFuzzy ?? !o.fuzzy, // --no-fuzzy sets fuzzy=false
    verbose: o.verbose,
    silent: o.silent,
    local: o.local,
    tag: o.tag,
    channel: o.channel,
    copy: o.copy,
    symlink: o.symlink,
    merge: o.merge,
    overwrite: o.overwrite,
    preserve: o.preserve,
    include: o.include,
    exclude: o.exclude,
    kind: o.kind as PackageKind | undefined,
    format: o.format,
  };
  setLogOptions(opts);
  return opts;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

type ResourceType = 'skills' | 'mcps' | 'presets';

const RESOURCE_ALIASES: Record<string, ResourceType> = {
  skills: 'skills',
  skill: 'skills',
  mcps: 'mcps',
  mcp: 'mcps',
  presets: 'presets',
  preset: 'presets',
};

function validateResourceType(type: string): ResourceType {
  const resolved = RESOURCE_ALIASES[type.toLowerCase()];
  if (resolved) return resolved;
  logError(`Unknown resource type '${type}'. Must be: skills (or skill), mcps (or mcp), presets (or preset)`);
  process.exit(1);
}

// ---- setup ---------------------------------------------------------------
{
  const cmd = program
    .command('setup [adapter]')
    .description('Setup an adapter folder, optionally applying a curated setup preset')
    .option('--preset <name>', 'Apply a setup preset (curated bundle of skills, MCPs, and files)')
    .option('--with <skills...>', 'Also install these skills after scaffolding')
    .action(async (adapter: string | undefined, cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { setupCommand } = await import('./commands/setup.js');
      await setupCommand(adapter, { ...opts, with: cmdOpts.with, preset: cmdOpts.preset });
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addRegistryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium setup claude', 'Create .claude/ folder structure'),
    ex('$ imperium setup claude --preset rxd', 'Setup + apply a curated preset'),
    ex('$ imperium setup --preset rxd', 'Adapter inferred from preset'),
    ex('$ imperium setup claude --with python-patterns', 'Setup + install a skill'),
    ex('$ imperium setup claude --preset rxd --with extra-skill', 'Preset + extra skills'),
    ex('$ imperium setup github', 'Create .github/copilot/ structure'),
    ex('$ imperium setup claude --dry-run', 'Preview what would be created'),
    '',
  ].join('\n'));
}

// ---- add -----------------------------------------------------------------
{
  const cmd = program
    .command('add <type> [names...]')
    .description('Add skills or MCPs to the project')
    .option('--from-file <path>', 'Read names from a file (skills only)')
    .option('--all', 'Add all from the registry (skills only)')
    .option('--path <dir>', 'Target directory to install into')
    .action(async (type: string, names: string[], cmdOpts, cmd: Command) => {
      const resourceType = validateResourceType(type);
      const opts = extractOpts(cmd);
      if (cmdOpts.path) opts.root = cmdOpts.path;

      if (resourceType === 'presets') {
        logError("Presets can't be added individually. Use 'imperium setup --preset <name>' instead.");
        process.exitCode = 1;
        return;
      }

      if (resourceType === 'skills') {
        const { addCommand } = await import('./commands/install.js');
        await addCommand(names, { ...opts, fromFile: cmdOpts.fromFile, all: cmdOpts.all });
      } else {
        const { addMcpsCommand } = await import('./commands/mcp.js');
        await addMcpsCommand(names, opts);
      }
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addRegistryFlags(cmd);
  addFilterFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples — Skills'),
    ex('$ imperium add skills python-patterns', 'Add a single skill'),
    ex('$ imperium add skills python-patterns django-tdd', 'Add multiple'),
    ex('$ imperium add skills --all', 'Add all from registry'),
    ex('$ imperium add skills --from-file skills.txt', 'From a file'),
    ex('$ imperium add skills python-patterns --path .cursor', 'Custom folder'),
    '',
    c.h('Examples — MCPs'),
    ex('$ imperium add mcps obsidian', 'Add an MCP server'),
    ex('$ imperium add mcps obsidian atlassian miro-mcp', 'Add multiple'),
    ex('$ imperium add mcps pdf-reader --force', 'Overwrite existing'),
    '',
  ].join('\n'));
}

// ---- list ----------------------------------------------------------------
{
  const cmd = program
    .command('list <type>')
    .description('List available skills, MCPs, or setup presets')
    .option('-d, --description [items...]', 'Show descriptions (optionally for specific items only)')
    .action(async (type: string, cmdOpts, cmd: Command) => {
      const resourceType = validateResourceType(type);
      const opts = extractOpts(cmd);

      if (resourceType === 'skills') {
        const { listCommand } = await import('./commands/query.js');
        await listCommand(opts, cmdOpts.description);
      } else if (resourceType === 'mcps') {
        const { listMcpsCommand } = await import('./commands/mcp.js');
        await listMcpsCommand(opts);
      } else {
        const { listPresetsCommand } = await import('./commands/preset.js');
        await listPresetsCommand(opts);
      }
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium list skills', 'List all skills'),
    ex('$ imperium list skills -d', 'With descriptions'),
    ex('$ imperium list skills --kind reference', 'Only reference packs'),
    ex('$ imperium list mcps', 'List MCP servers'),
    ex('$ imperium list presets', 'List setup presets'),
    '',
  ].join('\n'));
}

// ---- search --------------------------------------------------------------
{
  const cmd = program
    .command('search <type> <query>')
    .description('Search for skills, MCPs, or presets matching a keyword')
    .action(async (type: string, query: string, _cmdOpts, cmd: Command) => {
      const resourceType = validateResourceType(type);
      const opts = extractOpts(cmd);

      if (resourceType === 'skills') {
        const { searchCommand } = await import('./commands/query.js');
        await searchCommand(query, opts);
      } else if (resourceType === 'mcps') {
        const { searchMcpsCommand } = await import('./commands/mcp.js');
        await searchMcpsCommand(query, opts);
      } else {
        const { searchPresetsCommand } = await import('./commands/preset.js');
        await searchPresetsCommand(query, opts);
      }
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium search skills python', 'Search skills by keyword'),
    ex('$ imperium search skills "api design"', 'Search with a phrase'),
    ex('$ imperium search mcps figma', 'Search MCPs by keyword'),
    ex('$ imperium search presets design', 'Search setup presets'),
    '',
  ].join('\n'));
}

// ---- inspect -------------------------------------------------------------
{
  const cmd = program
    .command('inspect <type> <name>')
    .description('Show full metadata for a skill, MCP, or setup preset')
    .action(async (type: string, name: string, _cmdOpts, cmd: Command) => {
      const resourceType = validateResourceType(type);
      const opts = extractOpts(cmd);

      if (resourceType === 'skills') {
        const { inspectCommand } = await import('./commands/query.js');
        await inspectCommand(name, opts);
      } else if (resourceType === 'mcps') {
        const { inspectMcpCommand } = await import('./commands/mcp.js');
        await inspectMcpCommand(name, opts);
      } else {
        const { inspectPresetCommand } = await import('./commands/preset.js');
        await inspectPresetCommand(name, opts);
      }
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium inspect skills python-patterns', 'Skill metadata + content'),
    ex('$ imperium inspect mcps obsidian', 'MCP server details'),
    ex('$ imperium inspect presets rxd', 'Preset contents'),
    '',
  ].join('\n'));
}

// ---- update --------------------------------------------------------------
{
  const cmd = program
    .command('update [skills...]')
    .description('Update installed skills (all if none specified)')
    .action(async (skills: string[], _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { updateCommand } = await import('./commands/manage.js');
      await updateCommand(skills || [], opts);
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addRegistryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium update', 'Update all installed skills'),
    ex('$ imperium update python-patterns', 'Update specific skill'),
    ex('$ imperium update --dry-run', 'Preview changes'),
    '',
  ].join('\n'));
}

// ---- remove --------------------------------------------------------------
{
  const cmd = program
    .command('remove <type> <names...>')
    .description('Remove installed skills or MCPs')
    .action(async (type: string, names: string[], _cmdOpts, cmd: Command) => {
      const resourceType = validateResourceType(type);

      if (resourceType === 'presets') {
        logError("Presets can't be removed. Remove individual skills or MCPs instead.");
        process.exitCode = 1;
        return;
      }
      const opts = extractOpts(cmd);

      if (resourceType === 'skills') {
        const { removeCommand } = await import('./commands/manage.js');
        await removeCommand(names, opts);
      } else {
        const { removeMcpsCommand } = await import('./commands/mcp.js');
        await removeMcpsCommand(names, opts);
      }
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium remove skills python-patterns', 'Remove a skill'),
    ex('$ imperium remove skills python-patterns django-tdd', 'Remove multiple'),
    ex('$ imperium remove mcps obsidian', 'Remove MCP from config'),
    ex('$ imperium remove mcps obsidian atlassian', 'Remove multiple MCPs'),
    '',
  ].join('\n'));
}

// ---- init ----------------------------------------------------------------
{
  const cmd = program
    .command('init')
    .description('Initialize an imperium lockfile in the current target')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { initCommand } = await import('./commands/utility.js');
      await initCommand(opts);
    });
  addTargetFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium init', 'Init lockfile in auto-detected folder'),
    ex('$ imperium init --target claude', 'Init lockfile in .claude/'),
    '',
  ].join('\n'));
}

// ---- detect --------------------------------------------------------------
{
  const cmd = program
    .command('detect')
    .description('Detect agent folders in the current directory')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { detectCommand } = await import('./commands/query.js');
      await detectCommand(opts);
    });
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium detect', 'Scan for .claude, .github, .cursor, etc.'),
    '',
  ].join('\n'));
}

// ---- validate ------------------------------------------------------------
{
  const cmd = program
    .command('validate')
    .description('Validate installed skills against the lockfile')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { validateCommand } = await import('./commands/utility.js');
      await validateCommand(opts);
    });
  addTargetFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', () => [
    '',
    c.h('Examples'),
    ex('$ imperium validate', 'Check installed skills match lockfile'),
    '',
  ].join('\n'));
}

// ---------------------------------------------------------------------------
// Fuzzy command recovery
// ---------------------------------------------------------------------------

program.on('command:*', (operands: string[]) => {
  const unknown = operands[0];
  const suggestion = fuzzyCommand(unknown);

  if (suggestion) {
    warn(`Unknown command '${unknown}'. Did you mean '${suggestion}'?`);
    logError(`Run: imperium ${suggestion}`);
  } else {
    logError(`Unknown command '${unknown}'. Run 'imperium --help' for available commands.`);
  }

  process.exitCode = 1;
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

export { program };

export async function run(argv?: string[]): Promise<void> {
  await program.parseAsync(argv || process.argv);
}
