export default defineNuxtConfig({
  devtools: { enabled: false },

  llms: {
    domain: 'https://imperium.dev',
    title: 'Imperium CLI',
    description: 'The package manager for AI agent context — install curated knowledge packs, MCP server configs, custom instructions, and presets into Claude, Copilot, Cursor, or Windsurf.',
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
