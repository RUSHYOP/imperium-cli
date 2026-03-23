# Runtime Foundations

Read this whenever you are creating or improving UIDL generation, React -> UIDL conversion,
templates, validators, or agent instructions.

This project does **not** have freedom to invent a cleaner saved format. The current Swift
Runtime, Nebula Studio, and helper flows already parse a specific UIDL contract. Improvements
must reuse that contract and make authoring safer on top of it.

## Non-Negotiable Contract

### 1. Metadata shape is fixed, but the storage layer has two valid forms

- The canonical page tree is the UIDL metadata array.
- Local authoring files can safely store that bare array directly under `projects/*.json`.
- Designer import/export uses a wrapped bundle with `pageId`, `metadata`, and optional query data.
- API save uses `{ pageId, metadata: JSON.stringify({ pageInfo, metadata, queryEvents }) }`.
- For standard pages/fragments, the structural path is:
  `container -> row -> column -> leaf`

This means helper layers may exist during authoring, but the **final output for each target**
must still expand to the canonical runtime/import/save shape before validation or transport.

### 2. Bootstrap 12-column layout is the foundation

- `layout.colLayout` is not abstract metadata; the runtime converts it directly into Bootstrap
  classes like `col-lg-* col-md-* col-sm-*`.
- Container, row, and column wrappers append `className` and `margin` directly to the rendered
  Bootstrap structure.
- The runtime/global helper classes (`mb-two-s`, `p-two-s`, `wd-100`, `text-center`, etc.)
  are part of this same foundation.

When building React first, prototype the same wrapper structure you intend to ship in UIDL:
`container-fluid -> row -> col-* -> Nb* component`.

### 3. Designer fields are still part of the working contract

These fields may look like editor-only boilerplate, but the current Studio/runtime ecosystem
still reads or writes them:

- `isDragging`
- `selectedComponentId`
- `componentDropped`
- `index`
- `accept`
- `dropPosition`

Do **not** strip them from final UIDL. If a helper wants to hide them during authoring, it must
re-insert them before validation/save/import.

### 4. Component contracts are fixed today

Use components and wrappers **as they exist now**. Do not invent simplified props, alternate
children formats, or custom component APIs.

Important examples:

- `card` body content uses named slots: `{ header: [], body: [], footer: [] }`
- `panel`, `accordion`, `Div`, `form` use flat `children: []`
- `tab` uses keyed children object, not a flat array
- `actionIcon` must include `badgeFieldProps`, `badgeCountConfig`, and `badgeIconConfig`

If a component is awkward, solve it with templates, presets, validator checks, or better docs,
not by changing the component contract in generated UIDL.

## What We Can Improve Safely

These are good improvement surfaces because they keep the runtime foundations intact:

- Validator rules that catch contract mistakes earlier
- Node templates and presets that emit canonical UIDL
- React scaffolders that mirror the Bootstrap/runtime wrapper model
- Helper scripts that expand internal authoring shortcuts into canonical UIDL before validation
- Metadata-first project storage plus explicit export/translation helpers
- Generated catalogs that feed MCP and automation from the same source of truth
- Better reference docs inside the existing `uidl-creator` skill
- A better feedback loop using existing tools (`validate-uidl.js`, `simulate_runtime.js`,
  `test_full_flow.js`, Vite prototype preview)

## What Is Blocked Right Now

These are **not** safe defaults under the current implementation:

- Changing the saved UIDL structure
- Removing designer fields from final files
- Replacing the Bootstrap 12-column layout model
- Changing component APIs or wrapper parsing assumptions
- Inventing a parallel layout system for React that later has to be "interpreted" into UIDL

## Practical Rule

Make things easier by improving the **authoring path**, not by changing the **runtime contract**.
Reuse the existing `uidl-creator` skill references, templates, validator, and scaffolders. Avoid
random parallel conventions that the runtime never sees.

## Source Audit Behind This Reference

The constraints above were confirmed against the live implementation in
`/Users/admin/Codes/nebula-research`, especially:

- `nebula-runtime-platform-dev-stable/uidl-reference.md`
- `swift-runtime-dev-stable/src/store/pageDetails.ts`
- `swift-runtime-dev-stable/src/helpers/metadataParser.ts`
- `swift-runtime-dev-stable/src/wrapper/container/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/row/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/column/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/card/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/tabs/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/panel/index.tsx`
- `swift-runtime-dev-stable/src/wrapper/actionIcon/index.tsx`
- `nebula-studio-fe-dev-stable/Designer-Frontend/src/services/utils.ts`
- `nebula-studio-fe-dev-stable/Designer-Frontend/src/infra/components/Parser/RenderControl.tsx`

Additionally, a crash-point audit was performed against the live repos (2026-03-21):
- `/Users/admin/Codes/swift-runtime/src/wrapper/heading/index.tsx` — line 90: unsafe `updatedContent.toString()`
- `/Users/admin/Codes/swift-runtime/src/wrapper/button/index.tsx` — line 116: unsafe `updatedCaption.toString()`
- `/Users/admin/Codes/swift-runtime/src/helpers/metadataParser.ts` — line 8: unsafe `colLayout.lg.col`
- `/Users/admin/Codes/swift-runtime/src/helpers/utils.ts` — lines 1247-1360: `getUpdatedValue()` and `renderOutput()` chain
- `/Users/admin/Codes/nebula-studio-fe/Designer-Frontend/src/infra/components/Atoms/NbHeading.tsx` — line 79: same pattern

Full crash map: `references/runtime-crash-map.md`
