# Screenshot/Mockup → UIDL Conversion (Method 2)

A systematic workflow for converting screenshots, mockups, or design images
into pixel-perfect UIDL JSON. This method produces the most accurate UIDL
when the user has a specific visual design they want replicated.

## Table of Contents
1. [Visual Analysis Workflow](#visual-analysis-workflow)
2. [Layout Identification](#layout-identification)
3. [Color Identification](#color-identification)
4. [Spacing Measurement](#spacing-measurement)
5. [Component Identification](#component-identification)
6. [Typography Analysis](#typography-analysis)
7. [Common Screen Patterns](#common-screen-patterns)
8. [Conversion Checklist](#conversion-checklist)

---

## Visual Analysis Workflow

Before writing any UIDL, systematically analyze the screenshot in this order:

### Pass 1: Overall Structure
1. **Page type** — Is this a login page? Dashboard? Form? Data table? Settings page?
2. **Layout structure** — Single column? Two-column split? Three-column with sidebar?
3. **Background** — What's the page background color? Is there a dark panel?
4. **Height** — Does this fill the viewport (100vh) or scroll?
5. **Fragments** — Does the page contain distinct reusable sections?
   - Sidebar/navigation panel → likely a fragment
   - Stepper with multiple steps → each step is a fragment
   - Modal/dialog content → likely a fragment

### Pass 2: Section Breakdown
Divide the screenshot into horizontal bands (rows):
1. **Header area** — Title, subtitle, action buttons
2. **Content area** — Cards, forms, tables, KPI displays
3. **Footer area** — Action buttons, links, copyright
4. **Sidebar** — If present, note width and content (treat as fragment)

For each band, identify:
- How many columns?
- What components are in each column?
- What spacing separates this band from the next?

### Pass 3: Component Detail
For each component visible in the screenshot:
- What type is it? (button, textbox, heading, display, etc.)
- What variant/style? (contained vs outlined button, standard vs outlined textbox)
- What size? (small, medium, large)
- What color? (map to RXDS palette)
- What state? (default, disabled, error, active)

---

## Layout Identification

### Single Column (most common)
```
┌──────────────────────────────────┐
│  [Header: Title + Actions]       │
│  [Content rows stacked vertically]│
│  [Footer or Table]               │
└──────────────────────────────────┘
```
→ One `container-fluid` with sequential rows. FLAT architecture.

### Two-Column Split (login, onboarding)
```
┌────────────┬─────────────────────┐
│            │                     │
│  Left Side │    Right Side       │
│  (image/   │    (form/content)   │
│   video)   │                     │
│            │                     │
└────────────┴─────────────────────┘
```
→ Nested containers (exception to flat rule). Outer `container-fluid` (100vh, p-0) → row (no-gutters, stretch) → two col-6.

### Sidebar + Content (app layout)
```
┌──────┬───────────────────────────┐
│      │                           │
│ Nav  │    Main Content           │
│ Side │                           │
│ bar  │                           │
│      │                           │
└──────┴───────────────────────────┘
```
→ The sidebar is a **fragment**. Main content is the page. The parent uses a row with col-2 (sidebar) + col-10 (content).

### Card Grid (dashboard with cards)
```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ KPI  │ KPI  │ KPI  │ KPI  │ KPI  │ KPI  │
└──────┴──────┴──────┴──────┴──────┴──────┘
```
→ Single row with 6 × col-2 columns, each containing a `display` component.

### Table/List View
```
┌──────────────────────────────────┐
│ Header: Title + Buttons          │
│ Search bar                       │
│ ┌────────────────────────────┐   │
│ │  Column Headers            │   │
│ │  Row 1                     │   │
│ │  Row 2                     │   │
│ │  Row 3                     │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```
→ Container with header row, search row, then col-12 with `listview`.

---

## Color Identification

Map colors from the screenshot to RXDS tokens. Common visual cues:

| What You See | RXDS Token | Hex |
|---|---|---|
| Blue buttons or links | primary-500 | `#0066CC` |
| Dark navy text (headings) | neutral-900 | `#182858` |
| Medium gray text (body) | neutral-700 | `#344054` |
| Light gray text (captions) | neutral-500 | `#667085` |
| Very light gray text (placeholders) | neutral-400 | `#98A2B3` |
| Light gray background | neutral-50 | `#F9FAFB` |
| White card/panel background | white | `#FFFFFF` |
| Gray border/divider | neutral-200 | `#EAECF0` |
| Green success indicator | success-500 | `#0E9F63` |
| Red error indicator | error-500 | `#D92D20` |
| Yellow/amber warning | warning-500 | `#E68A00` |
| Light blue background (info) | info-25 | `#F5FAFF` |

If a color in the screenshot doesn't match any RXDS token exactly, use the closest token — don't use arbitrary hex values.

---

## Spacing Measurement

Estimate spacing in the screenshot by comparing to known element sizes:

### Reference Sizes
- Standard button height: ~36px (small), ~40px (medium)
- Standard input height: ~36px (small), ~40px (medium)
- Standard heading (h2): ~24px font, ~32px line height
- Standard body text: ~14px font, ~20px line height

### Spacing-to-Utility Mapping
| Visual gap | Approximate px | Preferred runtime class | Row margin |
|---|---|---|---|
| Tiny gap | ~4px | `mb-half-s` | `mb-half-s` |
| Small gap | ~8px | `mb-one-s` | `mb-one-s` |
| Standard field gap | ~16px | `mb-two-s` | `mb-two-s` |
| Section gap | ~24px | `mb-three-s` | `mb-three-s` |
| Large section gap | ~48px | `mb-six-s` | `mb-six-s` |

### Column Width Estimation
Map visible column proportions to Bootstrap grid:
| Visual proportion | cols |
|---|---|
| Full width | 12 |
| Half | 6 |
| Third | 4 |
| Quarter | 3 |
| Sixth | 2 |
| very narrow sidebar | 2-3 |
| main content next to sidebar | 9-10 |

---

## Component Identification

### Visual Cues → Component Type

| What You See | UIDL controlType |
|---|---|
| Large bold text at top | `heading` (h1-h3) |
| Section title | `heading` (h4-h6) |
| Regular paragraph text | `paragraph` |
| Small label above input | `textbox` caption, or `label` |
| Text input field with border | `textbox` (variant: "outlined") |
| Text input field with underline | `textbox` (variant: "standard") |
| Multi-line text area | `textarea` |
| Number input with +/- | `numeric` |
| Dropdown/select | `dropdown` |
| Searchable dropdown | `autosuggest` |
| Multiple-select chips | `multiselect` |
| On/off toggle | `switch` |
| Small square checkbox | `checkbox` |
| Radio button group | `radiogroup` |
| Date field with calendar icon | `datePicker` |
| Solid filled button | `button` (variant: "contained") |
| Bordered button | `button` (variant: "outlined") |
| Text-only button | `button` (variant: "text") |
| Small icon-only button | `actionIcon` |
| Link text | `Hyperlink` |
| Horizontal line | `separator` |
| KPI metric (label + value) | `display` |
| Small colored pill | `badge` or `tag` |
| Circular user photo | `avatar` |
| Group of avatars | `avatarGroup` |
| Data table with columns | `listview` |
| Search bar | `search` |
| Circular percentage | `circularProgress` |
| Bar chart / line chart | `chart` |
| Card with header/body/footer | `card` |
| Collapsible sections | `accordion` |
| Tab bar + content | `tab` |
| Step indicator + content | `stepper` |
| Modal/dialog overlay | `dialogModal` |
| Side panel | `panel` (or fragment) |
| Image | `image` |
| Video player | `video` |

---

## Typography Analysis

### Heading Detection
| Visual Size | Tag | Weight |
|---|---|---|
| Very large, bold (page title) | h1 | bold |
| Large, bold (section title) | h2 | bold |
| Medium-large (card title) | h3 | bold |
| Medium (sub-section) | h4 | bold or normal |
| Small heading | h5 | bold or normal |
| Very small heading | h6 | normal |

### Text Color Mapping
| Visual Appearance | Color |
|---|---|
| Dark, prominent text | `#182858` (neutral-900) |
| Standard body text | `#344054` (neutral-700) |
| Lighter, less important text | `#667085` (neutral-500) |
| Placeholder/disabled text | `#98A2B3` (neutral-400) |
| Blue link text | `#0066CC` (primary-500) |
| Red error text | `#D92D20` (error-500) |

---

## Common Screen Patterns

### Login Screen
- **Layout**: Two-column split (col-6 + col-6) or centered card
- **Left panel**: Dark background with logo/video/illustration
- **Right panel**: White card with form fields
- **Components**: heading (h3), textbox ×2, checkbox, button, Hyperlink, separator
- **Pattern**: Read `references/common-patterns.md` → "Two-Column Split" or "Centered Card Form"

### Dashboard
- **Layout**: Single column, flat architecture
- **Sections**: Header row → KPI row → Section header → Search → Data table
- **Components**: heading, paragraph, display ×6, button, actionIcon, search, listview
- **Pattern**: Read `references/common-patterns.md` → "Dashboard Page"

### Form/Settings Page
- **Layout**: Single column (or 2-column form layout)
- **Sections**: Title → Form sections with field rows → Action buttons
- **Components**: heading, textbox, dropdown, checkbox, radiogroup, button, separator
- **Pattern**: Read `references/common-patterns.md` → "Stacked Form Fields" or "Multi-Column Form Row"

### Data Table Page
- **Layout**: Single column with full-width table
- **Sections**: Header → Filters → Table
- **Components**: heading, button, actionIcon, search, listview
- **Pattern**: Standard dashboard pattern with `listview` as main content

---

## Conversion Checklist

After analyzing the screenshot, before writing UIDL:

- [ ] Identified the page type and layout pattern
- [ ] Mapped all visible colors to RXDS tokens
- [ ] Estimated all spacing values to Bootstrap classes
- [ ] Identified every visible component and its controlType
- [ ] Noted any fragments (sidebar, stepper steps, dialog content)
- [ ] Checked for special layout needs (fullscreen, nested containers)
- [ ] Planned the component tree (container → rows → columns → leaves)
- [ ] Read the relevant pattern from `references/common-patterns.md`
- [ ] Read `references/uidl-format-rules.md` for critical rules

Then proceed to SKILL.md Step 3 (Plan the Component Tree) and continue through the standard workflow.
