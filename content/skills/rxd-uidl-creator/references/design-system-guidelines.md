# RXDS Design System Guidelines for UIDL

When building UIDL pages, apply these RXDS design system rules to produce screens that look professional and consistent.

## Color Palette

Never use arbitrary hex values. Use the RXDS token palette:

### Primary Colors
| Token | Hex | Use for |
|-------|-----|---------|
| primary-25 | `#F5FAFF` | Light backgrounds, hover states |
| primary-50 | `#EFF8FF` | Selected row backgrounds |
| primary-100 | `#D1E9FF` | Active backgrounds |
| primary-500 | `#0066CC` | Buttons (contained), links, active elements |
| primary-700 | `#004C99` | Pressed/active primary |

### Semantic Colors
| Token | Hex | Use for |
|-------|-----|---------|
| success-500 | `#0E9F63` | Success messages, positive status |
| warning-500 | `#E68A00` | Warning messages, caution states |
| error-500 | `#D92D20` | Error messages, destructive actions |

### Neutral Colors (most frequently used)
| Token | Hex | Use for |
|-------|-----|---------|
| neutral-900 | `#182858` | Primary headings, dark text |
| neutral-700 | `#344054` | Body text, secondary headings |
| neutral-500 | `#667085` | Muted text, captions |
| neutral-400 | `#98A2B3` | Placeholder text, disabled |
| neutral-200 | `#EAECF0` | Borders, dividers, separator lines |
| neutral-100 | `#F2F4F7` | Subtle backgrounds (alt rows) |
| neutral-50 | `#F9FAFB` | Page backgrounds |
| white | `#FFFFFF` | Card/panel/input backgrounds |

### Applying Colors in UIDL

**Heading/Paragraph text color:**
```json
{ "controlType": "heading", "color": "#182858" }
```

**Container background:**
```json
{ "styles": "{\"backgroundColor\":\"#F9FAFB\"}" }
```

**Button:** The button component uses `status` prop (Default/Success/Warning/Error) — the design system maps these to the semantic palette automatically. Don't set custom button colors.

---

## Spacing Rules

RXDS uses a 4px grid. Map these to UIDL margin/padding:

| Design intent | px | UIDL implementation |
|---------------|------|---------------------|
| Tight gap (icon-label) | 4–8px | Row margin: `"mb-half-s"` or `"mb-one-s"` |
| Field spacing | 16px | Row margin: `"mb-two-s"` |
| Group separation | 24px | Row margin: `"mb-three-s"` |
| Section separation | 32px | Row margin: `"mb-four-s"` |
| Card/panel padding | 16–24px | Wrapper `className`: `"p-two-s"` or `"p-three-s"` |
| Login/hero padding | 40–80px | Container styles: `"padding": "60px 80px"` |

**Key rules:**
- Between form fields vertically: use `"mb-two-s"` (16px) on rows
- Between label and input: no extra margin (they belong in the same column)
- Between form groups/sections: use `"mb-three-s"` or `"mb-four-s"`
- Horizontal spacing inside cards: pad the container, not individual columns

---

## Shadow Tokens

Use RXDS shadow tokens in container styles, not arbitrary box-shadow values:

| Elevation | CSS value | When |
|-----------|-----------|------|
| xs | `0 1px 2px 0 rgba(24,40,88,0.05)` | Input focus, subtle lift |
| sm | `0 1px 2px 0 rgba(24,40,88,0.06), 0 1px 3px 0 rgba(24,40,88,0.1)` | Cards, panels |
| md | `0 2px 4px -2px rgba(24,40,88,0.06), 0 4px 8px -2px rgba(24,40,88,0.1)` | Elevated cards, dropdown menus |
| lg | `0 4px 6px -2px rgba(24,40,88,0.03), 0 12px 16px -4px rgba(24,40,88,0.08)` | Drawers, modals |

