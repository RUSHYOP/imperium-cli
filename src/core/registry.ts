import { createHash } from 'node:crypto';
import { info, verbose, warn, error as logError } from '../utils/log.js';
import type { PackageManifest, PackageKind, ContentSource } from './types.js';
import { getCached, setCache } from './cache.js';
import matter from 'gray-matter';
import {
  listPrivatePackages,
  fetchPrivatePackage,
  searchPrivatePackages,
  inspectPrivatePackage,
  listPrivateMcps,
  searchPrivateMcps,
  getPrivateMcp,
  listPrivateInstructions,
  searchPrivateInstructions,
  getPrivateInstruction,
  fetchPrivateInstructionContent,
  listPrivatePresets,
  searchPrivatePresets,
  getPrivatePreset,
  fetchPrivatePresetFile as fetchPrivatePresetFileFromWorker,
  isPrivatePackage,
} from './private-registry.js';

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
  source?: ContentSource;
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the raw GitHub content URL for a file. */
function rawUrl(cfg: RegistryConfig, path: string): string {
  return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/${path}`;
}

/** Build the GitHub API URL for the full repo tree (recursive, single request). */
function apiTreeUrl(cfg: RegistryConfig): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/${cfg.branch}?recursive=1`;
}

/** Build common headers, including GitHub token when available. */
function githubHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    'User-Agent': 'imperium-cli',
    'Cache-Control': 'no-cache',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

