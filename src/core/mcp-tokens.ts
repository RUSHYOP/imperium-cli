import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const STATE_DIR = join(homedir(), '.imperium');
const TOKENS_FILE = join(STATE_DIR, 'mcp-tokens.json');

interface McpTokenStore {
  [mcpName: string]: Record<string, string>;
}

function readTokenStore(): McpTokenStore {
  try {
    if (!existsSync(TOKENS_FILE)) return {};
    return JSON.parse(readFileSync(TOKENS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeTokenStore(store: McpTokenStore): void {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(TOKENS_FILE, JSON.stringify(store, null, 2), { encoding: 'utf-8', mode: 0o600 });
}

/** Get previously saved placeholder values for an MCP. */
export function getSavedTokens(mcpName: string): Record<string, string> {
  const store = readTokenStore();
  return store[mcpName] ?? {};
}

/** Persist placeholder values for an MCP (merged with existing). */
export function saveTokens(mcpName: string, tokens: Record<string, string>): void {
  const store = readTokenStore();
  store[mcpName] = { ...store[mcpName], ...tokens };
  writeTokenStore(store);
}

/** Mask a token value for display, showing first/last 4 chars. */
export function maskToken(value: string): string {
  if (value.length <= 8) return '••••••••';
  return value.slice(0, 4) + '••••' + value.slice(-4);
}
