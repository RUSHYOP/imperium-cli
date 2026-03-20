<script setup lang="ts">
useSeoMeta({
  titleTemplate: '%s',
  title: 'Imperium-CLI — The Package Manager for AI Agent Context',
  description: 'Install, manage, and share skills and curated setup presets across AI agent projects. 121+ skills, instant setup.'
})

const features = [
  {
    title: '121+ Knowledge Packs',
    description: 'Python, Django, Go, Kotlin, React, security, testing, databases, DevOps — curated instructions your agent applies immediately.',
    icon: 'i-lucide-brain',
    to: '/docs/getting-started/registry'
  },
  {
    title: 'One-Command Presets',
    description: 'Bundle skills, tool connections, and config files into a single command. Zero config required.',
    icon: 'i-lucide-package',
    to: '/docs/concepts/presets'
  },
  {
    title: 'Every Agent Supported',
    description: 'Claude, GitHub Copilot, Cursor, Windsurf — auto-detects your environment and writes to the right place.',
    icon: 'i-lucide-layers',
    to: '/docs/concepts/adapters'
  },
  {
    title: 'Lockfile & Validation',
    description: 'Every install is tracked in a lockfile. Share it with your team. Verify integrity with one command.',
    icon: 'i-lucide-shield-check',
    to: '/docs/concepts/lockfile'
  },
  {
    title: 'Familiar CLI',
    description: 'Works like npm — add, remove, update, list, search. Plus fuzzy typo correction and --dry-run previews.',
    icon: 'i-lucide-terminal',
    to: '/docs/commands/overview'
  },
  {
    title: 'Blazing Fast',
    description: 'Zero network calls for installs. Everything ships in the package. Works offline, works instantly.',
    icon: 'i-lucide-zap',
    to: '/docs/getting-started/installation'
  }
]

const agents = [
  { name: 'Claude', icon: 'i-lucide-message-square', command: 'imperium setup claude', dir: '.claude/' },
  { name: 'GitHub Copilot', icon: 'i-simple-icons-github', command: 'imperium setup github', dir: '.github/copilot/' },
  { name: 'Cursor', icon: 'i-lucide-mouse-pointer', command: 'imperium setup cursor', dir: '.cursor/' },
  { name: 'Windsurf', icon: 'i-lucide-wind', command: 'imperium setup windsurf', dir: '.windsurf/' }
]

const commands = [
  { label: 'setup', icon: 'i-lucide-settings', description: 'Scaffold an agent environment, optionally with a preset.', to: '/docs/commands/setup' },
  { label: 'add', icon: 'i-lucide-plus', description: 'Install knowledge packs and tool connections.', to: '/docs/commands/add' },
  { label: 'remove', icon: 'i-lucide-trash', description: 'Uninstall knowledge packs from your project.', to: '/docs/commands/remove' },
  { label: 'update', icon: 'i-lucide-refresh-cw', description: 'Update all installed packs to the latest version.', to: '/docs/commands/update' },
  { label: 'list', icon: 'i-lucide-list', description: 'Browse the full registry with descriptions.', to: '/docs/commands/list' },
  { label: 'search', icon: 'i-lucide-search', description: 'Search by keyword, category, or phrase.', to: '/docs/commands/search' },
  { label: 'inspect', icon: 'i-lucide-eye', description: 'View full metadata and file contents.', to: '/docs/commands/inspect' },
  { label: 'validate', icon: 'i-lucide-shield-check', description: 'Verify installed files match the lockfile.', to: '/docs/commands/utilities' }
]

const stats = [
  { value: '121+', label: 'Knowledge Packs' },
  { value: '8', label: 'Tool Connections' },
  { value: '4', label: 'Supported Agents' },
  { value: '10', label: 'CLI Commands' }
]
</script>

