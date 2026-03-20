---
name: uidl-creator
description: "Create UIDL JSON pages and fragments for the Swift Runtime rendering engine using any of three methods: (1) Direct UIDL — write JSON from text descriptions, (2) Screenshot Conversion — convert mockups/screenshots to pixel-perfect UIDL, (3) React Prototyping — build a working prototype with @ramco-platform/studio-components (Nb* components, RXDS design system, SCSS tokens) then convert the React code to UIDL JSON. Fragments are reusable UIDL pieces (sidebars, steppers, navigation) loaded via fragmentId. Use this skill whenever the user wants to create a UIDL page, convert a screenshot/mockup to UIDL, prototype with React components then convert, build a UI layout, mentions UIDL/fragments in any context, says 'create a page', 'build a screen', 'make a form', 'design a layout', 'create a fragment', 'prototype a page', or 'convert this to UIDL' in the UIDL/Swift Runtime project context."
---

# UIDL Creator

This skill creates UIDL (UI Description Language) JSON files that render into web pages
through the Swift Runtime engine. The runtime uses a Bootstrap 4 grid system with a
component hierarchy of Container → Row → Column → Leaf Components.

This skill is foundation-preserving. Reuse the existing references, templates, validator, and
scaffolders inside `uidl-creator`; do not invent alternate UIDL dialects, random helper
conventions, or non-Bootstrap layout abstractions. Any helper or React prototype must still emit
the same canonical UIDL that the runtime and Studio already parse today.

Local authoring is now metadata-first:
- Save page files under `/Users/admin/Codes/uidl/projects/*.json`
- Store a bare UIDL metadata array locally
- Add `pageId` only when exporting for Designer import or API save

Machine-readable authoring catalogs now live under `references/catalogs/`. Prefer those for MCP
and automation flows; use the markdown references for guidance and examples.

UIDL supports two artifact types:
- **Pages** — full-screen UIDL JSON rendered as a complete page
- **Fragments** — reusable UIDL pieces (sidebars, steppers, navigation panels) loaded inside a parent page via `fragmentId`

## When to Use This Skill

- User asks to "create a UIDL page" or "build a UIDL screen"
- User provides a screenshot/mockup and wants it converted to UIDL
- User provides React or HTML code and wants UIDL equivalent
- User wants to prototype with Nb* components first, then convert to UIDL
- User says "create a page", "build a form", "design a layout" in the UIDL project context
- User wants to create or modify a fragment (sidebar, stepper, nav panel)
- User wants to modify or fix an existing UIDL file

## Three Methods of Creating UIDL

Determine which method applies based on the user's input:

### Method 1: Direct UIDL (Text Description → JSON)
The user describes what they want in words. Design and build the UIDL JSON directly.
This is the fastest method for simple pages and the default when no screenshot or code is provided.

### Method 2: Screenshot/Mockup → UIDL
The user provides an image. Create a pixel-perfect UIDL reproduction.
Read `references/screenshot-conversion.md` for the detailed screenshot analysis workflow.

### Method 3: React Prototype → UIDL
The user wants to build a working prototype first using `@ramco-platform/studio-components` (Nb* components), then convert the React code into UIDL JSON. This is best for complex pages where the user wants to iterate visually before committing to UIDL.
Read `references/react-prototyping.md` for component imports, prop mappings, theme setup, and the React→UIDL conversion process.

## Pages vs Fragments

### Pages
A page is a complete UIDL JSON file rendered as a full screen. Root is always an array `[{ container }]`.

### Fragments
A fragment is a reusable UIDL piece that gets loaded inside another page's container component via `fragmentId`. Fragments have their own UIDL JSON files with the same structure as pages.

**Common fragment types:**
- **Sidebar / Navigation** — loaded in a panel or Div alongside the main content
- **Stepper steps** — each step in a `stepper` loads its content via `fragment.value` (the pageId)
- **Dialog content** — `dialogModal` loads fragment content via `fragmentId` + `pageId`
- **Tab content** — tabs can load fragments when tab IDs follow the `FG...` convention

**How fragments work in the runtime:**
1. The parent component (stepper, dialog, tab) has a `fragmentId` and `pageId`/`fragment.value`
2. The runtime fetches the fragment's UIDL via the page API: `GetPageDetails(pageId)`
3. All component IDs in the fragment get prefixed with `{fragmentId}_` to prevent collisions
4. Output parameters are namespaced as `{fragmentId}_{outParam}` for cross-fragment data access
5. Fragment state is tracked in a Zustand store (stepper uses `fragmentStateStore`)

**Fragment UIDL structure:** Identical to a page — `[{ container → rows → columns → leaves }]`. The fragment is just a separate JSON file that the runtime loads dynamically.

