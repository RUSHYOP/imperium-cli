---
name: compiler-design-expert
description: "Expert-level guidance for JavaScript/TypeScript AST manipulation, code transformation, and compiler tooling. Covers Babel plugin authoring, jscodeshift codemods, custom ESLint rules, recast-based transforms, SWC plugins, and general AST work. Use this skill whenever the user mentions ASTs, abstract syntax trees, codemods, Babel plugins, jscodeshift, code transforms, custom ESLint rules, codemod scripts, migration scripts that modify source code, automated refactoring, syntax tree manipulation, visitor patterns for code, parse-transform-print pipelines, or any task involving programmatic reading/writing/modifying of source code structure. Also use when the user wants to write a Babel preset, build a compiler plugin, create a custom syntax transform, or automate large-scale code changes across a codebase."
---

# Compiler Design Expert

Expert-level skill for JavaScript/TypeScript AST manipulation, code transformation pipelines, and compiler tooling. This covers the full spectrum from understanding AST node types to shipping production codemods that safely transform thousands of files.

## Before You Start

1. Read the user's code or description to identify what kind of transform they need
2. Check what tooling is already in the project (`package.json` for babel, jscodeshift, eslint, swc dependencies)
3. Determine the transform category — this shapes everything:
   - **One-off codemod** (migrate API, rename imports) → jscodeshift
   - **Ongoing build transform** (syntax extension, compile-time optimization) → Babel plugin
   - **Lint rule with autofix** (enforce patterns) → ESLint rule
   - **High-performance transform** (build pipeline, bundler plugin) → SWC
   - **Print-preserving edit** (cosmetic changes, formatting-sensitive) → recast directly
4. If the user's description is vague ("I want to transform some code"), ask what the input looks like and what the output should look like — a before/after example is worth more than paragraphs of description

## AST Fundamentals

Every tool in this space follows the same core pipeline:

```
Source Code → Parse → AST → Transform → Generate → Modified Code
```

The AST (Abstract Syntax Tree) is a tree representation of source code where each node represents a syntactic construct. Understanding node types is the foundation — everything else builds on it.

### Key Node Types

These are the nodes you'll work with constantly. The naming follows the ESTree/Babel AST spec:

| Category | Common Nodes | When You'll Hit Them |
|----------|-------------|---------------------|
| **Declarations** | `VariableDeclaration`, `FunctionDeclaration`, `ClassDeclaration` | Renaming, scoping changes |
| **Expressions** | `CallExpression`, `MemberExpression`, `ArrowFunctionExpression`, `ConditionalExpression` | API migration, function wrapping |
| **Statements** | `ExpressionStatement`, `ReturnStatement`, `IfStatement`, `BlockStatement` | Control flow changes |
| **Imports/Exports** | `ImportDeclaration`, `ImportSpecifier`, `ExportDefaultDeclaration` | Module migration, barrel files |
| **Literals** | `StringLiteral`, `NumericLiteral`, `TemplateLiteral`, `BooleanLiteral` | Value transforms |
| **JSX** | `JSXElement`, `JSXAttribute`, `JSXExpressionContainer`, `JSXSpreadAttribute` | Component API changes, prop transforms |
| **TypeScript** | `TSTypeAnnotation`, `TSInterfaceDeclaration`, `TSTypeReference`, `TSAsExpression` | Type migration, generic transforms |
| **Patterns** | `ObjectPattern`, `ArrayPattern`, `RestElement` | Destructuring transforms |

When unsure about a node's shape, use AST Explorer (https://astexplorer.net) — paste the code, see the tree. This is faster than reading spec docs and catches edge cases in node structure.

### The Visitor Pattern

All AST tools use the visitor pattern: you declare which node types you care about, and the traversal engine calls your function when it visits matching nodes.

```javascript
// Babel visitor — called for every CallExpression in the tree
const visitor = {
  CallExpression(path) {
    // path.node = the AST node
    // path.parent = parent node
    // path.scope = lexical scope info
    // path.replaceWith() / path.remove() / path.insertBefore() etc.
  }
};
```

The `path` object (in Babel) or `NodePath` (in jscodeshift) wraps the raw node with traversal context and mutation methods. Always work through the path, not the raw node — direct node mutation breaks traversal state and causes subtle bugs.

### Scope and Binding

