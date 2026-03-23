# UIDL Format Rules & Gotchas

These rules were learned through extensive trial-and-error testing against the Swift Runtime engine.
Violating any of these will cause either crashes, blank renders, or misaligned layouts.

Start with `runtime-foundations.md` whenever you are creating or improving generation rules.
The final UIDL contract is fixed by the current runtime and Studio implementation; helpers may
exist on top of it, but the delivered JSON must still match the canonical runtime shape.

## Critical Structure Rules

### 1. Local page files MUST use a root array
```json
[
  {
    "id": "container-outer",
    "controlType": "container",
    ...
  }
]
```
The renderer calls `metaData.map()` — it crashes if the root is an object.

Designer import/export bundles are the only wrapped exception:
```json
{
  "pageId": "...",
  "metadata": [ ... ]
}
```
Local authored page files under `projects/` should stay as the bare metadata array.

### 2. FLAT Architecture — No Nested Containers
We follow the Bootstrap method of generating screens. There is only ONE architecture:
**container-fluid → row → column → leaf content**. There is NO container inside container for standard pages.
The runtime converts `layout.colLayout` directly into Bootstrap 12-column classes (`col-lg-*`,
`col-md-*`, `col-sm-*`), so React prototypes should mirror this same structure.

**WRONG — nested containers for card styling:**
```
container-fluid
  └── row → col
       └── container (white bg, borderRadius, boxShadow)  ← BAD
            └── row → col → display component
```

**RIGHT — flat structure:**
```
container-fluid
  └── row → col(2)+col(2)+col(2)... → display components directly
```

**Only exception:** Fullscreen split layouts (login page with dark video panel + white form card) where nested containers serve truly distinct visual purposes.

### 3. No Random Inline CSS on Containers
Don't add `background`, `border`, `borderRadius`, `boxShadow`, custom `padding` to inner containers for card-like appearance. Use the component SCSS properly.

**WRONG:**
```json
"styles": "{\"backgroundColor\":\"#ffffff\",\"borderRadius\":\"12px\",\"boxShadow\":\"0 2px 10px rgba(0,0,0,0.1)\",\"border\":\"1px solid #EAECF0\",\"padding\":\"24px\"}"
```

**RIGHT — minimal container styles:**
```json
"styles": "{\"backgroundColor\":\"\"}"
```

### 4. Designer fields required on EVERY node
Every single node in the tree must include these fields:
```json
{
  "isDragging": false,
  "selectedComponentId": "",
  "componentDropped": [],
  "index": 0,
  "accept": "Component",
  "dropPosition": { "x": 0, "y": 0 }
}
```
- These may look like editor-only fields, but the current Studio/runtime flows still read and
  write them. Do not strip them from final UIDL.
- `index`: Must be sequential within the parent's children array (0, 1, 2, ...)
- `currentLayout`: `"DESKTOP"` — required on containers, rows, and columns (NOT on leaf components)

### 5. `visibility: true` on every node
Without this, the component won't render.

### 6. `id` must be unique across the entire page
Use descriptive kebab-case IDs like `"container-outer"`, `"row-main"`, `"col-email"`, `"textbox-email"`.

### 7. `layout.colLayout` is required on every node
- Containers: `{ "lg": { "col": "12", "height": "200" } }`
- Rows: `{ "lg": { "col": "12", "height": "200", "alignItems": "...", "justifyContent": "..." } }`
- Columns: `{ "lg": { "col": "12", "height": "200" }, "md": { "col": "12" }, "sm": { "col": "12" } }`
- Leaf components: `{ "lg": { "col": "12", "height": "200" }, "md": { "col": "12" }, "sm": { "col": "12" } }`
- **CRITICAL**: `col` MUST be a STRING (e.g., `"12"`) not integer `12`. `lg` MUST always have both `col` and `height`.
- The runtime does `colLayout.lg.col` without optional chaining — missing `lg`, missing `col`, or integer `col` will crash.
- `height` in `lg` uses `"200"` as the default (auto-height). It MUST be present.
- `md`/`sm` only need `col` (as string). Height is not required for `md`/`sm`.
- See `references/runtime-crash-map.md` for the full crash chain documentation.

---

## The Height Gotcha (CRITICAL)

The container wrapper does this:
```js
style={
  isValidJson(metadata?.styles)
    ? { ...JSON.parse(metadata?.styles), height: height }
    : { height: height }
}
// where: height = lg?.height || md?.height || sm?.height || ""
```

This means `height` from `layout.colLayout.lg.height` is ALWAYS spread OVER the parsed styles.

**If you put height in the styles JSON string AND lg.height is empty:**
- `lg.height` resolves to `""`
- The spread produces `{ ...parsedStyles, height: "" }`
- Your height from styles gets wiped to empty string!

**RULE**: Always specify height via `layout.colLayout.lg.height`, never in the `styles` JSON string.

Row and column wrappers have the same behavior.

---

## Styles vs className Conflicts