**Creating a fragment:** Build the fragment UIDL the same way you build a page. The only difference is that the parent page's component references the fragment via `fragmentId`/`pageId` props instead of inline `children`.

**Stepper fragment example (parent stepper node):**
```json
{
  "controlType": "stepper",
  "id": "stepper-main",
  "children": [
    {
      "id": "step-1",
      "label": "Personal Info",
      "fragment": {
        "fragmentId": "FG001",
        "value": "page-id-for-step-1-uidl",
        "activityName": ""
      }
    },
    {
      "id": "step-2",
      "label": "Address",
      "fragment": {
        "fragmentId": "FG002",
        "value": "page-id-for-step-2-uidl",
        "activityName": ""
      }
    }
  ]
}
```

**Dialog fragment example (parent dialog node):**
```json
{
  "controlType": "dialogModal",
  "id": "dialog-edit",
  "fragmentId": "FG010",
  "pageId": "page-id-for-dialog-content",
  "fragmentOutParams": {}
}
```

---

## Step-by-Step Workflow

Follow these steps for every UIDL creation task:

### Step 1: Understand the Request & Choose Method

**Method 1 — Direct UIDL (text description):** Ask clarifying questions if the layout is ambiguous:
- How many columns? Fullscreen or scrollable?
- Any specific colors or branding? (Default to RXDS palette if not specified)
- What form fields are needed?
- Any data display requirements? (Table vs ListView vs Cards)
- Is this a page or a fragment? (Sidebars, stepper steps, dialog content = fragments)

When the user doesn't specify visual details, apply RXDS defaults:
- Page background: `#F9FAFB` (neutral-50) or `#FFFFFF`
- Text: `#182858` (neutral-900) for headings, `#344054` (neutral-700) for body
- Primary actions: `#0066CC` (primary-500) via button `status: "default"`
- Card/panel: white background, shadow-sm token
- Spacing: 16px between form fields (`mb-two-s`), 24px between groups (`mb-three-s`)

**Method 2 — Screenshot/Mockup:** Read `references/screenshot-conversion.md` for the full analysis workflow. Study the image carefully for layout structure, colors, typography, form elements, spacing patterns, and special elements.

**Method 3 — React Prototype → UIDL:** Read `references/react-prototyping.md` for:
- Setting up a Vite project with `@ramco-platform/studio-components`
- Component import patterns and prop interfaces
- Theme activation (`theme-rxd` class on `<html>`)
- SCSS token usage (spacing, colors, shadows)
- The React→UIDL mapping process (converting Nb* JSX back to UIDL JSON)

For React/HTML code conversion (whether from a prototype or existing code), map each element:
- `<div>` with layout → container/row/column
- `<NbHeading>` / `<h1>`-`<h6>` → heading (with matching `tag`)
- `<NbParagraph>` / `<p>` → paragraph
- `<NbTextbox>` / `<input>` → textbox (check type for `inputFieldType`)
- `<NbButton>` / `<button>` → button (check variant: contained/outlined/text)
- `<NbCombo>` / `<select>` → dropdown
- `<NbCheckbox>` / `<input type="checkbox">` → checkbox
- `<NbHyperlink>` / `<a>` → Hyperlink (capital H!)
- `<NbSeparator>` / `<hr>` → separator
- `<NbVideo>` / `<video>` → video
- `<NbImage>` / `<img>` → image

### Step 2: Read the Reference Files

Before writing any UIDL, read the reference files in this order based on what you need:

1. **Always read first:** `references/uidl-format-rules.md` — critical rules and gotchas that prevent broken renders. Every UIDL creation MUST follow these rules.

2. **Read early whenever you are improving or converting UIDL:** `references/runtime-foundations.md` — the non-negotiable runtime/Studio contract. This keeps helpers, React prototypes, and UIDL output anchored to the same foundations.

3. **Read for save/import/export shape decisions:** `references/designer-save-import-contract.md` — local page files vs Designer bundles vs API save payloads.

4. **For design decisions:** `references/design-system-guidelines.md` — RXDS colors, spacing, shadows, component selection, and accessibility rules. Read this to ensure the page uses correct brand colors, proper spacing tokens, and the right components.

5. **For layout decisions:** `references/common-patterns.md` — pick the pattern that matches the visual layout (fullscreen, two-column, centered card, etc.)

6. **For component properties:** `references/control-types.md` — look up the exact `controlType` string and available props for each component you need.

7. **For CSS classes:** `references/bootstrap-grid.md` — available grid and runtime/global utility classes for `className` and `margin`. If a handoff uses `c~mb-two-s`, strip `c~` and keep `mb-two-s`.

8. **For rendering behavior:** `references/wrapper-rendering.md` — understand how the runtime converts your UIDL to HTML (especially the height override behavior).

9. **For complete examples:** `references/working-examples.md` — copy-paste from working examples to avoid mistakes.

