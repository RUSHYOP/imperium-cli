# How the Runtime Renders UIDL

This document explains exactly how the swift-runtime engine converts UIDL JSON into HTML.
Understanding this is critical for writing correct UIDL — if you don't understand how the
wrappers work, your styles, heights, and classes won't apply where you expect.

## Rendering Pipeline

1. The UIDL JSON (an array) is loaded
2. Each top-level node is passed to `ControlAdapter`
3. `ControlAdapter` matches `metadata.controlType` against the `Control` enum
4. The matching wrapper component renders HTML with children via recursive `ControlAdapter` calls

## The Tree Structure

Every UIDL page follows: **Container → Row → Column → Leaf Component**

```
container (outer div with container-fluid/container class)
  └── row (div with row class + flex)
       └── column (div with col-lg-N class)
            └── leaf component (heading, textbox, button, etc.)
```

You CANNOT skip levels. A heading inside a container without a row/column wrapper will render
but won't have proper Bootstrap grid layout.

---

## Container Wrapper

**Source**: `swift-runtime/src/wrapper/container/index.tsx`

### What it renders:
```html
<div
  className="container-layout container-fluid {margin} {className}"
  id="{id}"
  style="{ ...JSON.parse(styles), height: height }"
>
  {children}
</div>
```

### Key behaviors:

1. **`containerType`** → `"fluid"` maps to class `container-fluid` (100% width), `"fixed"` maps to `container` (max-width breakpoints)

2. **`styles`** — In source code, the wrapper does `isValidJson(metadata?.styles)` and tries `JSON.parse()`. However, in **production UIDL**, `styles` is always a **plain object** (e.g., `{"backgroundColor": ""}`), NOT a JSON string. When it's a plain object, `isValidJson()` returns false and the safe fallback `{ height: height }` applies. This means `backgroundColor` from styles won't be applied via this path — use CSS classes instead.
   ```js
   isValidJson(metadata?.styles)
     ? { ...JSON.parse(metadata?.styles), height: height }
     : { height: height }   // ← this branch always taken in production
   ```

3. **CRITICAL: Height override** — The wrapper ALWAYS spreads `height` from `layout.colLayout.lg.height` OVER the parsed styles. This means:
   - `height` set inside the `styles` JSON string gets **overridden** by `layout.colLayout.lg.height`
   - If `lg.height` is missing/empty, it defaults to `""`, which **wipes out** any height in styles
   - **Always put height in `layout.colLayout.lg.height`**, never in the styles JSON string

4. **`className`** is appended after `container-layout` and `container-fluid`/`container`. It goes through `getUpdatedValue()` for dynamic state resolution.

5. **`margin`** is appended as a class (runtime/global spacing like `"mb-two-s"` or grid-compatible spacing like `"mb-3"`)

### Container className generation:
```
"container-layout" + "container-fluid"|"container" + margin + className
```

---

## Row Wrapper

**Source**: `swift-runtime/src/wrapper/row/index.tsx`

### What it renders:
```html
<div
  id="{id}_row"
  className="row-layout row {d-flex} {align-items-lg-*} {justify-content-lg-*} {margin} {className}"
  style="{ height: height || 'auto' }"
>
  {children}
</div>
```

### Key behaviors:

1. **`d-flex`** is only added if `lg.alignItems` OR `lg.justifyContent` is set. Without those, no flex class.

2. **Alignment classes** are generated from `layout.colLayout`:
   - `lg.alignItems: "center"` → `align-items-lg-center`
   - `lg.justifyContent: "between"` → `justify-content-lg-between`
   - Also generates `sm` and `md` variants if set

3. **`styles`** on rows is `{}` (empty object). Rows don't parse styles as JSON like containers.

4. **Height** comes from `layout.colLayout.lg.height`. Default is `"auto"`.

5. **`className`** on the row is appended to the class list. This is where you put `"no-gutters h-100"` etc.

6. **`margin`** is appended as a class (e.g. `"mb-two-s"`)

### Row className generation:
```
"row-layout" + "row" + d-flex(conditional) + align-items-lg-* + justify-content-lg-* + margin + className
```

---

## Column Wrapper

**Source**: `swift-runtime/src/wrapper/column/index.tsx`

### What it renders:
```html
<div
  className="column-layout {col-lg-N col-md-N col-sm-N} {col-SM} {d-flex} {align-*} {justify-*} {margin} {className}"
  id="{id}"
  style="{ height: height }"
>
  {children}
</div>
```

### Key behaviors:

1. **Column sizing** uses `columnLayout()` helper function which generates `col-lg-N col-md-N col-sm-N` from `layout.colLayout`.

2. **`col-lg-0 col-md-0 col-sm-0`** is treated as invalid and replaced with just `"col"` (auto-width).

3. **Flex classes** work the same as row — `d-flex` only if alignItems or justifyContent is set on `lg`.

4. **Height** from `layout.colLayout.lg.height`, applied via inline style.

