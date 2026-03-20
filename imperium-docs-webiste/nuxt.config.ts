export default defineNuxtConfig({
  devtools: { enabled: false },

  content: {
    highlight: {
      theme: {
        dark: 'github-dark-high-contrast',
        default: 'github-light',
      },
    },
  },
})