10. **For React prototyping (Method 3):** `references/react-prototyping.md` — Nb* component imports, prop interfaces, theme setup, SCSS tokens, and the React→UIDL conversion mapping.

11. **For screenshot conversion (Method 2):** `references/screenshot-conversion.md` — systematic visual analysis workflow, color picking, spacing measurement, and component identification from images.

12. **For MCP workflows:** `references/mcp-authoring.md` — the supported MCP tools, generation modes, and metadata-first save flow.

13. **For script selection:** `references/script-inventory.md` — which scripts are official vs diagnostic.

11. **For deep component guidance:** If unsure which component to use, consult the `design-system` skill — it has decision trees and 60+ component reference files with full properties, variants, and alternatives.

### Step 3: Plan the Component Tree

Before writing JSON, sketch out the tree structure as a text outline.

**FOUNDATION RULE:** Final output stays canonical. Do not strip designer fields, simplify
children contracts, or invent new wrapper structures in delivered files. Authoring helpers are
fine only if they expand back to the canonical UIDL before validation/save/import.

**FLAT ARCHITECTURE RULE:** We follow the Bootstrap method of generating screens. There is only ONE architecture: `container-fluid → row → column → leaf content`. There is NO container inside container for standard pages. Every page is flat.

**Standard page tree (dashboard, form, data view):**
```
container-page (fluid)
  ├── row-header → col(6)+col(6) → heading+paragraph | buttons
  ├── row-stats → 6×col(2) → display components (directly in columns)
  ├── row-section-header → col(6)+col(6) → heading | action buttons+icons
  ├── row-search → col(4) → search
  └── row-table → col(12) → listview
```

**Exception — fullscreen split (login page with video):**
Only use nested containers when you have truly distinct visual panels that need independent backgrounds and centering (e.g., dark video panel + white form card). This is a special layout, not the standard.
```
container-outer (fluid, 100vh, p-0)
  └── row-main (no-gutters h-100, stretch)
       ├── col-left (col-6) → container-dark-panel → row → col → video
       └── col-right (col-6) → container-form-card → rows → fields
```

**Showcase / catalog page (card-sectioned):**
Use cards with `enableHeader: false` + `enableFooter: false` as section wrappers to group related components. Card body contains container → rows → columns → leaves.
```
container-page (fluid)
  ├── row → col → heading "Page Title" + paragraph
  ├── row → col → heading "Section Name" (h4)
  ├── row → col → card (enableHeader:false, enableFooter:false, type:"with-border")
  │   └── body → container → rows → cols → leaf components
  ├── row → col → heading "Next Section" (h4)
  └── row → col → card → body → ...
```

**Multiple components side-by-side in one column:**
Use `d-flex flex-wrap` on the column and `mr-two-s mb-two-s` on each leaf for inline layout.

This prevents structural mistakes that are painful to debug in a 500+ line JSON file.

### Step 4: Build the UIDL JSON

Follow these absolute rules while constructing the JSON:

#### The Node Template
Every single node MUST include these designer fields:
```json
{
  "id": "unique-descriptive-id",
  "controlType": "...",
  "visibility": true,
  "isDragging": false,
  "selectedComponentId": "",
  "componentDropped": [],
  "index": 0,
  "accept": "Component",
  "dropPosition": { "x": 0, "y": 0 }
}
```

#### Container Nodes — Additional Fields
```json
{
  "containerType": "fluid",
  "styles": "{\"key\":\"value\"}",
  "className": "",
  "currentLayout": "DESKTOP",
  "layout": { "colLayout": { "lg": {} } },
  "children": [...]
}
```

#### Row Nodes — Additional Fields
```json
{
  "styles": {},
  "className": "",
  "margin": "mb-two-s",
  "currentLayout": "DESKTOP",
  "layout": { "colLayout": { "lg": { "alignItems": "...", "justifyContent": "..." } } },
  "children": [...]
}
```

#### Column Nodes — Additional Fields
```json
{
  "styles": {},
  "className": "",
  "currentLayout": "DESKTOP",
  "layout": { "colLayout": { "lg": { "col": 12 }, "md": { "col": 12 }, "sm": { "col": 12 } } },
  "children": [...]
}
```

#### Leaf Nodes — Additional Fields
Each leaf type has its own props (see `references/control-types.md`). All need:
```json
{
  "layout": { "colLayout": { "lg": { "col": 12 }, "md": { "col": 12 }, "sm": { "col": 12 } } }
}
```
Leaf nodes do NOT need `currentLayout`, `children`, `styles`, or `className` (though some like textbox accept `className`).

### Step 5: Apply Critical Rules

Run through this checklist before finalizing:

