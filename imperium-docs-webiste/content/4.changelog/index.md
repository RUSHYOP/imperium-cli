---
title: Changelog
description: Release history for imperium-cli.
---

# Changelog

All notable changes to **imperium-cli** are documented here.

---

## v0.7.0

> Comprehensive UX and performance overhaul.

### 🚀 New Features
- **Command aliases** — `i` (add), `ls` (list), `s` (search), `rm` (remove) for faster typing
- **`--format json`** — machine-readable output for `list`, `search`, and `inspect` commands
- **`--no-cache`** — bypass cached data and fetch fresh from the registry
- **Progress spinner** — batch installs now show a live counter: `Fetching packages… (47/118)`
- **Batch install summary** — after bulk operations, prints `✔ 115 installed  ⚠ 2 skipped  ✖ 1 failed`

### ⚡ Performance
- **Parallel update command** — `imperium update` now fetches packages in parallel (was sequential)
- **Batch lockfile writes** — single write at end of `--all` instead of one per package (118→1 writes)
- **Async cache eviction** — no longer blocks the event loop with synchronous I/O
- **Deferred cursor glow** — docs site decorative effect deferred with `requestIdleCallback`
- **Compression + caching** — docs site now serves gzipped assets with proper `Cache-Control` headers

### 🐛 Bug Fixes
- **Partial failures now exit with code 1** — `imperium add skills --all` no longer silently exits 0 when some packages fail
- **Lockfile race condition** — concurrent installs are now protected with advisory file locking
- **Corrupt lockfile recovery** — corrupt lockfiles are backed up to `.backup` before reset (instead of silently discarding all install history)
- **`process.exitCode` standardized** — replaced all `process.exit(1)` calls to avoid skipping async cleanup
- **`--from-file` validation** — now shows a clear error if the file doesn't exist (instead of crashing)
- **Package deduplication** — `imperium add skills foo foo` installs once, not twice
- **`error()` respects `--silent`** — error output is now suppressed when `--silent` is set
- **Removed bare catch/re-throw** — cleaned up pointless exception handling in skill resolution
- **Verbose cache/auth logging** — cache and auth errors now log details when `--verbose` is set

---

## v0.6.21

> Emergency fix for GitHub API rate-limit storm.

### 🐛 Bug Fixes
- **Singleflight request coalescing** — concurrent requests to the same URL now share a single HTTP call (prevents thundering herd on `--all`)
- **Tree cache pre-warming** — `prefetchTree()` warms the GitHub tree cache before batch installs start
- **Batched concurrency** — package fetches limited to 10 concurrent requests (was unbounded)
- **Extended cache TTL** — tree cache extended from 60s to 5 minutes to survive long installs
- **Optional `GITHUB_TOKEN`** — if set, raises rate limit from 60 to 5,000 requests/hour (not required)
- **Retry improvements** — increased from 3 to 5 retries, max backoff raised from 8s to 30s

---

## v0.6.19

> Adapter propagation and dry-run scaffolding.

### 🐛 Bug Fixes
- Fixed adapter propagation to child commands during `setup --with`
- Added `previewScaffold` for accurate `--dry-run` output during setup

---

## v0.6.18

> MCP token persistence and install scopes.

### 🚀 New Features
- **Token persistence** — MCP placeholder values (API keys, tokens) are saved and reused across installs
- **Install scope selection** — choose project-level or global (`~/.imperium/mcp-installs/`) for MCP bundles

---

## v0.6.16

> Adapter-aware MCP configuration.

### 🚀 New Features
- **GitHub adapter** — MCP config now writes to `.vscode/mcp.json` with `servers` key (instead of `.mcp.json` with `mcpServers`)
- **Scaffolding** — `setup github` creates `.vscode` directory structure

---

## v0.6.14

> Security hardening release.

### 🔒 Security
- Fixed all 4 CodeQL security findings
- Hardened auth — removed environment variable overrides, fixed directory permissions, sanitized error messages
- Bumped `serialize-javascript` and `nitropack` dependencies

---

## v0.6.9

> SEO, AI discoverability, and login improvements.

### 🚀 New Features
- **SEO meta tags** — Open Graph, Twitter Cards, canonical URLs, robots.txt, sitemap
- **`llms.txt`** — AI discoverability endpoint for LLM-powered tools
- **Login page** — styled login/auth callback pages with auto-close

### 🐛 Bug Fixes
- Fixed misleading auto-close countdown on login page

---

## v0.6.0

> Authentication and batch operations.

### 🚀 New Features
- **Authentication** — `imperium login` / `logout` / `whoami` with Microsoft Entra ID
- **Batch endpoints** — parallelized download/upload for faster operations
- **Multitenant auth** — any organization account can sign in

### 🐛 Bug Fixes
- Fixed postinstall banner visibility (use stderr, npm suppresses stdout)
- Fixed login timeout preventing process from exiting

---

## v0.5.0

> Instructions support and codebase restructure.

### 🚀 New Features
- **Instructions** — new resource type: `imperium add instructions <name>`, `imperium list instructions`
- **Codebase restructure** — modular architecture with adapters, commands, core, and utils

---

## v0.4.0

> MCP support, setup presets, and colorized help.

### 🚀 New Features
- **MCP support** — `imperium add mcps <name>`, `imperium list mcps`, `imperium remove mcps`
- **Setup presets** — `imperium setup claude --preset fullstack` for curated bundles
- **Colorized help** — beautiful terminal output with syntax highlighting
- **Postinstall welcome** — friendly greeting on first install

---

## v0.3.0

> Performance optimization.

### ⚡ Performance
- **Registry index** — fetch a lightweight index instead of full package data for listing
- **Filesystem cache** — responses cached at `~/.imperium/cache/` with 5-minute TTL
- **Parallel fetch** — multiple files within a package fetched concurrently
- **Cache-Control headers** — leverages GitHub CDN for faster repeat fetches

### 🚀 New Features
- **`--with` flag** — `imperium setup claude --with python-patterns` scaffolds and installs in one step
- **Per-command help** — each command has its own examples and curated flags

---

## v0.2.0

> Simplified command structure.

### Breaking Changes
- Removed `install` and `download` commands — use `add` instead
- Removed `--registry` flag — registry is always the default public source
- Added `--path` flag for custom install directories

---

## v0.1.0

> Initial release.

### 🚀 Features
- `imperium add skills <name>` — install skill packs from the public registry
- `imperium list skills` — browse available packages
- `imperium search skills <query>` — search by keyword
- `imperium remove skills <name>` — uninstall packages
- Support for Claude, Copilot, Cursor, and Windsurf adapters
- Lockfile tracking (`imperium.lock.json`)
- Fuzzy matching for typo correction
