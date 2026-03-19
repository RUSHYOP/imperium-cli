# RXDS Spacing System

> 4px soft-grid spacing scale with 17 steps, plus container breakpoint widths.
> Source: [Figma — Spacing](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=131-60077)

---

## Foundation: 4px Soft Grid

All spacing values are multiples of **4px**. This is a **soft grid** (not a rigid 8px hard grid) — it allows nuanced spacing while still aligning to an 8px rhythm.

- **Prefer multiples of 8px** for major layout spacing (gaps, padding, margins)
- **Use 4px multiples** for fine-tuned adjustments (icon padding, tight group gaps)
- **Never use arbitrary values** — always pick the nearest token from the scale
- The same scale applies to **mobile** designs (no separate mobile spacing scale)

---

## Spacing Scale

Base: **16px = 1rem**. Step name aligns to the multiplier (`1` = 1×4px, `2` = 2×4px, etc.).

| Token | rem | px |
|-------|-----|----|
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |
| `32` | 8rem | 128px |
| `40` | 10rem | 160px |
| `48` | 12rem | 192px |
| `56` | 14rem | 224px |
| `64` | 16rem | 256px |

---

## Container Widths

Fixed max-widths for layout containers at each breakpoint:

| Token | rem | px |
|-------|-----|----|
| `sm` | 40rem | 640px |
| `md` | 48rem | 768px |
| `lg` | 64rem | 1,024px |
| `xl` | 80rem | 1,280px |

---

## Runtime Spacing Utility Classes

When applying spacing in code or UIDL, use the actual runtime utility classes generated from the
RXDS token scale:

```text
mt-half-s      → margin-top: 4px
mt-one-s       → margin-top: 8px
mt-one-half-s  → margin-top: 12px
mt-two-s       → margin-top: 16px
mb-three-s     → margin-bottom: 24px
px-two-s       → padding-left/right: 16px
py-three-s     → padding-top/bottom: 24px
```

Pattern: `{m|p}{t|b|l|r|x|y}-{token}-s`

If a design handoff still includes a legacy wrapper like `c~mb-two-s`, strip the `c~` prefix and
use `mb-two-s`.

---

## Best Practices

- **Consistent objects alignment** — always align elements both vertically and horizontally to the 4px grid.
- **Define spacing before building** — pick values from the scale first; don't measure after placing elements.
- **Vertical rhythm** — spacing consistency across similar components (e.g. all form rows use the same gap) creates a harmonious vertical rhythm that helps both designers and developers.
- **Developer handoff** — consistent spacing means developers can predict values and build from the design without guessing. Inconsistent spacing at design stage guarantees incorrect implementation.

### Do
- Use tokens from the scale (4, 8, 12, 16, 24, 32…)
- Prefer 8px multiples for structural gaps; 4px for micro-adjustments
- Apply the same spacing to similar components across all pages

### Don't
- Use arbitrary values (e.g. 7px, 11px, 15px)
- Use `c~`-prefixed classes in code or UIDL — normalize them to the real runtime class name
- Mix spacing values across similar components (e.g. some cards at 16px padding, others at 14px)
