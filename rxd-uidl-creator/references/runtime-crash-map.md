# Runtime Crash Map

A comprehensive map of every known crash point in the Swift Runtime (`swift-runtime/src/wrapper/`)
and the Designer Frontend (`nebula-studio-fe/Designer-Frontend/src/infra/components/Atoms/`),
and what UIDL property prevents it. Generated from source code audit of actual `.toString()` calls
and unsafe destructuring patterns.

> **Source repos**: `/Users/admin/Codes/swift-runtime`, `/Users/admin/Codes/nebula-studio-fe`

---

## Category 1: Unsafe `.toString()` — Will crash if property is `undefined` or `null`

### Swift Runtime

These are the **only two** runtime wrappers that call `.toString()` WITHOUT optional chaining (`?.`).
Every other wrapper uses `?.toString()` which is safe.

### heading/index.tsx:90
```typescript
content={
  typeof updatedContent === "string"
    ? updatedContent
    : updatedContent.toString()  // CRASH if updatedContent is null/undefined
}
```
**Trigger**: `metadata.content` is missing/undefined → `getUpdatedValue(undefined, ...)` → `renderOutput()` returns `undefined` → `typeof undefined !== "string"` → calls `undefined.toString()` → **CRASH**

**Prevention in UIDL**: Every `heading` node MUST have `"content": "some text"` (string, not empty). An empty string `""` is safe — `typeof "" === "string"` takes the safe branch.

### button/index.tsx:116
```typescript
caption={
  typeof updatedCaption === "string"
    ? updatedCaption
    : updatedCaption.toString()  // CRASH if updatedCaption is null/undefined
}
```
**Trigger**: `metadata.caption` is missing/undefined → same chain as heading → **CRASH**

**Prevention in UIDL**: Every `button` node MUST have `"caption": "Button Text"`. An empty string `""` is safe.

### Designer Frontend (nebula-studio-fe)

The Designer FE has its own set of unsafe `.toString()` calls in wrapper components at
`nebula-studio-fe/Designer-Frontend/src/infra/components/Atoms/`:

#### NbHeading.tsx:93
```typescript
updatedContent.toString()  // CRASH if content is missing from UIDL
```
Same pattern as the runtime — `getUpdatedValue(undefined)` → `undefined.toString()` → crash.

#### NbDropdown.tsx:62
```typescript
options.toString()  // CRASH if options is missing from UIDL
```
**Prevention**: Every `dropdown` node MUST have `"options"` property (use `"[]"` or `[]`).

#### NbSplitButton.tsx:63, 70
```typescript
props?.options.toString()  // Line 63: optional chaining on props but NOT on value
options.toString()          // Line 70: no null check at all
```
**Prevention**: Every `splitButton` node MUST have `"options"` property.

#### NbButton.tsx — SAFE in Designer ✓
Unlike the runtime, the Designer's NbButton uses truthiness checks (`caption && ...`) instead of `.toString()`.

---

## Category 2: Unsafe destructuring — Will crash if parent object is `undefined`

### metadataParser.ts:8 — `columnLayout()`
```typescript
export const columnLayout = (layout: LayoutType) => {
  const { colLayout } = layout;           // crash if layout is undefined
  const lgColSize = colLayout.lg.col;     // crash if lg is undefined
```
**Called by**: column/index.tsx, and indirectly by many leaf wrappers

**Prevention in UIDL**: Every node MUST have `"layout": { "colLayout": { "lg": { "col": "12" } } }`. The `lg` key MUST exist with a `col` property.

### button/index.tsx:102
```typescript
const { lg } = metadata?.layout?.colLayout;
```
**Trigger**: If `metadata.layout.colLayout` is `undefined`, destructuring crashes.

**Prevention in UIDL**: Every button MUST have full `layout.colLayout` with at least `lg` key.

### Multiple wrappers — `const { lg, md, sm } = metadata?.layout?.colLayout`
This pattern appears in: `container/index.tsx:67`, `row/index.tsx:64`, `column/index.tsx:51`, `button/index.tsx:102`

**Note**: The `?.` stops at `colLayout` but destructuring `{ lg }` from `undefined` still crashes.

**Prevention in UIDL**: ALL nodes need `layout.colLayout` with at least `lg` key.

