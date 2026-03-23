---
name: design-system
description: "RXDS (Ramco Xperience Design System) — the definitive reference for building screens with the correct components, colors, spacing, shadows, and accessibility rules. Use this skill whenever building a UI, designing a screen, choosing between components, picking colors or spacing values, checking accessibility compliance, or making any visual design decision. Also use when the user mentions 'design system', 'RXDS', 'component selection', 'which component should I use', 'colors', 'spacing', 'shadows', 'accessibility', or any UI/UX design question in the context of RXDS or Ramco products."
---

# RXDS Design System

The Ramco Xperience Design System (RXDS) defines every component, color, spacing token, shadow, and accessibility rule for building consistent, accessible screens. This skill helps you pick the right component, apply the right visual tokens, and avoid common design mistakes.

## Resource Map

Read the resource you need based on your task:

| Task | Read |
|------|------|
| Pick the right component | Decision trees below → then `references/<component>.md` |
| Choose colors | `foundations/colors.md` |
| Set spacing/sizing | `foundations/spacing.md` |
| Apply shadows/elevation | `foundations/shadows-and-blurs.md` |
| Typography (font, sizes, weights) | `foundations/typography.md` |
| Grid / layout columns / breakpoints | `foundations/grid-system.md` |
| All tokens in one file (colors, type, spacing, shadows, blur, grid) | `foundations/tokens.json` |
| Check accessibility | `foundations/accessibility.md` |
| Use illustrations | `foundations/illustrations.md` |
| Look up icons | `foundations/iconography.json` |
| Get Figma component IDs | `references/components.md` |
| Deep-dive any component | `references/<component-name>.md` (properties, variants, sub-components) |

---

## Foundations Quick Reference

### Colors

RXDS uses a semantic color system. Every color decision should use these palettes — never use arbitrary hex values.

| Role | Token | Hex | Use for |
|------|-------|-----|---------|
| **Primary 500** | primary-500 | `#0066CC` | Primary buttons, links, active states |
| **Primary 25** | primary-25 | `#F5FAFF` | Light primary backgrounds, hover states |
| **Primary 700** | primary-700 | `#004C99` | Pressed/active primary states |
| **Success 500** | success-500 | `#0E9F63` | Success indicators, positive status |
| **Warning 500** | warning-500 | `#E68A00` | Warning indicators, caution states |
| **Error 500** | error-500 | `#D92D20` | Error messages, destructive actions |
| **Neutral 900** | neutral-900 | `#182858` | Primary text, headings |
| **Neutral 700** | neutral-700 | `#344054` | Secondary text, body copy |
| **Neutral 400** | neutral-400 | `#98A2B3` | Placeholder text, disabled states |
| **Neutral 200** | neutral-200 | `#EAECF0` | Borders, dividers |
| **Neutral 50** | neutral-50 | `#F9FAFB` | Page backgrounds, subtle surfaces |
| **Information 25** | info-25 | `#F5FAFF` | Page-level backgrounds |
| **White** | white | `#FFFFFF` | Card/panel backgrounds, input fields |

**Color rules:**
- Minimum contrast ratio: **4.5:1** for regular text, **3:1** for large text (18px+) and interactive elements
- Never use dark shades (700–900) as backgrounds — they're for text
- Use shade 25/50 for backgrounds, 500 for interactive elements, 700+ for pressed states
- Error/Warning/Success colors are semantic — don't use red/yellow/green for decoration

For the full palette with all shades (25–900), read `foundations/colors.md`.

### Spacing

RXDS uses a **4px soft grid** with 17 spacing steps. Prefer 8px multiples for structural spacing.

| Token | px | rem | Common use |
|-------|------|------|------------|
| 1 | 4 | 0.25 | Tight inline gaps |
| 2 | 8 | 0.5 | Icon-to-label gaps, compact padding |
| 3 | 12 | 0.75 | Small component padding |
| 4 | 16 | 1.0 | Standard field spacing, card padding |
| 5 | 20 | 1.25 | Section gaps |
| 6 | 24 | 1.5 | Card internal padding, group spacing |
| 8 | 32 | 2.0 | Section separation |
| 10 | 40 | 2.5 | Major section gaps |
| 12 | 48 | 3.0 | Large panel padding |
| 16 | 64 | 4.0 | Page-level padding |
| 20 | 80 | 5.0 | Login/hero content padding |

**Container widths:** sm=640px, md=768px, lg=1024px, xl=1280px