**Structural Rules:**
- [ ] **Root is an array** `[{ ... }]` not an object `{ ... }`
- [ ] **FLAT ARCHITECTURE** — Only ONE `container-fluid` at root. No container inside container. Every standard page follows: `container-fluid → row → column → leaf`. Never wrap leaf content in extra containers for card-like styling.
- [ ] **No random inline CSS** — Don't add `background`, `border`, `borderRadius`, `boxShadow`, `padding` to inner containers for card-like appearance. Use component SCSS and Bootstrap utilities instead. Container styles should be minimal (backgroundColor for page background only, or empty).
- [ ] **Every node has designer fields** (isDragging, selectedComponentId, componentDropped, index, accept, dropPosition)
- [ ] **`index` values are sequential** within each children array (0, 1, 2, ...)
- [ ] **`visibility: true`** on every node
- [ ] **All IDs are unique** across the entire page
- [ ] **Container `styles` is a JSON string**, not an object
- [ ] **Row `styles` is an empty object `{}`**, not a string
- [ ] **Heights go in `layout.colLayout.lg.height`**, NOT in the styles JSON string (the wrapper overwrites height from lg.height)
- [ ] **No `p-0` on containers with custom padding** (Bootstrap `p-0` uses `!important`)
- [ ] **`controlType` case is correct** — `Hyperlink` (capital H), `Div` (capital D), `datePicker`, `dateTimepicker`
- [ ] **Textboxes have `enableInheritWidth: true`** for full-width rendering
- [ ] **`currentLayout: "DESKTOP"`** on containers, rows, and columns (not on leaf nodes)
- [ ] **actionIcon MUST have badge configs** — Every `actionIcon` MUST include `badgeFieldProps`, `badgeCountConfig`, and `badgeIconConfig` objects. Without them, the runtime crashes with `TypeError: Cannot read properties of undefined (reading 'margin')` in NbActionIcon.tsx.
- [ ] **Component body content uses Container → Row → Column** — Panel/Accordion/Div use flat `children: []`, Card uses `{ header: [], body: [], footer: [] }`, Tabs use `{ tabId: [] }`. Never put leaf nodes directly in a component body without row/col wrappers.
- [ ] **Card children are named-slot object** — `{ header: [], body: [], footer: [] }` (Pattern 2), NOT a flat array. Each slot contains ControlAdapter children.
- [ ] **Multiple leaves in one column need flex** — Use `className: "d-flex flex-wrap align-items-center"` on column and `className: "mr-two-s mb-two-s"` on each leaf.
- [ ] **Modal body is a string** — `dialogModal` uses a `body` string prop, not children-based nesting
- [ ] **display component needs all defaults** — `type`, `size`, `alignment`, `displayPriority`, `disabled`, `hideTitle`, `hideValue`, `overflow`, `icon`, `skipPreferences`
- [ ] **listview needs sub-objects** — `toolSettings`, `rowSettings`, `noDataScreen` must be present or certain toolbar/row features break

**Layout Rules (from the runtime/global utility classes — apply to UIDL and React):**
- [ ] **Col className depends on children** — Col with Row children → only breakpoints, NO flex. Col with direct non-row children (leaf components or a single nested container/panel) → use `d-flex flex-column`/`flex-row` or alignment utilities as needed. See `uidl-format-rules.md` Rule 17.
- [ ] **Group components in one Col** — Don't create Row > Col for every component. Multiple components share a Col with flex. See Rule 18.
- [ ] **`wd-100` on component, not Col** — Width/alignment classes (`wd-100`, `text-center`) go on the leaf node `className`, not on the column wrapper. See Rule 19.
- [ ] **Margin on Rows, padding on Cols** — Row carries `margin: "mb-two-s"` or `margin: "mb-three-s"`. Cols only get padding (`pt-*`, `pb-*`, `px-two-s`). Never margin on Cols unless they are positioning direct non-row children.
- [ ] **Use runtime/global spacing classes directly** — Prefer `mb-two-s`, `mb-three-s`, `p-two-s`, `px-three-s` in both UIDL and React. If a handoff gives you `c~mb-two-s`, strip `c~` and keep `mb-two-s`.
- [ ] **Spacing multiples of 4px** — All spacing from RXDS grid: 4, 8, 12, 16, 20, 24, 32, 40, 48px. Never arbitrary values.

