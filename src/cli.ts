import { Command } from 'commander';
import type { GlobalOptions, PackageKind, PresetName } from './core/types/index.js';
import { setLogOptions } from './utils/log.js';
import { fuzzyCommand } from './utils/fuzzy.js';
import { warn, error as logError } from './utils/log.js';

const program = new Command();

program
  .name('imperium')
  .description('A package manager for agent context — skills, reference packs, and presets.')
  .version('0.1.0');

// ---------------------------------------------------------------------------
// Global flags
// ---------------------------------------------------------------------------

function addGlobalFlags(cmd: Command): Command {
  return cmd
    .option('--root <path>', 'Custom folder root')
    .option('--target <preset>', 'Target preset: claude, github, windsurf, cursor, custom')
    .option('--force', 'Overwrite without asking')
    .option('--dry-run', 'Preview changes only')
    .option('-y, --yes', 'Skip confirmations')
    .option('--no-fuzzy', 'Disable typo correction')
    .option('--verbose', 'Show file-by-file actions')
    .option('--silent', 'Minimal output')
    .option('--registry <url>', 'GitHub registry (owner/repo or full URL)')
    .option('--local <path>', 'Local registry path')
    .option('--tag <version>', 'Version pin')
    .option('--channel <channel>', 'Channel: stable, beta, dev')
    .option('--copy', 'Copy files instead of symlink')
    .option('--symlink', 'Symlink where possible')
    .option('--merge', 'Merge with existing files')
    .option('--overwrite', 'Replace existing files')
    .option('--preserve', 'Preserve user edits')
    .option('--include <pattern>', 'Include files/folders matching pattern')
    .option('--exclude <pattern>', 'Exclude files/folders matching pattern')
    .option('--kind <kind>', 'Filter by kind: skill, reference, preset')
    .option('--format <fmt>', 'Output format: md, yaml, json');
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
    registry: o.registry,
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

addGlobalFlags(
  program
    .command('setup <preset>')
    .description('Create the full folder architecture for a preset (.claude, .github, .windsurf, .cursor, custom)')
    .action(async (preset: string, _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { setupCommand } = await import('./commands/setup.js');
      await setupCommand(preset, opts);
    }),
);

addGlobalFlags(
  program
    .command('add <skills...>')
    .description('Add one or more skills to the current project')
    .option('--from-file <path>', 'Read skill names from a file')
    .option('--all', 'Install all skills from the registry')
    .action(async (skills: string[], cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { addCommand } = await import('./commands/install.js');
      await addCommand(skills, { ...opts, fromFile: cmdOpts.fromFile, all: cmdOpts.all });
    }),
);

addGlobalFlags(
  program
    .command('download <skills...>')
    .description('Fetch skills from the registry into a target folder')
    .option('--to <path>', 'Target folder path')
    .option('--all', 'Download all skills')
    .action(async (skills: string[], cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { downloadCommand } = await import('./commands/install.js');
      await downloadCommand(skills, { ...opts, to: cmdOpts.to, all: cmdOpts.all });
    }),
);

addGlobalFlags(
  program
    .command('install <skills...>')
    .description('Install skills and generate native platform files')
    .option('--from-file <path>', 'Read skill names from a file')
    .option('--all', 'Install all skills')
    .action(async (skills: string[], cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { installCommand } = await import('./commands/install.js');
      await installCommand(skills, { ...opts, fromFile: cmdOpts.fromFile, all: cmdOpts.all });
    }),
);

addGlobalFlags(
  program
    .command('list')
    .description('List all available packages in the registry')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { listCommand } = await import('./commands/query.js');
      await listCommand(opts);
    }),
);

addGlobalFlags(
  program
    .command('search <query>')
    .description('Search for skills matching a query')
    .action(async (query: string, _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { searchCommand } = await import('./commands/query.js');
      await searchCommand(query, opts);
    }),
);

addGlobalFlags(
  program
    .command('inspect <skill>')
    .description('Show metadata and install path for a skill')
    .action(async (skill: string, _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { inspectCommand } = await import('./commands/query.js');
      await inspectCommand(skill, opts);
    }),
);

addGlobalFlags(
  program
    .command('update [skills...]')
    .description('Update installed skills (all if none specified)')
    .action(async (skills: string[], _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { updateCommand } = await import('./commands/manage.js');
      await updateCommand(skills || [], opts);
    }),
);

addGlobalFlags(
  program
    .command('remove <skills...>')
    .description('Remove installed skills')
    .action(async (skills: string[], _cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { removeCommand } = await import('./commands/manage.js');
      await removeCommand(skills, opts);
    }),
);

addGlobalFlags(
  program
    .command('init')
    .description('Initialize an imperium lockfile in the current target')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { initCommand } = await import('./commands/utility.js');
      await initCommand(opts);
    }),
);

addGlobalFlags(
  program
    .command('detect')
    .description('Detect agent folders in the current directory')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { detectCommand } = await import('./commands/query.js');
      await detectCommand(opts);
    }),
);

addGlobalFlags(
  program
    .command('validate')
    .description('Validate installed skills against lockfile')
    .action(async (_cmdOpts, cmd: Command) => {
      const opts = extractOpts(cmd.parent!);
      const { validateCommand } = await import('./commands/utility.js');
      await validateCommand(opts);
    }),
);

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