Bootstrap utility classes like `p-0` use `!important`. If you set padding in the `styles` JSON string AND `className: "p-0"`, the `p-0` wins because of `!important`.

**RULE**: Don't mix the same CSS property in both `styles` and `className`. Pick one:
- Use `styles` for custom values: `"{\"padding\":\"60px 80px\"}"`
- Use `className` for standard Bootstrap values: `"p-3"`
- Never `className: "p-0"` with `styles: "{\"padding\":\"60px\"}"` — `p-0` wins.

---

## Spacing Rules

### `margin` property on rows
Prefer the runtime/global spacing utility classes from `_spacers.scss`: `"mb-two-s"`, `"mt-three-s"`, `"my-one-s"`

Bootstrap numeric spacing still exists for compatibility, but it is no longer the preferred source of truth for RXDS spacing because it drifts from the 4px token scale.

**Do NOT use** legacy handoff names like `"c~mb-two-s"` — strip `c~` and keep the real class name.

### `className` for padding/flex
Use runtime/global utility classes and layout helpers: `p-two-s`, `px-three-s`, `d-flex`, `text-center`, `wd-100`, etc.

---

## Common Mistakes

### 1. Using `caption` on heading/paragraph
❌ `"caption": "Title"` — heading/paragraph ignore this
✅ `"content": "Title"` — use `content` for display text

### 2. Using `variant` on heading
❌ `"variant": "h1"` — heading doesn't use variant for tag selection
✅ `"tag": "h1"` — use `tag` for the HTML heading level

### 3. Using lowercase `hyperlink`
❌ `"controlType": "hyperlink"` — won't be recognized
✅ `"controlType": "Hyperlink"` — capital H required

### 4. Missing `containerType` on container
Without `containerType`, the container renders with just `container` class (fixed-width).
Always specify `"containerType": "fluid"` for full-width containers.

### 5. Putting height in styles JSON
❌ `"styles": "{\"height\":\"100vh\"}", "layout": { "colLayout": { "lg": {} } }`
✅ `"styles": "{}", "layout": { "colLayout": { "lg": { "height": "100vh" } } }`

### 6. Using p-0 with custom padding in styles
❌ `"className": "p-0", "styles": "{\"padding\":\"40px\"}"` — p-0 wins
✅ `"className": "", "styles": "{\"padding\":\"40px\"}"` — custom padding applies

### 7. Checkbox label stacking instead of inline
❌ Default: caption shows above, checkbox below
✅ For inline label: `"hideCaption": true, "title": "Remember me", "hideTitle": false`

### 8. Textbox not taking full width
❌ `"enableInheritWidth": false` — textbox has fixed width
✅ `"enableInheritWidth": true` AND `"className": "wd-100"` — takes full parent width

### 9. Forgetting `no-gutters` for fullscreen layouts
Without `no-gutters` on the row, columns get 15px padding on each side from the Bootstrap grid.
Columns also need `p-0` in className to remove their own column padding.

### 10. Missing actionIcon badge configs (RUNTIME CRASH)
❌ `actionIcon` without `badgeFieldProps` → `TypeError: Cannot read properties of undefined (reading 'margin')`
✅ Every `actionIcon` MUST include `badgeFieldProps`, `badgeCountConfig`, and `badgeIconConfig`:
```json
{
  "controlType": "actionIcon",
  "Icon": "FilterFilled",
  "badgeFieldProps": { "controlType": "badge", "size": "xsmall", "color": "success" },
  "badgeCountConfig": { "controlType": "badge", "size": "xsmall", "color": "success", "content": "", "borderType": "without-border", "customColor": false, "count": true },
  "badgeIconConfig": { "controlType": "badge", "size": "xsmall", "badgeType": "icononly", "iconOnly": "AddfileFilled", "borderType": "without-border", "visibility": true, "customColor": false }
}
```

### 11. Wrapping components in containers for card styling
❌ Putting a `container` with `borderRadius`, `boxShadow`, `backgroundColor: "#ffffff"` inside a column to create a card look
✅ Place components directly in columns. Use the component's own SCSS for visual appearance. If you truly need a card, use the `card` controlType.

### 12. Missing listview sub-objects
❌ `listview` without `toolSettings`, `rowSettings`, `noDataScreen` — toolbar and row features may break
✅ Always include these objects on listview nodes (see `control-types.md` for full defaults)

### 13. Card children must be named-slot object, not flat array
❌ `"children": [{ "controlType": "heading" }]` — card ignores flat array children
✅ `"children": { "header": [], "body": [container → row → col → leaf], "footer": [] }` — Pattern 2 named-slot structure
Each slot (`header`, `body`, `footer`) contains ControlAdapter children that follow the standard container → row → column → leaf hierarchy.

### 14. Multiple leaves in one column need flex on column
❌ Putting 6 buttons in a column without `d-flex` — they stack vertically with full width each
✅ `className: "d-flex flex-wrap align-items-center"` on the column, plus `className: "mr-two-s mb-two-s"` on each leaf component — they render inline with proper spacing

