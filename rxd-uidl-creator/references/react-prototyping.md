# React Prototyping → UIDL (Method 3)

Build a working React prototype with `@ramco-platform/studio-components` (Nb* components),
then convert the React code to UIDL JSON. This method is ideal for complex pages where
you want to iterate visually before committing to UIDL format.

When the prototype is approved, the local saved artifact should still be a bare metadata array
under `/Users/admin/Codes/uidl/projects/*.json`. Only wrap it later for Designer import or API
save flows.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Component Imports & Usage](#component-imports--usage)
3. [Theme Activation](#theme-activation)
4. [SCSS Token System](#scss-token-system)
5. [Key Component Prop Interfaces](#key-component-prop-interfaces)
6. [Icon System](#icon-system)
7. [React → UIDL Conversion Process](#react--uidl-conversion-process)
8. [Prop Mapping (Nb* → UIDL)](#prop-mapping-nb--uidl)
9. [Working React Example](#working-react-example)

---

## Project Setup

### Starter Template (Vite + React + Nb* Components)

```bash
npm create vite@latest my-prototype -- --template react-ts
cd my-prototype
npm install @ramco-platform/studio-components @ramco-platform/react-icons react-query
```

### package.json dependencies
```json
{
  "dependencies": {
    "@ramco-platform/studio-components": "^1.1.0",
    "@ramco-platform/react-icons": "^0.0.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-query": "^3.39.0"
  }
}
```

### Required Wrapper (App.tsx or main.tsx)
Every prototype needs `QueryClientProvider` — most Nb* components depend on it internally:

```tsx
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your page components here */}
    </QueryClientProvider>
  );
}
```

---

## Component Imports & Usage

All components import from `@ramco-platform/studio-components`:

```tsx
import {
  NbButton,
  NbTextbox,
  NbHeading,
  NbParagraph,
  NbCard,
  NbCheckbox,
  NbSwitch,
  NbCombo,        // This is the new dropdown (replaces old NbCombo)
  NbDropdown,     // Alternative import name for combo
  NbNumeric,
  NbDatePicker,
  NbSearch,
  NbIcon,
  NbActionIcon,
  NbBadge,
  NbAvatar,
  NbSeparator,
  NbTab,
  NbPanel,
  NbAccordion,
  NbStepper,
  NbDialogModal,
  NbImage,
  NbVideo,
  NbHyperlink,
  NbDisplay,
  NbRadioGroup,
  NbCircularProgress,
  NbTag,
  NbSlider,
  ListView,       // Note: not NbListView — it's just ListView
  NbMultiSelect,
  NbPhone,
  NbAutosuggest,
  NbLoader,
  NbTree,
  NbTimeline,
} from '@ramco-platform/studio-components';
```

### Every component requires `id` prop
Unlike standard React, every Nb* component requires a unique `id: string`:

```tsx
// WRONG — missing id
<NbButton caption="Submit" />

// RIGHT
<NbButton id="btn-submit" caption="Submit" />
```

### Dual ID System
Components have an `isRVW` flag that switches ID format. For prototyping, ignore this — leave it unset or `false`.

---

## Theme Activation

The RXDS theme system activates via a CSS class on the `<html>` element.
Without this class, components render unstyled.

### In index.html:
```html
<!DOCTYPE html>
<html lang="en" class="theme-rxd">
  <head>...</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Or programmatically in main.tsx:
```tsx
document.documentElement.classList.add('theme-rxd');
```

Available themes: `theme-rxd` (RXDS default), `theme-hrp`, `theme-rds`

---

## Design Rules for React Prototypes

These rules are mandatory for all React prototypes:

Prototype the exact runtime wrapper tree you plan to convert:
`container-fluid -> row -> col-* -> Nb* component` (or one of the documented nested-container
exceptions). This keeps React -> UIDL conversion mechanical instead of interpretive. See
`runtime-foundations.md` before building new generators or helper flows.

If you are building React specifically for MCP-assisted conversion, stay inside the strict
round-trip subset: Bootstrap wrappers, current Nb* components, approved runtime utilities,
and no custom visual inline styles.

1. **Props-only styling** — ALL visual styling comes from component `variant`/`color`/`type`/`size` props only. No inline `style={{}}` with hex values or custom CSS on any Nb* component.
2. **Runtime utilities on wrappers first** — Use the real runtime/global utility classes (`mb-two-s`, `p-two-s`, `d-flex`, `align-items-*`) on structural wrapper `<div>` elements. Never keep a legacy `c~` prefix in React or UIDL, and only put utilities on Nb* component `className` when the rule explicitly requires it (for example `wd-100`, `text-center`).
3. **Header/Footer via props** — For Card, Panel, Accordion, Tab: configure headers and footers exclusively via their props. Never inject custom JSX into header/footer slots. The body is composable with other Nb* components.
4. **Never delete props** — To disable a feature, set its boolean to `false` or value to empty string. Never remove the prop entirely.
5. **Styling priority chain** — When something doesn't look right: (1) Adjust component props. (2) Use runtime/global utility classes on wrapper divs. (3) Pick a different component. (4) Never add inline styles.

### Layout Rules from the Runtime Stylesheets (CRITICAL)

These rules come from the runtime utility stylesheets (`_spacers.scss` and `_helpers.scss`) and apply to both React prototypes and UIDL output. If a design handoff still shows `c~mb-two-s`, strip `c~` and keep `mb-two-s`.

6. **Col classes depend on what's INSIDE the Col:**
   - **Col with Row children** → Only breakpoints (`col-lg-*`). **NO `d-flex`, `align-items-*`, `justify-content-*`**. These are unnecessary when Rows are direct children.
   - **Col with direct non-row children** → Use `d-flex flex-column` (vertical), `d-flex flex-row` (horizontal), or alignment utilities when the column directly positions leaf components or a single nested container/panel.
   - **Col padding** → Only `pt-*`, `pb-*`, `pl-*`, `pr-*` on Cols. Margin on Rows only (exception: Col with direct non-row children).
7. **Group components in a single Col** — Do NOT create a separate `Row > Col` for every component. Multiple components share one Col with `d-flex flex-column` (stacked) or `d-flex flex-row` (inline). Even detached DS components can share a Col.
8. **`wd-100` on components, not on layout** — Width classes like `wd-100` go on the component's `className`, not on the Col wrapper. Example: `<NbTextbox className="wd-100" />` or UIDL `"className": "wd-100"` on the textbox node.
9. **`text-left`/`text-right`/`text-center` on components** — Text alignment classes go on the component, not the Col.
10. **Margin on Rows, padding on Cols** — Row carries all spacing between sections (`mb-two-s`, `mb-three-s`). Col only gets padding (`pt-*`, `pb-*`, `px-two-s`, etc.). Never put margin on a Col unless it is positioning direct non-row children.
11. **Max ~3 levels of Row/Col nesting** — `Col > Row > Col > Component` is fine; deeper is not.

### Fast Dev Server (No Storybook)

For fast iteration, use the Vite dev server instead of Storybook:

1. **Use `yarn dev`** from `packages/rui-components/` — starts Vite on port 5173
2. **If you are in this workspace, prefer `./scripts/new-page.sh <PageName>`** — it scaffolds a foundation-aligned page in `src/stories/` and updates `src/dev.tsx`
3. **Use direct imports** for fast HMR — import from `../atoms/<name>/Nb<Name>` instead of the barrel `../atoms/index.tsx` to avoid parsing all 89 components

Example `dev.tsx`:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/dev-only.scss";
import MyPage from "./stories/MyPage";

document.documentElement.classList.add("theme-rxd");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MyPage />
  </React.StrictMode>
);
```

The `index.html` in `packages/rui-components/` already includes Bootstrap CSS CDN and `theme-rxd` on `<html>`.

---

### Fixing Slow First Load (Critical)

The dev server can have a **5–10s first page load** if not configured correctly. Two fixes are required:

#### 1. `server.warmup` in `vite.config.ts`

The root cause is Vite crawling 200+ source modules synchronously on first browser request (especially `NbListviewInline` which imports 20+ nested components). Fix with `server.warmup.clientFiles` to pre-transform at startup:

```ts
server: {
  port: 5173,
  hmr: true,
  warmup: {
    clientFiles: [
      "./src/dev.tsx",
      "./src/stories/MyPage.tsx",           // your page
      "./src/atoms/listviewinline/NbListviewInline.tsx",
      "./src/atoms/panel/NbPanel.tsx",
      "./src/atoms/card/NbCard.tsx",
      "./src/atoms/tab/NbTab.tsx",
      "./src/atoms/badge/NbBadge.tsx",
      "./src/atoms/button/NbButton.tsx",
      "./src/atoms/actionicon/NbActionIcon.tsx",
      "./src/atoms/heading/NbHeading.tsx",
      "./src/atoms/paragraph/NbParagraph.tsx",
      "./src/atoms/display/NbDisplay.tsx",
      "./src/atoms/separator/NbSeparator.tsx",
      "./src/atoms/progressbar/NbProgressBar.tsx",
      "./src/atoms/icon/NbIcon.tsx",
    ],
  },
},
```

Add the path of any new page to `clientFiles` each time you create one.

#### 2. `NbIcon.tsx` uses dynamic import (already fixed)

`NbIcon.tsx` was changed to load `@ramco-platform/react-icons/nb` (6MB) via `import()` with a module-level cache instead of a static `import *`. This is already committed — **do not revert it**. All icon instances share one cached promise so the bundle downloads once after first render, not before it.

---

## SCSS Token System

When prototyping, you can use the RXDS SCSS tokens directly for custom styling.
These are the actual design system values used by the components internally.

### Spacing Tokens

| Token Name | Value | px | Common Use |
|------------|-------|------|------------|
| `$quarter-s` | 0.125rem | 2px | Hairline gaps |
| `$half-s` | 0.25rem | 4px | Tight inline gaps |
| `$one-s` | 0.5rem | 8px | Icon-label gaps, compact padding |
| `$one-half-s` | 0.75rem | 12px | Small component padding |
| `$two-s` | 1rem | 16px | Standard field spacing, card padding |
| `$two-half-s` | 1.25rem | 20px | Section gaps |
| `$three-s` | 1.5rem | 24px | Card internal padding, group spacing |
| `$four-s` | 2rem | 32px | Section separation |
| `$five-s` | 2.5rem | 40px | Major section gaps |
| `$six-s` | 3rem | 48px | Large panel padding |
| `$eight-s` | 4rem | 64px | Page-level padding |
| `$ten-s` | 5rem | 80px | Login/hero content padding |
| `$twelve-s` | 6rem | 96px | Extra-large spacing |

### Preferred Spacing Utilities — Use the Real Runtime Classes

The runtime already ships spacing utilities generated from the RXDS token scale. Use those class
names directly in both React prototypes and UIDL. If a handoff still includes `c~mb-two-s`, that
prefix is just a naming wrapper from the handoff tool, not part of the real class name.

#### Runtime spacing utility classes
Pattern: `{m|p}{t|b|l|r|x|y}-{token}-s`

| Class | px | Token |
|-------|------|-------|
| `mb-half-s` | 4px | `$half-s` |
| `mb-one-s` | 8px | `$one-s` |
| `mb-one-half-s` | 12px | `$one-half-s` |
| `mb-two-s` | 16px | `$two-s` |
| `mb-two-half-s` | 20px | `$two-half-s` |
| `mb-three-s` | 24px | `$three-s` |
| `mb-four-s` | 32px | `$four-s` |
| `p-two-s` | 16px | `$two-s` |
| `px-three-s` | 24px | `$three-s` |
| `py-one-s` | 8px | `$one-s` |

#### Legacy handoff wrapper

| Handoff name | Keep in code / UIDL |
|--------------|---------------------|
| `c~mb-two-s` | `mb-two-s` |
| `c~p-two-s` | `p-two-s` |
| `c~text-center` | `text-center` |

**CRITICAL RULE:**
- **In React prototypes** → use the runtime/global utility classes directly (`mb-two-s`, `px-three-s`)
- **In UIDL JSON** → use the same runtime/global utility classes directly (`mb-two-s`, `p-two-s`, `wd-100`)
- **In design handoff** → if you see `c~...`, strip the prefix and keep the real class name
- **Bootstrap grid/flex classes still exist** for layout (`row`, `col-*`, `d-flex`, `justify-content-*`), but numeric Bootstrap spacing is no longer the preferred source of truth for RXDS spacing values

### Utility CSS Classes (available when using components)
These spacer classes ARE available in the component library and use the design token names:
- **Padding:** `p-half-s`, `p-one-s`, `p-two-s`, `p-three-s`, `p-four-s`, etc.
- **Margin:** `m-half-s`, `m-one-s`, `mb-two-s`, `mt-three-s`, etc.
- **Direction:** `mt-` (top), `mb-` (bottom), `ml-` (left), `mr-` (right), `mx-` (horizontal), `my-` (vertical)

Use these same class names in both React and UIDL. The only normalization step is removing a legacy `c~` prefix if it appears in a handoff artifact.

### Color Tokens (from SCSS theme)

The theme uses a different naming convention than the UIDL skill's RXDS palette.
These are the actual SCSS variable values:

| Color Family | Variable Pattern | Key Values |
|---|---|---|
| **Royal Blue (Primary)** | `$royalblue1-7` | `#00458A` (dark) → `#0073E6` (primary) → `#E6F1FD` (tint) |
| **Red (Error)** | `$red1-7` | `#5C080F` (dark) → `#CF1322` (primary) → `#FCE9EB` (tint) |
| **Green (Success)** | `$green1-7` | `#0D521E` (dark) → `#158932` (primary) → `#E8F3EB` (tint) |
| **Amber (Warning)** | `$yellow1-7` | `#996B16` (dark) → `#FFB224` (primary) → `#FFF7E9` (tint) |
| **Orange** | `$orange1-7` | `#995B09` → `#FF970F` → `#FFF5E7` |
| **Purple** | `$purple1-7` | `#413897` → `#6C5DFB` → `#F0EFFF` |
| **Grey Blue (Neutral)** | `$greyblue*` | `#17294A` (dark text) → `#5D6980` (body) |
| **Background** | `$background` | `#f7f9fb` |

**UIDL vs SCSS mapping:** The UIDL skill uses RXDS design-system color names (primary-500 = `#0066CC`, error-500 = `#D92D20`). The actual SCSS theme values differ slightly. When prototyping in React, use the SCSS tokens or component props. When converting to UIDL, use the RXDS palette from `references/design-system-guidelines.md`.

### Shadow Tokens

| Token | CSS Value |
|-------|-----------|
| `$rxd-shadow-yaxis-down-xs` | `0px 1px 2px 0px rgba(24,40,88,0.05)` |
| `$rxd-shadow-yaxis-down-sm` | `0px 1px 2px 0px rgba(24,40,88,0.06), 0px 1px 3px 0px rgba(24,40,88,0.10)` |
| `$rxd-shadow-yaxis-down-md` | `0px 2px 4px -2px rgba(24,40,88,0.06), 0px 4px 8px -2px rgba(24,40,88,0.10)` |
| `$rxd-shadow-yaxis-down-lg` | `0px 4px 6px -2px rgba(24,40,88,0.03), 0px 12px 16px -4px rgba(24,40,88,0.08)` |
| `$rxd-shadow-yaxis-down-xl` | `0px 8px 8px -4px rgba(24,40,88,0.03), 0px 20px 24px -4px rgba(24,40,88,0.08)` |
| `$rxd-shadow-yaxis-down-2xl` | `0px 24px 48px -12px rgba(24,40,88,0.18)` |
| `$rxd-shadow-yaxis-down-3xl` | `0px 32px 64px -12px rgba(24,40,88,0.14)` |

Brand shadow color: Always `rgba(24,40,88, α)` — never black.

### Border Radius Tokens

| Token | Value |
|-------|-------|
| `$border-radius-xsmall` | 4px |
| `$border-radius-small` | 8px |
| `$border-radius-medium` | 12px |
| `$border-radius-large` | 16px |

### Font Sizes

Key sizes: `$font-xs` (12px), `$font-s` (13px), `$font-m` (14px), `$font-l` (16px), `$font-xl` (20px), `$font-2xl` (24px)

### Font Weights

`$font-regular` (400), `$font-medium` (500), `$font-semibold` (600), `$font-bold` (700)

---

## Key Component Prop Interfaces

### NbButton
```typescript
{
  id: string;                    // REQUIRED
  caption?: string;
  variant?: "text" | "contained" | "outlined" | "primary" | "secondary";
  color?: "primary" | "default" | "secondary" | "warning" | "positive" | "negative" | "neutral";
  size?: "xsmall" | "small" | "medium" | "large";
  disabled?: boolean;
  startIcon?: any;               // NbIcon component or iconKey
  endIcon?: any;
  className?: string;
  tooltip?: any;
  hideCaption?: boolean;
}
// Defaults: size="small", color="default", variant="contained"
```

### NbTextbox
```typescript
{
  id: string;                    // REQUIRED
  name: string;                  // REQUIRED (not needed in UIDL)
  value: string;                 // REQUIRED (optional in UIDL)
  caption?: string;
  variant?: "standard" | "material" | "label-left";
  size?: "small" | "medium" | "large";
  placeholder?: string;
  inputFieldType?: "text" | "password";
  enableInheritWidth?: boolean;  // set true for full-width
  disabled?: boolean;
  mandatory?: boolean;
  error?: boolean;
  hideCaption?: boolean;
  isReadonly?: boolean;
}
```

### NbCard
```typescript
{
  id: string;                    // REQUIRED
  enableHeader?: boolean;        // default true
  enableBody?: boolean;          // default true
  enableFooter?: boolean;        // default true
  enableMedia?: boolean;         // default false
  enablePadding?: boolean;       // default true
  type?: "with-border" | "with-shadow" | "without-border-shadow";
  size?: "small" | "medium" | "large" | "xlarge";
  header?: {
    title?: any;
    showOption?: boolean;
    showAvatar?: boolean;
    avatarConfig?: NbAvatarProps;
    showCheckbox?: boolean;
    showBadge1?: boolean;
    menu?: Array<{ code, desc, icon }>;
  };
  body?: any;                    // React children for body
  footer?: any;                  // React children for footer
  statusBorderColor?: "purple" | "green" | "red" | "yellow" | "blue" | "orange" | "grey";
  hideCaption?: boolean;
}
```

### NbDisplay
```typescript
{
  displayTitle?: string;         // Label text (e.g. "Total Orders")
  displayValue?: string;         // Value text (e.g. "1,234")
  type?: "form" | "default";
  size?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
  displayPriority?: "top" | "bottom" | "labelvalue" | "valuelabel";
  icon?: boolean;
  hideTitle?: boolean;
  hideValue?: boolean;
}
```

### NbIcon
```typescript
{
  iconKey: any;                  // Icon identifier string (e.g. "NbFilterFilled")
  size?: "3XS" | "2XS" | "XS" | "S" | "M" | "L" | "XL" | "2XL";
  color?: string;                // Hex color
  title?: string;                // Tooltip text
}
```

---

## Icon System

Icons come from `@ramco-platform/react-icons`. There are 600+ SVG icons.

### Naming Convention
SVG filename → `Nb` prefix + PascalCase:
- `filter--filled.svg` → `NbFilterFilled`
- `settings--filled.svg` → `NbSettingsFilled`
- `add-file--filled.svg` → `NbAddfileFilled`
- `more-vertical--filled.svg` → `NbMoreVerticalFilled`
- `search--outlined.svg` → `NbSearchOutlined`
- `close--filled.svg` → `NbCloseFilled`
- `edit--filled.svg` → `NbEditFilled`
- `delete--filled.svg` → `NbDeleteFilled`
- `download--filled.svg` → `NbDownloadFilled`
- `upload--filled.svg` → `NbUploadFilled`
- `check--filled.svg` → `NbCheckFilled`
- `info--filled.svg` → `NbInfoFilled`
- `warning--filled.svg` → `NbWarningFilled`

### Usage in React
```tsx
import { NbIcon } from '@ramco-platform/studio-components';

<NbIcon iconKey="NbFilterFilled" size="M" />
```

### Usage in UIDL (actionIcon)
In UIDL, the `actionIcon` component uses the icon name WITHOUT the `Nb` prefix:
```json
{ "controlType": "actionIcon", "Icon": "FilterFilled" }
```

---

## React → UIDL Conversion Process

When converting a working React prototype to UIDL JSON, follow this process:

### Step 1: Map the Layout
1. Identify the top-level container — becomes the root `container` (fluid)
2. Find all rows (flexbox rows, grid rows, or explicit `<div className="row">`) → `row` nodes
3. Map column widths to Bootstrap grid (`col-lg-*`) → `column` nodes
4. Everything else is a leaf component

### Step 2: Convert Components
For each Nb* component in the JSX:
1. Look up the `controlType` from the mapping table in SKILL.md
2. Copy over the props, adjusting names where they differ (see Prop Mapping below)
3. Add the required UIDL designer fields (`isDragging`, `selectedComponentId`, `componentDropped`, `index`, `accept`, `dropPosition`)
4. Add `visibility: true` and `layout.colLayout` to every node
5. Add `currentLayout: "DESKTOP"` to containers, rows, and columns
6. Preserve the runtime children contracts exactly: `card` named-slot children, `panel`/`accordion`/`Div`/`form` flat children arrays, `tab` keyed children object

### Step 3: Handle Prop Differences
Some props work differently between React and UIDL:
- **Button `color`**: React has `"positive"/"negative"/"neutral"/"default"` — UIDL uses `"success"/"error"/"secondary"/"primary"`
- **Button `variant`**: React has `"primary"/"secondary"` aliases — UIDL uses `"contained"/"outlined"`
- **Button `size`**: React has `"xsmall"` — UIDL doesn't, use `"small"`
- **Textbox `variant`**: React uses `"standard"/"material"/"label-left"` — UIDL uses `"standard"/"outlined"/"filled"`
- **Textbox `name`** and `value`: Required in React, optional in UIDL
- **Container styles**: React uses inline `style={{}}` — UIDL uses a JSON-stringified `styles` prop
- **Heights**: In UIDL, always put height in `layout.colLayout.lg.height`, never in styles

### Step 4: Apply UIDL Rules
Run through the checklist in SKILL.md Step 5 to catch common mistakes:
- Root is array, flat architecture, no random inline CSS, designer fields on all nodes, canonical children patterns, etc.

### Step 5: Handle Fragments
If the prototype includes embedded components like sidebars, stepper contents, or dialog forms:
1. Extract those sections into separate UIDL JSON files (fragments)
2. In the parent page, reference them via `fragmentId` + `pageId` props on the container component (stepper, dialog, etc.)

---

## Prop Mapping (Nb* → UIDL)

### Color Mapping
| Nb* React `color` | UIDL `color` |
|---|---|
| `"default"` | `"primary"` |
| `"primary"` | `"primary"` |
| `"secondary"` | `"secondary"` |
| `"positive"` | `"success"` |
| `"negative"` | `"error"` |
| `"neutral"` | `"secondary"` |
| `"warning"` | `"warning"` |

### Variant Mapping (Button)
| Nb* React `variant` | UIDL `variant` |
|---|---|
| `"contained"` | `"contained"` |
| `"outlined"` | `"outlined"` |
| `"text"` | `"text"` |
| `"primary"` (alias) | `"contained"` |
| `"secondary"` (alias) | `"outlined"` |

### Variant Mapping (Textbox)
| Nb* React `variant` | UIDL `variant` |
|---|---|
| `"standard"` | `"standard"` |
| `"material"` | `"outlined"` |
| `"label-left"` | `"standard"` (with layout) |

### Size Mapping (Button)
| Nb* React `size` | UIDL `size` |
|---|---|
| `"xsmall"` | `"small"` |
| `"small"` | `"small"` |
| `"medium"` | `"medium"` |
| `"large"` | `"large"` |

### Icon Mapping
| Nb* React | UIDL |
|---|---|
| `<NbIcon iconKey="NbFilterFilled" />` | `actionIcon.Icon = "FilterFilled"` (no Nb prefix) |
| `<NbIcon size="M" />` | `icon.size` or use actionIcon `size: "medium"` |

---

## Working React Example

A simple dashboard page using Nb* components:

```tsx
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  NbHeading,
  NbParagraph,
  NbButton,
  NbDisplay,
  NbSearch,
  NbSeparator,
} from '@ramco-platform/studio-components';

const queryClient = new QueryClient();

function DashboardPage() {
  return (
    <div className="container-fluid" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header row */}
      <div className="row mb-three-s" style={{ alignItems: 'center' }}>
        <div className="col-lg-6">
          <NbHeading id="heading-title" content="Dashboard" tag="h2" weight="bold" color="#182858" />
          <NbParagraph id="para-subtitle" content="Overview of your business metrics" color="#667085" />
        </div>
        <div className="col-lg-6 d-flex justify-content-end">
          <NbButton id="btn-export" caption="Export" variant="outlined" color="secondary" />
          <NbButton id="btn-add" caption="Add New" variant="contained" color="primary" className="ml-two-s" />
        </div>
      </div>

      {/* KPI Stats row */}
      <div className="row mb-two-s">
        {['Total Orders', 'Revenue', 'Active Users', 'Conversion', 'Avg Order', 'Growth'].map((title, i) => (
          <div key={i} className="col-lg-2 col-md-4 col-sm-6">
            <NbDisplay
              id={`display-kpi-${i}`}
              displayTitle={title}
              displayValue={`${(i + 1) * 234}`}
              type="default"
              size="medium"
              alignment="left"
              displayPriority="top"
            />
          </div>
        ))}
      </div>

      <NbSeparator id="sep-1" orientation="horizontal" />

      {/* Search row */}
      <div className="row mb-two-s">
        <div className="col-lg-4">
          <NbSearch id="search-main" searchType="basic" size="md" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>
  );
}
```

### Converting this to UIDL
The React above converts to this UIDL structure:
```
container-page (fluid, bg: #F9FAFB)
  ├── row-header (mb-three-s, alignItems: center, justifyContent: between)
  │    ├── col(6) → heading "Dashboard" (h2, bold, #182858) + paragraph
  │    └── col(6, d-flex justify-content-end) → button "Export" + button "Add New"
  ├── row-stats (mb-two-s)
  │    └── 6 × col(2) → display components
  ├── row-separator → col(12) → separator
  └── row-search (mb-two-s) → col(4) → search
```

Each Nb* prop maps to a UIDL prop following the mapping tables above. The `id` prop becomes the UIDL node `id`, and all designer fields are added automatically.
