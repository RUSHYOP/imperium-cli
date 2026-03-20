/** The three content types imperium manages. */
export type PackageKind = 'skill' | 'reference' | 'preset';

/** Supported agent-ecosystem presets. */
export type PresetName = 'claude' | 'github' | 'windsurf' | 'cursor' | 'custom';

/** Known agent root folder names. */
export const KNOWN_ROOTS: Record<PresetName, string> = {
  claude: '.claude',
  github: '.github',
  windsurf: '.agents',
  cursor: '.cursor',
  custom: '.agents',
};

/** Manifest schema for a skill / reference pack. */
export interface PackageManifest {
  name: string;
  kind: PackageKind;
  version: string;
  description: string;
  aliases?: string[];
  tags?: string[];
  targets?: PresetName[];
  includes?: string[];
  dependencies?: string[];
  sources?: string[];
  scripts?: string[];
  assets?: string[];
  examples?: string[];
  author?: string;
  license?: string;
  deprecated?: boolean;
  updated_at?: string;
}

/** Lockfile entry for an installed package. */
export interface LockEntry {
  name: string;
  kind: PackageKind;
  version: string;
  source: string;
  checksum: string;
  installedPath: string;
  installedAt: string;
  lastSync: string;
}

/** Lockfile entry for an installed instruction file. */
export interface LockInstructionEntry {
  name: string;
  description: string;
  source: string;
  checksum: string;
  installedPath: string;
  installedAt: string;
}

/** Full lockfile schema. */
export interface Lockfile {
  version: 1;
  preset: PresetName | null;
  root: string;
  packages: Record<string, LockEntry>;
  instructions: Record<string, LockInstructionEntry>;
}

/** Global CLI options threaded through all commands. */
export interface GlobalOptions {
  root?: string;
  target?: PresetName;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  noFuzzy?: boolean;
  verbose?: boolean;
  silent?: boolean;
  local?: string;
  tag?: string;
  channel?: 'stable' | 'beta' | 'dev';
  copy?: boolean;
  symlink?: boolean;
  merge?: boolean;
  overwrite?: boolean;
  preserve?: boolean;
  include?: string;
  exclude?: string;
  kind?: PackageKind;
  format?: 'md' | 'yaml' | 'json';
}

/** Resolved target information after folder detection. */
export interface ResolvedTarget {
  preset: PresetName;
  rootDir: string;
  skillsDir: string;
}

/** A setup preset: a curated bundle of skills, MCPs, and files for a specific workflow. */
export interface SetupPresetEntry {
  name: string;
  description: string;
  adapter: PresetName;
  skills: string[];
  mcps: string[];
  files: string[];
}
