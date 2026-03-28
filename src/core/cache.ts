import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { readdir, stat, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { verbose } from '../utils/log.js';

const CACHE_DIR = join(homedir(), '.imperium', 'cache');
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // max cached entries

let _noCache = false;

/** Globally disable cache reads (--no-cache flag). */
export function setCacheDisabled(disabled: boolean): void {
  _noCache = disabled;
}

/** Ensure cache directory exists. */
function ensureCacheDir(): void {
  mkdirSync(CACHE_DIR, { recursive: true });
}

/** Turn a URL into a safe filename using SHA-256 (no collision risk). */
function cacheKey(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 32) + '.cache';
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
  if (_noCache) return null;
  try {
    const path = join(CACHE_DIR, cacheKey(url));
    if (!existsSync(path)) return null;

    const raw = readFileSync(path, 'utf-8');
    const entry: CacheEntry = JSON.parse(raw);

    if (Date.now() - entry.ts > ttl) return null;

    return entry.data;
  } catch (err: any) {
    verbose(`Cache read failed for ${url}: ${err.message}`);
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
    // Evict asynchronously — don't block the caller
    evictOldEntries().catch(() => {});
  } catch (err: any) {
    verbose(`Cache write failed for ${url}: ${err.message}`);
  }
}

/** Evict oldest entries if cache exceeds max size (async I/O). */
async function evictOldEntries(): Promise<void> {
  try {
    const names = await readdir(CACHE_DIR);
    const entries = await Promise.all(
      names
        .filter((f) => f.endsWith('.cache'))
        .map(async (f) => {
          const p = join(CACHE_DIR, f);
          const s = await stat(p);
          return { file: p, mtime: s.mtimeMs };
        }),
    );
    entries.sort((a, b) => a.mtime - b.mtime);

    while (entries.length > MAX_CACHE_SIZE) {
      const oldest = entries.shift()!;
      await rm(oldest.file, { force: true });
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