**Spacing rules:**
- Use consistent spacing within a layout — don't mix arbitrary pixel values
- 8px (token 2) minimum between adjacent form fields
- 16px (token 4) standard vertical gap between form rows
- 24px (token 6) between distinct content groups
- 32–48px (tokens 8–12) between page sections

### Shadows

Shadow tokens create elevation hierarchy. Higher elevation = more user attention.

| Token | When to use | CSS |
|-------|-------------|-----|
| **xs** | Subtle lift — inputs on focus | `0 1px 2px 0 rgba(24,40,88,0.05)` |
| **sm** | Cards, panels | dual-layer — see `foundations/shadows-and-blurs.md` |
| **md** | Dropdowns, popovers | dual-layer |
| **lg** | Drawers, modals | dual-layer |
| **xl** | Fullscreen overlays | dual-layer |

**Shadow color:** Always `rgba(24,40,88, α)` — the RXDS brand shadow. Never use black/grey box-shadows.

### Typography

- **Font family:** Inter (all weights, all sizes)
- **Weights:** Regular (400) · Medium (500) · Semibold (600) · Bold (700)
- **Size scale:** 72 · 60 · 48 · 40 · 36 · 32 · 28 · 24 · 20 · 18 · 16 · 14 · 12 · 10 · 8 px
- **Body default:** 16px Regular · line-height 1.5
- **Form labels:** 14px Medium minimum
- **Helper/caption:** 12px minimum (mobile hard floor)
- **Mobile minimums:** helper 12px · body 13px · title 16px
- **Display sizes** (72, 60, 48): hero/KPI sections only — not for body copy

For full scale with roles and line-height guidelines, read `foundations/typography.md`.

### Grid System

- **Columns:** 12 · **Gutter:** 24px
- **Desktop:** 1440px wide · Web Centered (80px nav) or Web Left (60px nav)
- **Tablet:** 768 × 1024px portrait
- **Mobile:** 360 × 880px portrait (Android Large reference)
- **Standard splits:** full (12) · half (6+6) · hero+panel (8+4) · thirds (4+4+4) · quarters (3×4)
- **Always specify:** `col-lg-N col-md-N col-sm-12` for every column

For UIDL grid rules and fullscreen patterns, read `foundations/grid-system.md`.

### Accessibility (WCAG AA Minimum)

Every screen must meet these requirements:

- **Text contrast:** 4.5:1 minimum (3:1 for 18px+ bold or 24px+ regular)
- **Interactive elements:** 3:1 contrast against background
- **Focus indicators:** Visible on every interactive element — never remove `outline`
- **Keyboard navigation:** All actions reachable via Tab/Shift+Tab/Enter/Space/Escape
- **Form labels:** Every input must have a visible label (or `aria-label` if hidden)
- **Error messages:** Associate with the field via `aria-describedby`, not just color
- **Touch targets:** Minimum 44×44px on mobile

---

## Component Selection

Use these decision trees to pick the right component. When unsure, read the linked `references/<name>.md` for full properties and variants.

### Text & Typography

| Need | Component | Key variants |
|------|-----------|-------------|
| Page/section title | **Heading** | Tags H1–H6, Weight: Semi-bold/Bold |
| Body text, description | **Paragraph** | color, size |
| Form field label | **Label** | always pair with an input |
| Read-only label + value pair | **Display** | for view-mode data |
| Inline navigation text | **Hyperlink** | underlined, opens target |

### Data Entry — "What input type?"

```
Is it free text?
├── Single line → Input Field (types: text/email/password)
├── Multi-line → TextArea
└── Formatted (bold, lists) → Rich Text Box

Is it a selection?
├── One from ≤15 fixed options → Dropdown
├── One from large/dynamic set → AutoSuggest
├── Multiple picks → MultiSelect
├── Exactly one from 2–7 visible → Radio / RadioGroup
├── Multiple independent toggles → Checkbox
└── On/off with immediate effect → Switch

Is it a number?
├── Exact value → Numeric
└── Range with visual handle → Slider

Is it a date/time?
├── Date only → DatePicker
├── Time only → TimePicker
├── Date + time → DateTimePicker
├── Date range → DateRangePicker
├── Date+time range → DateTimeRangePicker
└── Always-visible calendar → Inplace Calendar

Is it a phone number? → Phone
Is it a formatted pattern (SSN, card, OTP)? → Mask Field (ElementPatterntextbox)
Is it a color? → ColorPicker
Is it files? → Attachments (mixed) / Image Attach (images only)
Is it a rating/score? → Rating
```

### Actions — "Which button type?"