<template>
  <div>
    <!-- ═══════════════════════ HERO ═══════════════════════ -->
    <UPageHero
      orientation="horizontal"
      :ui="{
        root: 'py-24 sm:py-32 lg:py-40 relative overflow-hidden',
        title: 'font-black tracking-tight text-5xl sm:text-6xl lg:text-7xl',
        description: 'text-lg sm:text-xl max-w-2xl text-pretty'
      }"
    >
      <!-- Ambient gradient -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/8 blur-3xl" />
        <div class="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <template #headline>
        <UBadge color="primary" variant="subtle" size="md" class="rounded-full font-medium">
          <UIcon name="i-lucide-sparkles" class="size-3.5 mr-1" />
          v0.4.2 — 121+ Knowledge Packs
        </UBadge>
      </template>

      <template #title>
        The package manager<br>for your <span class="text-primary">AI agent</span>
      </template>

      <template #description>
        Install curated knowledge packs, tool connections, and presets into Claude, Copilot, Cursor, or Windsurf. One CLI. Every agent. Instant expertise.
      </template>

      <template #links>
        <UButton
          size="xl"
          color="primary"
          to="/docs/getting-started/introduction"
          trailing-icon="i-lucide-arrow-right"
        >
          Get Started
        </UButton>
        <UButton
          size="xl"
          variant="subtle"
          color="neutral"
          to="https://github.com/RUSHYOP/imperium-cli"
          target="_blank"
          trailing-icon="i-simple-icons-github"
        >
          GitHub
        </UButton>
      </template>

      <template #right>
        <div class="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl shadow-primary/10 overflow-hidden w-full max-w-lg">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
            <div class="flex gap-1.5">
              <div class="size-3 rounded-full bg-red-500/80" />
              <div class="size-3 rounded-full bg-yellow-500/80" />
              <div class="size-3 rounded-full bg-green-500/80" />
            </div>
            <span class="text-xs text-neutral-500 ml-2 font-mono">Terminal</span>
          </div>
          <div class="p-5 text-sm font-mono leading-loose text-neutral-300 overflow-x-auto">
            <div><span class="text-neutral-500">$</span> <span class="text-primary">npm</span> install -g @rushy/imperium-cli</div>
            <div class="mt-3"><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> setup claude</div>
            <div class="text-green-400">✓ Created .claude/settings.json</div>
            <div class="text-green-400">✓ Created .claude/commands/</div>
            <div class="text-green-400">✓ Created .claude/skills/</div>
            <div class="mt-3"><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> add skills python-patterns</div>
            <div class="text-green-400">✓ Installed python-patterns</div>
            <div class="mt-1 text-neutral-600"># Your agent is smarter now.</div>
          </div>
        </div>
      </template>
    </UPageHero>

    <USeparator />

    <!-- ═══════════════════════ STATS ═══════════════════════ -->
    <section class="bg-elevated/50">
      <UContainer class="py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-4xl sm:text-5xl font-black text-primary tabular-nums">{{ stat.value }}</p>
            <p class="text-sm text-muted mt-1.5 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <USeparator />

    <!-- ═══════════════════════ FEATURES ═══════════════════════ -->
    <UPageSection
      title="Why Imperium?"
      description="AI agents are powerful out of the box — but they don't know your stack. Imperium fixes that in seconds."
    >
      <UPageGrid>
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          v-bind="feature"
          variant="outline"
          spotlight
          spotlight-color="primary"
        />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ HOW IT WORKS ═══════════════════════ -->
    <UPageSection
      title="Get started in 30 seconds"
      description="From zero to a fully equipped AI agent in three commands."
      class="bg-elevated/25"
    >
      <UPageGrid :ui="{ root: 'grid-cols-1 lg:grid-cols-3 gap-8' }">
        <UPageCard
          variant="outline"
          spotlight
          icon="i-lucide-download"
          title="1. Install"
          :ui="{ body: 'font-mono text-sm' }"
        >
          <template #description>
            <code class="text-xs bg-elevated px-2 py-1 rounded font-mono">npm install -g @rushy/imperium-cli</code>
          </template>
        </UPageCard>
        <UPageCard
          variant="outline"
          spotlight
          icon="i-lucide-settings"
          title="2. Setup"
        >
          <template #description>
            <code class="text-xs bg-elevated px-2 py-1 rounded font-mono">imperium setup claude</code>
            <p class="text-muted text-sm mt-2">Creates the agent folder structure with settings, commands, and skills.</p>
          </template>
        </UPageCard>
        <UPageCard
          variant="outline"
          spotlight
          icon="i-lucide-brain"
          title="3. Add Knowledge"
        >
          <template #description>
            <code class="text-xs bg-elevated px-2 py-1 rounded font-mono">imperium add skills python-patterns</code>
            <p class="text-muted text-sm mt-2">Your agent now has expert knowledge. Done.</p>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ AGENTS ═══════════════════════ -->
    <UPageSection
      title="Every agent. One CLI."
      description="Imperium auto-detects your environment or lets you pick. Each agent gets its knowledge in the right place."
    >
      <UPageGrid :ui="{ root: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }">
        <UPageCard
          v-for="agent in agents"
          :key="agent.name"
          :title="agent.name"
          :icon="agent.icon"
          variant="outline"
          spotlight
          spotlight-color="primary"
        >
          <template #description>
            <code class="text-xs bg-elevated px-2 py-1 rounded font-mono text-primary">{{ agent.command }}</code>
            <p class="text-muted text-xs mt-2">Creates <code class="text-xs">{{ agent.dir }}</code></p>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ PRESETS ═══════════════════════ -->
    <UPageSection
      title="Or use a preset"
      description="Bundle knowledge packs, tool connections, and config files into a single command."
      class="bg-elevated/25"
      orientation="horizontal"
    >
      <template #default>
        <div class="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden w-full">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
            <div class="flex gap-1.5">
              <div class="size-3 rounded-full bg-red-500/80" />
              <div class="size-3 rounded-full bg-yellow-500/80" />
              <div class="size-3 rounded-full bg-green-500/80" />
            </div>
            <span class="text-xs text-neutral-500 ml-2 font-mono">Terminal</span>
          </div>
          <div class="p-5 text-sm font-mono leading-loose text-neutral-300">
            <div class="text-neutral-600"># Apply a curated bundle</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> setup claude --preset fullstack</div>
            <div class="mt-3 text-neutral-600"># Or combine a preset with extra skills</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> setup claude --preset fullstack --with security-review</div>
          </div>
        </div>
      </template>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ COMMANDS ═══════════════════════ -->
    <UPageSection
      title="Complete command reference"
      description="Every command at a glance. Click to see full documentation."
    >
      <UPageGrid :ui="{ root: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }">
        <UPageCard
          v-for="cmd in commands"
          :key="cmd.label"
          :title="cmd.label"
          :description="cmd.description"
          :icon="cmd.icon"
          :to="cmd.to"
          variant="outline"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ REGISTRY BROWSER ═══════════════════════ -->
    <UPageSection
      title="Browse, search, inspect"
      description="Explore everything available — all from the terminal."
      class="bg-elevated/25"
      orientation="horizontal"
    >
      <template #default>
        <div class="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden w-full">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
            <div class="flex gap-1.5">
              <div class="size-3 rounded-full bg-red-500/80" />
              <div class="size-3 rounded-full bg-yellow-500/80" />
              <div class="size-3 rounded-full bg-green-500/80" />
            </div>
            <span class="text-xs text-neutral-500 ml-2 font-mono">Terminal</span>
          </div>
          <div class="p-5 text-sm font-mono leading-loose text-neutral-300">
            <div class="text-neutral-600"># Browse all 121+ knowledge packs</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> list skills -d</div>
            <div class="mt-3 text-neutral-600"># Search for something specific</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> search skills "api design"</div>
            <div class="mt-3 text-neutral-600"># Inspect full metadata and contents</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> inspect skills python-patterns</div>
            <div class="mt-3 text-neutral-600"># Output as JSON for scripting</div>
            <div><span class="text-neutral-500">$</span> <span class="text-primary">imperium</span> list skills --format json</div>
          </div>
        </div>
      </template>
    </UPageSection>

    <USeparator />

    <!-- ═══════════════════════ CTA ═══════════════════════ -->
    <UPageCTA
      title="Ready to make your agent smarter?"
      description="Install Imperium and give your AI agent expert-level knowledge in seconds."
      :links="[
        { label: 'Get Started', to: '/docs/getting-started/introduction', color: 'primary' as const, size: 'xl' as const, trailingIcon: 'i-lucide-arrow-right' },
        { label: 'Browse Registry', to: '/docs/getting-started/registry', variant: 'subtle' as const, color: 'neutral' as const, size: 'xl' as const, trailingIcon: 'i-lucide-list' }
      ]"
    />
  </div>
</template>
