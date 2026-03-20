export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    fixAriaHidden()
    addMainLandmark()
  })

  function fixAriaHidden() {
    const nuxtEl = document.getElementById('__nuxt')
    if (!nuxtEl) return

    if (nuxtEl.getAttribute('aria-hidden') === 'true') {
      nuxtEl.removeAttribute('aria-hidden')
    }

    const observer = new MutationObserver(() => {
      if (nuxtEl.getAttribute('aria-hidden') === 'true') {
        nuxtEl.removeAttribute('aria-hidden')
      }
    })
    observer.observe(nuxtEl, { attributes: true, attributeFilter: ['aria-hidden'] })
  }

  function addMainLandmark() {
    if (document.querySelector('main, [role="main"]')) return

    const page =
      document.querySelector('[data-slot="content"]') ??
      document.querySelector('[data-slot="page"]') ??
      document.querySelector('.page-body')

    if (page) {
      const main = document.createElement('main')
      page.parentNode?.insertBefore(main, page)
      main.appendChild(page)
      return
    }

    // Fallback: tag the first child of #__nuxt
    const nuxtEl = document.getElementById('__nuxt')
    const firstChild = nuxtEl?.firstElementChild
    if (firstChild && !firstChild.matches('header, footer, nav')) {
      firstChild.setAttribute('role', 'main')
    }
  }
})