5. **`className`** is where you put utility classes like `"h-100 p-0 text-center"`.

### Column className generation:
```
"column-layout" + col-lg-N col-md-N col-sm-N + col-SM(optional) + d-flex(conditional) + align-* + justify-* + margin + className
```

---

## Leaf Component Wrappers

Each leaf component (heading, textbox, button, etc.) has its own wrapper in `swift-runtime/src/wrapper/{name}/index.tsx`.

### Common patterns across all leaf wrappers:
- They read props directly from `metadata` (not from `styles`)
- `className` is composed as: `${metadata?.margin} ${getUpdatedValue(metadata?.className, currentState)}`
- `visibility` is tracked in state and can be toggled
- `id` is read from `nameIdMapping[metadata?.id] || metadata?.id`

### Heading wrapper:
```tsx
<AHeading
  content={content}   // NOT caption
  tag={tag || "h3"}    // NOT variant
  weight={weight}
  color={color}
  fontSize={fontSize}
  className={`${margin} ${className}`}
/>
```

### Textbox wrapper:
The textbox wrapper lives at `wrapper/textfield/index.tsx` (NOT `wrapper/textbox/`).
```tsx
<ATextbox
  caption={caption}
  variant={variant || "standard"}
  enableInheritWidth={enableInheritWidth}
  placeholder={placeholder}
  size={size}
  inputFieldType={inputFieldType}
  value={value}
  className={`${margin} ${className}`}
  // ... error, success, mandatory, disabled, isReadonly, hideCaption, maxLength
/>
```

### Button wrapper:
```tsx
<AButton
  caption={caption}
  variant={variant}
  color={color}
  size={size}
  className={`${classNameStyling(lg)} ${margin} ${className}`}
  startIcon={startIcon ? <NbIcon iconKey={startIcon} /> : null}
  endIcon={endIcon ? <NbIcon iconKey={endIcon} /> : null}
  disabled={disabled}
  hideCaption={hideCaption}
  tooltip={tooltip}
/>
```

### Checkbox wrapper:
```tsx
<ACheckbox
  caption={caption}
  hideCaption={hideCaption}
  title={title}
  hideTitle={hideTitle}
  checked={checked}
  name={name}
  size={size}
  className={`${margin} ${className}`}
/>
```

### Paragraph wrapper:
```tsx
<AParagraph
  content={content}     // NOT caption
  color={color}
  size={size}
  weight={weight}
  lineHeight={lineHeight}
  className={`${margin} ${className}`}
/>
```

### Separator wrapper:
```tsx
<ASeparator
  orientation={orientation}
  color={color}
  weight={weight}       // "thin", "default", "thick"
  width={width}
  minHeight={minHeight}
  className={`${margin} ${className}`}
/>
```

### Video wrapper:
```tsx
<AVideo
  videoSource={videoSource}   // "YOUTUBE", "VIMEO", "LOCAL"
  url={url}
  orientation={orientation}   // "LANDSCAPE", "PORTRAIT"
  enableAutoPlay={enableAutoPlay}
  enableFullScreen={enableFullScreen}
  caption={caption}
  hideCaption={hideCaption}
  minVideoWidth={minVideoWidth}
  minVideoHeight={minVideoHeight}
  className={`${margin} ${className}`}
/>
```
Video height is aspect-ratio locked: LANDSCAPE = `(parentWidth * 9) / 16` px.

### Hyperlink wrapper:
```tsx
<AHyperlink
  content={content}
  url={url}
  variant={variant}
  size={size}
  className={`r-hyperlink ${classNameStyling(lg)} ${margin} ${className}`}
  openLinkinSamePage={openLinkinSamePage}
  enableNavigation={enableNavigation}
/>
```

---

## Known Crash Points (Source Code Audit)

The following wrapper patterns cause `TypeError: Cannot read properties of undefined (reading 'toString')` or similar crashes. For the complete crash map, see `references/runtime-crash-map.md`.

### Unsafe `.toString()` (no optional chaining)
- **heading/index.tsx:90** — `updatedContent.toString()` — crashes if `content` property is missing
- **button/index.tsx:116** — `updatedCaption.toString()` — crashes if `caption` property is missing

### Unsafe destructuring
- **metadataParser.ts:8** — `const lgColSize = colLayout.lg.col;` — crashes if `lg` or `col` is missing
- **button/index.tsx:102** — `const { lg } = metadata?.layout?.colLayout;` — crashes if `colLayout` is undefined
- **container/row/column** — `const { lg, md, sm } = metadata?.layout?.colLayout;` — same pattern

### Unsafe property access
- **currency/index.tsx:12** — `metadata.layout.colLayout.lg.col` — zero optional chaining
- **daterangepicker/index.tsx:39** — `metadata?.layout.colLayout.lg.col` — partial optional chaining

### Silent failures (no crash, but broken render)
- **card** without `cardConfig` — body content never renders
- **row** without `margin` — `undefined` concatenated into className string
