import { createHash } from 'node:crypto';
import { info, verbose, warn, error as logError } from '../../utils/log.js';
import type { PackageManifest, PackageKind } from '../types/index.js';
import { getCached, setCache } from '../cache/index.js';
import matter from 'gray-matter';

/**
 * Default GitHub org/repo used as the skill registry.
 */
const DEFAULT_OWNER = 'RUSHYOP';
const DEFAULT_REPO = 'imperium-cli';
const DEFAULT_BRANCH = 'main';

/** Parsed registry config. */
interface RegistryConfig {
  owner: string;
  repo: string;
  branch: string;
}

/** A registry index entry returned from listing. */
export interface RegistryEntry {
  name: string;
  kind: PackageKind;
  description: string;
  version: string;
  path: string;
}

/** A fully-fetched package from the registry. */
export interface FetchedPackage {
  manifest: PackageManifest;
  skillContent: string;
  files: { path: string; content: string }[];
  checksum: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getConfig(): RegistryConfig {
  return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH };
}

/** Build the raw GitHub content URL for a file. */
function rawUrl(cfg: RegistryConfig, path: string): string {
  return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/${path}`;
}

/** Build the GitHub API URL for the full repo tree (recursive, single request). */
function apiTreeUrl(cfg: RegistryConfig): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/${cfg.branch}?recursive=1`;
}

/** Cached fetch for text content. */
async function fetchTextCached(url: string, ttl?: number): Promise<string> {
  const cached = getCached(url, ttl);
  if (cached !== null) {
    verbose('Cache hit');
    return cached;
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'imperium-cli', 'Cache-Control': 'no-cache' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  const text = await res.text();
  setCache(url, text);
  return text;
}

/** Cached fetch for JSON. */
async function fetchJsonCached<T>(url: string, ttl?: number): Promise<T> {
  const text = await fetchTextCached(url, ttl);
  return JSON.parse(text) as T;
}

/** Uncached fetch for text (for individual file downloads). */
async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'imperium-cli', 'Cache-Control': 'no-cache' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.text();
}

function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

// ---------------------------------------------------------------------------
// Registry Index (pre-built registry.json)
// ---------------------------------------------------------------------------

interface RegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  packages: RegistryEntry[];
}

/** Registry index URL (single file, ~47KB). */
function registryIndexUrl(cfg: RegistryConfig): string {
  return rawUrl(cfg, 'registry.json');
}

/** Fetch the pre-built registry index. Cached locally for 5 minutes. */
async function fetchRegistryIndex(cfg: RegistryConfig): Promise<RegistryIndex> {
  return fetchJsonCached<RegistryIndex>(registryIndexUrl(cfg));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const DIR_TO_KIND: Record<string, PackageKind> = {
  skills: 'skill',
  references: 'reference',
  presets: 'preset',
};

/**
 * List all packages in the registry.
 * Uses the pre-built registry.json index — 1 HTTP request (cached).
 */
export async function listPackages(
  registryUrl?: string,
  kind?: PackageKind,
): Promise<RegistryEntry[]> {
  const cfg = getConfig();

  const index = await fetchRegistryIndex(cfg);
  let entries = index.packages;

  if (kind) {
    entries = entries.filter((e) => e.kind === kind);
  }

  return entries;
}

/**
 * Fetch a single package from the registry by name.
 *
 * Uses the Trees API to discover all files in one call, then fetches
 * all file contents in parallel — much faster than recursive directory walking.
 */
export async function fetchPackage(
  name: string,
  registryUrl?: string,
): Promise<FetchedPackage> {
  const cfg = getConfig();
  const dirs = ['skills', 'references', 'presets'];

  // 1) Use Trees API to find the package directory and all its files
  type TreeEntry = { path: string; type: string };
  type TreeResponse = { tree: TreeEntry[]; truncated: boolean };
  const tree = await fetchJsonCached<TreeResponse>(apiTreeUrl(cfg), 60_000);

  for (const dir of dirs) {
    const prefix = `${dir}/${name}/`;
    const packageFiles = tree.tree.filter(
      (e) => e.type === 'blob' && e.path.startsWith(prefix),
    );

    if (packageFiles.length === 0) continue;

    // 2) Fetch SKILL.md first to get manifest
    const skillMdEntry = packageFiles.find((e) => e.path === `${prefix}SKILL.md`);
    if (!skillMdEntry) continue;

    const skillMd = await fetchText(rawUrl(cfg, skillMdEntry.path));
    const { data, content } = matter(skillMd);
    const manifest = data as PackageManifest;

    // 3) Fetch all other files in parallel
    const allFiles = await Promise.all(
      packageFiles.map(async (entry) => {
        const fileContent = entry.path === skillMdEntry.path
          ? skillMd
          : await fetchText(rawUrl(cfg, entry.path));
        return {
          path: entry.path.replace(prefix, ''),
          content: fileContent,
        };
      }),
    );

    const allContent = allFiles.map((f) => f.content).join('');

    return {
      manifest: {
        ...manifest,
        name: manifest.name || name,
        kind: manifest.kind || (DIR_TO_KIND[dir] || 'skill'),
        version: manifest.version || '0.0.0',
        description: manifest.description || '',
      } as PackageManifest,
      skillContent: content,
      files: allFiles,
      checksum: checksum(allContent),
    };
  }

  throw new Error(`Package '${name}' not found in registry.`);
}

/**
 * Search the registry for packages matching a query.
 * Uses the cached registry index + client-side filtering — instant after first load.
 */
export async function searchPackages(
  query: string,
  registryUrl?: string,
): Promise<RegistryEntry[]> {
  const entries = await listPackages(registryUrl);
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );
}

