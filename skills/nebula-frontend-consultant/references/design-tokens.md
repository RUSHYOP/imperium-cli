# SCSS Design Tokens

Nebula Studio's design tokens live in `Designer-Frontend/src/infra/assets/styles/scss/1-tools/_variables.scss`. These tokens define the visual design system used throughout the platform.

The SCSS tools directory also includes:
- `_flex.scss` — Flexbox utility classes
- `_fonts.scss` — Font face definitions
- `_mixins.scss` — SCSS mixins for responsive design and common patterns
- `_reset.scss` — CSS reset/normalize
- `_tools.scss` — General utility mixins
- `_variables.scss` — The main token file (documented below)

---

## Typography Scale

| Token | Value | Use |
|---|---|---|
| `$font-xxxs` | 10px | Micro labels, footnotes |
| `$font-xxs` | 11px | Small captions |
| `$font-xs` | 12px | Secondary text |
| `$font-s` | 13px | Body small |
| `$font-m` | 14px | Body default |
| `$font-l` | 16px | Body large / subheadings |
| `$font-xl` | 18px | Section headings |
| `$font-xxl` | 20px | Panel headings |
| `$font-xxxl` | 24px | Page titles |
| `$font-xxxxl` | 28px | Large titles |
| `$font-xxxxxl` | 32px | Hero headings |
| `$font-xxxxxxl` | 48px | Display text |
| `$font-xxxxxxxl` | 60px | Jumbo display |
| `$font-xxxxxxxxl` | 72px | Maximum display |

13 sizes from 10px to 72px. The naming convention uses repeated `x` characters to indicate scale.

---

## Spacing Scale

| Token | Value | Use |
|---|---|---|
| `$quarter-s` | 2px | Hairline spacing |
| `$half-s` | 4px | Tight spacing |
| `$three-fourth-s` | 6px | Compact spacing |
| `$one-s` | 8px | Base unit |
| `$one-and-half-s` | 12px | Small gap |
| `$two-s` | 16px | Default gap |
| `$two-and-half-s` | 20px | Medium gap |
| `$three-s` | 24px | Section gap |
| `$four-s` | 32px | Large gap |
| `$five-s` | 40px | Panel padding |
| `$six-s` | 48px | Section padding |
| `$seven-s` | 56px | Large section |
| `$eight-s` | 64px | Page-level |
| `$ten-s` | 80px | Maximum spacing |

14 steps from 2px to 80px. Base unit is 8px (`$one-s`).

---

## Box Shadows

### Standard Shadows
| Token | Context |
|---|---|
| `$box-shadow-input` | Form input focus |
| `$box-shadow-default` | Cards, elevated surfaces |
| `$box-shadow-hover` | Hover state elevation |
| `$box-shadow-sidebar` | Sidebar panels |
| `$box-shadow-modal` | Modal/dialog overlays |
| `$box-shadow-dropdown` | Dropdown menus |

### RXD Shadows (Y-axis and X-axis variants)
| Token | Size |
|---|---|
| `$rxd-box-shadow-xs` | Extra small |
| `$rxd-box-shadow-sm` | Small |
| `$rxd-box-shadow-md` | Medium |
| `$rxd-box-shadow-lg` | Large |
| `$rxd-box-shadow-xl` | Extra large |
| `$rxd-box-shadow-2xl` | 2X large |
| `$rxd-box-shadow-3xl` | 3X large |

Each RXD shadow has both Y-axis (default) and X-axis variants.

---

## Focus Indicators

| Token | Description |
|---|---|
| `$focus-shadow-*` | Blue-tinted focus rings using `#EAF4FF` base |

Focus rings follow accessibility standards with visible, high-contrast outlines.

---

## Border Radius

| Token | Description |
|---|---|
| `$rounded-*` | Consistent border-radius scale |

---

## Breakpoints (Layout Grid)

| Breakpoint | Min Width | SCSS Usage |
|---|---|---|
| `col` (fallback) | < 576px | Mobile fallback |
| `sm` | ≥ 576px | Small tablets |
| `md` | ≥ 768px | Tablets |
| `lg` | ≥ 992px | Desktop |
| `xl` | ≥ 1200px | Large desktop |

These correspond to the `colLayout` breakpoint keys in the UIDL metadata layout system.

---

## Usage Notes

- The design tokens are **SCSS variables**, not CSS custom properties. They're compiled at build time.
- The component library (`@ramco-platform/studio-components`) uses these same tokens internally.
- When the MCP server needs to expose design tokens to Lovable, these are the values to serve.
- For the actual values (hex colors, exact shadow definitions, etc.), read the `_variables.scss` file directly from the codebase.
