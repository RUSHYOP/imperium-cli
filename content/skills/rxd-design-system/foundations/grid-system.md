# RXDS Grid System

> Layout grids define structure, hierarchy, and rhythm in RXDS screens. The system uses a **12-column grid** with a **24px gutter** across all viewport sizes.
> Source: [Figma — Grid Systems](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=131-60078)

---

## Viewport Definitions

| Name | Viewport | Nav width | Nav position | Primary use |
|------|----------|-----------|--------------|-------------|
| **Web — Centered Nav** | 1440 × 768px | 80px | Both sides | Desktop app with centered layout |
| **Web — Left Nav** | 1440 × 768px | 60px | Left side | Desktop app with sidebar nav |
| **Tab — Portrait** | 768 × 1024px | Collapsed | Left | Tablet portrait mode |
| **Mobile — Portrait** | 360 × 880px | Collapsed | Bottom/hidden | Mobile (Android Large reference size) |

### Mobile Baseline
- **Reference device:** Android Large variant — 360 × 800px portrait
- Layouts should be tested at 360px wide minimum
- Optimise for **portrait orientation** first on mobile

---

## Grid Specifications

| Property | Value |
|----------|-------|
| Columns | **12** |
| Gutter | **24px** (between columns) |
| Column type | Auto (fluid) |
| Margin | Context-dependent (see viewport table above) |

The 12-column grid is stretched to fill the available container width. Columns scale proportionally — gutters are fixed at 24px.

---

## Column Layouts (Container Grid)

Standard column span patterns for content within the 12-column grid:

| Layout | Spans | Visual proportion |
|--------|-------|------------------|
| Full width | `col-12` | 100% |
| Half / 2-column | `col-6` + `col-6` | 50 / 50 |
| Primary + aside | `col-8` + `col-4` | 66 / 33 |
| Third / 3-column | `col-4` × 3 | 33 / 33 / 33 |
| Quarter / 4-column | `col-3` × 4 | 25 / 25 / 25 / 25 |
| 5-column | `col` (auto, 5 items) | 20% each |
| 6-column | `col` (auto, 6 items) | ~16.6% each |

> **Rule: all sibling column spans in a row must sum to 12.**

---

## Breakpoint Behavior

Specify all three breakpoints for every column. Default responsive collapse:

| Breakpoint | Class prefix | Viewport | Typical behavior |
|------------|-------------|----------|-----------------|
| Large (desktop) | `lg` | ≥ 992px | Full multi-column layout |
| Medium (tablet) | `md` | 768–991px | Reduce to 2 columns or stack |
| Small (mobile) | `sm` | < 768px | Single column (`col-sm-12`) |

```
Always specify: col-lg-N col-md-N col-sm-12
```

---

## UIDL Bootstrap Grid — Enforced Rules

The RXDS runtime uses Bootstrap 4 grid. These rules are non-negotiable in UIDL:

### 1. Columns must sum to 12

```
col-lg-8 + col-lg-4 = 12 ✓
col-lg-6 + col-lg-6 = 12 ✓
col-lg-7 + col-lg-5 = 12 ✓ (but non-standard — use 8/4 for hero+aside)
col-lg-4 × 3 = 12 ✓
col-lg-3 × 4 = 12 ✓
```

### 2. Hero + Form Pattern

The standard hero+form split is **8/4 (not 7/5)**:

```json
{ "col": { "lg": 8 } }  ← hero/content
{ "col": { "lg": 4 } }  ← form/panel
```

### 3. Fullscreen Viewport Pattern

```json
{
  "type": "container",
  "layout": {
    "colLayout": { "lg": { "height": "100vh" } },
    "className": "p-0"
  },
  "children": [{
    "type": "row",
    "layout": { "className": "no-gutters h-100", "lg": { "alignItems": "stretch" } },
    "children": [
      { "type": "column", "layout": { "lg": { "col": 8, "height": "100%" } } },
      { "type": "column", "layout": { "lg": { "col": 4, "height": "100%" } } }
    ]
  }]
}
```

### 4. Always include all three breakpoints

```json
"col": { "lg": 6, "md": 6, "sm": 12 }
```

---

## Container Widths

Fixed max-width containers that constrain content width at each viewport:

| Token | px | rem | Usage |
|-------|----|-----|-------|
| `sm` | 640px | 40rem | Small fixed containers |
| `md` | 768px | 48rem | Tablet-width containers |
| `lg` | 1024px | 64rem | Standard desktop container |
| `xl` | 1280px | 80rem | Wide desktop container |

---

## Grid Guidelines

### Best Practices

**Follow a flex-first approach** — start with a single base-unit component, then expand horizontally based on content needs.

**Balance white space** — grids create breathing room between elements; don't fill every column unless content requires it.

**Text as main element** — set a maximum line-length for text columns to maintain readability (see Typography guidelines).

**Grid for different elements** — use consistent column widths for similar content types across a product.

### Do's
- Align all elements to the column grid for visual consistency
- Use `col-sm-12` (full width) for all columns on mobile
- Maintain 24px gutter between columns — never collapse it
- Test tablet (768px) as a mid-point between desktop and mobile

### Don'ts
- Don't use fewer than 12 total columns in a row
- Don't use arbitrary widths outside the Bootstrap column system
- Don't optimize for landscape mobile — portrait (360×800) is the reference
- Don't override gutters with negative margins

---

## Mobile Recommendations

| Point | Guideline |
|-------|-----------|
| Single column | All content stacks to `col-sm-12` on mobile |
| Portrait first | Optimize layouts for portrait orientation |
| Reference size | 360×800px (Android Large Variant) |
| Touch targets | Minimum 44×44px for all interactive elements |
