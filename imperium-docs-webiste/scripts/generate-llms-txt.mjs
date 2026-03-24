#!/usr/bin/env node
/**
 * Generate llms.txt and llms-full.txt from content/ markdown files.
 * Run before build: node scripts/generate-llms-txt.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SITE_URL = 'https://imperium.dev';
const CONTENT_DIR = new URL('../content', import.meta.url).pathname;
const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;

// Recursively collect all .md files
function collectMdFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Parse frontmatter title + description from a md file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];
  const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  return { title, description };
}

// Convert file path to URL path
// content/1.getting-started/2.introduction.md → /getting-started/introduction
function fileToUrlPath(filePath) {
  let rel = relative(CONTENT_DIR, filePath);
  // Remove .md extension
  rel = rel.replace(/\.md$/, '');
  // Remove numeric prefixes (1. 2. etc.)
  rel = rel.replace(/(\d+)\./g, '');
  // index → /
  if (rel === 'index') return '/';
  // Normalize separators
  return '/' + rel.replace(/\\/g, '/');
}

// Strip frontmatter and Docus component syntax for plain text
function stripMarkdown(content) {
  // Remove frontmatter
  let text = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  // Remove Docus component blocks (::component ... ::)
  text = text.replace(/^:{2,3}[\s\S]*?^:{2,3}$/gm, '');
  // Remove inline component syntax
  text = text.replace(/:{2,3}[a-z-]+[\s\S]*?:{2,3}/g, '');
  // Remove HTML tags (loop to handle nested/malformed tags)
  let prev;
  do { prev = text; text = text.replace(/<[^>]+>/g, ''); } while (text !== prev);
  // Decode HTML entities
  text = text.replace(/&[a-zA-Z]+;/g, ' ');
  // Collapse multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

// Collect and sort files
const files = collectMdFiles(CONTENT_DIR).sort((a, b) => {
  // Sort by path segments (maintains section order via numeric prefixes)
  return a.localeCompare(b);
});

// ── Generate llms.txt (index) ──────────────────────────────────────

const sections = new Map();

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const { title, description } = parseFrontmatter(content);
  const urlPath = fileToUrlPath(file);

  if (urlPath === '/') continue; // skip homepage from index

  // Group by section
  const section = urlPath.split('/')[1] || 'other';
  if (!sections.has(section)) sections.set(section, []);
  sections.get(section).push({ title, description, url: `${SITE_URL}${urlPath}` });
}

const sectionLabels = {
  'getting-started': 'Getting Started',
  'commands': 'Commands',
  'concepts': 'Concepts',
};

let llmsTxt = `# Imperium CLI

> The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.

## Docs

`;

for (const [section, pages] of sections) {
  const label = sectionLabels[section] || section;
  llmsTxt += `### ${label}\n\n`;
  for (const page of pages) {
    const desc = page.description ? `: ${page.description}` : '';
    llmsTxt += `- [${page.title}](${page.url})${desc}\n`;
  }
  llmsTxt += '\n';
}

writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llmsTxt.trim() + '\n');
console.log(`✓ llms.txt (${sections.size} sections, ${files.length - 1} pages)`);

// ── Generate llms-full.txt (full content) ──────────────────────────

let fullTxt = `# Imperium CLI — Full Documentation

> The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.

`;

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const { title } = parseFrontmatter(content);
  const urlPath = fileToUrlPath(file);
  const body = stripMarkdown(content);

  if (!body) continue;

  fullTxt += `---\n\n`;
  fullTxt += `## ${title || urlPath}\n\n`;
  fullTxt += `URL: ${SITE_URL}${urlPath}\n\n`;
  fullTxt += `${body}\n\n`;
}

writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), fullTxt.trim() + '\n');
const sizeKb = Math.round(Buffer.byteLength(fullTxt) / 1024);
console.log(`✓ llms-full.txt (${files.length} pages, ${sizeKb} KB)`);
