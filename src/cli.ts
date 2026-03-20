import { Command } from 'commander';
import type { GlobalOptions, PackageKind, PresetName } from './core/types/index.js';
import { setLogOptions } from './utils/log.js';
import { fuzzyCommand } from './utils/fuzzy.js';
import { warn, error as logError } from './utils/log.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('imperium')
  .description('A package manager for agent context — skills, reference packs, and presets.')
  .version(pkg.version)
  .addHelpText('after', `
Command Reference:
  imperium setup <preset> [--with <skills...>] [--dry-run] [-y] [--force] [--verbose]
    preset: claude | github | windsurf | cursor | custom | <path>

  imperium add <skills...> [--all] [--from-file <path>] [--path <dir>]
               [--target <preset>] [--root <path>] [--force] [--dry-run]
               [--merge | --overwrite | --preserve] [-y] [--verbose]

  imperium list [-d [skills...]] [--kind skill|reference|preset] [--format md|yaml|json]

  imperium search <query> [--kind skill|reference|preset] [--format md|yaml|json]

  imperium inspect <skill> [--format md|yaml|json]

  imperium update [skills...] [--target <preset>] [--root <path>] [--dry-run] [-y]

  imperium remove <skills...> [--target <preset>] [--root <path>] [--dry-run] [-y]

  imperium init [--target <preset>] [--root <path>]

  imperium detect

  imperium validate [--target <preset>] [--root <path>]

Common Flags (all commands accept):
  --target <preset>    claude | github | windsurf | cursor | custom
  --root <path>        Custom folder root (overrides --target)
  --dry-run            Preview changes without writing anything
  -y, --yes            Skip all confirmation prompts
  --force              Overwrite existing files without asking
  --verbose            Show file-by-file detail
  --silent             Suppress all output

Run 'imperium <command> --help' for full options and examples.`);

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

// ---- setup ---------------------------------------------------------------
{
  const cmd = program
    .command('setup <preset>')
    .description('Setup a preset folder (.claude, .github, .windsurf, .cursor, custom)')
    .option('--with <skills...>', 'Also install these skills after scaffolding')
    .action(async (preset: string, cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { setupCommand } = await import('./commands/setup.js');
      await setupCommand(preset, { ...opts, with: cmdOpts.with });
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addRegistryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium setup claude                                   Create .claude/ folder structure
  $ imperium setup claude --with python-patterns            Setup + install a skill
  $ imperium setup claude --with python-patterns django-tdd Setup + install multiple skills
  $ imperium setup github                                   Create .github/copilot/ structure
  $ imperium setup windsurf                                 Create .windsurf/ structure
  $ imperium setup ./my-agent                               Create custom folder structure
  $ imperium setup claude --dry-run                         Preview what would be created`);
}

// ---- add -----------------------------------------------------------------
{
  const cmd = program
    .command('add <skills...>')
    .description('Add skills to the project')
    .option('--from-file <path>', 'Read skill names from a file')
    .option('--all', 'Add all skills from the registry')
    .option('--path <dir>', 'Target directory to install into')
    .action(async (skills: string[], cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      if (cmdOpts.path) opts.root = cmdOpts.path;
      const { addCommand } = await import('./commands/install.js');
      await addCommand(skills, { ...opts, fromFile: cmdOpts.fromFile, all: cmdOpts.all });
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addRegistryFlags(cmd);
  addFilterFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium add python-patterns                     Add a single skill
  $ imperium add python-patterns django-tdd           Add multiple skills
  $ imperium add python-patterns --path .cursor       Add to a specific folder
  $ imperium add --all                                Add all skills from registry
  $ imperium add --from-file skills.txt               Add skills listed in a file
  $ imperium add python-patterns --dry-run --verbose  Preview with details
  $ imperium add python-patterns --force              Overwrite existing files`);
}

// ---- list ----------------------------------------------------------------
{
  const cmd = program
    .command('list')
    .description('List available skills from the registry')
    .option('-d, --description [skills...]', 'Show descriptions (optionally for specific skills only)')
    .action(async (cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { listCommand } = await import('./commands/query.js');
      await listCommand(opts, cmdOpts.description);
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium list                           List all skill names
  $ imperium list -d                        List all with descriptions
  $ imperium list -d python-patterns        Show description for specific skills
  $ imperium list --kind reference          List only reference packs
  $ imperium list --format json             Output as JSON`);
}

// ---- search --------------------------------------------------------------
{
  const cmd = program
    .command('search <query>')
    .description('Search for skills matching a keyword')
    .action(async (query: string, _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { searchCommand } = await import('./commands/query.js');
      await searchCommand(query, opts);
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium search python           Search by keyword
  $ imperium search "api design"     Search with a phrase
  $ imperium search django --kind skill  Filter by kind`);
}

// ---- inspect -------------------------------------------------------------
{
  const cmd = program
    .command('inspect <skill>')
    .description('Show full metadata and content for a skill')
    .action(async (skill: string, _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { inspectCommand } = await import('./commands/query.js');
      await inspectCommand(skill, opts);
    });
  addQueryFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium inspect python-patterns          View skill metadata and content
  $ imperium inspect python-patterns --format yaml  Output as YAML`);
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
  cmd.addHelpText('after', `
Examples:
  $ imperium update                          Update all installed skills
  $ imperium update python-patterns          Update a specific skill
  $ imperium update --dry-run                Preview what would change`);
}

// ---- remove --------------------------------------------------------------
{
  const cmd = program
    .command('remove <skills...>')
    .description('Remove installed skills from the project')
    .action(async (skills: string[], _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd);
      const { removeCommand } = await import('./commands/manage.js');
      await removeCommand(skills, opts);
    });
  addTargetFlags(cmd);
  addWriteFlags(cmd);
  addOutputFlags(cmd);
  cmd.addHelpText('after', `
Examples:
  $ imperium remove python-patterns           Remove a skill
  $ imperium remove python-patterns django-tdd  Remove multiple skills
  $ imperium remove python-patterns --dry-run   Preview removal`);
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
  cmd.addHelpText('after', `
Examples:
  $ imperium init                    Init lockfile in auto-detected folder
  $ imperium init --target claude    Init lockfile in .claude/`);
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
  cmd.addHelpText('after', `
Examples:
  $ imperium detect                  Scan for .claude, .github, .cursor, etc.`);
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
  cmd.addHelpText('after', `
Examples:
  $ imperium validate                Check all installed skills match lockfile`);
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
