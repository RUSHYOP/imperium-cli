# Component Decision Engine

When the user describes a page intent (e.g. "employee onboarding form", "analytics dashboard"),
use these decision trees to select appropriate controlTypes and layout patterns **without explicit instructions**.

---

## 1. Input Field Selection

| User Describes | controlType | Key Props | Col Width (lg) |
|---|---|---|---|
| Name, email, address, free text | `textbox` | `inputFieldType: "text"`, `enableInheritWidth: true` | 6 or 4 |
| Password | `textbox` | `inputFieldType: "password"`, `enableInheritWidth: true` | 6 |
| Long description, notes, comments | `textarea` | `enableInheritWidth: true` | 12 |
| Number, quantity, amount | `numeric` | — | 4 or 3 |
| Date (birthday, start date) | `datePicker` | — | 4 or 3 |
| Date + time (appointment, deadline) | `dateTimepicker` | — | 4 |
| Country, status, category (≤20 items) | `dropdown` | `options: "[]"` | 4 or 6 |
| City, employee name (>20 items, searchable) | `autosuggest` | — | 6 |
| Multiple tags, skills, categories | `multiselect` | — | 6 |
| Yes/no immediate toggle (dark mode, notifications) | `switch` | — | 6 |
| Yes/no on form submit (terms, opt-in) | `checkbox` | `title: "..."` | 6 or 12 |
| One-of-few options (gender, priority) | `radiogroup` | `alignment: "horizontal"` | 6 or 12 |
| File upload | `fileUpload` | — | 12 |
| Rich text content | `richTextEditor` | — | 12 |
| Search/filter bar | `search` | — | 4 |

### Anti-Patterns
- **NEVER** use `textbox` when a `dropdown` or `datePicker` is more appropriate
- **NEVER** use `dropdown` for >20 items — use `autosuggest` (searchable)
- **NEVER** use `checkbox` for immediate state change — use `switch`
- **NEVER** use `radiogroup` for >5 options — use `dropdown`
- **NEVER** use `textarea` for single-line input — use `textbox`

---

## 2. Action & Button Selection

| User Describes | controlType | Key Props |
|---|---|---|
| Primary action (Submit, Save, Create) | `button` | `variant: "contained"`, `status: "default"` |
| Secondary action (Cancel, Back) | `button` | `variant: "outlined"`, `status: "default"` |
| Tertiary / subtle (Skip, Learn more) | `button` | `variant: "text"`, `status: "default"` |
| Destructive action (Delete, Remove) | `button` | `variant: "contained"`, `status: "negative"` |
| Icon-only action (filter, refresh, settings) | `actionIcon` | `Icon: "FilterFilled"`, + badge configs |
| Action with dropdown (Export → CSV/PDF) | `splitButton` | `options: "[]"` |
| Navigation link (View all, See details) | `Hyperlink` | `content: "View all"` |
| Menu with multiple actions | `menuButton` | — |

### Button Hierarchy Rule
Every form/page should have clear visual hierarchy:
- **One** primary contained button (most important action)
- **Zero or more** outlined buttons (secondary actions)
- **Zero or more** text buttons (tertiary actions)
- Never multiple contained buttons side-by-side (confuses user priority)

---

## 3. Data Display Selection

| User Describes | controlType | Key Props |
|---|---|---|
| Single KPI value | `display` | `displayTitle`, `displayValue`, `type: "default"` |
| List of records with columns | `listview` | `fieldDefs`, `toolSettings`, `rowSettings` |
| Tabular comparison data | `listview` | (UIDL does not have a separate "table" — use listview) |
| Hierarchical/tree data | `tree` | — |
| Image content | `image` | `src` |
| Video content | `video` | — |
| Progress indicator | `progressBar` | `type: "linear"` or `"circular"` |
| Status tag/label | `badge` | `color`, `content` |

---

## 4. Layout Container Selection

| User Describes | controlType | Key Props |
|---|---|---|
| Visual grouping with border | `card` | `cardConfig.enableBody: true`, `cardConfig.type: "with-border"` |
| Collapsible section | `panel` | `isPanelOpen: true`, `header.title: "..."` |
| Multiple collapsible sections | `accordion` | (array of panel-like sections) |
| Tabbed views of same content | `tab` | — |
| Step-by-step flow | `stepper` | `fragment` children with pageIds |
| Modal dialog | `dialogModal` | `body` (string), `fragmentId` |
| Generic wrapper | `Div` | `className` |
| Side navigation + content | `Div` with flex | Two columns: nav list + content area |

