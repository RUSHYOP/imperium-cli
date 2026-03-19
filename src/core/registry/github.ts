import { createHash } from 'node:crypto';
import { info, verbose, warn, error as logError } from '../../utils/log.js';
import type { PackageManifest, PackageKind } from '../types/index.js';
import matter from 'gray-matter';

/**
 * Default GitHub org/repo used as the skill registry.
 * The CLI and skills live in the same repo.
 * Users can override with --registry flag.
 */
const DEFAULT_OWNER = 'RUSHYOP';
const DEFAULT_REPO = 'imperium-cli';
const DEFAULT_BRANCH = 'main';

/** Parsed registry config from a URL or defaults. */
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

function parseRegistryUrl(url?: string): RegistryConfig {
  if (!url) {
    return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH };
  }

  // Accept formats:
  //   owner/repo
  //   owner/repo#branch
  //   https://github.com/owner/repo
  //   https://github.com/owner/repo/tree/branch
  const ghUrl = url.replace(/\.git$/, '');

  const fullUrlMatch = ghUrl.match(
    /github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+))?$/,
  );

  if (fullUrlMatch) {
    return {
      owner: fullUrlMatch[1],
      repo: fullUrlMatch[2],
      branch: fullUrlMatch[3] || DEFAULT_BRANCH,
    };
  }

  const shortMatch = ghUrl.match(/^([^/]+)\/([^#]+?)(?:#(.+))?$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      branch: shortMatch[3] || DEFAULT_BRANCH,
    };
  }

  return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH };
}

/** Build the raw GitHub content URL for a file. */
function rawUrl(cfg: RegistryConfig, path: string): string {
  return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/${path}`;
}

/** Build the GitHub API URL for listing directory contents. */
function apiContentsUrl(cfg: RegistryConfig, path: string): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}&per_page=200`;
}

/** Build the GitHub API URL for the full repo tree (recursive, single request). */
function apiTreeUrl(cfg: RegistryConfig): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/${cfg.branch}?recursive=1`;
}

/** Build the GitHub API search URL. */
function apiSearchUrl(cfg: RegistryConfig, query: string): string {
  return `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${cfg.owner}/${cfg.repo}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'imperium-cli',
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'imperium-cli' },
  });
  if (!res.ok) {
    throw new Error(`GitHub fetch error ${res.status}: ${url}`);
  }
  return res.text();
}

function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
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
 *
 * Uses the Git Trees API (single request) to discover all SKILL.md files,
 * then batch-fetches their frontmatter via raw.githubusercontent.com.
 * This avoids N+1 API calls for large registries.
 */
export async function listPackages(
  registryUrl?: string,
  kind?: PackageKind,
): Promise<RegistryEntry[]> {
  const cfg = parseRegistryUrl(registryUrl);

  // 1) Get the full recursive tree in a single API call
  type TreeEntry = { path: string; type: string };
  type TreeResponse = { tree: TreeEntry[]; truncated: boolean };
  const tree = await fetchJson<TreeResponse>(apiTreeUrl(cfg));

  // 2) Find all SKILL.md paths: skills/<name>/SKILL.md, references/<name>/SKILL.md, etc.
  const skillFiles = tree.tree.filter((entry) => {
    if (entry.type !== 'blob') return false;
    const m = entry.path.match(/^(skills|references|presets)\/[^/]+\/SKILL\.md$/);
    return !!m;
  });

  // 3) Filter by kind if requested
  const filtered = kind
    ? skillFiles.filter((f) => {
        const dir = f.path.split('/')[0];
        return DIR_TO_KIND[dir] === kind;
      })
    : skillFiles;

  // 4) Fetch each SKILL.md's frontmatter in parallel (batched in groups of 20)
  const entries: RegistryEntry[] = [];
  const BATCH_SIZE = 20;

  for (let i = 0; i < filtered.length; i += BATCH_SIZE) {
    const batch = filtered.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (entry) => {
        const parts = entry.path.split('/');
        const dir = parts[0];
        const name = parts[1];
        const k = DIR_TO_KIND[dir] || 'skill';

        try {
          const skillMd = await fetchText(rawUrl(cfg, entry.path));
          const { data } = matter(skillMd);
          return {
            name: data.name || name,
            kind: (data.kind as PackageKind) || k,
            description: typeof data.description === 'string' ? data.description : '',
            version: data.version || '0.0.0',
            path: `${dir}/${name}`,
          } as RegistryEntry;
        } catch {
          // Couldn't fetch — return a minimal entry from the tree info
          return {
            name,
            kind: k,
            description: '',
            version: '0.0.0',
            path: `${dir}/${name}`,
          } as RegistryEntry;
        }
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        entries.push(result.value);
      }
    }
  }

  return entries;
}

