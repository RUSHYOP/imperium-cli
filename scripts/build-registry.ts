#!/usr/bin/env tsx
/**
 * Build a registry.json index from all SKILL.md files in the skills/ directory.
 * Run: npx tsx scripts/build-registry.ts
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

interface RegistryEntry {
  name: string;
  kind: string;
  version: string;
  description: string;
  path: string;
}

const ROOT = join(import.meta.dirname, '..');
const DIRS = ['skills', 'references', 'presets'] as const;
const KIND_MAP: Record<string, string> = {
  skills: 'skill',
  references: 'reference',
  presets: 'preset',
};

const entries: RegistryEntry[] = [];

for (const dir of DIRS) {
  const dirPath = join(ROOT, dir);
  let children: string[];
  try {
    children = readdirSync(dirPath);
  } catch {
    continue;
  }

  for (const child of children) {
    const skillPath = join(dirPath, child, 'SKILL.md');
    try {
      if (!statSync(skillPath).isFile()) continue;
    } catch {
      continue;
    }

    const raw = readFileSync(skillPath, 'utf-8');
    const { data } = matter(raw);

    entries.push({
      name: (data.name as string) || child,
      kind: (data.kind as string) || KIND_MAP[dir] || 'skill',
      version: (data.version as string) || '0.0.0',
      description: typeof data.description === 'string' ? data.description : '',
      path: `${dir}/${child}`,
    });
  }
}

entries.sort((a, b) => a.name.localeCompare(b.name));

const registry = {
  version: 1,
  updated_at: new Date().toISOString(),
  count: entries.length,
  packages: entries,
};

const outPath = join(ROOT, 'registry.json');
writeFileSync(outPath, JSON.stringify(registry) + '\n', 'utf-8');
console.log(`registry.json written — ${entries.length} packages`);