### When to Use Card vs Panel vs Div
- **Card**: Visual grouping with optional header (avatar, title, subtitle). Best for dashboards, profile sections, KPI tiles.
- **Panel**: Collapsible content section with header bar. Best for settings pages, long forms with sections.
- **Accordion**: Multiple panels where only one/some are open. Best for FAQ, grouped settings.
- **Div**: Invisible wrapper when you just need CSS flex/grid control. No visual border/shadow.

---

## 5. Page Intent → Component Palette

### Form Pages (registration, onboarding, settings)
```
Skeleton:
  container-fluid
    row-header → col(12) → heading (h2) + paragraph
    row-fields → col(6) + col(6) → textbox, dropdown, datePicker
    row-fields → col(6) + col(6) → more fields
    row-textarea → col(12) → textarea
    row-actions → col(12) → button (contained) + button (outlined)

Components: heading, paragraph, textbox, dropdown, datePicker, checkbox, switch, button
Spacing: rows mb-three-s, field labels via caption
Color: neutral page bg (#F9FAFB), white card bg if grouped
```

### Dashboard Pages (analytics, overview, metrics)
```
Skeleton:
  container-fluid
    row-header → col(6) + col(6) → heading + action buttons/icons
    row-kpis → col(2) × 6 → display components
    row-section → col(6) + col(6) → heading + actionIcons
    row-data → col(12) → listview

Components: heading, paragraph, display, listview, actionIcon, button, badge, search
Spacing: header mb-three-s, stats mb-two-s
Color: white surface cards for KPIs, primary accent on metrics
```

### Login / Auth Pages
```
Skeleton:
  container-fluid (100vh, p-0)
    row (no-gutters h-100, alignItems: stretch)
      col(8) → container → video/image (dark panel hero)
      col(4) → container → card with form
        row → heading "Welcome"
        row → textbox (email)
        row → textbox (password)
        row → checkbox "Remember me"
        row → button "Sign In"
        row → Hyperlink "Forgot password?"

Components: heading, textbox, checkbox, button, Hyperlink, image/video
Layout: Two-column split (8/4), exception to flat rule
Color: dark left panel, white right panel
```

### Data Listing Pages (table, search results)
```
Skeleton:
  container-fluid
    row-header → col(6) + col(6) → heading + button (Create New)
    row-filters → col(3) + col(3) + col(3) + col(3) → search + dropdowns
    row-table → col(12) → listview

Components: heading, search, dropdown, listview, button, actionIcon, badge
Spacing: filter row mb-two-s
```

### Detail / Profile Pages
```
Skeleton:
  container-fluid
    row-header → col(12) → heading + paragraph
    row-content → col(12) → tab
      tab-1: container → rows → display fields
      tab-2: container → rows → form fields
      tab-3: container → rows → listview

Components: heading, tab, display, textbox, dropdown, listview, badge, image
```

### Settings Pages
```
Skeleton:
  container-fluid
    row-header → col(12) → heading
    row-section → col(12) → panel "General"
      body → container → rows → switch + labels
    row-section → col(12) → panel "Notifications"
      body → container → rows → checkbox + labels
    row-actions → col(12) → button "Save"

Components: heading, panel, switch, checkbox, textbox, dropdown, button
```

### Wizard / Stepper Pages
```
Skeleton:
  container-fluid
    row → col(12) → stepper
      step-1: fragment (personal info form)
      step-2: fragment (address form)
      step-3: fragment (review & submit)

Components: stepper, fragments with form content, button (Next/Back/Submit)
```

---

## 6. Responsive Breakpoint Defaults

| Page Type | lg (desktop) | md (tablet) | sm (mobile) |
|---|---|---|---|
| Form 2-column | col: 6 + 6 | col: 6 + 6 | col: 12 + 12 |
| Form 3-column | col: 4 + 4 + 4 | col: 6 + 6 + 12 | col: 12 × 3 |
| Dashboard KPIs | col: 2 × 6 | col: 4 × 3 | col: 6 × 2 |
| Login split | col: 8 + 4 | col: 12 (hide hero) | col: 12 |
| Data listing filters | col: 3 × 4 | col: 6 × 2 | col: 12 |
| Full width content | col: 12 | col: 12 | col: 12 |

---

## 7. Common Row Patterns Quick Reference

```
# Page header (title + actions)
row [mb-three-s] → col(6) heading + col(6) buttons [justify-content-end]

# Form field pair
row [mb-two-s] → col(6) field + col(6) field

# Full-width field
row [mb-two-s] → col(12) textarea/richtext

# Button bar
row [mb-two-s] → col(12) [d-flex gap] → button(contained) + button(outlined)

# KPI strip
row [mb-two-s] → col(2) × N → display components

# Section divider
row [mb-two-s] → col(12) → heading(h4) or separator
```
