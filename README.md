# imperium

A package manager for agent context — install skills, reference packs, and presets for any AI agent ecosystem.

```bash
npm install -g @rushy/imperium-cli
imperium --help
```

## What it does

Imperium manages **skills** (reusable AI agent instructions) across different agent ecosystems. It fetches skills from a GitHub registry and installs them into your project, adapting the output for whichever agent platform you use.

**121 skills** included — covering frontend, backend, testing, DevOps, security, content, and more.

### Three layers

| Layer | Purpose |
|-------|---------|
| **Registry** | GitHub repo where skills live (`skills/` directory) |
| **Installer** | Fetches and writes skill files locally |
| **Adapter** | Reshapes output for `.claude`, `.github`, `.windsurf`, `.cursor`, or custom folders |

### Supported platforms

| Platform | Target folder | Native files generated |
|----------|--------------|----------------------|
| Claude Code | `.claude/` | `agents/*.md` |
| GitHub Copilot | `.github/` | `copilot-instructions.md`, `instructions/*.instructions.md` |
| Windsurf | `.agents/` | `skills/`, `workflows/` |
| Cursor | `.cursor/` | `rules/*.md` |
| Custom | any folder | `skills/` only |

## Commands

```bash
imperium setup <preset>         # Scaffold a preset (.claude, .github, .windsurf, .cursor, custom)
imperium add <skills...>        # Add skills to the current project
imperium install <skills...>    # Install skills + generate native platform files
imperium download <skills...>   # Fetch skills into a target folder
imperium list                   # List all available skills in the registry
imperium search <query>         # Search for skills by name or description
imperium inspect <skill>        # Show metadata before installing
imperium update [skills...]     # Update installed skills (all if none specified)
imperium remove <skills...>     # Remove installed skills
imperium init                   # Initialize a lockfile in the current target
imperium detect                 # Detect agent folders in the current directory
imperium validate               # Validate installed skills against lockfile
```

## Usage

### Set up a project

```bash
# Scaffold for Claude Code
imperium setup .claude

# Scaffold for GitHub Copilot
imperium setup .github

# Scaffold for Cursor
imperium setup .cursor
```

### Install skills

```bash
# Single skill
imperium add python-patterns

# Multiple skills
imperium add python-patterns frontend-patterns api-design

# Comma-separated
imperium add python-patterns,django-patterns,django-security

# Install + generate native platform files
imperium install python-patterns --target claude

# Install all skills
imperium install --all --target .claude

# From a file
imperium add --from-file skills.txt
```

### Search and discover

```bash
imperium list
imperium search "react"
imperium search "testing"
imperium inspect python-patterns
```

### Manage

```bash
imperium update                  # Update all installed skills
imperium update python-patterns  # Update a specific skill
imperium remove django-patterns  # Remove a skill
imperium validate                # Check installation integrity
```

## Flags

### Core

```
--root <path>        Custom folder root
--target <preset>    claude, github, windsurf, cursor, custom
--force              Overwrite without asking
--dry-run            Preview changes only
-y, --yes            Skip confirmations
--no-fuzzy           Disable typo correction
--verbose            Show file-by-file actions
--silent             Minimal output
```

### Registry

```
--registry <url>     GitHub registry (owner/repo or full URL)
--kind <kind>        Filter by kind: skill, reference, preset
```

### Install behavior

```
--overwrite          Replace existing files
--preserve           Preserve user edits
--all                Operate on all skills
--from-file <path>   Read skill names from a file
```

## Fuzzy matching

Imperium corrects typos for commands, skills, and folder names:

```
$ imperium dowload test
⚠ Unknown command 'dowload'. Did you mean 'download'?

$ imperium add opneapi
⚠ 'opneapi' not found — using 'openapi' instead.

$ imperium setup .claud
⚠ '.claud' not found — using '.claude' instead.
```

## Lockfile

Imperium tracks installations in `imperium.lock.json`:

```json
{
  "version": 1,
  "preset": "claude",
  "root": ".claude",
  "packages": {
    "python-patterns": {
      "name": "python-patterns",
      "kind": "skill",
      "version": "0.0.0",
      "source": "github:RUSHYOP/imperium-cli",
      "checksum": "a1b2c3d4e5f6...",
      "installedPath": ".claude/skills/python-patterns",
      "installedAt": "2026-03-19T00:00:00.000Z",
      "lastSync": "2026-03-19T00:00:00.000Z"
    }
  }
}
```

## Skill format

Each skill is a folder with a `SKILL.md` file using YAML frontmatter:

```markdown
---
name: python-patterns
description: >
  Use when working on Python projects. Covers idiomatic patterns,
  project structure, and best practices.
---

# Python Patterns

Content and instructions for the AI agent...
```

Some skills include subfolders (`references/`, `scripts/`, `evals/`, `templates/`).

## Custom registry

Point to any GitHub repo that has a `skills/` directory:

```bash
imperium list --registry your-org/your-repo
imperium add my-skill --registry your-org/your-repo#dev
```

## Architecture

```
src/
  bin.ts                    # Entry point (shebang)
  cli.ts                    # Commander setup, all 12 commands
  index.ts                  # Public API exports
  commands/
    setup.ts                # setup command
    install.ts              # add, download, install commands
    manage.ts               # update, remove commands
    query.ts                # list, search, inspect, detect commands
    utility.ts              # init, validate commands
  core/
    types/index.ts          # TypeScript interfaces
    registry/github.ts      # GitHub API: tree listing, fetching, search
    installer/index.ts      # File writer + lockfile integration
    lockfile/index.ts       # imperium.lock.json read/write
  adapters/index.ts         # Claude, GitHub, Windsurf, Cursor, Custom adapters
  utils/
    fuzzy.ts                # Levenshtein-based typo correction
    log.ts                  # Colored terminal output
    resolve-target.ts       # Folder detection and resolution
skills/                     # 121 skills (the registry)
```

## License

MIT