**Component Usage Rules:**
- [ ] **Zero custom CSS on components** — Nb* components must be styled exclusively via their own props (`variant`, `color`, `size`, `type`, etc.). Never add inline `style` with hex colors, box-shadows, border-radius, or custom padding on any component node. Runtime/global utility classes belong on wrapper divs unless a leaf needs a utility like `wd-100` or `text-center`.
- [ ] **Header/Footer immutable, body composable** — For Card, Panel, Accordion, Tab: configure headers/footers via props only (`header.title`, `enableHeader`, `enableFooter`, etc.). Never inject custom children into header/footer slots. Body content must follow Container → Row → Column → Leaf.
- [ ] **Styling priority chain** — (1) Adjust component props first. (2) Bootstrap utilities on parent wrapper. (3) Pick a different component. (4) Never add inline styles to force appearance.
- [ ] **Never delete props** — To disable a feature, set boolean to `false` or value to `""`. The prop key must remain in the JSON. Example: `"enableHeader": false` not removing the key; `"hideCaption": true` not removing `caption`.
- [ ] **Prop values from valid enums only** — Cross-check every prop value against `control-types.md` or `componentdocs.md`. Invalid values render broken components with no error.

**RXDS Design System Rules:**
- [ ] **Colors from RXDS palette** — no arbitrary hex. Primary: `#0066CC`, text: `#182858` / `#344054`, backgrounds: `#F9FAFB` / `#FFFFFF`. See `references/design-system-guidelines.md`
- [ ] **Spacing uses 4px grid** — row margins and wrapper spacing should use runtime token classes like `mb-one-s`, `mb-two-s`, `mb-three-s`, `p-two-s`, `px-three-s`
- [ ] **Shadows use brand color** — `rgba(24,40,88, α)`, never `rgba(0,0,0, α)`. Use xs/sm/md/lg/xl tokens
- [ ] **Right component chosen** — switch vs checkbox (immediate vs form-submit), dropdown vs autosuggest (≤15 vs large list), heading vs label (title vs field label)
- [ ] **Every input has a label** — `caption` or visible label for accessibility (WCAG AA)
- [ ] **Contrast meets 4.5:1** — don't use neutral-400 or lighter for readable text on white backgrounds

### Step 6: Create a Mock Webscreen

After writing the UIDL JSON, create a simple HTML mockup that shows what the page should
look like. This serves as a visual verification reference.

Create this as an HTML file next to the UIDL JSON file with the suffix `-preview.html`.
Use inline CSS to approximate the layout. This does NOT need to be pixel-perfect —
it's just for quick visual validation before loading in the runtime.

Example: if the UIDL is `my-page.json`, create `my-page-preview.html`.

The mock should show:
- Overall layout structure (columns, spacing)
- Component positions (headings, inputs, buttons)
- Background colors and borders
- Approximate typography sizes

### Step 7: Verify the Output

Before delivering, do a final pass:

1. **Run the UIDL validator**: `node scripts/validate-uidl.js <output-file.json>` — fix every error. Review warnings and fix where possible. The validator checks: unique IDs, designer fields, flat architecture, styles/className conflicts, actionIcon badge configs, component children-pattern mismatches, prop values against `component-schema.json`, className against `bootstrap-allowlist.json`, height placement, controlType casing, repeated `Row > Col > single leaf` grouping anti-patterns, and more.
2. **Run the runtime crash simulator**: `node samples/simulate_runtime.js <output-file.json>` — catches crash-prone wrapper assumptions before delivery.
3. **If the file is meant for Studio import/save flow, export a wrapped bundle and run the full-flow check**: `node samples/test_full_flow.js <wrapped-import-file.json>` — this catches envelope/import issues that a bare metadata array won't show.
4. **Validate JSON syntax** — catch trailing commas, missing brackets
5. **Count children indices** — every `children` array should have sequential `index` values starting at 0
6. **Check the tree depth** — every leaf must be inside Container → Row → Column
7. **Verify controlType spellings** — compare against the enum in `references/control-types.md`
8. **Test height handling** — if any container needs a height, it must be in `lg.height`, not styles
9. **Check for `p-0` conflicts** — if a container has custom padding in styles, `className` must NOT be `p-0`
10. **Cross-check prop values** — verify against `component-schema.json` enum values (validator does this automatically)
11. **Verify className allowlist** — no classes from the `DO_NOT_USE` list in `bootstrap-allowlist.json`

---

## Critical Gotchas (Lessons Learned)

These are the most common mistakes that cause broken or misaligned layouts.
They were discovered through extensive trial and error.

### The Flat Architecture Rule
We follow the Bootstrap method: **one container-fluid at root, then rows and columns and content**. There is NO container-inside-container for standard pages.

- **Wrong**: wrapping display components in a container with `borderRadius`, `boxShadow`, `background` to make them look like cards
- **Right**: placing display components directly in columns — the component's own SCSS handles its visual appearance
- **Exception**: fullscreen split layouts (login with video) where nested containers serve distinct purposes (dark video panel vs white form card)

