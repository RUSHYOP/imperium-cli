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

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  const token = getToken();
  const baseDir = join(import.meta.dirname, '..');

  // ── 1. Collect all files to upload ──────────────────────────────────
  const allFiles: { path: string; content: string }[] = [];

  // Skill: miro-board-report-pdf (dir: miro-board-to-confluence)
  const miroDir = join(baseDir, 'content/skills/miro-board-to-confluence');
  const miroFiles = collectSkillFiles(miroDir, 'miro-board-report-pdf');
  allFiles.push(...miroFiles);
  console.log(`  Skill: miro-board-report-pdf (${miroFiles.length} files)`);

  // MCP: uidl-mcp (skip if already uploaded / deleted locally)
  const uidlMcpPath = join(baseDir, 'content/mcps/uidl-mcp.json');
  if (existsSync(uidlMcpPath)) {
    allFiles.push(collectMcpFile(uidlMcpPath, 'uidl-mcp'));
    console.log(`  MCP: uidl-mcp`);
  } else {
    console.log(`  MCP: uidl-mcp (already on R2, skipping)`);
  }

  // MCP: rxds-figma-mcp (skip if already uploaded / deleted locally)
  const figmaMcpPath = join(baseDir, 'content/mcps/rxds-figma-mcp.json');
  if (existsSync(figmaMcpPath)) {
    allFiles.push(collectMcpFile(figmaMcpPath, 'rxds-figma-mcp'));
    console.log(`  MCP: rxds-figma-mcp`);
  } else {
    console.log(`  MCP: rxds-figma-mcp (already on R2, skipping)`);
  }

  // ── 2. Upload all content files ─────────────────────────────────────
  console.log(`\nUploading ${allFiles.length} files to R2...`);
  const result = await batchUpload(token, allFiles);
  console.log(`  ✓ Uploaded ${result.uploaded}/${result.total} files`);

  // ── 3. Update registry indexes ──────────────────────────────────────
  // Fetch existing private registries
  let skillRegistry = await fetchExistingRegistry(token, 'registry.json');
  let mcpRegistry = await fetchExistingRegistry(token, 'mcp-registry.json');

  // Initialize if they don't exist
  if (!skillRegistry) {
    skillRegistry = { version: 1, updated_at: new Date().toISOString(), count: 0, packages: [] };
  }
  if (!mcpRegistry) {
    mcpRegistry = { version: 1, updated_at: new Date().toISOString(), count: 0, mcps: [] };
  }

  // Parse SKILL.md frontmatter for the miro skill
  const skillMd = readFileSync(join(miroDir, 'SKILL.md'), 'utf-8');
  const fmMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
  const skillMeta = { name: 'miro-board-report-pdf', description: '' };
  if (fmMatch) {
    const lines = fmMatch[1].split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split(':');
      if (key.trim() === 'description') skillMeta.description = rest.join(':').trim();
    }
  }

  // Remove stale miro-board-to-confluence entry if present
  skillRegistry.packages = skillRegistry.packages.filter(
    (p: any) => p.name !== 'miro-board-to-confluence',
  );

  // Add/update miro-board-report-pdf in skill registry
  const existingSkillIdx = skillRegistry.packages.findIndex(
    (p: any) => p.name === 'miro-board-report-pdf',
  );
  const skillEntry = {
    name: 'miro-board-report-pdf',
    kind: 'skill',
    description: skillMeta.description,
    version: '0.0.0',
  };
  if (existingSkillIdx >= 0) {
    skillRegistry.packages[existingSkillIdx] = skillEntry;
  } else {
    skillRegistry.packages.push(skillEntry);
  }
  skillRegistry.count = skillRegistry.packages.length;
  skillRegistry.updated_at = new Date().toISOString();

  // Add/update MCPs in MCP registry (only if local files exist)
  for (const [mcpPath, mcpName] of [
    [join(baseDir, 'content/mcps/uidl-mcp.json'), 'uidl-mcp'],
    [join(baseDir, 'content/mcps/rxds-figma-mcp.json'), 'rxds-figma-mcp'],
  ] as const) {
    if (!existsSync(mcpPath)) continue;
    const mcpData = JSON.parse(readFileSync(mcpPath, 'utf-8'));
    const existingIdx = mcpRegistry.mcps.findIndex((m: any) => m.name === mcpData.name);
    if (existingIdx >= 0) {
      mcpRegistry.mcps[existingIdx] = mcpData;
    } else {
      mcpRegistry.mcps.push(mcpData);
    }
  }
  mcpRegistry.count = mcpRegistry.mcps.length;
  mcpRegistry.updated_at = new Date().toISOString();

  // Upload updated registry indexes
  console.log('\nUpdating private registry indexes...');
  const registryFiles = [
    { path: 'registry.json', content: JSON.stringify(skillRegistry, null, 2) },
    { path: 'mcp-registry.json', content: JSON.stringify(mcpRegistry, null, 2) },
  ];
  const regResult = await batchUpload(token, registryFiles);
  console.log(`  ✓ Updated ${regResult.uploaded} registry files`);
  console.log(`  Skills: ${skillRegistry.count} packages`);
  console.log(`  MCPs: ${mcpRegistry.count} MCPs`);

  console.log('\nDone! Private content is now available via `imperium login`.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