### Worst cases (zero optional chaining)
- `currency/index.tsx:12` — `metadata.layout.colLayout.lg.col` — zero safety
- `daterangepicker/index.tsx:39` — `metadata?.layout.colLayout.lg.col` — partial safety

---

## Category 3: `getUpdatedValue()` returns `null` or `undefined`

The `getUpdatedValue()` function in `helpers/utils.ts` has these return paths:

```typescript
// Line 1340: Template still unresolved → safe
return "";

// Line 1341: Preference-processed value is literal "null" → returns actual null
return prefUpdatedValue === "null" ? null : prefUpdatedValue;

// Line 1352: Value is literal "null" → returns actual null
return updatedValue === "null" ? null : updatedValue;
```

And `renderOutput()` at line 1266 returns the original `text` parameter as fallback — which is the original `initialValue` passed to `getUpdatedValue`. If that was `undefined` (property missing from UIDL), it returns `undefined`.

**Prevention**: Always include ALL required string properties on every UIDL node. Missing properties flow through as `undefined` and crash at the `.toString()` call.

---

## Category 4: Safe `.toString()` calls (information only)

These use `?.toString()` (optional chaining) and won't crash:
- `Numeric/index.tsx` — `prefix?.toString()`, `suffix?.toString()`, `value?.toString()`
- `accordion/index.tsx` — `visibility?.toString()`, `?.toString()`
- `actionIcon/index.tsx` — `showDotBadge?.toString()`
- `switch/index.tsx` — `value?.toString()`, `checked?.toString()`
- `phone/index.tsx` — `value?.toString()`
- `rating/index.tsx` — `defaultValue?.toString()`
- `textEditor/index.tsx` — `newContent?.toString()`
- All autosuggest/search/reportviewer `index.toString()` calls (on loop index, always defined)

---

## Quick Reference: Required Properties by Component

| Component | Required Property | Type | Default Safe Value | Crash If Missing |
|-----------|------------------|------|-------------------|-----------------|
| heading | `content` | string | `""` | YES — `updatedContent.toString()` |
| button | `caption` | string | `""` | YES — `updatedCaption.toString()` (runtime); safe in Designer |
| dropdown | `options` | string/array | `"[]"` | YES — `options.toString()` (Designer FE) |
| actionIcon | `badgeFieldProps` | object | `{ controlType: "badge", ... }` | YES — `TypeError: reading 'margin'` |
| actionIcon | `badgeCountConfig` | object | `{ controlType: "badge", ... }` | YES |
| actionIcon | `badgeIconConfig` | object | `{ controlType: "badge", ... }` | YES |
| ALL nodes | `layout.colLayout.lg` | object | `{ "col": "12", "height": "200" }` | YES — destructuring crash |
| ALL nodes | `layout.colLayout.lg.col` | string | `"12"` | YES — `colLayout.lg.col` in `columnLayout()` |
| card | `cardConfig` | object | `{ enableBody: true, ... }` | YES — body won't render |
| card | `cardConfig.enableBody` | boolean | `true` | YES — body won't render |
| row | `margin` | string | `""` | YES — runtime reads `node.margin` directly |
| splitButton | `options` | string/array | `"[]"` | YES — `options.toString()` |

---

## The `getUpdatedValue` Chain (Full Trace)

```
UIDL property (e.g., content: "Hello")
  → metadata.content = "Hello"
  → getUpdatedValue("Hello", currentState)
    → getExtractedText("Hello", ...) → tries template resolution
    → replaceVariablesInContent("Hello", ...) → tries variable substitution
    → renderOutput(replacedValue, extractedValue, "Hello")
      → returns "Hello" (no templates found, original text returned)
    → typeof "Hello" === "string" && starts with "{{" ? → no
    → return "Hello"
  → updatedContent = "Hello"
  → typeof "Hello" === "string" ? "Hello" : "Hello".toString()
  → renders "Hello" ✓

UIDL property MISSING (content not in metadata)
  → metadata.content = undefined
  → getUpdatedValue(undefined, currentState)
    → getExtractedText(undefined, ...) → returns undefined
    → replaceVariablesInContent(undefined, ...) → returns undefined
    → renderOutput(undefined, undefined, undefined)
      → all undefined → returns text (= undefined)
    → updatedValue === "null" ? null : undefined
    → return undefined
  → updatedContent = undefined
  → typeof undefined === "string" ? → NO
  → undefined.toString() → CRASH! 💥
```