### No Random Inline CSS
Don't add `background`, `border`, `borderRadius`, `boxShadow`, custom `padding` to inner containers for card-like appearance. Use component SCSS and Bootstrap utilities. Container styles should be minimal:
- Page background: `"{\"backgroundColor\":\"#F9FAFB\"}"` on the root container only
- Empty/default: `"{\"backgroundColor\":\"\"}"` or `"{}"`
- Never: `"{\"backgroundColor\":\"#ffffff\",\"borderRadius\":\"12px\",\"boxShadow\":\"...\",\"border\":\"1px solid #EAECF0\"}"` on inner containers

### The actionIcon Badge Crash
The `NbActionIcon.tsx` component accesses `badgeFieldProps.margin` on line 112 without optional chaining. If `badgeFieldProps` is undefined, the runtime crashes:
```
TypeError: Cannot read properties of undefined (reading 'margin')
```

**Fix:** Every `actionIcon` node MUST include these three objects:
```json
{
  "badgeFieldProps": {
    "controlType": "badge",
    "size": "xsmall",
    "color": "success"
  },
  "badgeCountConfig": {
    "controlType": "badge",
    "size": "xsmall",
    "color": "success",
    "content": "",
    "borderType": "without-border",
    "customColor": false,
    "count": true
  },
  "badgeIconConfig": {
    "controlType": "badge",
    "size": "xsmall",
    "badgeType": "icononly",
    "iconOnly": "AddfileFilled",
    "borderType": "without-border",
    "visibility": true,
    "customColor": false
  }
}
```

### The Height Override Bug
The container wrapper always does:
```js
style = { ...JSON.parse(styles), height: layout.colLayout.lg.height || "" }
```
This means `height` in the styles JSON string gets **unconditionally overwritten**.
If `lg.height` is missing or empty, the height becomes `""` (empty string), destroying
any height you set in styles.

**Fix:** Always put height values in `layout.colLayout.lg.height`:
```json
"layout": { "colLayout": { "lg": { "height": "100vh" } } }
```

### The `p-0` Trap
Bootstrap generates `p-0` as `.p-0 { padding: 0 !important; }`.
If your container styles have `"padding": "60px 80px"` but className includes `p-0`,
the Bootstrap `!important` wins and your padding disappears.

**Fix:** Use `className: ""` on containers with custom padding in styles.
Only use `p-0` when you genuinely want zero padding everywhere (like the outer page container).

### Textbox Width Problem
Textboxes render with a fixed default width. If you just put a textbox in a col-12 column,
it will NOT fill the column width.

**Fix:** Set both `enableInheritWidth: true` AND `className: "wd-100"` on the textbox.

### Video Height Problem
The NbVideo component calculates height as `(parentWidth * 9) / 16` for LANDSCAPE orientation.
It will NEVER fill 100% height of its container.

**Fix:** Use `minVideoHeight` / `minVideoWidth` props, and put the video inside a dark-background
container with `display: flex` centering so the empty space isn't visible.

### Checkbox Label Confusion
The checkbox has two label mechanisms:
- `caption`: The label above the checkbox (form label)
- `title`: The inline label next to the checkbox

To get just an inline label:
```json
"hideCaption": true,     // hides "caption" text
"title": "Remember me",  // inline label
"hideTitle": false        // shows the inline label
```

### Row `styles` Must Be an Object
Container `styles` is a JSON string: `"{\"padding\":\"20px\"}"`.
Row `styles` is a plain object: `{}`.
Mixing them up causes parsing errors.

### Missing `currentLayout` on Structural Nodes
Containers, rows, and columns need `"currentLayout": "DESKTOP"`.
Leaf components (heading, textbox, button, etc.) do NOT need it.
If missing on structural nodes, the layout engine may not apply breakpoint logic.

---

## Mapping React/HTML/Nb* Components to UIDL

When converting from React prototypes (Method 3), HTML, or any source code, use this mapping:

