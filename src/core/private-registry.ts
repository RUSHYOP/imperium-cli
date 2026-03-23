import { getAccessToken, isLoggedIn } from './auth.js';
import { getCached, setCache } from './cache.js';
import { verbose } from '../utils/log.js';
import type { PackageManifest, PackageKind } from './types.js';
import type { RegistryEntry, FetchedPackage, McpEntry, InstructionEntry, SetupPresetEntry } from './registry.js';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Base URL for the Cloudflare Worker gateway. Override via IMPERIUM_WORKER_URL env var. */
const WORKER_BASE_URL = process.env.IMPERIUM_WORKER_URL ?? 'https://imperium-worker.alwayspurav.workers.dev';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes — same as public registry

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/** Authenticated fetch against the Worker gateway. */
async function fetchPrivate(path: string): Promise<Response> {
  const token = await getAccessToken();
  const url = `${WORKER_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'imperium-cli',
    },
  });

  if (res.status === 401) {
    throw new Error('Authentication expired. Run `imperium login` to re-authenticate.');
  }

  if (res.status === 403) {
    throw new Error('Access denied. Your email domain is not authorized for private content.');
  }

  if (!res.ok) {
    throw new Error(`Private registry error (HTTP ${res.status}): ${path}`);
  }

  return res;
}

/** Authenticated fetch with local caching. */
async function fetchPrivateTextCached(path: string, ttl = CACHE_TTL): Promise<string> {
  const cacheUrl = `imperium-private://${path}`;
  const cached = getCached(cacheUrl, ttl);
  if (cached !== null) {
    verbose('Private cache hit');
    return cached;
  }

  const res = await fetchPrivate(path);
  const text = await res.text();
  setCache(cacheUrl, text);
  return text;
}

async function fetchPrivateJsonCached<T>(path: string, ttl = CACHE_TTL): Promise<T> {
  const text = await fetchPrivateTextCached(path, ttl);
  return JSON.parse(text) as T;
}

async function fetchPrivateText(path: string): Promise<string> {
  const res = await fetchPrivate(path);
  return res.text();
}

// ---------------------------------------------------------------------------
// Batch download — fetch multiple files in one request
// ---------------------------------------------------------------------------

interface BatchResponseItem {
  path: string;
  content: string | null;
  error?: string;
}

interface BatchResponse {
  files: BatchResponseItem[];
}

/**
 * Fetch multiple files in a single HTTP request via the batch endpoint.
 * Falls back to individual parallel fetches if the batch endpoint fails.
 */
async function fetchPrivateBatch(paths: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  try {
    const token = await getAccessToken();
    const res = await fetch(`${WORKER_BASE_URL}/batch/download`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'imperium-cli',
      },
      body: JSON.stringify({ paths }),
    });

    if (res.ok) {
      const data = await res.json() as BatchResponse;
      for (const item of data.files) {
        if (item.content !== null) {
          results.set(item.path, item.content);
        }
      }
      return results;
    }

    verbose(`Batch download returned HTTP ${res.status}, falling back to parallel fetches`);
  } catch (err: any) {
    verbose(`Batch download failed: ${err.message}, falling back to parallel fetches`);
  }

  // Fallback: individual parallel fetches
  const settled = await Promise.all(
    paths.map(async (p) => {
      try {
        const content = await fetchPrivateText(p);
        return { path: p, content };
      } catch {
        return { path: p, content: null };
      }
    }),
  );
  for (const item of settled) {
    if (item.content !== null) {
      results.set(item.path, item.content);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Private Registry Index
// ---------------------------------------------------------------------------

interface PrivateRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  packages: RegistryEntry[];
}

interface PrivateMcpRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  mcps: McpEntry[];
}

interface PrivateInstructionsRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  instructions: InstructionEntry[];
}

interface PrivatePresetRegistryIndex {
  version: number;
  updated_at: string;
  count: number;
  presets: SetupPresetEntry[];
}

// ---------------------------------------------------------------------------
// Public API — Skills / Packages
// ---------------------------------------------------------------------------

/**
 * List all private packages. Returns empty array if not logged in or on error.
 */
export async function listPrivatePackages(kind?: PackageKind): Promise<RegistryEntry[]> {
  if (!isLoggedIn()) return [];

  try {
    const index = await fetchPrivateJsonCached<PrivateRegistryIndex>('/registry.json');
    let entries = index.packages.map((e) => ({ ...e, source: 'private' as const }));
    if (kind) {
      entries = entries.filter((e) => e.kind === kind);
    }
    return entries;
  } catch (err: any) {
    verbose(`Private registry unavailable: ${err.message}`);
    return [];
  }
}

/**
 * Fetch a single private package by name.
 */