| Scenario | Component | Variant |
|----------|-----------|---------|
| Primary page action (Save, Submit) | **Button** | Primary, contained |
| Secondary action (Cancel, Back) | **Button** | Secondary, outlined |
| Tertiary/subtle action (Learn more) | **Button** | Tertiary, text |
| Icon-only action (close, delete) | **ActionIcon** | — |
| Icon toggle (pin, favourite) | **ActionIconToggle** | — |
| One primary + overflow alternatives | **SplitButton** | — |
| Multiple equal options under one trigger | **MenuButton** | — |
| Persistent mobile creation action | **Floating Button** | — |
| 2–5 mutually exclusive visual options | **ToggleButtonGroup** | — |

**Button sizes:** XS, Small, Medium (default), Large
**Button status colors:** Default, Success, Warning, Error, Neutral

### Content Surfaces — "How to group content?"

| Need | Component | When |
|------|-----------|------|
| Tile with header/body/footer + media | **Card** | Sizes: SM/MD/LG/XL. Types: Border, Shadow, No Border+Shadow |
| Grid of cards | **Card Container** | 1–4 columns, gap 8/16/24px |
| Simple bordered/shadowed box | **Panel** | EnableBorder, EnableShadow. Sizes: Small/Medium |
| Page section with header/body/footer | **Section** | structural layout zoning |
| Collapsible stacked sections | **Accordion** | Outline/Line style. Desktop/Mobile |
| Switchable peer-level views | **Tabs** | Horizontal-Tab / Vertical-Tab |

### Overlays & Feedback

| Need | Component | When |
|------|-----------|------|
| Must acknowledge before continuing | **Modal** | Sizes: XSmall–Full Screen |
| Side panel for detail/form | **Drawer (Sidedraw)** | Sizes: XSmall–Fullscreen |
| Mobile bottom sheet | **Drawer (Mobile)** | Sizes: 1/4–Full Screen |
| Brief contextual info near trigger | **Popover** | non-blocking floating panel |
| Text-only hint on hover | **Tooltip** | single-line hint |
| In-app help topics | **QuickHelp** | contextual help panel |
| Transient action feedback | **Toast Message** | Status: Neutral/Success/Warning/Error |
| No data to display | **Empty States** | Type: Illustration/Icon |

### Data Display

| Need | Component |
|------|-----------|
| Column-aligned tabular data | **Table** (Default/Zebra, Single Line/Multiline) |
| Data list with toolbar + bulk actions | **ListView** (with Toolbar, Column Chooser, Pagination) |
| Sequential event history | **Timeline** |
| Org/reporting hierarchy | **OrgChart** |
| Nested parent-child browsing | **Tree** |
| Nested grid with expandable rows | **Treegrid** |
| Before/after data comparison | **DiffCheck** |
| Code/config display | **Code Snippet** |
| Interactive JSON editing | **JSON Viewer** |
| Inline document/file preview | **File Viewer** (PDF, XLSX, CSV, DOCX, TXT, HTML) |
| Word frequency visualization | **Word Cloud** |
| Charts/graphs | **Charts** |

### Navigation & Progress

| Need | Component |
|------|-----------|
| Hierarchy backtrack trail | **Breadcrumbs** |
| Multi-step sequential wizard | **Stepper** (Horizontal/Vertical/Mobile) |
| Discrete page navigation | **Pagination** |
| Continuous scroll loading | **Infinite Scroll** |
| Percentage completion (linear) | **ProgressBar** |
| Percentage completion (radial) | **Circular Progress** |
| Unknown-duration loading | **Loader** (inline spinner) |
| Full-page route loading | **Page Loader** (top bar) |
| Known-structure loading | **Skeleton Animation** |

### Layout & Structure

| Need | Component |
|------|-----------|
| Responsive multi-column grid | **Grid Column** |
| Visual divider line | **Separator** (horizontal/vertical) |
| Invisible whitespace gap | **Spacing** |
| Resizable adjacent panels | **Splitter** |
| Drag-to-reorder items | **SortItem** |
| Inline-editable list items | **List Edit** |
| Table column show/hide | **Column Switch** |

#### Bootstrap 12-Column Grid — Enforced Rules

The RXDS runtime uses a Bootstrap 4 grid. These rules are non-negotiable:

**Column widths must sum to 12.** All sibling `col-lg-*` values in one row must add to exactly 12.

| Split type | Left | Right | Total |
|-----------|------|-------|-------|
| Hero + Form (standard) | col-lg-8 | col-lg-4 | **12** |
| Equal split | col-lg-6 | col-lg-6 | **12** |
| Card grid (3-col) | col-lg-4 | col-lg-4 | col-lg-4 = **12** |
| Metric tiles (4-col) | col-lg-3 × 4 | — | **12** |
| Full width | col-lg-12 | — | **12** |