Scope analysis is what separates toy transforms from robust ones. Before renaming a variable or moving a declaration:

- **Check if the name is already bound** in the target scope (`path.scope.hasBinding('name')`)
- **Check references** to understand what will break (`path.scope.getBinding('name').references`)
- **Generate unique identifiers** when introducing new names (`path.scope.generateUidIdentifier('temp')`)

Ignoring scope is the #1 cause of codemods that "work on simple cases but break real code."

## Choosing Your Tool

### Decision Tree

```
What's the goal?
├─ Migrate code once (API change, library swap, deprecation)
│  └─ jscodeshift — designed exactly for this
├─ Transform on every build (syntax feature, compile-time macro)
│  └─ Babel plugin — runs in the build pipeline
├─ Enforce a pattern with autofix
│  └─ ESLint rule — linting + auto-repair in one
├─ Performance-critical build step
│  └─ SWC plugin — Rust-speed, WASM-deployable
└─ Preserve exact formatting (whitespace, comments, semicolons)
   └─ recast directly — its printer preserves what it can
```

### Tool Comparison

| | jscodeshift | Babel Plugin | ESLint Rule | SWC Plugin |
|---|---|---|---|---|
| **Language** | JS | JS | JS | Rust |
| **AST format** | ESTree (via recast) | Babel AST | ESTree | SWC AST |
| **Runs** | CLI, once | Build pipeline | Lint pass | Build pipeline |
| **Print preservation** | Yes (recast) | No (regenerates) | Partial (fixer) | No |
| **Scope analysis** | Manual | Built-in (`path.scope`) | Built-in (`scope`) | Manual |
| **Best for** | Codemods | Syntax transforms | Pattern enforcement | Perf-critical |

For detailed patterns and code templates, see:
- `references/jscodeshift-patterns.md` — codemod recipes, CLI usage, testing
- `references/babel-plugins.md` — plugin structure, visitor patterns, preset authoring
- `references/eslint-rules.md` — rule anatomy, autofix, testing with RuleTester
- `references/ast-node-reference.md` — complete node type catalog with field descriptions

## Writing Transforms: General Principles

These apply regardless of which tool you're using.

### 1. Start From a Before/After Example

Always begin with a concrete example of the transform:

```javascript
// BEFORE
import { oldFunc } from 'old-lib';
const result = oldFunc(a, b);

// AFTER
import { newFunc } from 'new-lib';
const result = newFunc({ first: a, second: b });
```

Then decompose what changed:
- Import source changed: `'old-lib'` → `'new-lib'`
- Import specifier renamed: `oldFunc` → `newFunc`
- Call arguments changed: positional → named object

Each of these is a separate visitor concern. Don't try to handle everything in one visitor — compose small transforms.

### 2. Match Precisely, Transform Minimally

The biggest source of codemod bugs is over-matching. If you're looking for calls to `oldFunc`, make sure you're not accidentally matching a local variable also named `oldFunc`:

```javascript
// Bad: matches ANY call to something named oldFunc
CallExpression(path) {
  if (path.node.callee.name === 'oldFunc') { ... }
}

// Good: verify it's the imported binding, not a local shadow
CallExpression(path) {
  if (
    path.node.callee.name === 'oldFunc' &&
    path.scope.getBinding('oldFunc')?.path.isImportSpecifier()
  ) { ... }
}
```

### 3. Handle Edge Cases Explicitly

Real codebases have patterns you didn't plan for. Common ones to handle:
- **Aliased imports**: `import { oldFunc as myFunc } from 'old-lib'`
- **Namespace imports**: `import * as Lib from 'old-lib'; Lib.oldFunc()`
- **Re-exports**: `export { oldFunc } from 'old-lib'`
- **Dynamic import**: `const mod = await import('old-lib')`
- **Require calls**: `const { oldFunc } = require('old-lib')`
- **Spread into call**: `oldFunc(...args)` — can't naively convert to named params
- **Comments attached to nodes** — transforms can silently drop them

Don't try to handle every edge case upfront — that leads to bloated, buggy transforms. Instead, handle the common path well, log warnings for patterns you can't transform, and let the developer handle those manually.

### 4. Test With Real Code

Unit tests with RuleTester or jscodeshift's `defineInlineTest` are great for coverage, but always run on actual project files before shipping. Real code has:
- Nested expressions you didn't anticipate
- Unusual formatting that breaks assumptions
- TypeScript generics in unexpected positions
- Comments that need preserving

