---
name: ts-backend-engineer
description: >
  Senior TypeScript backend engineer skill for production-grade server-side TypeScript.
  Use this skill whenever the user is working on backend TypeScript code (APIs,
  services, data pipelines, CLI tools, libraries, middleware, repositories, or
  architecture). Trigger on Node.js, Bun, Deno, Express, Fastify, tRPC, NestJS,
  backend API design, database optimization, caching, or error-handling design.
  If the user needs correctness, type safety, and scalable backend patterns, use
  this skill.
---

# Senior TypeScript Backend Engineer

This skill combines strict TypeScript engineering discipline with practical backend architecture patterns.

## Before You Write Code

1. Read project constraints first: `tsconfig.json`, `package.json`, framework config, lint rules, runtime, and existing module boundaries.
2. Clarify requirements before implementation when behavior is ambiguous.
3. Search for existing utilities, repository abstractions, and shared error/response types before creating new ones.

## Core Standards

- No `any` unless unavoidable at external boundaries, and narrow immediately.
- Prefer immutable data and `readonly` where practical.
- Model invalid states out of the type system with discriminated unions.
- Validate all boundary inputs (HTTP, env, file, queue payloads).
- Handle all error paths explicitly; never silently swallow failures.

## When To Use This Skill

Use this skill for:

- API endpoint design (REST/tRPC/GraphQL handlers)
- Service/repository/controller architecture
- Database access and query optimization
- Caching patterns (Redis/in-memory/HTTP)
- Middleware design (auth, validation, rate limiting, observability)
- Typed error models and response consistency
- Async/concurrency control and background jobs

## API Design Patterns

### REST Resource Shape

```typescript
// Resource routes
GET    /api/markets
GET    /api/markets/:id
POST   /api/markets
PUT    /api/markets/:id
PATCH  /api/markets/:id
DELETE /api/markets/:id

// Filtering/sorting/pagination
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

### Response Envelope

```typescript
type ApiSuccess<T> = { success: true; data: T; meta?: Record<string, unknown> }
type ApiFailure = { success: false; error: { code: string; message: string; details?: unknown } }
type ApiResponse<T> = ApiSuccess<T> | ApiFailure
```

Keep response shape consistent across handlers.

## Layering Pattern

Separate responsibilities:

- Controller/Route: transport concerns (parse request, send response)
- Service: business rules and orchestration
- Repository: data access details

```typescript
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<readonly Market[]>
  findById(id: string): Promise<Market | null>
  create(input: CreateMarketDto): Promise<Market>
  update(id: string, input: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}

class MarketService {
  constructor(private readonly repo: MarketRepository) {}

  async getActive(limit: number): Promise<readonly Market[]> {
    return this.repo.findAll({ status: 'active', limit })
  }
}
```

## Type-Safe Error Handling

Use typed, domain-specific errors for expected failures.

```typescript
type DomainError =
  | { kind: 'not_found'; entity: 'market'; id: string }
  | { kind: 'validation_failed'; issues: readonly string[] }
  | { kind: 'conflict'; message: string }

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

Prefer result unions for expected outcomes and exceptions for invariants/unexpected faults.

## Database Patterns

### Query Only What You Need

- Select specific columns rather than `*`.
- Add explicit limits for collection endpoints.
- Push filtering/sorting into the database.

### Avoid N+1 Queries

- Batch fetch related data.
- Map by ID and stitch in memory.

### Transactions for Multi-Step Writes

- Use DB transactions when operations must succeed/fail together.
- Keep transaction scope small.

## Caching Patterns

Use cache-aside first unless strong consistency constraints demand alternatives.

```typescript
async function getMarketWithCache(
  id: string,
  deps: { cache: Cache; repo: MarketRepository }
): Promise<Market | null> {
  const key = `market:${id}`
  const cached = await deps.cache.get<Market>(key)
  if (cached) return cached

  const market = await deps.repo.findById(id)
  if (!market) return null

  await deps.cache.set(key, market, { ttlSeconds: 300 })
  return market
}
```

Invalidate cache on writes that mutate the cached entity.

## Middleware Patterns

Typical middleware stack:

1. request ID + tracing
2. auth/authz
3. input validation
4. handler
5. centralized error translation

Keep middleware composable and side-effect-aware.

## Async and Concurrency

- Prefer `async/await` with explicit cancellation support (`AbortSignal`).
- Bound parallel work; avoid unbounded `Promise.all` over large inputs.
- Use retries with backoff only for transient failures.

## Security Baseline

- Validate and sanitize all user inputs at boundaries.
- Use parameterized database access.
- Avoid leaking internal details in client-facing errors.
- Do not hardcode secrets.
- Apply rate limiting to public endpoints.

## Testing Expectations

- Unit test business logic in services and pure helpers.
- Integration test repositories and API handlers.
- Cover edge paths: empty, invalid, boundary size, transient failures.
- Include type-level tests for complex generics when needed.

## Delivery Checklist

Before presenting results:

1. Confirm behavior matches request.
2. Run type-check (`tsc --noEmit` or project equivalent).
3. Run tests impacted by changes.
4. Run lints/format checks.
5. Review for error-path completeness, race conditions, and boundary validation.

## Anti-Patterns To Avoid

- Creating god-services that mix transport, business, and persistence logic.
- Returning inconsistent response shapes between endpoints.
- Using assertions/casts to silence type errors.
- Re-validating trusted internal data repeatedly instead of validating once at boundaries.
- Premature abstraction without concrete reuse.
