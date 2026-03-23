import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { success, info } from '../utils/log.js';
import type { AuthState } from './types.js';

// ---------------------------------------------------------------------------
// Microsoft Entra ID constants
// ---------------------------------------------------------------------------

/** Replace with your actual Entra ID app registration values. */
const CLIENT_ID = process.env.IMPERIUM_CLIENT_ID ?? '952eb2a4-55db-4a95-baae-e744293a6b90';

// Multitenant: use 'organizations' so any org account can sign in.
// Domain restriction is enforced server-side by the Worker.
const AUTHORITY = 'https://login.microsoftonline.com/organizations';
const AUTHORIZE_URL = `${AUTHORITY}/oauth2/v2.0/authorize`;
const TOKEN_URL = `${AUTHORITY}/oauth2/v2.0/token`;
const SCOPES = 'openid email profile User.Read';
const REDIRECT_PORT = 9876;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

// ---------------------------------------------------------------------------
// State file
// ---------------------------------------------------------------------------

const STATE_DIR = join(homedir(), '.imperium');
const AUTH_FILE = join(STATE_DIR, 'auth.json');

function ensureStateDir(): void {
  mkdirSync(STATE_DIR, { recursive: true });
}

function readAuthState(): AuthState | null {
  try {
    if (!existsSync(AUTH_FILE)) return null;
    const raw = readFileSync(AUTH_FILE, 'utf-8');
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

function writeAuthState(state: AuthState): void {
  ensureStateDir();
  writeFileSync(AUTH_FILE, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
}

function deleteAuthState(): void {
  try {
    if (existsSync(AUTH_FILE)) rmSync(AUTH_FILE, { force: true });
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// PKCE helpers
// ---------------------------------------------------------------------------

function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

// ---------------------------------------------------------------------------
// Token exchange
// ---------------------------------------------------------------------------

async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<AuthState> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: SCOPES,
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (HTTP ${res.status}): ${text}`);
  }

  const data = await res.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    id_token?: string;
  };

  const email = parseEmailFromIdToken(data.id_token);

  return {
    accessToken: data.access_token,
    idToken: data.id_token ?? null,
    refreshToken: data.refresh_token ?? null,
    expiresAt: Date.now() + data.expires_in * 1000,
    email,
  };
}

async function refreshAccessToken(refreshToken: string): Promise<AuthState> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: SCOPES,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed (HTTP ${res.status}). Run \`imperium login\` to re-authenticate.`);
  }

  const data = await res.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    id_token?: string;
  };

  const email = parseEmailFromIdToken(data.id_token);

  return {
    accessToken: data.access_token,
    idToken: data.id_token ?? null,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
    email,
  };
}

// ---------------------------------------------------------------------------
// JWT helpers (lightweight decode — validation happens server-side on Worker)
// ---------------------------------------------------------------------------

function parseEmailFromIdToken(idToken?: string): string | null {
  if (!idToken) return null;
  try {
    const payload = idToken.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return decoded.email ?? decoded.preferred_username ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Interactive browser-based login flow.
 * Opens the system browser to Microsoft's authorize endpoint,
 * receives the auth code via a local HTTP server, exchanges for tokens.
 */
export async function login(): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = randomBytes(16).toString('hex');

  const authorizeParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  });

  const authorizeUrl = `${AUTHORIZE_URL}?${authorizeParams}`;

  return new Promise<void>((resolve, reject) => {
    const sockets = new Set<import('node:net').Socket>();
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', `http://localhost:${REDIRECT_PORT}`);

        if (url.pathname !== '/callback') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const error = url.searchParams.get('error');
        if (error) {
          const desc = url.searchParams.get('error_description') ?? error;
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<html><body><h2>Login failed</h2><p>${desc}</p><p>You can close this tab.</p></body></html>`);
          forceClose();
          reject(new Error(`Login failed: ${desc}`));
          return;
        }

        const returnedState = url.searchParams.get('state');
        if (returnedState !== state) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<html><body><h2>Invalid state</h2><p>Possible CSRF attack. Please try again.</p></body></html>');
          forceClose();
          reject(new Error('OAuth state mismatch — possible CSRF attack.'));
          return;
        }

        const code = url.searchParams.get('code');
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<html><body><h2>No code received</h2></body></html>');
          forceClose();
          reject(new Error('No authorization code received.'));
          return;
        }

        // Exchange code for tokens
        const authState = await exchangeCodeForTokens(code, codeVerifier);
        writeAuthState(authState);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h2>✔ Login successful!</h2><p>You can close this tab and return to the terminal.</p></body></html>');

        forceClose();
        success(`Logged in as ${authState.email ?? 'unknown'}`);
        resolve();
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<html><body><h2>Error</h2><p>${err.message}</p></body></html>`);
        forceClose();
        reject(err);
      }
    });

    server.on('connection', (socket) => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });

    const forceClose = () => {
      server.close();
      for (const s of sockets) s.destroy();
    };

    server.listen(REDIRECT_PORT, '127.0.0.1', async () => {
      info('Opening browser for Microsoft sign-in...');

      // Dynamic import to open the browser
      try {
        const { exec } = await import('node:child_process');
        const cmd = process.platform === 'darwin'
          ? `open "${authorizeUrl}"`
          : process.platform === 'win32'
            ? `start "" "${authorizeUrl}"`
            : `xdg-open "${authorizeUrl}"`;
        exec(cmd);
      } catch {
        info(`Open this URL in your browser:\n  ${authorizeUrl}`);
      }
    });

    // Timeout after 5 minutes — unref so it doesn't keep process alive
    const timer = setTimeout(() => {
      forceClose();
      reject(new Error('Login timed out after 5 minutes. Please try again.'));
    }, 5 * 60 * 1000);
    timer.unref();
  });
}

