// Public API — re-export everything usable programmatically
export { run, program } from './cli.js';
export type {
  PackageKind,
  PresetName,
  PackageManifest,
  LockEntry,
  Lockfile,
  GlobalOptions,
  ResolvedTarget,
} from './core/types/index.js';
export {
  listPackages,
  fetchPackage,
  searchPackages,
  inspectPackage,
} from './core/registry/index.js';
export { installPackage, removePackage } from './core/installer/index.js';
export { getAdapter } from './adapters/index.js';
export {
  readLockfile,
  writeLockfile,
  isInstalled,
} from './core/lockfile/index.js';
export { resolveTarget, detectAgentFolders } from './utils/resolve-target.js';
export { fuzzyMatch, bestMatch, fuzzyCommand, fuzzyPreset } from './utils/fuzzy.js';
