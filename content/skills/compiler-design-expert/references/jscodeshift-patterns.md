# jscodeshift Patterns

Comprehensive reference for writing codemods with jscodeshift.

## Table of Contents
- [Setup and CLI](#setup-and-cli)
- [Core API](#core-api)
- [Finding Nodes](#finding-nodes)
- [Transforming Nodes](#transforming-nodes)
- [Building Nodes](#building-nodes)
- [Import Manipulation](#import-manipulation)
- [JSX Transforms](#jsx-transforms)
- [TypeScript Considerations](#typescript-considerations)
- [Testing Codemods](#testing-codemods)
- [Running at Scale](#running-at-scale)

---

## Setup and CLI

### Installation

```bash
npm install -g jscodeshift
# or in a project
npm install --save-dev jscodeshift @types/jscodeshift
```

### CLI Usage

```bash
# Dry run (prints diff, doesn't write)
jscodeshift --dry --print -t transform.js src/

# Run on specific files
jscodeshift -t transform.js src/components/**/*.tsx

# With TypeScript parser (required for .tsx files)
jscodeshift --parser tsx -t transform.js src/

# With Babel parser and plugins
jscodeshift --parser babel --parser-config parser-config.json -t transform.js src/

# Parallel execution (default: number of CPUs)
jscodeshift -t transform.js --cpus 4 src/

# Ignore pattern
jscodeshift -t transform.js --ignore-pattern '**/node_modules/**' src/
```

### Parser Config (`parser-config.json`)

```json
{
  "sourceType": "module",
  "plugins": [
    "jsx",
    "typescript",
    "decorators-legacy",
    "classProperties",
    "optionalChaining",
    "nullishCoalescingOperator",
    "dynamicImport"
  ]
}
```

## Core API

### Transform Function Signature

```javascript
/**
 * @param {FileInfo} file - { path: string, source: string }
 * @param {API} api - { jscodeshift: JSCodeshift, stats: Function, report: Function }
 * @param {Options} options - CLI options passed via --foo=bar
 * @returns {string|undefined} - modified source, or undefined to skip file
 */
export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // ... transforms ...

  // Return modified source (or undefined to leave file unchanged)
  const modified = root.toSource({ quote: 'single' });
  return modified !== file.source ? modified : undefined;
}
```

### `toSource()` Options

```javascript
root.toSource({
  quote: 'single',           // 'single' | 'double' | 'auto'
  trailingComma: true,        // Add trailing commas
  lineTerminator: '\n',       // Line ending
  reuseWhitespace: true,      // Preserve original formatting where possible
  tabWidth: 2,                // Indentation width
  useTabs: false,             // Tabs vs spaces
  wrapColumn: 80,             // Line wrap column (recast heuristic)
});
```

## Finding Nodes

### `.find(type, filter?)`

```javascript
// All call expressions
root.find(j.CallExpression);

// Calls to a specific function
root.find(j.CallExpression, {
  callee: { name: 'myFunction' }
});

// Member expression calls: obj.method()
root.find(j.CallExpression, {
  callee: {
    type: 'MemberExpression',
    object: { name: 'React' },
    property: { name: 'createElement' }
  }
});

// Import from a specific source
root.find(j.ImportDeclaration, {
  source: { value: '@old/library' }
});

// Variable declarations with specific kind
root.find(j.VariableDeclaration, { kind: 'var' });
```

### `.filter(callback)`

```javascript
// Find imports that import at least one specific specifier
root.find(j.ImportDeclaration, {
  source: { value: 'react' }
}).filter(path => {
  return path.node.specifiers.some(
    s => s.type === 'ImportSpecifier' && s.imported.name === 'useState'
  );
});
```

### `.closest(type)`

```javascript
// From a node, find the nearest enclosing function
path.closest(j.FunctionDeclaration);

// Find the enclosing class
path.closest(j.ClassDeclaration);
```

### `.forEach()` vs `.map()` vs `.replaceWith()`

```javascript
// forEach: side effects, returns same collection
root.find(j.Identifier, { name: 'old' })
  .forEach(path => { path.node.name = 'new'; });

// map: transform collection elements
const names = root.find(j.ImportSpecifier)
  .map(path => path.node.imported.name);

// replaceWith: replace each matched node
root.find(j.Identifier, { name: 'old' })
  .replaceWith(j.identifier('new'));
```

## Transforming Nodes

### Replace

```javascript
// Replace a node
path.replace(newNode);

// Replace with multiple nodes (e.g., splitting a statement)
path.replace(node1, node2, node3);

// Replace using a callback
root.find(j.Literal, { value: 'old' })
  .replaceWith(path => j.literal('new'));
```

### Insert

```javascript
// Insert before
path.insertBefore(newNode);

// Insert after
path.insertAfter(newNode);

// Insert at beginning of body (e.g., top of file)
const body = root.find(j.Program).get('body');
body.unshift(newImportStatement);
```

### Remove

```javascript
// Remove matched nodes
root.find(j.ImportDeclaration, {
  source: { value: 'deprecated-lib' }
}).remove();

// Remove a specific path
path.prune(); // removes node and cleans up empty parents
```

## Building Nodes

jscodeshift uses the `ast-types` builders. Every AST node type has a corresponding builder function:

```javascript
// Identifier
j.identifier('myVar')

// Literal / StringLiteral
j.literal('hello')
j.stringLiteral('hello')  // Babel-style

// Member expression: obj.prop
j.memberExpression(
  j.identifier('obj'),
  j.identifier('prop')
)

// Call expression: func(arg1, arg2)
j.callExpression(
  j.identifier('func'),
  [j.identifier('arg1'), j.identifier('arg2')]
)

// Arrow function: (x) => x + 1
j.arrowFunctionExpression(
  [j.identifier('x')],
  j.binaryExpression('+', j.identifier('x'), j.literal(1))
)

// Object expression: { key: value }
j.objectExpression([
  j.property('init', j.identifier('key'), j.identifier('value'))
])

// Import declaration: import { foo } from 'bar'
j.importDeclaration(
  [j.importSpecifier(j.identifier('foo'))],
  j.literal('bar')
)

// Import default: import Foo from 'bar'
j.importDeclaration(
  [j.importDefaultSpecifier(j.identifier('Foo'))],
  j.literal('bar')
)

// Template literal: `hello ${name}`
j.templateLiteral(
  [j.templateElement({ raw: 'hello ', cooked: 'hello ' }, false),
   j.templateElement({ raw: '', cooked: '' }, true)],
  [j.identifier('name')]
)

// Spread element: ...args
j.spreadElement(j.identifier('args'))

// JSX element: <Component prop="value" />
j.jsxElement(
  j.jsxOpeningElement(
    j.jsxIdentifier('Component'),
    [j.jsxAttribute(j.jsxIdentifier('prop'), j.literal('value'))],
    true  // selfClosing
  ),
  null,  // closingElement (null for self-closing)
  []     // children
)
```

### Shortcut: `template` for Complex Nodes

When building complex AST structures, the template API is cleaner than nested builders:

```javascript
const { statement, expression } = j.template;

// Build from a code string pattern
const newStatement = statement`
  if (process.env.NODE_ENV !== 'production') {
    console.warn(${j.literal(warningMessage)});
  }
`;

// Expression template
const newExpr = expression`${j.identifier(name)}.bind(this)`;
```

## Import Manipulation

Imports are the most common thing codemods touch. Here are battle-tested patterns:

### Add an Import (If Not Already Present)

```javascript
function addImport(root, j, specifierName, source) {
  const existing = root.find(j.ImportDeclaration, {
    source: { value: source }
  });

  if (existing.length > 0) {
    // Source already imported — add specifier if missing
    const hasSpecifier = existing.find(j.ImportSpecifier, {
      imported: { name: specifierName }
    }).length > 0;

    if (!hasSpecifier) {
      existing.get().node.specifiers.push(
        j.importSpecifier(j.identifier(specifierName))
      );
    }
  } else {
    // New import — insert after last import
    const lastImport = root.find(j.ImportDeclaration).at(-1);
    const newImport = j.importDeclaration(
      [j.importSpecifier(j.identifier(specifierName))],
      j.literal(source)
    );

    if (lastImport.length > 0) {
      lastImport.insertAfter(newImport);
    } else {
      // No imports yet — add at top of file
      root.find(j.Program).get('body', 0).insertBefore(newImport);
    }
  }
}
```

### Remove an Import Specifier (Clean Up Empty Imports)

```javascript
function removeImportSpecifier(root, j, specifierName, source) {
  root.find(j.ImportDeclaration, {
    source: { value: source }
  }).forEach(path => {
    const specifiers = path.node.specifiers.filter(
      s => !(s.type === 'ImportSpecifier' && s.imported.name === specifierName)
    );

    if (specifiers.length === 0) {
      path.prune(); // Remove the whole import if empty
    } else {
      path.node.specifiers = specifiers;
    }
  });
}
```

### Rename Import Source

```javascript
root.find(j.ImportDeclaration, {
  source: { value: '@old/package' }
}).forEach(path => {
  path.node.source.value = '@new/package';
});

// Also handle require() calls
root.find(j.CallExpression, {
  callee: { name: 'require' },
  arguments: [{ value: '@old/package' }]
}).forEach(path => {
  path.node.arguments[0].value = '@new/package';
});
```

## JSX Transforms

### Rename a Component

```javascript
function renameComponent(root, j, oldName, newName) {
  // Opening tags: <OldName ... >
  root.find(j.JSXOpeningElement, {
    name: { name: oldName }
  }).forEach(path => {
    path.node.name = j.jsxIdentifier(newName);
  });

  // Closing tags: </OldName>
  root.find(j.JSXClosingElement, {
    name: { name: oldName }
  }).forEach(path => {
    path.node.name = j.jsxIdentifier(newName);
  });

  // Also rename the import
  root.find(j.ImportSpecifier, {
    imported: { name: oldName }
  }).forEach(path => {
    path.node.imported = j.identifier(newName);
    if (path.node.local.name === oldName) {
      path.node.local = j.identifier(newName);
    }
  });
}
```

### Transform Props

```javascript
// Rename a prop
root.find(j.JSXAttribute, {
  name: { name: 'oldProp' }
}).forEach(path => {
  path.node.name = j.jsxIdentifier('newProp');
});

// Change prop value
root.find(j.JSXAttribute, {
  name: { name: 'variant' }
}).forEach(path => {
  if (path.node.value?.value === 'primary') {
    path.node.value = j.literal('default');
  }
});

// Convert prop to different structure:
// <Comp onClick={handler} /> → <Comp on={{ click: handler }} />
root.find(j.JSXOpeningElement, {
  name: { name: 'Comp' }
}).forEach(path => {
  const onClickAttr = path.node.attributes.find(
    a => a.type === 'JSXAttribute' && a.name.name === 'onClick'
  );
  if (!onClickAttr) return;

  // Remove old prop
  path.node.attributes = path.node.attributes.filter(a => a !== onClickAttr);

  // Add new structured prop
  const handler = onClickAttr.value.expression;
  path.node.attributes.push(
    j.jsxAttribute(
      j.jsxIdentifier('on'),
      j.jsxExpressionContainer(
        j.objectExpression([
          j.property('init', j.identifier('click'), handler)
        ])
      )
    )
  );
});
```

## TypeScript Considerations

### Parser Setup

```bash
# Always use tsx parser for TypeScript files
jscodeshift --parser tsx -t transform.js src/**/*.tsx
```

### Common TS-Specific Nodes

```javascript
// Type assertion: value as Type
j.tsAsExpression(
  j.identifier('value'),
  j.tsTypeReference(j.identifier('Type'))
)

// Generic: Array<string>
j.tsTypeReference(
  j.identifier('Array'),
  j.tsTypeParameterInstantiation([
    j.tsStringKeyword()
  ])
)

// Type annotation: const x: string
j.variableDeclaration('const', [
  j.variableDeclarator(
    Object.assign(j.identifier('x'), {
      typeAnnotation: j.tsTypeAnnotation(j.tsStringKeyword())
    }),
    j.literal('hello')
  )
])
```

### Handling Generics Without Crashing

TypeScript generics look like JSX to parsers. When processing `.tsx` files, the parser handles this, but be aware:

```javascript
// This is a TSTypeParameterInstantiation, not JSX
// foo<string>(arg)
//    ^^^^^^^^ — parser knows this is a type param in .tsx mode
```

If your transform creates generic call expressions, build them correctly:

```javascript
j.callExpression(
  j.identifier('foo'),
  [j.identifier('arg')]
);
// For the type parameter, you need to set it on the node:
// callExpr.typeParameters = j.tsTypeParameterInstantiation([...])
```

## Testing Codemods

### `defineInlineTest`

```javascript
const { defineInlineTest } = require('jscodeshift/dist/testUtils');
const transform = require('../transform');

defineInlineTest(
  transform,
  {}, // options
  // Input
  `import { oldFunc } from 'old-lib';
const result = oldFunc(a, b);`,
  // Expected output
  `import { newFunc } from 'new-lib';
const result = newFunc({ first: a, second: b });`,
  'transforms oldFunc to newFunc with named params'
);

// Test no-op case (file should not be modified)
defineInlineTest(
  transform,
  {},
  `import { unrelated } from 'other-lib';`,
  `import { unrelated } from 'other-lib';`,
  'leaves unrelated imports alone'
);
```

### Test File-Based (`defineTest`)

```
__testfixtures__/
  transform-name/
    basic.input.js
    basic.output.js
    edge-case.input.js
    edge-case.output.js
```

```javascript
const { defineTest } = require('jscodeshift/dist/testUtils');

defineTest(__dirname, 'transform-name', {}, 'basic');
defineTest(__dirname, 'transform-name', {}, 'edge-case');
```

## Running at Scale

### Pre-flight Checklist

1. **Dry run first**: `jscodeshift --dry --print -t transform.js src/ | head -100`
2. **Commit everything**: Run on a clean git state so you can `git diff` the results
3. **Run on a subset**: Test on one directory before the full codebase
4. **Check for errors**: jscodeshift reports files it couldn't parse — fix those first

### Post-Codemod Steps

```bash
# Review the diff
git diff --stat
git diff -- '*.tsx' | head -200

# Run the linter to catch formatting issues
npx eslint --fix src/

# Run type checker
npx tsc --noEmit

# Run tests
npm test
```

### Stats and Reporting

```javascript
// Inside your transform
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const matches = root.find(j.CallExpression, {
    callee: { name: 'oldFunc' }
  });

  if (matches.length === 0) return undefined;

  api.stats('files_transformed');
  api.stats('calls_transformed', matches.length);

  // ... transform ...
}

// CLI: --print-stats shows aggregated stats after run
```