/**
 * Clear stored tokens and log out.
 */
export function logout(): void {
  deleteAuthState();
  success('Logged out successfully.');
}

/**
 * Display current auth status.
 */
export function whoami(): void {
  const state = readAuthState();

  if (!state) {
    info('Not logged in. Run `imperium login` to authenticate.');
    return;
  }

  const expired = Date.now() > state.expiresAt;

  if (expired && !state.refreshToken) {
    info('Session expired. Run `imperium login` to re-authenticate.');
    return;
  }

  info(`Logged in as ${state.email ?? 'unknown'}`);

  if (state.email) {
    const domain = state.email.split('@')[1];
    info(`Domain: ${domain}`);
  }

  if (expired) {
    info('(token expired — will auto-refresh on next request)');
  }
}

/**
 * Check if user has valid auth credentials (may be expired but refreshable).
 */
export function isLoggedIn(): boolean {
  const state = readAuthState();
  if (!state) return false;
  // Has valid token or has refresh token to renew
  return Date.now() < state.expiresAt || !!state.refreshToken;
}

/**
 * Get a valid access token — refreshes automatically if expired.
 * Throws if not logged in or refresh fails.
 */
export async function getAccessToken(): Promise<string> {
  const state = readAuthState();

  if (!state) {
    throw new Error('Not authenticated. Run `imperium login` first.');
  }

  // Token still valid — prefer id_token for Worker auth (correct audience)
  if (Date.now() < state.expiresAt) {
    return state.idToken ?? state.accessToken;
  }

  // Try refresh
  if (!state.refreshToken) {
    deleteAuthState();
    throw new Error('Session expired with no refresh token. Run `imperium login` to re-authenticate.');
  }

  try {
    const newState = await refreshAccessToken(state.refreshToken);
    // Preserve email if refresh didn't return id_token
    if (!newState.email && state.email) {
      newState.email = state.email;
    }
    writeAuthState(newState);
    return newState.idToken ?? newState.accessToken;
  } catch {
    deleteAuthState();
    throw new Error('Session expired. Run `imperium login` to re-authenticate.');
  }
}
