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

// ---------------------------------------------------------------------------
// MCP Registry
// ---------------------------------------------------------------------------

interface McpEntry {
  name: string;
  description: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  placeholders?: Record<string, string>;
}

const mcpDir = join(ROOT, 'mcps');
const mcpEntries: McpEntry[] = [];

try {
  const mcpFiles = readdirSync(mcpDir).filter((f) => f.endsWith('.json'));
  for (const file of mcpFiles) {
    const raw = readFileSync(join(mcpDir, file), 'utf-8');
    mcpEntries.push(JSON.parse(raw) as McpEntry);
  }
} catch {
  // mcps/ dir may not exist
}

mcpEntries.sort((a, b) => a.name.localeCompare(b.name));

const mcpRegistry = {
  version: 1,
  updated_at: new Date().toISOString(),
  count: mcpEntries.length,
  mcps: mcpEntries,
};

const mcpOutPath = join(ROOT, 'mcp-registry.json');
writeFileSync(mcpOutPath, JSON.stringify(mcpRegistry) + '\n', 'utf-8');
console.log(`mcp-registry.json written — ${mcpEntries.length} MCPs`);

// ---------------------------------------------------------------------------
// Setup Preset Registry
// ---------------------------------------------------------------------------

interface SetupPresetEntry {
  name: string;
  description: string;
  adapter: string;
  skills: string[];
  mcps: string[];
  files: string[];
}

const presetDir = join(ROOT, 'setup-presets');
const presetEntries: SetupPresetEntry[] = [];

try {
  const presetFolders = readdirSync(presetDir).filter((f) => {
    try {
      return statSync(join(presetDir, f)).isDirectory();
    } catch {
      return false;
    }
  });

  for (const folder of presetFolders) {
    const manifestPath = join(presetDir, folder, 'preset.json');
    try {
      if (!statSync(manifestPath).isFile()) continue;
    } catch {
      continue;
    }

    const raw = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw) as {
      name: string;
      description: string;
      adapter: string;
      skills?: string[];
      mcps?: string[];
    };

    // Auto-discover files (everything except preset.json)
    const files: string[] = [];
    function walkDir(dir: string, prefix: string) {
      for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const relPath = prefix ? `${prefix}/${entry}` : entry;
        if (statSync(fullPath).isDirectory()) {
          walkDir(fullPath, relPath);
        } else if (entry !== 'preset.json') {
          files.push(relPath);
        }
      }
    }
    walkDir(join(presetDir, folder), '');

    presetEntries.push({
      name: manifest.name || folder,
      description: manifest.description || '',
      adapter: manifest.adapter || 'claude',
      skills: manifest.skills || [],
      mcps: manifest.mcps || [],
      files,
    });
  }
} catch {
  // setup-presets/ dir may not exist
}

presetEntries.sort((a, b) => a.name.localeCompare(b.name));

const presetRegistry = {
  version: 1,
  updated_at: new Date().toISOString(),
  count: presetEntries.length,
  presets: presetEntries,
};

const presetOutPath = join(ROOT, 'preset-registry.json');
writeFileSync(presetOutPath, JSON.stringify(presetRegistry) + '\n', 'utf-8');
console.log(`preset-registry.json written — ${presetEntries.length} presets`);