| React Nb* Component | HTML Equivalent | UIDL controlType | Key Props |
|---------------------|----------------|-----------------|-----------|
| `<div className="container">` | same | `container` | containerType: "fixed" |
| `<div className="container-fluid">` | same | `container` | containerType: "fluid" |
| `<div className="row">` | same | `row` | - |
| `<div className="col-*">` | same | `column` | lg.col: N |
| `<NbHeading>` | `<h1>`-`<h6>` | `heading` | tag: "h1"-"h6", content |
| `<NbParagraph>` | `<p>` | `paragraph` | content, color |
| `<NbLabel>` | `<label>` | `label` | caption |
| `<NbDisplay>` | `<span>` | `display` | displayTitle, displayValue |
| `<NbTextbox>` | `<input type="text">` | `textbox` | inputFieldType: "text" |
| `<NbTextbox inputFieldType="password">` | `<input type="password">` | `textbox` | inputFieldType: "password" |
| `<NbNumeric>` | `<input type="number">` | `numeric` | - |
| `<NbTextarea>` | `<textarea>` | `textarea` | - |
| `<NbCombo>` / `<NbDropdown>` | `<select>` | `dropdown` | options |
| `<NbCheckbox>` | `<input type="checkbox">` | `checkbox` | checked |
| `<NbRadioGroup>` | `<input type="radio">` + group | `radiogroup` | options |
| `<NbButton variant="contained">` | `<button>` solid | `button` | variant: "contained" |
| `<NbButton variant="outlined">` | `<button>` outline | `button` | variant: "outlined" |
| `<NbButton variant="text">` | `<button>` text | `button` | variant: "text" |
| `<NbHyperlink>` | `<a href>` | `Hyperlink` | content, url (capital H!) |
| `<NbSeparator>` | `<hr>` | `separator` | orientation: "horizontal" |
| `<NbImage>` | `<img>` | `image` | imageSrc |
| `<NbVideo>` | `<video>`/`<iframe>` | `video` | videoSource, url |
| `<NbSwitch>` | Switch toggle | `switch` | checked |
| `<NbDiv>` | `<div>` wrapper | `Div` | (capital D!) |
| `<NbCard>` | card wrapper | `card` | children: { header, body, footer } |
| `<NbPanel>` | panel wrapper | `panel` | children: [] (flat) |
| `<NbTab>` | tabs | `tab` | tabDefinition, children: { tabId: [] } |
| `<NbAccordion>` | accordion | `accordion` | children: [] (flat) |
| `<NbStepper>` | stepper | `stepper` | children with fragment refs |
| `<NbDialogModal>` | modal | `dialogModal` | body (string), or fragmentId |
| `<NbSearch>` | search | `search` | searchType |
| `<NbDatePicker>` | date input | `datePicker` | dateFormat |
| `<ListView>` | data table | `listview` | fieldDefs, toolSettings, rowSettings |
| `<NbIcon>` | icon | `icon` | iconKey |
| `<NbActionIcon>` | icon button | `actionIcon` | Icon, badge configs (required!) |
| `<NbBadge>` | badge | `badge` | content, color |
| `<NbAvatar>` | avatar | `avatar` | type, status |
| `<NbCircularProgress>` | progress | `circularProgress` | progress, type |

### Prop Name Differences (React Nb* → UIDL)

Some props have different names or values between the Nb* React components and UIDL:

| Nb* React Prop | UIDL Prop | Notes |
|----------------|-----------|-------|
| `NbButton.color="positive"` | `button.color` → not available in UIDL | Use `"success"` instead |
| `NbButton.color="negative"` | `button.color` → not available in UIDL | Use `"error"` instead |
| `NbButton.color="neutral"` | `button.color` → not available in UIDL | Use `"secondary"` instead |
| `NbButton.color="default"` | `button.color="primary"` | Default maps to primary in UIDL |
| `NbButton.size="xsmall"` | `button.size` → not available | Use `"small"` |
| `NbButton.variant="primary"` | `button.variant="contained"` | Alias |
| `NbButton.variant="secondary"` | `button.variant="outlined"` | Alias |
| `NbTextbox.variant="material"` | `textbox.variant="outlined"` | Runtime maps differently |
| `NbTextbox.variant="label-left"` | `textbox.variant="standard"` | Use standard with layout |
| `NbTextbox.name` (required) | Not needed in UIDL | UIDL uses `id` instead |
| `NbTextbox.value` (required) | `textbox.value` | Optional in UIDL |
| `NbCard.id` (required) | Everything needs `id` | All UIDL nodes need unique `id` |

### CSS to UIDL Mapping

| CSS Property | UIDL Location |
|-------------|---------------|
| `background-color` | container styles JSON: `backgroundColor` |
| `padding` | container styles JSON: `padding` |
| `margin-bottom` on rows | row `margin`: `"mb-two-s"` |
| `height: 100vh` | container `layout.colLayout.lg.height`: `"100vh"` |
| `height: 100%` | container `layout.colLayout.lg.height`: `"100%"` |
| `width: 100%` | container styles JSON: `width: "100%"` or className `wd-100` |
| `max-width` | container styles JSON: `maxWidth` |
| `display: flex` | container styles JSON or column className `d-flex` |
| `align-items: center` | row `lg.alignItems: "center"` or className |
| `justify-content: center` | row `lg.justifyContent: "center"` or className |
| `text-align: center` | column className `text-center` |
| `text-align: right` | column className `text-right` |
| `font-weight: bold` | heading `weight: "bold"` |
| `color: #333` | heading/paragraph `color: "#333333"` |
| `border-radius` | container styles JSON (camelCase: `borderRadius`) |
| `box-shadow` | container styles JSON (camelCase: `boxShadow`) |
| `overflow: hidden` | container styles JSON |
| `flex: 1` | container styles JSON |