**7/5 is wrong.** The hero+form split is 8/4, not 7/5. 7+5=12 but the visual proportion is wrong for RXDS — the form panel at col-4 is the established pattern.

**Always specify all three breakpoints:** `lg` (≥992px), `md` (768–991px), `sm` (<768px). Default responsive behavior: 2-column on desktop (lg), single-column on mobile (sm:12).

**Fullscreen viewport pattern:**
```
container (layout.colLayout.lg.height: "100vh", className: "p-0")
  └── row (className: "no-gutters h-100", layout.lg.alignItems: "stretch")
       ├── column (layout.lg: { col: 8, height: "100%" })
       └── column (layout.lg: { col: 4, height: "100%" })
```

### Media & Identity

| Need | Component |
|------|-----------|
| Person/entity thumbnail | **Avatar** (Image/Initials/Icon) |
| Group of people | **AvatarGroup** (stacked + overflow count) |
| Content image | **Image** (aspect ratio, shape control) |
| Playable video | **Video** (with controls, thumbnail) |
| Status/count overlay | **Badge** (Numeric/Dot/Label) |
| Categorization chip | **Tag** (removable, filterable) |
| Standalone icon | **Icon** |
| No-data illustration | see `foundations/illustrations.md` (76 components) |
| Horizontal item browser | **Carousel** |
| Geographic location | **Map** |
| Week schedule view | **Week Calendar** |

---

## Common Decision Mistakes

These are the most frequent wrong-component choices. Check this before finalizing:

| You chose | But consider | When |
|-----------|-------------|------|
| Checkbox | **Switch** | Setting takes effect immediately, not on form submit |
| Switch | **Checkbox** | Part of a form that gets submitted, not an immediate toggle |
| Dropdown | **AutoSuggest** | Option list is large (>15) or dynamic/searchable |
| AutoSuggest | **Dropdown** | Option list is small and fixed (≤15 items) |
| Tabs | **Accordion** | Content should stack, not switch (user needs to compare) |
| Accordion | **Tabs** | Content should switch, not stack (only one view at a time) |
| Modal | **Drawer** | Content is secondary/detail, doesn't need to block the page |
| Drawer | **Modal** | User MUST acknowledge before continuing |
| Button | **Hyperlink** | Action is pure navigation to another page |
| Hyperlink | **Button** | Action triggers a process (save, delete, submit) |
| Panel | **Card** | Content needs structured header/body/footer with media |
| Card | **Panel** | Just need a simple bordered/shadowed box |
| Table | **ListView** | Need toolbar, bulk actions, column config |
| ListView | **Table** | Simple column-aligned data, no toolbar needed |
| Badge | **Tag** | Needs to be standalone, removable, filterable |
| Tag | **Badge** | Overlays another element as a count/status indicator |
| Input Field | **Mask Field** | Value has a strict format (phone, SSN, card number) |
| Loader | **Skeleton Animation** | Page structure is known — show shape placeholders instead of spinner |

---

## Self-Verification Checklist

Before delivering any screen design, verify:

- [ ] **Right component?** Check the decision tree above — is there a better fit?
- [ ] **Colors from RXDS palette?** No arbitrary hex values — use the token table above
- [ ] **Contrast meets WCAG AA?** 4.5:1 for text, 3:1 for interactive/large text
- [ ] **Spacing consistent?** Using 4px grid tokens, not arbitrary pixel values
- [ ] **Shadows use RXDS tokens?** xs/sm/md/lg/xl — never custom box-shadow values
- [ ] **Every input has a label?** Visible label or aria-label for accessibility
- [ ] **Keyboard navigable?** Tab order makes sense, focus states visible
- [ ] **Error states shown?** Form fields show error status + message
- [ ] **Empty state handled?** What does the user see when there's no data?
- [ ] **Loading state handled?** Skeleton/Loader/Page Loader appropriate to context
- [ ] **Touch targets ≥ 44×44px?** For mobile-responsive screens

---

## Full Component Reference Table

For the complete table of all 86 components with Description, Use-when, Not, and Guide links, each component has a dedicated reference file at `references/<component-name>.md` containing:
- Full properties table with all variants and defaults
- Sub-components and their properties
- Figma component keys and set IDs
- Do's and Don'ts with specific alternatives

Read these when you need exact property values, variant names, or Figma component IDs for implementation.