**In UIDL:**
```json
{
  "styles": "{\"boxShadow\":\"0 1px 2px 0 rgba(24,40,88,0.06), 0 1px 3px 0 rgba(24,40,88,0.1)\"}"
}
```

**Brand shadow color:** Always `rgba(24,40,88, α)`, never `rgba(0,0,0, α)`.

---

## Component Selection Quick Guide

When deciding which `controlType` to use, follow RXDS guidelines:

### Input Types
| User need | controlType | Why |
|-----------|-------------|-----|
| Single-line text | `textbox` | Input Field — most common |
| Multi-line text | `textarea` | TextArea |
| Formatted text (bold, lists) | `richtextbox` | Rich Text Box |
| Number only | `numeric` | Numeric (has step controls) |
| Formatted pattern (SSN, card) | `maskfield` | Mask Field |
| Phone with country code | `phone` | Phone |
| Color value | `colorpicker` | ColorPicker |

### Selection Types
| User need | controlType | Why |
|-----------|-------------|-----|
| One from ≤15 fixed options | dropdown | Short list → dropdown |
| One from large/dynamic set | `autosuggest` | Searchable typeahead |
| Multiple picks from list | `multiselect` | Chips display |
| One from 2–7 visible options | `radiogroup` | Always visible |
| Multiple independent toggles | `checkbox` | Multi-select with labels |
| Instant on/off toggle | `switch` | NOT for form-submit scenarios |

### Common Mistakes to Avoid
- **Don't use `switch` in forms.** Switch implies immediate effect. For form fields that submit later, use `checkbox`.
- **Don't use `textbox` for numbers.** Use `numeric` — it enforces numeric input.
- **Don't use `dropdown` with 50+ options.** Use `autosuggest` for large or searchable lists.
- **Don't use `heading` for field labels.** Use `label` paired with the input.
- **Don't use `paragraph` for page titles.** Use `heading` with the semantic tag (h1-h6).
- **Don't use `button` for navigation links.** Use `Hyperlink` for page navigation.

---

## Accessibility in UIDL

Every UIDL page should meet these WCAG AA standards:

1. **Text contrast:** Use neutral-900 (`#182858`) or neutral-700 (`#344054`) for text on white/light backgrounds. Never use neutral-400 or lighter for readable text.

2. **Form labels:** Every `textbox`, `dropdown`, `checkbox`, and other inputs must have:
   - A `caption` (visible label) — or `hideCaption: true` with an accessible alternative
   - Placeholder text alone is NOT sufficient for accessibility

3. **Error states:** When showing validation errors, use:
   - `status: "error"` on the input component
   - A visible error message below the field
   - Error color: `#D92D20` (error-500)

4. **Button contrast:** Primary (contained) buttons are accessible by default. For outlined/text buttons on colored backgrounds, verify contrast.

5. **Focus order:** Arrange form fields in logical top-to-bottom, left-to-right order matching the tab sequence via `index` values.

---

## Visual Patterns

### Login Page
- Background: info-25 (`#F5FAFF`) or a dark branded panel with video
- Card: white background, shadow-sm, padding 40–60px
- Heading: h2 or h3, neutral-900
- Fields: full-width inputs with labels, 16px vertical gap
- Button: Primary contained, full-width or right-aligned
- Links: Hyperlink for "Forgot password?" — not a button

### Dashboard
- **FLAT architecture** — single container-fluid with all rows at top level, no nested containers
- Page background: minimal — `styles: "{\"backgroundColor\":\"\"}"` or neutral-50 (`#F9FAFB`) on root container only
- **NO card wrappers** — don't wrap display components in containers with borderRadius/boxShadow/border. Place display components directly in columns. The component SCSS handles appearance.
- KPI metrics: `display` component with `displayTitle` and `displayValue`, placed directly in `col-2` columns (6 per row)
- Headings: h2 for page title (neutral-900), h4 for section titles, paragraph for subtitles (neutral-500)
- Action buttons: `outlined` variant with `secondary` color for navigation actions (To Do, Analytics)
- Action icons: `actionIcon` with **required** `badgeFieldProps`, `badgeCountConfig`, `badgeIconConfig` — crashes without them
- Search: `search` component with `searchType: "basic"`, `size: "md"` in a `col-4` column
- Data table: `listview` with `fieldDefs`, `toolSettings`, `rowSettings`, `noDataScreen` sub-objects
- Status indicators: Badge with semantic colors (success-500, warning-500, error-500)
- Row spacing: `mb-three-s` for header row, `mb-two-s` for content rows

