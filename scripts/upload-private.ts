#!/usr/bin/env npx tsx
/**
 * Upload content to R2 private registry and update registry indexes.
 * 
 * Usage: npx tsx scripts/upload-private.ts
 * 
 * Requires: `imperium login` first (reads token from ~/.imperium/auth.json)
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';

const WORKER_URL = 'https://imperium-worker.alwayspurav.workers.dev';

// ── Auth ───────────────────────────────────────────────────────────────
function getToken(): string {
  const authPath = join(homedir(), '.imperium', 'auth.json');
  if (!existsSync(authPath)) {
    console.error('Not logged in. Run `imperium login` first.');
    process.exit(1);
  }
  const auth = JSON.parse(readFileSync(authPath, 'utf-8'));
  return auth.idToken ?? auth.accessToken;
}

// ── Helpers ────────────────────────────────────────────────────────────
async function batchUpload(token: string, files: { path: string; content: string }[]) {
  const res = await fetch(`${WORKER_URL}/batch/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { uploaded: number; total: number };
  return data;
}

async function fetchExistingRegistry(token: string, filename: string): Promise<any | null> {
  const res = await fetch(`${WORKER_URL}/${filename}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${filename}: ${res.status}`);
  return res.json();
}

// ── Collect files ──────────────────────────────────────────────────────
function collectSkillFiles(skillDir: string, skillName: string): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];
  const output = execSync(
    `find "${skillDir}" -not -path '*/.git/*' -not -path '*/.git' -type f`,
    { encoding: 'utf-8' },
  ).trim();

  for (const absPath of output.split('\n').filter(Boolean)) {
    const relPath = absPath.replace(skillDir + '/', '');
    const content = readFileSync(absPath, 'utf-8');
    files.push({
      path: `content/skills/${skillName}/${relPath}`,
      content,
    });
  }

  return files;
}

function collectMcpFile(mcpPath: string, mcpName: string): { path: string; content: string } {
  return {
    path: `content/mcps/${mcpName}.json`,
    content: readFileSync(mcpPath, 'utf-8'),
  };
}

function collectPresetFiles(presetDir: string, presetName: string): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];
  const output = execSync(
    `find "${presetDir}" -not -path '*/.git/*' -not -path '*/.git' -type f`,
    { encoding: 'utf-8' },
  ).trim();

  for (const absPath of output.split('\n').filter(Boolean)) {
    const relPath = absPath.replace(presetDir + '/', '');
    const content = readFileSync(absPath, 'utf-8');
    files.push({
      path: `content/presets/${presetName}/${relPath}`,
      content,
    });
  }

  return files;
}