/** Get a single package's metadata without downloading all files. */
export async function inspectPackage(
  name: string,
  registryUrl?: string,
): Promise<{ manifest: PackageManifest; content: string }> {
  const cfg = getConfig();
  const dirs = ['skills', 'references', 'presets'];

  for (const dir of dirs) {
    try {
      const skillMd = await fetchTextCached(rawUrl(cfg, `${dir}/${name}/SKILL.md`));
      const { data, content } = matter(skillMd);
      return {
        manifest: {
          ...data,
          name: data.name || name,
          kind: data.kind || (DIR_TO_KIND[dir] || 'skill'),
          version: data.version || '0.0.0',
          description: data.description || '',
        } as PackageManifest,
        content,
      };
    } catch {
      continue;
    }
  }

  throw new Error(`Package '${name}' not found in registry.`);
}

// ---------------------------------------------------------------------------
// MCP Registry
// ---------------------------------------------------------------------------

export interface McpEntry {
  name: string;
  description: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  placeholders?: Record<string, string>;
}

interface McpRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  mcps: McpEntry[];
}

function mcpRegistryUrl(cfg: RegistryConfig): string {
  return rawUrl(cfg, 'mcp-registry.json');
}

async function fetchMcpRegistryIndex(cfg: RegistryConfig): Promise<McpRegistryIndex> {
  return fetchJsonCached<McpRegistryIndex>(mcpRegistryUrl(cfg));
}

/** List all available MCP server templates. */
export async function listMcps(): Promise<McpEntry[]> {
  const cfg = getConfig();
  const index = await fetchMcpRegistryIndex(cfg);
  return index.mcps;
}

/** Search MCP templates by keyword. */
export async function searchMcps(query: string): Promise<McpEntry[]> {
  const all = await listMcps();
  const q = query.toLowerCase();
  return all.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );
}

/** Get a single MCP template by name. */
export async function getMcp(name: string): Promise<McpEntry> {
  const all = await listMcps();
  const entry = all.find((m) => m.name === name);
  if (!entry) throw new Error(`MCP '${name}' not found in registry.`);
  return entry;
}

// ---------------------------------------------------------------------------
// Setup Preset Registry
// ---------------------------------------------------------------------------

export interface SetupPresetEntry {
  name: string;
  description: string;
  adapter: string;
  skills: string[];
  mcps: string[];
  files: string[];
}

interface PresetRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  presets: SetupPresetEntry[];
}

function presetRegistryUrl(cfg: RegistryConfig): string {
  return rawUrl(cfg, 'preset-registry.json');
}

async function fetchPresetRegistryIndex(cfg: RegistryConfig): Promise<PresetRegistryIndex> {
  return fetchJsonCached<PresetRegistryIndex>(presetRegistryUrl(cfg));
}

/** List all available setup presets. */
export async function listSetupPresets(): Promise<SetupPresetEntry[]> {
  const cfg = getConfig();
  const index = await fetchPresetRegistryIndex(cfg);
  return index.presets;
}

/** Search setup presets by keyword. */
export async function searchSetupPresets(query: string): Promise<SetupPresetEntry[]> {
  const all = await listSetupPresets();
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}

/** Get a single setup preset by name. */
export async function getSetupPreset(name: string): Promise<SetupPresetEntry> {
  const all = await listSetupPresets();
  const entry = all.find((p) => p.name === name);
  if (!entry) throw new Error(`Setup preset '${name}' not found in registry.`);
  return entry;
}

/** Fetch a single file from a setup preset directory. */
export async function fetchPresetFile(presetName: string, filePath: string): Promise<string> {
  const cfg = getConfig();
  const url = rawUrl(cfg, `setup-presets/${presetName}/${filePath}`);
  return fetchText(url);
}
