export default defineNuxtPlugin(() => {
  const style = document.createElement('style')
  style.textContent = `
    #cursor-glow {
      pointer-events: none;
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(139,92,246,0.02) 40%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: 0;
      will-change: left, top;
      top: 0; left: 0;
    }
    :root.dark #cursor-glow {
      background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0.04) 40%, transparent 70%);
    }
    .glow-card {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      background: rgba(255,255,255,0.5);
      border: 1px solid rgba(228,228,231,0.7);
      transition: border-color 0.3s ease;
    }
    :root.dark .glow-card {
      background: rgba(255,255,255,0.02);
      border-color: rgba(63,63,70,0.5);
    }
    .glow-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
      pointer-events: none;
      background: radial-gradient(
        600px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(139,92,246,0.12),
        transparent 40%
      );
    }
    :root.dark .glow-card::before {
      background: radial-gradient(
        600px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(167,139,250,0.18),
        transparent 40%
      );
    }
    .glow-card:hover::before {
      opacity: 1;
    }
    .glow-card::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(
        400px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(139,92,246,0.5),
        transparent 40%
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    :root.dark .glow-card::after {
      background: radial-gradient(
        400px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(167,139,250,0.6),
        transparent 40%
      );
    }
    .glow-card:hover::after {
      opacity: 1;
    }
    .glow-card > * { position: relative; z-index: 2; }
  `
  document.head.appendChild(style)

  // Cursor glow orb
  const el = document.createElement('div')
  el.id = 'cursor-glow'
  document.body.appendChild(el)

  // Apply glow-card class to feature cards and card-group cards
  function tagCards() {
    document.querySelectorAll('[class*="u-page-feature"], [class*="card-group"] [class*="card"]').forEach(card => {
      if (!card.classList.contains('glow-card')) {
        card.classList.add('glow-card')
      }
    })
  }

  // Update glow position on cards
  function updateCardGlow(x: number, y: number) {
    document.querySelectorAll('.glow-card').forEach(card => {
      const rect = (card as HTMLElement).getBoundingClientRect()
      const cx = x - rect.left
      const cy = y - rect.top
      ;(card as HTMLElement).style.setProperty('--glow-x', cx + 'px')
      ;(card as HTMLElement).style.setProperty('--glow-y', cy + 'px')
    })
  }

  document.addEventListener('mousemove', (e: MouseEvent) => {
    el.style.left = e.clientX + 'px'
    el.style.top = e.clientY + 'px'
    el.style.opacity = '1'
    updateCardGlow(e.clientX, e.clientY)
  }, { passive: true })

  document.addEventListener('mouseleave', () => {
    el.style.opacity = '0'
  })

  // Tag cards on load and after navigation
  tagCards()
  const observer = new MutationObserver(() => tagCards())
  observer.observe(document.body, { childList: true, subtree: true })
})
