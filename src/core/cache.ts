import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';

const CACHE_DIR = join(homedir(), '.imperium', 'cache');
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // max cached entries

/** Ensure cache directory exists. */
function ensureCacheDir(): void {
  mkdirSync(CACHE_DIR, { recursive: true });
}

/** Turn a URL into a safe filename. */
function cacheKey(url: string): string {
  // Use a simple hash-like approach for filenames
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  return `${(hash >>> 0).toString(36)}.cache`;
}

interface CacheEntry {
  url: string;
  data: string;
  ts: number;
}

/**
 * Get a cached response, or null if expired/missing.
 */
export function getCached(url: string, ttl = DEFAULT_TTL): string | null {
  try {
    const path = join(CACHE_DIR, cacheKey(url));
    if (!existsSync(path)) return null;

    const raw = readFileSync(path, 'utf-8');
    const entry: CacheEntry = JSON.parse(raw);

    if (Date.now() - entry.ts > ttl) return null;
    if (entry.url !== url) return null; // hash collision

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Store a response in the cache.
 */
export function setCache(url: string, data: string): void {
  try {
    ensureCacheDir();
    const entry: CacheEntry = { url, data, ts: Date.now() };
    writeFileSync(join(CACHE_DIR, cacheKey(url)), JSON.stringify(entry), 'utf-8');
    evictOldEntries();
  } catch {
    // Cache write failure is non-fatal
  }
}

/** Evict oldest entries if cache exceeds max size. */
function evictOldEntries(): void {
  try {
    const files = readdirSync(CACHE_DIR)
      .filter((f) => f.endsWith('.cache'))
      .map((f) => {
        const p = join(CACHE_DIR, f);
        return { file: p, mtime: statSync(p).mtimeMs };
      })
      .sort((a, b) => a.mtime - b.mtime);

    while (files.length > MAX_CACHE_SIZE) {
      const oldest = files.shift()!;
      rmSync(oldest.file, { force: true });
    }
  } catch {
    // Eviction failure is non-fatal
  }
}

/** Clear the entire cache. */
export function clearCache(): void {
  try {
    if (existsSync(CACHE_DIR)) {
      rmSync(CACHE_DIR, { recursive: true, force: true });
    }
  } catch {
    // ignore
  }
}
