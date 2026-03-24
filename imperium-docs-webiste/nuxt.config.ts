export default defineNuxtConfig({
  devtools: { enabled: false },

  site: {
    url: 'https://imperium.dev',
    name: 'Imperium CLI',
    description: 'The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Imperium CLI' },
        { property: 'og:title', content: 'Imperium CLI — The Package Manager for AI Agent Context' },
        { property: 'og:description', content: 'Install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.' },
        { property: 'og:url', content: 'https://imperium.dev' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Imperium CLI — The Package Manager for AI Agent Context' },
        { name: 'twitter:description', content: 'Install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.' },
      ],
      link: [
        { rel: 'canonical', href: 'https://imperium.dev' },
      ],
    },
  },

  llms: {
    domain: 'https://imperium.dev',
    title: 'Imperium CLI',
    description: 'The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.',
  },

  robots: {
    allow: ['/'],
    sitemap: 'https://imperium.dev/sitemap.xml',
  },

  sitemap: {
    siteUrl: 'https://imperium.dev',
  },

  content: {
    highlight: {
      theme: {
        dark: 'github-dark-high-contrast',
        default: 'github-light',
      },
    },
  },
})