/** Fetch with exponential backoff — handles 429 rate limits and transient 5xx errors. */
async function fetchWithRetry(
  url: string,
  maxAttempts = 5,
): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, { headers: githubHeaders() });

    if (res.ok) return res;

    if (res.status === 429 || res.status >= 500) {
      const retryAfter = res.headers.get('retry-after');
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.min(1000 * 2 ** (attempt - 1), 30_000);
      if (attempt < maxAttempts) {
        warn(`HTTP ${res.status} from GitHub (attempt ${attempt}/${maxAttempts}). Retrying in ${Math.round(delay / 1000)}s...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }

    if (res.status === 403) {
      const msg = res.headers.get('x-ratelimit-remaining') === '0'
        ? `GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.`
        : `HTTP 403: ${url}`;
      throw new Error(msg);
    }

    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  throw lastError ?? new Error(`Failed to fetch ${url} after ${maxAttempts} attempts`);
}

/**
 * Pre-warm the tree cache so parallel fetchPackage calls don't stampede the API.
 * Call this once before batch operations.
 */
export async function prefetchTree(): Promise<void> {
  const cfg = getConfig();
  await fetchJsonCached(apiTreeUrl(cfg), 300_000);
}

// ---------------------------------------------------------------------------
// In-flight request deduplication (singleflight pattern)
// ---------------------------------------------------------------------------
// When multiple callers request the same URL concurrently, only one HTTP
// request is made — the rest await the same promise.  This prevents the
// "thundering herd" that caused the 429 storm when --all fired 118 fetches.
// ---------------------------------------------------------------------------
const _inflight = new Map<string, Promise<string>>();

/** Cached fetch for text content — coalesces concurrent requests to the same URL. */
async function fetchTextCached(url: string, ttl?: number): Promise<string> {
  const cached = getCached(url, ttl);
  if (cached !== null) {
    verbose('Cache hit');
    return cached;
  }

  // If an identical request is already in-flight, piggyback on it
  const existing = _inflight.get(url);
  if (existing) {
    verbose('Coalescing duplicate request');
    return existing;
  }

  const promise = (async () => {
    const res = await fetchWithRetry(url);
    const text = await res.text();
    setCache(url, text);
    return text;
  })();

  _inflight.set(url, promise);
  try {
    return await promise;
  } finally {
    _inflight.delete(url);
  }
}

/** Cached fetch for JSON. */
async function fetchJsonCached<T>(url: string, ttl?: number): Promise<T> {
  const text = await fetchTextCached(url, ttl);
  return JSON.parse(text) as T;
}

/** Uncached fetch for text (for individual file downloads). */
async function fetchText(url: string): Promise<string> {
  const res = await fetchWithRetry(url);
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

const CONTENT_DIRS = ['content/skills', 'content/references', 'content/presets'] as const;

const DIR_TO_KIND: Record<string, PackageKind> = {
  'content/skills': 'skill',
  'content/references': 'reference',
  'content/presets': 'preset',
};

/**
 * List all packages in the registry.
 * Merges public (GitHub) + private (R2) registries when logged in.
 */
export async function listPackages(
  registryUrl?: string,
  kind?: PackageKind,
): Promise<RegistryEntry[]> {
  const cfg = getConfig();

  const index = await fetchRegistryIndex(cfg);
  let entries = index.packages.map((e) => ({ ...e, source: 'public' as ContentSource }));

  // Merge private packages if authenticated
  const privateEntries = await listPrivatePackages(kind);
  if (privateEntries.length > 0) {
    const publicNames = new Set(entries.map((e) => e.name));
    for (const pe of privateEntries) {
      if (!publicNames.has(pe.name)) {
        entries.push({ ...pe, source: 'private' });
      }
    }
  }

  if (kind) {
    entries = entries.filter((e) => e.kind === kind);
  }

  return entries;
}

/**
 * Fetch a single package from the registry by name.
 * Checks private registry first (if logged in), then public.
 */
export async function fetchPackage(
  name: string,
  registryUrl?: string,
): Promise<FetchedPackage> {
  // Try private registry first
  if (await isPrivatePackage(name)) {
    return fetchPrivatePackage(name);
  }

  const cfg = getConfig();

  // 1) Use Trees API to find the package directory and all its files
  type TreeEntry = { path: string; type: string };
  type TreeResponse = { tree: TreeEntry[]; truncated: boolean };
  const tree = await fetchJsonCached<TreeResponse>(apiTreeUrl(cfg), 300_000);

  if (tree.truncated) {
    warn('GitHub tree API returned a truncated result — some packages may not be visible. Consider running `npx gitnexus analyze` to refresh the local index.');
  }

  for (const dir of CONTENT_DIRS) {
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
  const publicResults = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );

  // Also search private if logged in
  const privateResults = await searchPrivatePackages(query);
  const publicNames = new Set(publicResults.map((e) => e.name));
  for (const pe of privateResults) {
    if (!publicNames.has(pe.name)) {
      publicResults.push({ ...pe, source: 'private' });
    }
  }

  return publicResults;
}

/** Get a single package's metadata without downloading all files. */
export async function inspectPackage(
  name: string,
  registryUrl?: string,
): Promise<{ manifest: PackageManifest; content: string }> {
  // Check private first
  const privateResult = await inspectPrivatePackage(name);
  if (privateResult) return privateResult;

  const cfg = getConfig();

  for (const dir of CONTENT_DIRS) {
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

export interface McpBundleInfo {
  /** Bundle name (matches the R2 prefix under mcp-bundles/{mcpName}/). */
  name: string;
  /** Destination folder in the project root. */
  dest: string;
  /** Command to run in the dest folder after files are written. */
  postInstall?: string;
}

export interface McpConfigFileInfo {
  /** Relative path in the project root for the config file. */
  path: string;
  /** JSON content to write. */
  content: Record<string, unknown>;
}

export interface McpEntry {
  name: string;
  description: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  placeholders?: Record<string, string>;
  /** Directories to download from R2 and copy into the project. */
  bundles?: McpBundleInfo[];
  /** Config file to generate after bundles are installed. */
  configFile?: McpConfigFileInfo;
  source?: ContentSource;
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

/** List all available MCP server templates (public + private). */
export async function listMcps(): Promise<McpEntry[]> {
  const cfg = getConfig();
  const index = await fetchMcpRegistryIndex(cfg);
  const entries = index.mcps.map((m) => ({ ...m, source: 'public' as ContentSource }));

  // Merge private MCPs
  const privateMcps = await listPrivateMcps();
  const publicNames = new Set(entries.map((m) => m.name));
  for (const pm of privateMcps) {
    if (!publicNames.has(pm.name)) {
      entries.push({ ...pm, source: 'private' });
    }
  }

  return entries;
}

/** Search MCP templates by keyword (public + private). */
export async function searchMcps(query: string): Promise<McpEntry[]> {
  const all = await listMcps();
  const q = query.toLowerCase();
  return all.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );
}

/** Get a single MCP template by name (checks private first). */
export async function getMcp(name: string): Promise<McpEntry> {
  // Try private first
  const privateMcp = await getPrivateMcp(name);
  if (privateMcp) return privateMcp;

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
  source?: ContentSource;
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

/** List all available setup presets (public + private). */
export async function listSetupPresets(): Promise<SetupPresetEntry[]> {
  const cfg = getConfig();
  const index = await fetchPresetRegistryIndex(cfg);
  const entries = index.presets.map((p) => ({ ...p, source: 'public' as ContentSource }));

  // Merge private presets
  const privatePresets = await listPrivatePresets();
  const publicNames = new Set(entries.map((p) => p.name));
  for (const pp of privatePresets) {
    if (!publicNames.has(pp.name)) {
      entries.push({ ...pp, source: 'private' });
    }
  }

  return entries;
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

/** Get a single setup preset by name (checks private first). */
export async function getSetupPreset(name: string): Promise<SetupPresetEntry> {
  const privatePreset = await getPrivatePreset(name);
  if (privatePreset) return privatePreset;

  const all = await listSetupPresets();
  const entry = all.find((p) => p.name === name);
  if (!entry) throw new Error(`Setup preset '${name}' not found in registry.`);
  return entry;
}

/** Fetch a single file from a setup preset directory (checks private first). */
export async function fetchPresetFile(presetName: string, filePath: string): Promise<string> {
  const privatePreset = await getPrivatePreset(presetName);
  if (privatePreset) {
    return fetchPrivatePresetFileFromWorker(presetName, filePath);
  }

  const cfg = getConfig();
  const url = rawUrl(cfg, `content/presets/${presetName}/${filePath}`);
  return fetchText(url);
}

// ---------------------------------------------------------------------------
// Instructions Registry
// ---------------------------------------------------------------------------

export interface InstructionEntry {
  name: string;
  description: string;
  source?: ContentSource;
}

interface InstructionsRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  instructions: InstructionEntry[];
}

function instructionsRegistryUrl(cfg: RegistryConfig): string {
  return rawUrl(cfg, 'instructions-registry.json');
}

async function fetchInstructionsRegistryIndex(cfg: RegistryConfig): Promise<InstructionsRegistryIndex> {
  return fetchJsonCached<InstructionsRegistryIndex>(instructionsRegistryUrl(cfg));
}

/** List all available instruction files (public + private). */
export async function listInstructions(): Promise<InstructionEntry[]> {
  const cfg = getConfig();
  const index = await fetchInstructionsRegistryIndex(cfg);
  const entries = index.instructions.map((i) => ({ ...i, source: 'public' as ContentSource }));

  // Merge private instructions
  const privateInstructions = await listPrivateInstructions();
  const publicNames = new Set(entries.map((i) => i.name));
  for (const pi of privateInstructions) {
    if (!publicNames.has(pi.name)) {
      entries.push({ ...pi, source: 'private' });
    }
  }

  return entries;
}

/** Search instruction files by keyword. */
export async function searchInstructions(query: string): Promise<InstructionEntry[]> {
  const all = await listInstructions();
  const q = query.toLowerCase();
  return all.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q),
  );
}

/** Get a single instruction entry by name (checks private first). */
export async function getInstruction(name: string): Promise<InstructionEntry> {
  const privateInstr = await getPrivateInstruction(name);
  if (privateInstr) return privateInstr;

  const all = await listInstructions();
  const entry = all.find((i) => i.name === name);
  if (!entry) throw new Error(`Instruction '${name}' not found in registry.`);
  return entry;
}

/** Fetch the full content of an instruction file (checks private first). */
export async function fetchInstructionContent(name: string): Promise<{ content: string; description: string }> {
  // Try private first
  const privateInstr = await getPrivateInstruction(name);
  if (privateInstr) {
    return fetchPrivateInstructionContent(name);
  }

  const cfg = getConfig();
  const url = rawUrl(cfg, `content/instructions/${name}.md`);
  const raw = await fetchText(url);
  const { data, content } = matter(raw);
  return {
    content: content.trim(),
    description: typeof data.description === 'string' ? data.description : '',
  };
}
