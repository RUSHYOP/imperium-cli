# RXDS Typography System

> Font family: **Inter** — used across all RXDS screens for desktop, tablet, and mobile.
> Source: [Figma — Typography](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=1-3)

---

## Font Family

| Name | Usage |
|------|-------|
| **Inter** | All UI text — headings, body, labels, captions, helpers |

Inter is a variable font. Always reference it via the design system — never substitute arbitrary system fonts in RXDS screens.

---

## Type Scale

Base: **16px = 1rem**. All sizes listed in px.

| Size | rem | Weights available | Typical role |
|------|-----|-------------------|-------------|
| 72 | 4.5rem | Regular · Medium · Semibold · **Bold** | Display / Hero |
| 60 | 3.75rem | Regular · Medium · Semibold · **Bold** | Display |
| 48 | 3rem | Regular · Medium · Semibold · **Bold** | H1 / Page title |
| 40 | 2.5rem | Regular · Medium · Semibold · **Bold** | H2 |
| 36 | 2.25rem | Regular · Medium · Semibold · **Bold** | H3 |
| 32 | 2rem | Regular · Medium · Semibold · **Bold** | H4 |
| 28 | 1.75rem | Regular · Medium · Semibold · **Bold** | H5 |
| 24 | 1.5rem | Regular · Medium · Semibold · **Bold** | H6 / Large body |
| 20 | 1.25rem | Regular · Medium · Semibold · **Bold** | Subheading |
| 18 | 1.125rem | Regular · Medium · Semibold · **Bold** | Large body |
| 16 | 1rem | Regular · Medium · Semibold · **Bold** | Body (default) |
| 14 | 0.875rem | Regular · Medium · Semibold · **Bold** | Secondary body / labels |
| 12 | 0.75rem | Regular · Medium · Semibold · **Bold** | Helper / caption |
| 10 | 0.625rem | Regular · Medium · Semibold · **Bold** | Fine print |
| 8 | 0.5rem | Regular · Medium · Semibold · **Bold** | Micro labels / badges |

---

## Font Weights

| Name | Value | Use |
|------|-------|-----|
| Regular | 400 | Body text, secondary labels |
| Medium | 500 | Emphasis, form labels, active states |
| Semibold | 600 | Subheadings, button labels |
| Bold | 700 | Headings, key metrics, high-priority labels |

---

## Mobile Recommendations

| Role | Minimum size | Note |
|------|-------------|------|
| Helper / caption text | **12px** | Never go below 12px on mobile |
| Body / paragraph text | **13px** | Base body text |
| App header / title | **16px+** | Titles should start at 16px |

The full desktop scale applies to mobile. Only the minimums above are enforced.

---

## Display Sizes

"Display" in RXDS terminology refers to font sizes 72, 60, and 48 — used in hero sections, dashboards with large KPIs, and marketing-style pages. Not for regular body content or form labels.

---

## Line Height Guidelines

| Category | Sizes | Recommended line-height |
|----------|-------|------------------------|
| Display | 72, 60 | 1.1 (tight — optical balance) |
| Large heading | 48, 40, 36 | 1.2 |
| Heading | 32, 28, 24 | 1.25–1.3 |
| Body | 20, 18, 16 | 1.5 (WCAG requirement for readability) |
| Small | 14, 12 | 1.4–1.5 |
| Micro | 10, 8 | 1.5 |

WCAG requires body text line-height of at least **1.5×** the font size.

---

## Letter Spacing (Tracking)

- **Display / Large headings (48px+):** slight negative tracking (-0.01em to -0.02em) for tight optical balance
- **Body text (14–20px):** normal tracking (0em)
- **Small / helper text (10–12px):** slight positive tracking (+0.01em) for readability

---

## Best Practices

### Do
- Use **Semibold or Bold** for headings to create clear visual hierarchy
- Use **Regular or Medium** for body text — avoid Bold for long paragraphs
- Pair a large heading size with a smaller body size (e.g., 32 Bold heading + 14 Regular body)
- Use **14px Medium** for form labels — never smaller
- Use **12px Regular or Medium** for helper/placeholder/caption text

### Don't
- Don't use more than **3 different font sizes** on a single view — it creates visual noise
- Don't use light-weight text (Regular) at sizes below 12px — illegible
- Don't use heading sizes (28+) for body copy paragraphs
- Don't mix weights arbitrarily — weight changes should reflect hierarchy intent
- Don't use decorative fonts — Inter is the only RXDS typeface

---

## Accessibility

- **Minimum body size:** 14px (13px absolute minimum for mobile body)
- **Minimum helper text:** 12px
- **Contrast:** Text must meet WCAG AA (4.5:1 for body, 3:1 for large text ≥ 24px normal or ≥ 18px bold)
- **Zoom:** Content must remain readable and non-overlapping at 200% zoom
- **Line length:** 45–80 characters for desktop body; 30–40 for mobile
- **Line height:** ≥ 1.5× for body text (accessibility requirement)
