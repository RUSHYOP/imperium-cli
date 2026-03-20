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
} from './core/types.js';
export {
  listPackages,
  fetchPackage,
  searchPackages,
  inspectPackage,
  listInstructions,
  searchInstructions,
  getInstruction,
  fetchInstructionContent,
} from './core/registry.js';
export { installPackage, removePackage } from './core/installer.js';
export { getAdapter } from './adapters/index.js';
export { getInstructionPath } from './adapters/index.js';
export {
  readLockfile,
  writeLockfile,
  isInstalled,
} from './core/lockfile.js';
export { resolveTarget, detectAgentFolders } from './utils/resolve-target.js';
export { fuzzyMatch, bestMatch, fuzzyCommand, fuzzyPreset } from './utils/fuzzy.js';