function parseFrontmatter(filePath: string): { name: string; description: string } {
  const raw = readFileSync(filePath, 'utf-8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const meta = { name: '', description: '' };
  if (fmMatch) {
    const lines = fmMatch[1].split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split(':');
      const k = key.trim();
      const v = rest.join(':').trim().replace(/^["']|["']$/g, '');
      if (k === 'name') meta.name = v;
      if (k === 'description') meta.description = v;
    }
  }
  return meta;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  const token = getToken();
  const baseDir = join(import.meta.dirname, '..');

  const allFiles: { path: string; content: string }[] = [];

  // ── 1. Skills ───────────────────────────────────────────────────────

  // Skill: rxd-design-system (local folder at repo root)
  const designDir = join(baseDir, 'rxd-design-system');
  if (existsSync(designDir)) {
    const files = collectSkillFiles(designDir, 'rxd-design-system');
    allFiles.push(...files);
    console.log(`  Skill: rxd-design-system (${files.length} files)`);
  }

  // Skill: rxd-uidl-creator (local folder at repo root)
  const uidlDir = join(baseDir, 'rxd-uidl-creator');
  if (existsSync(uidlDir)) {
    const files = collectSkillFiles(uidlDir, 'rxd-uidl-creator');
    allFiles.push(...files);
    console.log(`  Skill: rxd-uidl-creator (${files.length} files)`);
  }

  // Skill: miro-board-report-pdf (dir: miro-board-to-confluence)
  const miroDir = join(baseDir, 'content/skills/miro-board-to-confluence');
  if (existsSync(miroDir)) {
    const files = collectSkillFiles(miroDir, 'miro-board-report-pdf');
    allFiles.push(...files);
    console.log(`  Skill: miro-board-report-pdf (${files.length} files)`);
  }

  // ── 2. MCPs ─────────────────────────────────────────────────────────

  for (const mcpName of ['uidl-mcp', 'rxds-figma-mcp']) {
    const mcpPath = join(baseDir, `content/mcps/${mcpName}.json`);
    if (existsSync(mcpPath)) {
      allFiles.push(collectMcpFile(mcpPath, mcpName));
      console.log(`  MCP: ${mcpName}`);
    } else {
      console.log(`  MCP: ${mcpName} (already on R2, skipping)`);
    }
  }

  // ── 3. Presets ──────────────────────────────────────────────────────

  const rxdPresetDir = join(baseDir, 'content/presets/rxd');
  if (existsSync(rxdPresetDir)) {
    const files = collectPresetFiles(rxdPresetDir, 'rxd');
    allFiles.push(...files);
    console.log(`  Preset: rxd (${files.length} files)`);
  }

  // ── 4. Upload ───────────────────────────────────────────────────────

  if (allFiles.length === 0) {
    console.log('Nothing to upload.');
    return;
  }

  console.log(`\nUploading ${allFiles.length} files to R2...`);
  // Batch upload in chunks of 100 to avoid payload limits
  for (let i = 0; i < allFiles.length; i += 100) {
    const chunk = allFiles.slice(i, i + 100);
    const result = await batchUpload(token, chunk);
    console.log(`  ✓ Batch ${Math.floor(i / 100) + 1}: ${result.uploaded}/${result.total} files`);
  }

  // ── 5. Update registry indexes ──────────────────────────────────────

  console.log('\nUpdating private registry indexes...');

  // Skill registry
  const skillRegistry = await fetchExistingRegistry(token, 'registry.json') ?? {
    version: 1, updated_at: '', count: 0, packages: [] as any[],
  };

  // Remove stale entries
  skillRegistry.packages = skillRegistry.packages.filter(
    (p: any) => p.name !== 'miro-board-to-confluence',
  );

  const skillDefs = [
    { dir: designDir, registryName: 'rxd-design-system' },
    { dir: uidlDir, registryName: 'rxd-uidl-creator' },
    { dir: join(miroDir, ''), registryName: 'miro-board-report-pdf' },
  ];

  for (const { dir, registryName } of skillDefs) {
    const skillMdPath = join(dir, 'SKILL.md');
    if (!existsSync(skillMdPath)) continue;
    const meta = parseFrontmatter(skillMdPath);
    const entry = {
      name: registryName,
      kind: 'skill',
      description: meta.description,
      version: '0.0.0',
      path: `content/skills/${registryName}`,
    };
    const idx = skillRegistry.packages.findIndex((p: any) => p.name === registryName);
    if (idx >= 0) skillRegistry.packages[idx] = entry;
    else skillRegistry.packages.push(entry);
  }
  skillRegistry.count = skillRegistry.packages.length;
  skillRegistry.updated_at = new Date().toISOString();

  // MCP registry
  const mcpRegistry = await fetchExistingRegistry(token, 'mcp-registry.json') ?? {
    version: 1, updated_at: '', count: 0, mcps: [] as any[],
  };

  for (const mcpName of ['uidl-mcp', 'rxds-figma-mcp']) {
    const mcpPath = join(baseDir, `content/mcps/${mcpName}.json`);
    if (!existsSync(mcpPath)) continue;
    const mcpData = JSON.parse(readFileSync(mcpPath, 'utf-8'));
    const idx = mcpRegistry.mcps.findIndex((m: any) => m.name === mcpData.name);
    if (idx >= 0) mcpRegistry.mcps[idx] = mcpData;
    else mcpRegistry.mcps.push(mcpData);
  }
  mcpRegistry.count = mcpRegistry.mcps.length;
  mcpRegistry.updated_at = new Date().toISOString();

  // Preset registry
  const presetRegistry = await fetchExistingRegistry(token, 'preset-registry.json') ?? {
    version: 1, updated_at: '', count: 0, presets: [] as any[],
  };

  const presetJsonPath = join(rxdPresetDir, 'preset.json');
  if (existsSync(presetJsonPath)) {
    const manifest = JSON.parse(readFileSync(presetJsonPath, 'utf-8'));
    // Collect file list (everything except preset.json)
    const presetFiles = collectPresetFiles(rxdPresetDir, 'rxd')
      .map((f) => f.path.replace('content/presets/rxd/', ''))
      .filter((f) => f !== 'preset.json');

    const presetEntry = {
      name: manifest.name,
      description: manifest.description,
      adapter: manifest.adapter,
      skills: manifest.skills || [],
      mcps: manifest.mcps || [],
      files: presetFiles,
    };
    const idx = presetRegistry.presets.findIndex((p: any) => p.name === manifest.name);
    if (idx >= 0) presetRegistry.presets[idx] = presetEntry;
    else presetRegistry.presets.push(presetEntry);
    presetRegistry.count = presetRegistry.presets.length;
    presetRegistry.updated_at = new Date().toISOString();
  }

  // Upload all registry files
  const registryFiles = [
    { path: 'registry.json', content: JSON.stringify(skillRegistry, null, 2) },
    { path: 'mcp-registry.json', content: JSON.stringify(mcpRegistry, null, 2) },
    { path: 'preset-registry.json', content: JSON.stringify(presetRegistry, null, 2) },
  ];
  const regResult = await batchUpload(token, registryFiles);
  console.log(`  ✓ Updated ${regResult.uploaded} registry files`);
  console.log(`  Skills: ${skillRegistry.count} | MCPs: ${mcpRegistry.count} | Presets: ${presetRegistry.count}`);

  console.log('\nDone! Private content is now available via `imperium login`.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
