/**
 * Imperium Worker — Authenticated gateway to private R2 content.
 *
 * Validates Microsoft Entra ID JWT tokens and serves private skills,
 * MCPs, presets, and instructions from a bound R2 bucket.
 */

export interface Env {
  CONTENT_BUCKET: R2Bucket;
  TENANT_ID: string;
  CLIENT_ID: string;
  ALLOWED_DOMAINS: string;
}

// ---------------------------------------------------------------------------
// JWKS cache — Microsoft signing keys
// ---------------------------------------------------------------------------

interface JwkKey {
  kid: string;
  kty: string;
  n: string;
  e: string;
  use?: string;
}

interface JwksResponse {
  keys: JwkKey[];
}

let jwksCache: JwksResponse | null = null;
let jwksCacheTime = 0;
const JWKS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getJwks(): Promise<JwksResponse> {
  if (jwksCache && Date.now() - jwksCacheTime < JWKS_CACHE_TTL) {
    return jwksCache;
  }

  // Use the common JWKS endpoint for multitenant token validation
  const jwksUrl = 'https://login.microsoftonline.com/common/discovery/v2.0/keys';
  const res = await fetch(jwksUrl);
  if (!res.ok) throw new Error(`Failed to fetch JWKS: HTTP ${res.status}`);

  jwksCache = await res.json() as JwksResponse;
  jwksCacheTime = Date.now();
  return jwksCache;
}

// ---------------------------------------------------------------------------
// JWT validation
// ---------------------------------------------------------------------------

interface TokenPayload {
  iss: string;
  aud: string;
  exp: number;
  email?: string;
  preferred_username?: string;
  sub: string;
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function decodeJwtPayload(token: string): TokenPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const payload = new TextDecoder().decode(base64UrlDecode(parts[1]!));
  return JSON.parse(payload) as TokenPayload;
}

function decodeJwtHeader(token: string): { kid: string; alg: string } {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const header = new TextDecoder().decode(base64UrlDecode(parts[0]!));
  return JSON.parse(header) as { kid: string; alg: string };
}

async function importRsaKey(jwk: JwkKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    {
      kty: jwk.kty,
      n: jwk.n,
      e: jwk.e,
      alg: 'RS256',
      ext: true,
    },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

async function verifyJwt(token: string, env: Env): Promise<TokenPayload> {
  const header = decodeJwtHeader(token);
  const payload = decodeJwtPayload(token);

  // Validate issuer — multitenant: accept any Azure AD v2.0 issuer
  const issuerPattern = /^https:\/\/login\.microsoftonline\.com\/[a-f0-9-]+\/v2\.0$/;
  if (!issuerPattern.test(payload.iss)) {
    throw new Error(`Invalid issuer: ${payload.iss}`);
  }

  // Validate audience
  if (payload.aud !== env.CLIENT_ID) {
    throw new Error(`Invalid audience: ${payload.aud}`);
  }

  // Validate expiry
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }

  // Validate signature
  const jwks = await getJwks();
  const signingKey = jwks.keys.find((k) => k.kid === header.kid);
  if (!signingKey) {
    // Refresh JWKS in case keys rotated
    jwksCache = null;
    const refreshedJwks = await getJwks();
    const refreshedKey = refreshedJwks.keys.find((k) => k.kid === header.kid);
    if (!refreshedKey) throw new Error('Signing key not found in JWKS');
    return verifySignature(token, refreshedKey, payload);
  }

  return verifySignature(token, signingKey, payload);
}

async function verifySignature(token: string, jwk: JwkKey, payload: TokenPayload): Promise<TokenPayload> {
  const parts = token.split('.');
  const signingInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = base64UrlDecode(parts[2]!);

  const key = await importRsaKey(jwk);
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    new Uint8Array(signature) as BufferSource,
    new Uint8Array(signingInput) as BufferSource,
  );

  if (!valid) throw new Error('Invalid JWT signature');
  return payload;
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

function getAllowedDomains(env: Env): string[] {
  return env.ALLOWED_DOMAINS.split(',').map((d) => d.trim().toLowerCase());
}