### 15. Fragment IDs must start with "FG"
❌ Using arbitrary IDs for fragment references — the runtime won't recognize them
✅ Fragment IDs follow the convention `"FG"` + number (e.g. `"FG001"`, `"FG010"`). The runtime checks for the `"FG"` prefix to identify fragment-scoped components and auto-prefix all child IDs.

### 16. Fragments are separate UIDL files, not inline content
❌ Putting all stepper/dialog content inline in the parent page — makes the page JSON enormous and non-reusable
✅ Each fragment (sidebar, stepper step, dialog content) is a separate UIDL JSON file with its own `[{ container → rows → columns → leaves }]` structure. The parent references it via `fragmentId` + `pageId`/`fragment.value`.

### 17. Col className depends on what's INSIDE the Col
❌ Adding `d-flex`, `align-items-*`, `justify-content-*` to a column that contains Row children — unnecessary, breaks layout
✅ **Col with Row children** → only breakpoints (`lg.col`, `md.col`), no flex classes
✅ **Col with direct non-row children** → use `d-flex flex-column` (stacked), `d-flex flex-row` (inline), or alignment utilities when the column directly positions leaf components or a single nested container/panel
✅ **Col padding** → Only `pt-*`, `pb-*`, `pl-*`, `pr-*`. Margin goes on Rows, not Cols (exception: Col with direct non-row children may use margin).
Examples of valid direct non-row children: a button group, a heading+paragraph stack, a centered login card container, or a header/content/footer shell built from direct nested containers.

### 18. Group components in a Col — don't wrap each in Row > Col
❌ Creating a separate `Row > Col` for every single component — bloated structure, unnecessary nesting
✅ Multiple components share one Col with `d-flex flex-column` (vertical) or `d-flex flex-row` (horizontal). Example: a heading + paragraph + 2 buttons can all live in one column with `d-flex flex-column`.

### 19. `wd-100` and `text-*` alignment go on the component, not on Col
❌ `className: "wd-100"` on a column node — has no effect on the child component's width
✅ `className: "wd-100"` on the leaf node (textbox, button, etc.) — component takes full width
✅ `className: "text-center"` on the leaf node — aligns the component's text

### 20. Use the real runtime/global classes directly — never `c~`
❌ `"margin": "c~mb-two-s"` in UIDL — `c~` is a handoff wrapper, not a real class name
✅ `"margin": "mb-two-s"` in UIDL — use the runtime/global class directly
✅ `className="mb-two-s"` in React prototype — same class as UIDL
✅ `className: "p-two-s px-three-s"` in UIDL/React wrappers — same runtime utility names in both places
Bootstrap numeric spacing (`mb-3`, `p-4`) still exists, but the preferred spacing source of truth is the runtime token utility set. See `react-prototyping.md` for examples.

### 21. Spacing values must be multiples of 4px
❌ Using arbitrary spacing like 7px, 11px, 15px
✅ All spacing from the RXDS 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. Prefer 8px multiples for structural spacing.

---

## Runtime Crash Prevention Checklist

These are verified crash points from source code audit of `swift-runtime/src/wrapper/`.
For the full crash map with code traces, see `references/runtime-crash-map.md`.

### Mandatory properties that crash if missing:

| Component | Property | Safe Default | Crash Type |
|-----------|----------|-------------|------------|
| `heading` | `content` | `""` | `updatedContent.toString()` — heading/index.tsx:90 |
| `button` | `caption` | `""` | `updatedCaption.toString()` — button/index.tsx:116 |
| `actionIcon` | `badgeFieldProps` | `{...}` | `TypeError: reading 'margin'` |
| `actionIcon` | `badgeCountConfig` | `{...}` | `TypeError` |
| `actionIcon` | `badgeIconConfig` | `{...}` | `TypeError` |
| `card` | `cardConfig` | `{ enableBody: true, ... }` | Body won't render (silent) |
| `splitButton` | `options` | `"[]"` | `options.toString()` crash |
| ALL nodes | `layout.colLayout.lg.col` | `"12"` | `colLayout.lg.col` — metadataParser.ts:8 |
| ALL nodes | `layout.colLayout.lg.height` | `"200"` | Some wrappers read height unsafely |
| rows | `margin` | `""` | `undefined` concatenated into className |

### The `col` type trap:
- `"col": "12"` (string) ✅ — works
- `"col": 12` (integer) ❌ — some code paths call `.toString()` on it; while JS coercion may work in some cases, the runtime expects strings. Always use strings.

### The `getUpdatedValue` chain:
When a UIDL property is missing (e.g., no `content` on heading), the chain is:
`undefined → getUpdatedValue(undefined) → renderOutput(undefined, undefined, undefined) → return undefined → typeof undefined !== "string" → undefined.toString() → CRASH`

An empty string `""` is always safe — `typeof "" === "string"` takes the safe branch.
