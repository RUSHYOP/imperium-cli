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
    name: 'Imperium-CLI',
    description: 'The package manager for AI agent context.',
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
        root: 'py-20 sm:py-32 relative overflow-hidden',
        title: 'font-extrabold sm:text-6xl lg:text-7xl tracking-tight leading-[1.06]',
        description: 'text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed'
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
        root: 'p-6 rounded-2xl'
      }
    }
  }
})