async function authenticate(request: Request, env: Env): Promise<TokenPayload | Response> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.slice(7);

  let payload: TokenPayload;
  try {
    payload = await verifyJwt(token, env);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Authentication failed: ${err.message}` }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check email domain
  const email = (payload.email ?? payload.preferred_username ?? '').toLowerCase();
  if (!email) {
    return new Response(JSON.stringify({ error: 'No email claim in token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const domain = email.split('@')[1];
  const allowed = getAllowedDomains(env);
  if (!domain || !allowed.includes(domain)) {
    return new Response(JSON.stringify({ error: `Domain '${domain}' is not authorized` }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

async function handleRegistryFile(env: Env, filename: string): Promise<Response> {
  const object = await env.CONTENT_BUCKET.get(filename);
  if (!object) {
    return new Response(JSON.stringify({ error: `${filename} not found` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

async function handleContentFile(env: Env, path: string): Promise<Response> {
  const object = await env.CONTENT_BUCKET.get(path);
  if (!object) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ext = path.split('.').pop()?.toLowerCase();
  const contentType = ext === 'json' ? 'application/json' : 'text/plain; charset=utf-8';

  return new Response(object.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=300',
    },
  });
}

async function handleContentListing(env: Env, prefix: string): Promise<Response> {
  const listed = await env.CONTENT_BUCKET.list({ prefix: prefix + '/' });
  const files = listed.objects
    .map((obj) => obj.key.replace(prefix + '/', ''))
    .filter(Boolean);

  return new Response(JSON.stringify(files), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

// ---------------------------------------------------------------------------
// Batch download — fetch multiple files in one request
// ---------------------------------------------------------------------------

interface BatchRequest {
  paths: string[];
}

interface BatchResponseItem {
  path: string;
  content: string | null;
  error?: string;
}

async function handleBatchDownload(env: Env, body: BatchRequest): Promise<Response> {
  if (!Array.isArray(body.paths) || body.paths.length === 0) {
    return new Response(JSON.stringify({ error: 'Request body must have a non-empty "paths" array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cap at 200 files per batch to prevent abuse
  const paths = body.paths.slice(0, 200);

  const results: BatchResponseItem[] = await Promise.all(
    paths.map(async (p): Promise<BatchResponseItem> => {
      try {
        // Normalise: strip leading slash, ensure content/ prefix
        const key = p.replace(/^\//, '').replace(/^content\//, '');
        const objectKey = `content/${key}`;
        const object = await env.CONTENT_BUCKET.get(objectKey);
        if (!object) {
          return { path: p, content: null, error: 'Not found' };
        }
        const text = await object.text();
        return { path: p, content: text };
      } catch (err: any) {
        return { path: p, content: null, error: err.message };
      }
    }),
  );

  return new Response(JSON.stringify({ files: results }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// Batch upload — upload multiple files in one request
// ---------------------------------------------------------------------------

interface UploadItem {
  path: string;
  content: string;
}

interface UploadRequest {
  files: UploadItem[];
}

interface UploadResponseItem {
  path: string;
  ok: boolean;
  error?: string;
}

async function handleBatchUpload(env: Env, body: UploadRequest): Promise<Response> {
  if (!Array.isArray(body.files) || body.files.length === 0) {
    return new Response(JSON.stringify({ error: 'Request body must have a non-empty "files" array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cap at 200 files per batch
  const files = body.files.slice(0, 200);

  const results: UploadResponseItem[] = await Promise.all(
    files.map(async (f): Promise<UploadResponseItem> => {
      try {
        const key = f.path.replace(/^\//, '');
        await env.CONTENT_BUCKET.put(key, f.content);
        return { path: f.path, ok: true };
      } catch (err: any) {
        return { path: f.path, ok: false, error: err.message };
      }
    }),
  );

  const successCount = results.filter((r) => r.ok).length;
  return new Response(
    JSON.stringify({ uploaded: successCount, total: results.length, results }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check — no auth required
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // All other routes require auth
    const authResult = await authenticate(request, env);
    if (authResult instanceof Response) return authResult;

    // Batch download — POST /batch/download
    if (path === '/batch/download' && request.method === 'POST') {
      const body = await request.json() as BatchRequest;
      return handleBatchDownload(env, body);
    }

    // Batch upload — POST /batch/upload
    if (path === '/batch/upload' && request.method === 'POST') {
      const body = await request.json() as UploadRequest;
      return handleBatchUpload(env, body);
    }

    // Registry index files
    if (path === '/registry.json' || path === '/mcp-registry.json' || path === '/instructions-registry.json' || path === '/preset-registry.json') {
      return handleRegistryFile(env, path.slice(1));
    }

    // Content routes: /content/<kind>/<name>/<file> or /content/<kind>/<name>
    const contentMatch = path.match(/^\/content\/(.+)$/);
    if (contentMatch) {
      const contentPath = `content/${contentMatch[1]}`;

      // Check if it looks like a file path (has extension)
      if (/\.\w+$/.test(contentPath)) {
        return handleContentFile(env, contentPath);
      }

      // Otherwise, list files in the directory
      return handleContentListing(env, contentPath);
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
} satisfies ExportedHandler<Env>;
