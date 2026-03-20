# Grid & Runtime CSS Utilities

The rui-components library bundles the Bootstrap 4 grid system plus runtime/global utility classes
from the shared SCSS stylesheets. Use the real runtime class names directly in `className` and
`margin`. If a handoff still contains `c~mb-two-s`, strip `c~` and keep `mb-two-s`.

## FLAT Architecture Rule

**All standard pages use ONE container-fluid with rows and columns directly inside.** There is NO container-inside-container for standard pages. The hierarchy is always:

```
container-fluid (ONE, at root)
  ├── row → column(s) → leaf component(s)
  ├── row → column(s) → leaf component(s)
  └── row → column(s) → leaf component(s)
```

**Don't** wrap components in inner containers for card-like styling (no `borderRadius`, `boxShadow`, `border` on containers). Use component SCSS instead.

**Exception:** Fullscreen split layouts (login with video) where nested containers serve distinct visual purposes.

## Grid System Overview

The grid uses `$grid-gutter-width: 30px` (15px padding on each side).

### Container classes (applied automatically by container wrapper)
- `container-fluid` — `width: 100%; padding-right: 15px; padding-left: 15px; margin: auto`
- `container` — same but with max-width breakpoints

### Row class (applied automatically by row wrapper)
- `row` — `display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px`

### Column classes (applied automatically by column wrapper via `layout.colLayout`)
- `col-lg-{1-12}` — column width at large breakpoint
- `col-md-{1-12}` — column width at medium breakpoint
- `col-sm-{1-12}` — column width at small breakpoint
- Each column gets `padding-right: 15px; padding-left: 15px`

### Gutter removal
- `no-gutters` — **apply on rows** to remove row negative margins AND child column padding:
  ```scss
  .no-gutters {
    margin-right: 0;
    margin-left: 0;
    > .col, > [class*="col-"] {
      padding-right: 0;
      padding-left: 0;
    }
  }
  ```

---

## Spacing Utilities

Use the runtime/global spacing utilities as the preferred spacing source of truth for UIDL and
React wrappers.

### Preferred runtime spacing classes
- `m-half-s`, `m-one-s`, `m-two-s`, `m-three-s`
- `mt-half-s`, `mt-one-s`, `mt-two-s`, `mt-three-s`
- `mb-half-s`, `mb-one-s`, `mb-two-s`, `mb-three-s`, `mb-four-s`
- `ml-one-s`, `mr-one-s`, `mr-two-s`
- `mx-one-s`, `mx-two-s`, `my-one-s`, `my-two-s`
- `p-one-s`, `p-two-s`, `p-three-s`
- `pt-one-s`, `pb-one-s`, `px-two-s`, `py-two-s`, `px-three-s`

Typical values: `half-s` = 4px, `one-s` = 8px, `one-half-s` = 12px, `two-s` = 16px, `two-half-s` = 20px, `three-s` = 24px, `four-s` = 32px

### Bootstrap numeric spacing (legacy-compatible)
- `m-{0-5}`, `mt-{0-5}`, `mb-{0-5}`, `ml-{0-5}`, `mr-{0-5}`, `mx-{0-5}`, `my-{0-5}`
- `p-{0-5}`, `pt-{0-5}`, `pb-{0-5}`, `pl-{0-5}`, `pr-{0-5}`, `px-{0-5}`, `py-{0-5}`

These still work, but prefer the runtime token classes above when matching RXDS spacing precisely.

**WARNING**: `p-0` uses `!important` and will override any inline padding set via the `styles` JSON string. If you need custom padding via styles, do NOT also set `p-0` in className.

---

## Sizing Utilities (for `className`)

### Width
- `w-25` — width: 25%
- `w-50` — width: 50%
- `w-75` — width: 75%
- `w-100` — width: 100%
- `mw-100` — max-width: 100%

### Height
- `h-25` — height: 25%
- `h-50` — height: 50%
- `h-75` — height: 75%
- `h-100` — height: 100% (of parent)
- `mh-100` — max-height: 100%

### Viewport
- `vh-100` — height: 100vh
- `vw-100` — width: 100vw
- `min-vh-100` — min-height: 100vh
- `min-vw-100` — min-width: 100vw

All sizing utilities use `!important`.

---

## Flexbox Utilities (for `className`)

### Display
- `d-flex` — display: flex
- `d-inline-flex` — display: inline-flex
- `d-block`, `d-inline-block`, `d-inline`, `d-none`

### Direction
- `flex-row` — flex-direction: row
- `flex-column` — flex-direction: column
- `flex-row-reverse`, `flex-column-reverse`

### Alignment
- `align-items-start`, `align-items-center`, `align-items-end`, `align-items-stretch`, `align-items-baseline`
- `justify-content-start`, `justify-content-center`, `justify-content-end`, `justify-content-between`, `justify-content-around`
- `align-self-start`, `align-self-center`, `align-self-end`

### Wrapping
- `flex-wrap`, `flex-nowrap`

---

## Text Utilities (for `className`)

- `text-left`, `text-center`, `text-right`
- `text-uppercase`, `text-lowercase`, `text-capitalize`
- `font-weight-bold`, `font-weight-normal`, `font-weight-light`

---

## RUI-specific Classes (for `className`)

- `wd-100` — width: 100% (rui utility, works on components like textbox, button)

---

## Common Fullscreen Layout Pattern (Special Case)

**NOTE:** This is a SPECIAL layout for fullscreen split pages (login, onboarding). For standard dashboard/form/data pages, use the flat architecture above — single container-fluid with all rows at the top level.

For edge-to-edge fullscreen pages:

1. **Outer container**: `containerType: "fluid"`, `className: "p-0"`, `layout.colLayout.lg.height: "100vh"`
   - styles: `"{\"padding\":\"0px\",\"margin\":\"0px\",\"overflow\":\"hidden\"}"`

2. **Main row**: `className: "no-gutters h-100"`, `layout.colLayout.lg.alignItems: "stretch"`

3. **Columns**: `className: "h-100 p-0"` for edge-to-edge, or omit `p-0` if you want natural padding

This removes all Bootstrap grid padding/margins for a true fullscreen layout.

---

## Standard Dashboard Spacing Pattern (DEFAULT)

Use this for most pages — dashboards, forms, data views:

1. **Root container**: `containerType: "fluid"`, `styles: "{\"backgroundColor\":\"\"}"`, `className: ""`
   - No custom padding, borderRadius, boxShadow, or border on the container.
   
2. **Header row**: `margin: "mb-three-s"`, `alignItems: "center"`, `justifyContent: "between"`
   - Left col: heading + paragraph subtitle
   - Right col: action buttons (right-aligned with `className: "d-flex justify-content-end"`)

3. **Stats/KPI row**: `margin: "mb-two-s"`, 6 x `col-2` columns
   - `display` components directly in columns (no wrapper containers)

4. **Section header row**: `margin: "mb-two-s"`, split col-6 + col-6
   - Similar to header but with actionIcons for filtering/settings

5. **Search row**: `margin: "mb-two-s"`, single `col-4`
   - `search` component

6. **Data table row**: `margin: ""`, single `col-12`
   - `listview` with `fieldDefs`, `toolSettings`, `rowSettings`, `noDataScreen`
