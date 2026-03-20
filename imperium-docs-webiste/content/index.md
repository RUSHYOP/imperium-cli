---
seo:
  title: imperium-cli — The Package Manager for AI Agent Context
  description: Install, manage, and share skills and curated setup presets across AI agent projects. 121+ skills, instant setup.
---

::u-page-hero
#title
The package manager for your [*AI AGENT*]{.text-primary}

#description
Install curated knowledge packs, tool connections, and presets into Claude, Copilot, Cursor, or Windsurf. One CLI. Every agent. Instant expertise.

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/introduction
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
  Instant Setup

  #description
  No config files to write. One command detects your agent, installs skills, and wires everything up automatically.
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
  `imperium setup github` — creates `.github/` with instructions and skills.
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