export async function fetchPrivatePackage(name: string): Promise<FetchedPackage> {
  // Get the file listing for this package
  const filesJson = await fetchPrivateTextCached(`/content/skills/${name}`);
  const filePaths = JSON.parse(filesJson) as string[];

  if (filePaths.length === 0) {
    throw new Error(`Private package '${name}' has no files.`);
  }

  const skillMdPath = filePaths.find((f) => f.endsWith('SKILL.md'));
  if (!skillMdPath) {
    throw new Error(`Private package '${name}' is missing SKILL.md.`);
  }

  // Batch-fetch all files in a single request
  const fullPaths = filePaths.map((f) => `/content/skills/${name}/${f}`);
  const batchResults = await fetchPrivateBatch(fullPaths);

  const skillMdFullPath = `/content/skills/${name}/${skillMdPath}`;
  const skillMd = batchResults.get(skillMdFullPath);
  if (!skillMd) {
    throw new Error(`Failed to fetch SKILL.md for private package '${name}'.`);
  }

  const { data, content } = matter(skillMd);
  const manifest = data as PackageManifest;

  const allFiles = filePaths.map((filePath) => {
    const fullPath = `/content/skills/${name}/${filePath}`;
    return {
      path: filePath,
      content: batchResults.get(fullPath) ?? '',
    };
  });

  const allContent = allFiles.map((f) => f.content).join('');

  return {
    manifest: {
      ...manifest,
      name: manifest.name || name,
      kind: manifest.kind || 'skill',
      version: manifest.version || '0.0.0',
      description: manifest.description || '',
    } as PackageManifest,
    skillContent: content,
    files: allFiles,
    checksum: checksum(allContent),
  };
}

/**
 * Search private packages by keyword.
 */
export async function searchPrivatePackages(query: string): Promise<RegistryEntry[]> {
  const entries = await listPrivatePackages();
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );
}

/**
 * Inspect a private package (metadata + content only — no full file download).
 */
export async function inspectPrivatePackage(
  name: string,
): Promise<{ manifest: PackageManifest; content: string } | null> {
  if (!isLoggedIn()) return null;

  try {
    const skillMd = await fetchPrivateTextCached(`/content/skills/${name}/SKILL.md`);
    const { data, content } = matter(skillMd);
    return {
      manifest: {
        ...data,
        name: data.name || name,
        kind: data.kind || 'skill',
        version: data.version || '0.0.0',
        description: data.description || '',
      } as PackageManifest,
      content,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API — MCPs
// ---------------------------------------------------------------------------

export async function listPrivateMcps(): Promise<McpEntry[]> {
  if (!isLoggedIn()) return [];

  try {
    const index = await fetchPrivateJsonCached<PrivateMcpRegistryIndex>('/mcp-registry.json');
    return index.mcps;
  } catch (err: any) {
    verbose(`Private MCP registry unavailable: ${err.message}`);
    return [];
  }
}

export async function searchPrivateMcps(query: string): Promise<McpEntry[]> {
  const all = await listPrivateMcps();
  const q = query.toLowerCase();
  return all.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );
}

export async function getPrivateMcp(name: string): Promise<McpEntry | null> {
  const all = await listPrivateMcps();
  return all.find((m) => m.name === name) ?? null;
}

// ---------------------------------------------------------------------------
// Public API — Instructions
// ---------------------------------------------------------------------------

export async function listPrivateInstructions(): Promise<InstructionEntry[]> {
  if (!isLoggedIn()) return [];

  try {
    const index = await fetchPrivateJsonCached<PrivateInstructionsRegistryIndex>('/instructions-registry.json');
    return index.instructions;
  } catch (err: any) {
    verbose(`Private instructions registry unavailable: ${err.message}`);
    return [];
  }
}

export async function searchPrivateInstructions(query: string): Promise<InstructionEntry[]> {
  const all = await listPrivateInstructions();
  const q = query.toLowerCase();
  return all.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q),
  );
}

export async function getPrivateInstruction(name: string): Promise<InstructionEntry | null> {
  const all = await listPrivateInstructions();
  return all.find((i) => i.name === name) ?? null;
}

export async function fetchPrivateInstructionContent(
  name: string,
): Promise<{ content: string; description: string }> {
  const raw = await fetchPrivateText(`/content/instructions/${name}.md`);
  const { data, content } = matter(raw);
  return {
    content: content.trim(),
    description: typeof data.description === 'string' ? data.description : '',
  };
}

// ---------------------------------------------------------------------------
// Public API — Presets
// ---------------------------------------------------------------------------

export async function listPrivatePresets(): Promise<SetupPresetEntry[]> {
  if (!isLoggedIn()) return [];

  try {
    const index = await fetchPrivateJsonCached<PrivatePresetRegistryIndex>('/preset-registry.json');
    return index.presets;
  } catch (err: any) {
    verbose(`Private preset registry unavailable: ${err.message}`);
    return [];
  }
}

export async function searchPrivatePresets(query: string): Promise<SetupPresetEntry[]> {
  const all = await listPrivatePresets();
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}

export async function getPrivatePreset(name: string): Promise<SetupPresetEntry | null> {
  const all = await listPrivatePresets();
  return all.find((p) => p.name === name) ?? null;
}

export async function fetchPrivatePresetFile(presetName: string, filePath: string): Promise<string> {
  return fetchPrivateText(`/content/presets/${presetName}/${filePath}`);
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Check if a package name exists in the private registry.
 */
export async function isPrivatePackage(name: string): Promise<boolean> {
  const all = await listPrivatePackages();
  return all.some((e) => e.name === name);
}
