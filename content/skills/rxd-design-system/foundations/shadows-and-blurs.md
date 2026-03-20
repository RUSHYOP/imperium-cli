# RXDS Shadows & Blurs

> Standardized drop shadows and background blurs for depth, elevation, and layering.
> Source: [Figma — Shadows & Blurs](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=136-45260)

---

## Shadows (Drop Shadows — Y-Axis Down)

All shadows use the brand shadow color `rgba(24, 40, 88, α)` — a deep navy tint. Shadows increase in Y-offset, blur radius, and spread as the size scale grows.

> **Mobile:** Desktop shadow values apply as-is to mobile designs (no separate mobile scale).

| Token | Description | Use on |
|-------|-------------|--------|
| `xs` | Subtlest lift | Input focus rings, chips, small badges |
| `sm` | Gentle elevation | Buttons, list items, tooltips |
| `md` | Discernible lift | Cards, interactive tiles |
| `lg` | Prominent depth | Modals, drawer panels, popovers |
| `xl` | Strong separation | Full-screen overlays, floating panels |
| `2xl` | High emphasis | Hero cards, spotlight panels |
| `3xl` | Maximum depth | Full-page overlays, splash elements |

### CSS Values

```css
/* xs — 0 1px 2px 0 rgba(24,40,88,0.05) */
box-shadow: 0 1px 2px 0 rgba(24, 40, 88, 0.05);

/* sm — two layers */
box-shadow:
  0 1px 2px 0 rgba(24, 40, 88, 0.06),
  0 1px 3px 0 rgba(24, 40, 88, 0.10);

/* md — two layers */
box-shadow:
  0 2px 4px -2px rgba(24, 40, 88, 0.06),
  0 4px 8px -2px rgba(24, 40, 88, 0.10);

/* lg — two layers */
box-shadow:
  0 4px 6px -2px rgba(24, 40, 88, 0.03),
  0 12px 16px -4px rgba(24, 40, 88, 0.08);

/* xl — two layers */
box-shadow:
  0 8px 8px -4px rgba(24, 40, 88, 0.03),
  0 20px 24px -4px rgba(24, 40, 88, 0.08);

/* 2xl — single layer */
box-shadow: 0 24px 48px -12px rgba(24, 40, 88, 0.18);

/* 3xl — single layer */
box-shadow: 0 32px 64px -12px rgba(24, 40, 88, 0.14);
```

### Raw Values

| Token | Layer | X | Y | Blur | Spread | Color (RGBA) |
|-------|-------|---|---|------|--------|--------------|
| `xs` | 1 | 0 | 1 | 2 | 0 | rgba(24,40,88, 0.05) |
| `sm` | 1 | 0 | 1 | 2 | 0 | rgba(24,40,88, 0.06) |
| `sm` | 2 | 0 | 1 | 3 | 0 | rgba(24,40,88, 0.10) |
| `md` | 1 | 0 | 2 | 4 | -2 | rgba(24,40,88, 0.06) |
| `md` | 2 | 0 | 4 | 8 | -2 | rgba(24,40,88, 0.10) |
| `lg` | 1 | 0 | 4 | 6 | -2 | rgba(24,40,88, 0.03) |
| `lg` | 2 | 0 | 12 | 16 | -4 | rgba(24,40,88, 0.08) |
| `xl` | 1 | 0 | 8 | 8 | -4 | rgba(24,40,88, 0.03) |
| `xl` | 2 | 0 | 20 | 24 | -4 | rgba(24,40,88, 0.08) |
| `2xl` | 1 | 0 | 24 | 48 | -12 | rgba(24,40,88, 0.18) |
| `3xl` | 1 | 0 | 32 | 64 | -12 | rgba(24,40,88, 0.14) |

---

## Background Blurs

Background blurs are used stylistically for frosted-glass effects and depth layering. Two variants — **light** (over a light/bright background) and **dark** (over a dark/image background) — share the same blur radius per size but differ in the visual context they are applied over.

| Token | Blur Radius | Variant | Use on |
|-------|-------------|---------|--------|
| `sm light` | `8px` | Light bg | Subtle frosted panel over light content |
| `md light` | `16px` | Light bg | Sidepanel, popover over light page |
| `lg light` | `24px` | Light bg | Modal overlay on light background |
| `xl light` | `40px` | Light bg | Full-page glass overlay |
| `sm dark` | `8px` | Dark bg | Subtle frosted element over dark/image bg |
| `md dark` | `16px` | Dark bg | Panels over hero images or dark sections |
| `lg dark` | `24px` | Dark bg | Modal overlay on dark background |
| `xl dark` | `40px` | Dark bg | Full-page glass overlay on dark bg |

### CSS Values

```css
/* Light variants — use on light/white backgrounds */
backdrop-filter: blur(8px);   /* sm light */
backdrop-filter: blur(16px);  /* md light */
backdrop-filter: blur(24px);  /* lg light */
backdrop-filter: blur(40px);  /* xl light */

/* Dark variants — use over dark backgrounds or images */
backdrop-filter: blur(8px);   /* sm dark */
backdrop-filter: blur(16px);  /* md dark */
backdrop-filter: blur(24px);  /* lg dark */
backdrop-filter: blur(40px);  /* xl dark */
```

> The blur radius values are identical between light and dark at each size. The distinction is the **background context** — apply light variants over bright/white content, dark variants over dark/image content.

---

## Application Guidelines

### Where to use shadows

- **Card Components** — `sm` or `md` to give tiles a sense of elevation above the page surface.
- **Floating Action Buttons** — `md` or `lg` to draw attention to primary actions.
- **Dropdown Menus & Popovers** — `lg` to make them appear floating above other content.
- **Modals** — `lg` or `xl` to separate from background content.

### Best Practices

- **Consistent light source** — all shadows fall on the Y (down) axis; never mix upward or diagonal shadows.
- **User feedback** — buttons can use a reduced shadow on `:active` (pressed) state to simulate depth response.
- **Spacing** — shadow values use multiples of 4 for all offsets, consistent with the RXDS spacing scale.

### Accessibility

- Shadows must never be the **sole** means of conveying information — always pair with color, borders, or labels.
- Text over shadowed surfaces must maintain WCAG AA contrast ratios.
- Focus indicators on interactive elements must remain clearly visible and must not blend into shadows.
- Avoid rapidly animated or flickering shadows — they can trigger discomfort for users with vestibular disorders.
- Do not use shadows so strong that they obscure adjacent elements.
