export default defineAppConfig({
  header: {
    title: 'Imperium-CLI'
  },
  github: {
    owner: 'RUSHYOP',
    name: 'imperium-cli',
    url: 'https://github.com/RUSHYOP/imperium-cli',
    branch: 'main'
  },
  docus: {
    name: 'Imperium CLI',
    description: 'The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.',
    url: 'https://imperium.dev',
    editOnGithub: false,
    reportIssue: false
  },
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'zinc'
    },
    pageHero: {
      slots: {
        root: 'relative overflow-hidden min-h-screen',
        container: '!pt-56 sm:!pt-64 !pb-24 sm:!pb-32',
        title: 'font-extrabold sm:text-6xl lg:text-7xl tracking-tight leading-[1.06]',
        description: 'text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mx-auto'
      }
    },
    pageSection: {
      slots: {
        root: 'py-16 sm:py-24',
        title: 'font-bold text-3xl sm:text-4xl tracking-tight text-center',
        description: 'text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg mx-auto text-center'
      }
    },
    pageFeature: {
      slots: {
        root: 'p-6 rounded-2xl text-left',
        title: 'text-left',
        description: 'text-left text-sm leading-relaxed'
      }
    },
    prose: {
      steps: {
        base: 'ms-4 border-s border-default ps-8 [counter-reset:step] text-left'
      },
      pre: {
        slots: {
          base: 'group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none text-left'
        }
      }
    }
  }
})