### 5. Idempotency

A codemod should be safe to run twice. After transforming, the output shouldn't match the input pattern anymore — otherwise running again will double-transform. Check this explicitly in tests.

## Common Transform Recipes

### Rename an Import and Its Usage

```javascript
// jscodeshift
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find the import
  const importDecl = root.find(j.ImportDeclaration, {
    source: { value: 'old-lib' }
  });

  if (importDecl.length === 0) return; // File doesn't use this lib

  // Rename specifier
  importDecl.find(j.ImportSpecifier, {
    imported: { name: 'oldFunc' }
  }).forEach(spec => {
    const localName = spec.node.local.name;
    // Rename all references
    root.find(j.Identifier, { name: localName })
      .filter(path => path.scope.getBinding(localName)?.path === spec)
      .forEach(id => { id.node.name = 'newFunc'; });
    spec.node.imported.name = 'newFunc';
  });

  // Update source
  importDecl.forEach(decl => {
    decl.node.source.value = 'new-lib';
  });

  return root.toSource();
}
```

### Wrap a Function Call

```javascript
// Babel plugin: wrap console.log in __DEV__ check
module.exports = function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        if (!t.isMemberExpression(path.node.callee)) return;
        const { object, property } = path.node.callee;
        if (!t.isIdentifier(object, { name: 'console' })) return;
        if (!t.isIdentifier(property, { name: 'log' })) return;

        // Don't wrap if already inside an if(__DEV__) block
        const ifParent = path.findParent(p =>
          p.isIfStatement() &&
          t.isIdentifier(p.node.test, { name: '__DEV__' })
        );
        if (ifParent) return;

        path.replaceWith(
          t.ifStatement(
            t.identifier('__DEV__'),
            t.expressionStatement(path.node)
          )
        );
      }
    }
  };
};
```

### Add a Prop to JSX Elements

```javascript
// jscodeshift: add data-testid to all Button components
root.find(j.JSXOpeningElement, {
  name: { name: 'Button' }
}).forEach(path => {
  const hasTestId = path.node.attributes.some(
    attr => attr.type === 'JSXAttribute' && attr.name.name === 'data-testid'
  );
  if (hasTestId) return; // Already has it

  // Derive testid from nearest identifiable context
  const varDecl = path.closest(j.VariableDeclarator);
  const name = varDecl ? varDecl.node.id.name : 'button';

  path.node.attributes.push(
    j.jsxAttribute(
      j.jsxIdentifier('data-testid'),
      j.literal(`btn-${name}`)
    )
  );
});
```

## Debugging Transforms

When a transform isn't working:

1. **Print the AST** — `console.log(JSON.stringify(path.node, null, 2))` at your visitor entry point. Compare against what you expected.
2. **Check parent context** — your node might be nested inside something unexpected. Use `path.getAncestry()` or walk up with `path.parentPath`.
3. **Traversal order matters** — Babel visits depth-first. If you replace a node, the new node's children haven't been visited yet (unless you call `path.traverse()` on it). If you need to visit the replacement, use `path.replaceWith()` and let the traversal continue. If you don't, use `path.skip()`.
4. **Infinite loops** — if your replacement matches your own visitor pattern, you'll loop forever. Guard with a marker: `if (path.node._transformed) return; path.node._transformed = true;` or use `path.skip()`.
5. **State leaks between files** — in jscodeshift, each file gets a fresh transform call. In Babel, plugin state persists across files unless you use `pre()` / `post()` hooks to reset. Put per-file state in `this` inside the visitor (Babel binds `this` to plugin state per file).

## Verification Checklist

Before delivering a transform:

- [ ] Before/after example matches the user's requirement
- [ ] Transform is idempotent (running twice produces same result)
- [ ] Aliased imports handled (or explicitly warned)
- [ ] Namespace imports handled (or explicitly warned)
- [ ] TypeScript syntax doesn't crash the parser (use `@babel/parser` with `typescript` plugin or jscodeshift's `tsx` parser)
- [ ] Comments are preserved where possible
- [ ] Transform logs a warning for patterns it can't handle instead of silently skipping
- [ ] Tests include at minimum: basic case, no-op (file without matching code), edge case
- [ ] Dry-run on a real codebase attempted