### Important Style Rules
- All CSS properties in container `styles` must use **camelCase**: `backgroundColor`, `fontSize`, `borderRadius`
- Container `styles` is a **JSON string**, not an object: `"{\"backgroundColor\":\"#fff\"}"`
- Row `styles` is always `{}` (empty object) — use `className`/`margin` for row styling
- Heights MUST go in `lg.height`, not in styles (the wrapper overwrites height)
- **FLAT ARCHITECTURE**: Don't add `borderRadius`, `boxShadow`, `border`, custom `padding` to inner containers to make them look like cards. Use component SCSS instead. Only use `backgroundColor` on the root page container for page-level background.
- **Container styles should be minimal**: `"{\"backgroundColor\":\"\"}"` for most containers. Reserve complex styles for special layouts (fullscreen split with video).

---

## File Output

When creating a UIDL page, always produce:

1. **`<name>.json`** — The UIDL JSON file (the primary output)
2. **`<name>-preview.html`** — A simple HTML mockup for visual verification

Place both files in the location the user specifies, or in the workspace root if no
location is specified.

### Python Generator for Large Pages

For pages with 200+ nodes (e.g., component showcases, complex dashboards), writing JSON by hand is error-prone. Use a Python generator script with helper functions:

1. Create helper functions for each structural element (container, row, column) and each component type (button, textbox, etc.)
2. Each helper automatically includes required designer fields (`visibility`, `isDragging`, `selectedComponentId`, `componentDropped`, `index`, `accept`, `dropPosition`)
3. Build the page tree using these helpers, then `json.dump()` to file
4. Reference example: `samples/gen_showcase.py` generates the 7985-line `07-component-showcase.json`

---

## Reference Files

The `references/` folder contains detailed documentation. Read them as needed:

| File | When to Read | Content |
|------|-------------|---------|
| `uidl-format-rules.md` | **Always** (before writing any UIDL) | Critical structural rules, the height bug, common mistakes |
| `runtime-foundations.md` | When improving workflows, conversions, or generators | The fixed runtime/Studio contract: canonical UIDL shape, Bootstrap 12-column foundation, component and designer-field constraints |
| `common-patterns.md` | When planning layout | Fullscreen, two-column, centered card, showcase/catalog, responsive patterns |
| `control-types.md` | When using any component | Full controlType enum, props for each component, color/variant/size catalog |
| `bootstrap-grid.md` | When adding CSS classes | Grid system plus runtime/global spacing, sizing, text, and flex utilities |
| `wrapper-rendering.md` | When debugging layout issues | How the runtime converts UIDL to HTML |
| `working-examples.md` | When starting a new page | Complete working UIDL files to copy from (4 examples including showcase) |
| `react-prototyping.md` | **Method 3** — React prototype → UIDL | Nb* component library setup, prop interfaces, theme activation, SCSS tokens, React→UIDL conversion |
| `screenshot-conversion.md` | **Method 2** — Screenshot → UIDL | Visual analysis workflow, color identification, spacing measurement, component mapping from images |
| `uidl-node-templates.json` | When building any UIDL node | Pre-validated node templates with all designer fields for every common controlType — copy as starting points |
| `bootstrap-allowlist.json` | When adding className or margin | Categorized allowlist of safe CSS classes, plus DO_NOT_USE list of app-specific classes to avoid |

Also reference these from the `design-system` skill:

| File | When to Read | Content |
|------|-------------|---------|
| `component-schema.json` | When validating prop values | Machine-readable enum values for every component prop — cross-check every value against this |
| `component-catalog.json` | When selecting a component | Quick lookup: controlType → React name, category, required props, composition rules |

---

## If Something Goes Wrong

- **Blank page / "Control Type Not Available yet"**: The `controlType` string doesn't match the enum. Check case sensitivity — read `references/control-types.md`.
- **TypeError: Cannot read properties of undefined (reading 'margin')**: An `actionIcon` is missing `badgeFieldProps`, `badgeCountConfig`, or `badgeIconConfig`. Add all three objects — see the actionIcon section in `references/control-types.md`.
- **Layout broken / heights wrong**: The container wrapper is overwriting your height. Move height to `lg.height` — read `references/wrapper-rendering.md`.
- **Custom padding ignored**: `p-0` in className is overriding your styles with `!important`. Remove `p-0` or remove custom padding from styles.
- **Textbox doesn't fill width**: Add `enableInheritWidth: true` and `className: "wd-100"`.
- **Component not visible**: Check `visibility: true` is set on the node.
- **JSON parse error**: Container `styles` must be a valid JSON string. Check for unescaped quotes.
- **Unexpected gutters/gaps**: The Bootstrap grid has 15px column padding by default. Use `no-gutters` on the row to remove them.
- **Too many nested containers**: You're probably wrapping components in containers for card-like styling. Remove inner containers — use the flat architecture (container-fluid → row → column → leaf).
