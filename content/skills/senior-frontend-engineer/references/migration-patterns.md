# Migration Patterns Reference

Read this file when performing any frontend migration. Each section covers a specific migration type with strategy, common pitfalls, and verification steps.

## Table of Contents

1. [Component Library Migrations](#component-library-migrations)
2. [CSS Framework Migrations](#css-framework-migrations)
3. [Framework Migrations](#framework-migrations)
4. [JavaScript to TypeScript](#javascript-to-typescript)
5. [State Management Migrations](#state-management-migrations)
6. [Build System Migrations](#build-system-migrations)
7. [Universal Pitfalls](#universal-pitfalls)

---

## Component Library Migrations

**Examples**: Material UI → shadcn/ui, Ant Design → Radix, Bootstrap React → Headless UI, custom library → design system components.

### Strategy

1. **Audit usage.** Search the codebase for every import from the old library. Group by component type (buttons, inputs, modals, tables, etc.). This is your migration surface.

2. **Build a component mapping table.** For each old component, identify the new equivalent:

   ```
   Old: <MuiButton variant="contained" color="primary">
   New: <Button variant="default">

   Old: <MuiTextField label="Email" error={!!errors.email} helperText={errors.email}>
   New: <div><Label htmlFor="email">Email</Label><Input id="email" />{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}</div>
   ```

   Pay close attention to: prop name differences, structural differences (some libraries wrap label+input together, others don't), default styling differences, event handler signatures.

3. **Handle the hard cases first.** Some components won't map 1:1. Complex tables, rich text editors, date pickers, and autocomplete inputs often have significantly different APIs. Plan wrapper components or custom implementations for these before starting the bulk migration.

4. **Migrate bottom-up.** Start with leaf components (buttons, badges, icons) that are used everywhere but depend on nothing. Then move up to composite components (forms, cards, modals) that use the leaf components. This means your early migrations have the widest impact and you catch systemic issues fast.

5. **Coexistence during migration.** Both libraries will be installed simultaneously. Watch for:
   - Conflicting global CSS resets (both libraries may inject global styles)
   - Duplicate provider wrappers (theme providers, toast providers)
   - CSS specificity wars (old library's styles overriding new library's styles or vice versa)
   - Bundle size temporarily bloating (both libraries in the bundle)

### Common Pitfalls

- **Default spacing differs.** MUI buttons have different default padding than shadcn buttons. Ant Design cards have different default margins than custom cards. After each component migration, visually check spacing.
- **Focus ring styles differ.** Every library handles focus indicators differently. Ensure keyboard users still see clear focus after migration.
- **Animation/transition differences.** Modals, dropdowns, tooltips — their open/close animations will differ. Decide whether to match the old animations or accept the new library's defaults.
- **Controlled vs uncontrolled defaults.** Some libraries default to controlled inputs, others to uncontrolled. Check form behavior after migration.
- **Theme variable naming.** Old library's `primary` color might not match new library's `primary`. Map theme tokens explicitly.

### Verification

- Every migrated component renders identically at mobile, tablet, and desktop
- Tab order and keyboard navigation work as before
- Form submission behavior unchanged
- No console warnings about deprecated props or missing handlers

---

## CSS Framework Migrations

**Examples**: Bootstrap → Tailwind, CSS Modules → Tailwind, styled-components → CSS Modules, Sass → Tailwind, custom CSS → design system tokens.

### Strategy

1. **Inventory all style sources.** Find every CSS file, styled-component, CSS module, inline style, and utility class in the project. Understand the full styling surface.

2. **Map the design tokens.** Before touching components, map the old framework's values to the new:

   ```
   Bootstrap spacing:   1=0.25rem, 2=0.5rem, 3=1rem, 4=1.5rem, 5=3rem
   Tailwind spacing:    1=0.25rem, 2=0.5rem, 3=0.75rem, 4=1rem, 5=1.25rem, 6=1.5rem, 8=2rem, 12=3rem

   Bootstrap .text-primary = #0d6efd
   Tailwind text-primary = project-specific (check tailwind.config)
   ```

   The spacing scales are NOT equivalent. `p-3` in Bootstrap is `1rem`; `p-3` in Tailwind is `0.75rem`. This is where most visual regressions come from.

3. **Set up the new framework alongside the old.** For Tailwind, install and configure it to generate classes with a prefix (e.g., `tw-`) during migration to avoid collisions: `prefix: 'tw-'` in tailwind.config. Remove the prefix after migration is complete.

4. **Migrate one component file at a time.** Replace old classes with new classes, old tokens with new tokens. After each file, visually compare.

5. **Handle responsive breakpoints carefully.** Bootstrap: `sm=576`, `md=768`, `lg=992`, `xl=1200`. Tailwind: `sm=640`, `md=768`, `lg=1024`, `xl=1280`. These differences cause layout shifts at certain viewport widths. Either adjust the new framework's config to match the old breakpoints, or verify layout at every breakpoint.

### Common Pitfalls

- **CSS specificity changes.** Utility classes and CSS modules have different specificity profiles than Bootstrap's classes. Overrides that worked before may not work after.
- **Global resets differ.** Bootstrap's `reboot.css` normalizes elements differently than Tailwind's `preflight.css`. Heading sizes, margin resets, list styles — check them all.
- **Missing responsive classes.** Not every Bootstrap responsive utility has a Tailwind equivalent. Some require custom utilities or `@apply` directives.
- **Dark mode implementation differs.** Bootstrap uses `data-bs-theme`, Tailwind uses `class` or `media` strategy. Make sure dark mode still works.
- **Pseudo-class support.** styled-components handles `:hover`, `:focus`, `::before` inline. CSS modules and Tailwind handle them differently. Verify every interactive state.

### Verification

- Compare screenshots at 320px, 768px, 1024px, 1440px viewports
- Toggle dark mode and verify all components
- Check that custom scrollbars, animations, and transitions survived
- Verify that no old framework CSS remains (search for old class patterns)
- Check bundle size — CSS frameworks have very different output sizes

---

## Framework Migrations

**Examples**: Vue → React, Angular → React, class components → function components with hooks, Pages Router → App Router (Next.js), Options API → Composition API (Vue).

### Strategy

This is the hardest type of migration. Reactivity models, component lifecycles, template syntax, and dependency injection all differ fundamentally between frameworks.

1. **Map the mental model.** Before writing code, understand how concepts translate:

   ```
   Vue ref()           → React useState()
   Vue computed()      → React useMemo()
   Vue watch()         → React useEffect() (with deps)
   Vue onMounted()     → React useEffect(() => {}, [])
   Vue provide/inject  → React Context
   Vue v-if/v-for      → React conditional rendering / .map()
   Vue emit()          → React callback props
   Vue slots           → React children / render props

   Angular @Input()    → React props
   Angular @Output()   → React callback props
   Angular Services    → React Context + hooks, or external stores
   Angular Pipes       → React utility functions
   Angular Directives  → React HOCs or custom hooks
   Angular Modules     → React doesn't have an equivalent (just imports)
   ```

2. **Migrate data layer first.** Extract business logic into framework-agnostic modules (plain TypeScript functions and classes). API calls, data transformations, validation — none of these should depend on the UI framework. This makes the framework migration a UI-only concern.

3. **Rebuild component-by-component.** Start with the outermost layout (app shell, navigation, routing), then work inward. This lets you run the new and old in parallel — the new app shell rendering old components through adapter wrappers while you migrate them one by one.

4. **Route structure is a separate concern.** Map the old routing to the new framework's router. Ensure URL structure stays identical — changing URLs breaks bookmarks, SEO, and external links.

### Common Pitfalls

- **Reactivity model differences.** Vue's reactivity is automatic (mutate and it updates). React requires explicit state updates. Angular's change detection is zone-based. Missing a state update in React that was automatic in Vue causes stale UI.
- **Lifecycle timing.** `onMounted` (Vue) fires after DOM mount. `useEffect` (React) fires after paint. `ngOnInit` (Angular) fires before the template renders. Timing-sensitive code (measuring DOM, initializing third-party libraries) must account for these differences.
- **Two-way binding loss.** Vue's `v-model` and Angular's `[(ngModel)]` are two-way bindings. React doesn't have two-way binding — you need controlled components with explicit `onChange` handlers. Every form must be rewired.
- **Scoped styles.** Vue's `<style scoped>` and Angular's view encapsulation have no direct React equivalent. Choose a styling approach (CSS modules, Tailwind, styled-components) and migrate all scoped styles.
- **Server-side rendering.** SSR works differently in Next.js vs Nuxt vs Angular Universal. Data fetching, hydration, and streaming patterns all change.

### Verification

- Application boots and renders correctly
- All routes produce identical URLs and content
- Forms submit correctly with validation
- All interactive behaviors (modals, dropdowns, drag-and-drop) work
- Server-side rendering produces the same HTML (if applicable)
- SEO-critical meta tags are preserved

---

## JavaScript to TypeScript

### Strategy

1. **Configure TypeScript incrementally.** Start with `strict: false` in `tsconfig.json` and enable rules one at a time. Or use `// @ts-check` in JS files to get type checking without renaming.

2. **Rename files in dependency order.** Start with utility files that have no imports from the project, then move outward. This avoids cascading type errors from un-typed dependencies.

3. **Don't type everything perfectly on day one.** It's acceptable to use `unknown` as a stepping stone (never `any`). Replace `unknown` with proper types as you understand the data shapes. The goal is to get the project compiling, then progressively tighten types.

4. **Generate types from your data sources.** If you have an API, generate types from the OpenAPI spec or GraphQL schema. If you have a database, generate types from the schema. Don't hand-write types that should come from a source of truth.

### Common Pitfalls

- **Third-party libraries without types.** Some libraries don't have `@types/*` packages. Write a `declarations.d.ts` with `declare module 'library-name'` as a temporary bridge, but flag it for proper typing later.
- **Event handler types.** `React.ChangeEvent<HTMLInputElement>` vs `React.MouseEvent<HTMLButtonElement>` vs `Event` — get these right. Don't use `any` for events.
- **Generic component patterns.** Typing HOCs, render props, and forwarded refs in TypeScript is genuinely tricky. Use the framework's built-in type helpers (`React.ComponentProps<typeof Component>`, `React.ForwardRefRenderFunction`).
- **Enum vs union type.** Prefer union types (`type Status = 'active' | 'inactive'`) over TypeScript `enum`. Unions are lighter, tree-shake better, and are more idiomatic in modern TS.

### Verification

- `tsc --noEmit` passes with zero errors
- No `any` in the final code (search for it)
- No `@ts-ignore` or `@ts-expect-error` (search for them)
- All tests still pass
- Build succeeds and output works identically

---

## State Management Migrations

**Examples**: Redux → Zustand, MobX → Jotai, Context → external store, prop drilling → state library.

### Strategy

1. **Map the state shape.** Document every piece of state: where it lives, what reads it, what writes it, how it's derived. This is your migration blueprint.

2. **Migrate one slice at a time.** If using Redux with multiple slices, migrate one slice to Zustand (or whatever the target is) at a time. Both stores can coexist during migration.

3. **Preserve the subscription pattern.** If components subscribe to specific state slices for performance (Redux selectors, Zustand selectors, MobX computed), ensure the new implementation has equivalent selectivity. Don't regress from fine-grained subscriptions to re-rendering the whole tree.

4. **Side effects need special attention.** Redux Saga → plain async functions. Redux Thunk → store actions. MobX reactions → Zustand subscriptions. Each migration has different patterns for handling async work and side effects.

### Common Pitfalls

- **Middleware differences.** Redux middleware (logging, persistence, devtools) may not have direct equivalents. Check devtools support in the new library.
- **Hydration differences.** If the state is persisted (localStorage, SSR), the hydration mechanism differs between libraries.
- **TypeScript generics.** Each state library has a different generics pattern for typing stores and selectors. Refer to the target library's TypeScript documentation.

### Verification

- All state transitions work identically
- Derived state computes correctly
- Persistence/hydration works as before
- DevTools integration works (if applicable)
- No unnecessary re-renders introduced

---

## Build System Migrations

**Examples**: Webpack → Vite, Create React App → Vite, CRA → Next.js, Parcel → Vite.

### Strategy

1. **Inventory build-specific code.** Webpack loaders, CRA-specific environment variables (`REACT_APP_*`), custom plugins — find everything that depends on the old build system.

2. **Migrate config first, don't touch source.** Set up the new build system to handle the existing source code as-is. Fix build errors by adjusting config, not by changing application code. Application code changes come after the build works.

3. **Environment variables.** CRA uses `REACT_APP_` prefix. Vite uses `VITE_`. Next.js uses `NEXT_PUBLIC_`. Rename all environment variable references.

4. **Static assets.** Different bundlers handle `import logo from './logo.svg'` differently. Verify all asset imports resolve correctly.

### Common Pitfalls

- **Path aliases.** Webpack's `resolve.alias` must be replicated in Vite's config and tsconfig.
- **Proxy configuration.** CRA's `proxy` field in `package.json` → Vite's `server.proxy` config.
- **CSS processing.** PostCSS, Sass, Less — verify preprocessor plugins are configured in the new build system.
- **Code splitting behavior.** Different bundlers split code differently. Check that lazy-loaded routes still load correctly.
- **Development server differences.** Hot module replacement (HMR) behavior, error overlay style, port configuration — verify the dev experience is intact.

### Verification

- `npm run build` (or equivalent) succeeds with zero errors
- `npm run dev` starts and HMR works
- All routes load correctly (including lazy-loaded ones)
- All environment variables resolve
- All static assets (images, fonts, SVGs) render
- Bundle size is comparable or better

---

## Universal Pitfalls

These apply to every migration type:

1. **Don't migrate and refactor at the same time.** Migration is a mechanical operation — replace technology A with technology B, same behavior. Refactoring is a design operation — improve code structure, change patterns. Doing both simultaneously makes it impossible to tell whether a bug came from the migration or the refactor. Migrate first, refactor second.

2. **Don't delete the old code until migration is verified.** Comment it out, move it to a `_deprecated/` folder, whatever — but keep it accessible until the new code is verified working. You will need to reference it.

3. **Test at every intermediate step.** After every component, every file, every slice — verify. Don't batch 20 migrations and then check. You'll spend more time debugging than you saved by batching.

4. **Watch for silent failures.** A component that renders nothing is technically "not crashing." But if it used to render a dropdown and now renders empty space, that's a regression. Check positive rendering, not just absence of errors.

5. **Document what you changed.** After the migration, leave a brief commit message or PR description that lists: what was migrated, what the old technology was, what the new technology is, and any known differences or trade-offs.