### Form Page
- **FLAT architecture** — same container-fluid → row → column → leaf pattern
- Background: white or neutral-50 on root container only
- Section headings: h4, neutral-900, `mb-three-s`
- Fields: 2-column grid for short fields, full-width for long text
- Required indicators: Label with asterisk
- Actions: Primary button (Submit) + Secondary button (Cancel)
- Spacing: `mb-two-s` between field rows, `mb-four-s` between sections

### Data View (Table/List)
- **FLAT architecture** — listview goes directly in a column, not wrapped in a card container
- Use ListView for toolbar + bulk actions + column config
- Always include `toolSettings`, `rowSettings`, `noDataScreen` on the listview node
- Page header: heading + action buttons in the same row (col-6 + col-6)
- Empty state via `noDataScreen` config (not a separate component)
- Search: separate row above the listview with a `search` component

### Component Showcase / Catalog
- **FLAT architecture** — single container-fluid, card sections with `enableHeader: false`, `enableFooter: false`
- Section wrapper: `card` with `type: "with-border"`, `hideCaption: true`, body-only display
- Section heading: `heading` with `tag: "h4"` above each card
- Sub-labels inside card body: `heading` with `tag: "h6"`, color neutral-700 (`#344054`)
- Multiple components in row: column `className: "d-flex flex-wrap align-items-center"`, each leaf `className: "mr-two-s mb-two-s"`
- No custom CSS — all visuals via component props and runtime/global utility classes

---

## Component Variant Quick Reference

### Button Colors (6)
`primary` · `secondary` · `success` · `error` · `warning` · `info`

### Button Variants (3)
`contained` (filled background) · `outlined` (border only) · `text` (no border/background)

### Badge Colors (6)
Same as button: `primary` · `secondary` · `success` · `error` · `warning` · `info`

### Avatar Types & Statuses
- Types: `text` · `icon` · `image`
- Statuses: `online` · `offline` · `away` · `active` · `inactive` · `blocked`

### Card Styles
- Types: `with-border` · `with-shadow` · `without-border-shadow`
- Sizes: `small` · `medium` · `large` · `xlarge`
- Status border colors: `purple` · `green` · `red` · `yellow` · `blue` · `orange` · `grey`

### Heading Weights
`normal` · `bold` · `lighter` · `bolder`

---

## Fragment Design Patterns

Fragments are reusable UIDL pieces loaded inside container components. Design each fragment as a self-contained page.

### Sidebar Fragment
- Background: white or neutral-50
- Width: col-2 or col-3 in parent layout
- Content: navigation links (Hyperlink), section headings (h5/h6), icons/actionIcons, separator dividers
- Height: match parent container (100%, or use lg.height)

### Stepper Step Fragment
- Each step is its own UIDL page
- Typically form-based: textbox, dropdown, checkbox, radiogroup fields
- Standard form layout: stacked fields with `mb-two-s` spacing
- Action buttons (Next/Previous) are handled by the stepper component, not the fragment

### Dialog Fragment
- Constrained width (dialog sets max-width)
- Form fields or confirmation content
- Keep it simple — complex multi-section layouts don't work well in modals

### Tab Panel Fragment
- Each tab's content is a separate fragment
- Same layout rules as a regular page
- Consider tab switching performance — keep fragments lean