/**
 * Fetch a single package from the registry by name.
 * Looks in skills/, references/, presets/ directories.
 */
export async function fetchPackage(
  name: string,
  registryUrl?: string,
): Promise<FetchedPackage> {
  const cfg = parseRegistryUrl(registryUrl);
  const dirs = ['skills', 'references', 'presets'];

  for (const dir of dirs) {
    try {
      const skillMd = await fetchText(rawUrl(cfg, `${dir}/${name}/SKILL.md`));
      const { data, content } = matter(skillMd);
      const manifest = data as PackageManifest;

      // Fetch directory listing to get all files
      type GHContent = { name: string; type: string; path: string; download_url: string | null }[];
      const allFiles: { path: string; content: string }[] = [];

      async function fetchDir(dirPath: string): Promise<void> {
        try {
          const items = await fetchJson<GHContent>(apiContentsUrl(cfg, dirPath));
          for (const item of items) {
            if (item.type === 'file' && item.download_url) {
              const fileContent = await fetchText(item.download_url);
              // Store path relative to the package root
              const relativePath = item.path.replace(`${dir}/${name}/`, '');
              allFiles.push({ path: relativePath, content: fileContent });
            } else if (item.type === 'dir') {
              await fetchDir(item.path);
            }
          }
        } catch {
          // directory doesn't exist, skip
        }
      }

      await fetchDir(`${dir}/${name}`);

      const allContent = allFiles.map((f) => f.content).join('');

      return {
        manifest: {
          ...manifest,
          name: manifest.name || name,
          kind: manifest.kind || (dir === 'skills' ? 'skill' : dir === 'references' ? 'reference' : 'preset'),
          version: manifest.version || '0.0.0',
          description: manifest.description || '',
        } as PackageManifest,
        skillContent: content,
        files: allFiles,
        checksum: checksum(allContent),
      };
    } catch {
      continue;
    }
  }

  throw new Error(`Package '${name}' not found in registry.`);
}

/**
 * Search the registry for packages matching a query.
 * Uses GitHub's code search API scoped to the registry repo.
 */
export async function searchPackages(
  query: string,
  registryUrl?: string,
): Promise<RegistryEntry[]> {
  const cfg = parseRegistryUrl(registryUrl);

  // First try: search code in the repo
  try {
    type SearchResult = {
      items: { path: string; name: string; repository: { full_name: string } }[];
    };
    const result = await fetchJson<SearchResult>(apiSearchUrl(cfg, query));

    const seen = new Set<string>();
    const entries: RegistryEntry[] = [];

    for (const item of result.items) {
      // Extract the package directory from the path
      const match = item.path.match(/^(skills|references|presets)\/([^/]+)\//);
      if (!match || seen.has(match[2])) continue;
      seen.add(match[2]);

      try {
        const skillMd = await fetchText(rawUrl(cfg, `${match[1]}/${match[2]}/SKILL.md`));
        const { data } = matter(skillMd);
        entries.push({
          name: data.name || match[2],
          kind: (data.kind as PackageKind) || (match[1] === 'skills' ? 'skill' : match[1] === 'references' ? 'reference' : 'preset'),
          description: data.description || '',
          version: data.version || '0.0.0',
          path: `${match[1]}/${match[2]}`,
        });
      } catch {
        entries.push({
          name: match[2],
          kind: match[1] === 'skills' ? 'skill' : match[1] === 'references' ? 'reference' : 'preset',
          description: '',
          version: '0.0.0',
          path: `${match[1]}/${match[2]}`,
        });
      }
    }

    return entries;
  } catch {
    // Fallback: list all and filter locally
    const all = await listPackages(registryUrl);
    const q = query.toLowerCase();
    return all.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    );
  }
}

/** Get a single package's metadata without downloading all files. */
export async function inspectPackage(
  name: string,
  registryUrl?: string,
): Promise<{ manifest: PackageManifest; content: string }> {
  const cfg = parseRegistryUrl(registryUrl);
  const dirs = ['skills', 'references', 'presets'];

  for (const dir of dirs) {
    try {
      const skillMd = await fetchText(rawUrl(cfg, `${dir}/${name}/SKILL.md`));
      const { data, content } = matter(skillMd);
      return {
        manifest: {
          ...data,
          name: data.name || name,
          kind: data.kind || (dir === 'skills' ? 'skill' : dir === 'references' ? 'reference' : 'preset'),
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
