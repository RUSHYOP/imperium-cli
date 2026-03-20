---
seo:
  title: imperium-cli — The Package Manager for AI Agent Context
  description: Install, manage, and share skills and curated setup presets across AI agent projects. 121+ skills, instant setup.
---

::u-page-hero
---
orientation: horizontal
---
#title
The package manager for your [AI agent]{.text-primary}

#description
Install curated knowledge packs, tool connections, and presets into Claude, Copilot, Cursor, or Windsurf. One CLI. Every agent. Instant expertise.

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::

  :::u-button
  ---
  color: neutral
  size: xl
  to: https://github.com/RUSHYOP/imperium-cli
  variant: subtle
  trailing-icon: i-lucide-github
  ---
  GitHub
  :::

#right
  ```bash [Terminal]
  npm install -g @rushy/imperium-cli

  imperium setup claude
  imperium add skills python-patterns
  # Done. Your agent is smarter now.
  ```
::

::u-page-section
---
align: center
---
#title
Why Imperium?

#description
AI agents are powerful out of the box — but they don't know your stack, your patterns, or your tools. Imperium fixes that in seconds.

#features
  :::u-page-feature
  ---
  icon: i-lucide-brain
  ---
  #title
  121+ Knowledge Packs

  #description
  Python, Django, Go, Kotlin, React, security, testing, databases, DevOps — curated instructions your agent reads and immediately applies.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-package
  ---
  #title
  One-Command Presets

  #description
  Bundle skills and configs into a single command. Run `imperium setup claude --preset fullstack` and ship.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Every Agent Supported

  #description
  Claude, GitHub Copilot, Cursor, Windsurf — auto-detects your environment and installs to the right place.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-lock
  ---
  #title
  Lockfile & Validation

  #description
  Every install is tracked. Share the lockfile with your team. Run `imperium validate` to verify integrity.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-terminal
  ---
  #title
  Familiar CLI

  #description
  Works like npm — `add`, `remove`, `update`, `list`, `search`. Plus fuzzy typo correction and `--dry-run` previews.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  Blazing Fast

  #description
  Zero network calls. Everything ships in the package. Works offline, works instantly, works everywhere.
  :::
::

::u-page-section
---
align: center
---
#title
Get started in 30 seconds

#description
From zero to a fully equipped AI agent in three commands.

#default
  ::steps
  ### Install Imperium

  ```bash [Terminal]
  npm install -g @rushy/imperium-cli
  ```

  ### Set up your agent

  ```bash [Terminal]
  imperium setup claude
  ```

  Creates the `.claude/` folder structure with settings, commands, and a skills directory — ready for knowledge packs.

  ### Add what you need

  ```bash [Terminal]
  imperium add skills python-patterns django-tdd security-review
  ```

  Your agent now has expert Python knowledge, Django TDD patterns, and security review capabilities.
  ::
::

::u-page-section
---
align: center
---
#title
Or use a preset for the full stack

#description
Presets bundle knowledge packs, tool connections, and config files into a single command. Zero config.

#default
  ```bash [Terminal]
  # Apply a curated bundle — skills, tools, and config files
  imperium setup claude --preset fullstack

  # Or combine a preset with extra skills
  imperium setup claude --preset fullstack --with security-review python-testing
  ```
::

::u-page-section
---
align: center
---
#title
Explore the registry

#description
Browse, search, and inspect everything that's available — all from the terminal.

#default
  ```bash [Terminal]
  # Browse all 121+ knowledge packs with descriptions
  imperium list skills -d

  # Search for something specific
  imperium search skills "api design"

  # Inspect full metadata and contents
  imperium inspect skills python-patterns

  # Output as JSON for scripting
  imperium list skills --format json
  ```
::

::u-page-section
---
align: center
---
#title
Manage your setup

#description
Update, remove, and validate — keep your agent's knowledge current.

#default
  ```bash [Terminal]
  # Update all installed packs to latest
  imperium update

  # Remove something you don't need
  imperium remove skills golang-patterns

  # Validate everything matches the lockfile
  imperium validate

  # Preview any change before it happens
  imperium add skills react-patterns --dry-run
  ```
::

::u-page-section
---
align: center
---
#title
Works with every agent

#description
Imperium auto-detects your environment or lets you pick.

#features
  :::u-page-feature
  ---
  icon: i-lucide-message-square
  ---
  #title
  Claude

  #description
  `imperium setup claude` — creates `.claude/` with settings, commands, and skills directories.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-github
  ---
  #title
  GitHub Copilot

  #description
  `imperium setup github` — creates `.github/copilot/` with instructions and skills.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-mouse-pointer
  ---
  #title
  Cursor

  #description
  `imperium setup cursor` — creates `.cursor/` with rules and skills directories.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-wind
  ---
  #title
  Windsurf

  #description
  `imperium setup windsurf` — creates `.windsurf/` with rules and skills directories.
  :::
::

::u-page-section
---
align: center
---
#title
Complete command reference

#description
Every command at a glance. See the full [Command Overview](/commands/overview) for the CLI skeleton.

#default
  | Command | Description |
  |---------|-------------|
  | [`setup`](/commands/setup) | Scaffold an agent environment, optionally with a preset |
  | [`add`](/commands/add) | Install knowledge packs |
  | [`remove`](/commands/remove) | Uninstall knowledge packs |
  | [`update`](/commands/update) | Update installed packs to the latest version |
  | [`list`](/commands/list) | Browse the full registry |
  | [`search`](/commands/search) | Search by keyword or phrase |
  | [`inspect`](/commands/inspect) | View full metadata for any item |
  | [`init`](/commands/utilities) | Initialize a lockfile |
  | [`detect`](/commands/utilities) | Scan for existing agent folders |
  | [`validate`](/commands/utilities) | Verify installed files match the lockfile |
::

::u-page-section
---
align: center
---
#title
Ready to make your agent smarter?

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Install Imperium
  :::

  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started/quick-start
  variant: subtle
  trailing-icon: i-lucide-zap
  ---
  Quick Start Guide
  :::
::
