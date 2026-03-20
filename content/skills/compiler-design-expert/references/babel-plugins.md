# Babel Plugins

Comprehensive reference for authoring Babel plugins, presets, and build-time transforms.

## Table of Contents
- [Plugin Structure](#plugin-structure)
- [Visitor API](#visitor-api)
- [Path Methods](#path-methods)
- [Builder Helpers (types)](#builder-helpers-types)
- [Scope API](#scope-api)
- [State Management](#state-management)
- [Plugin Options](#plugin-options)
- [Presets](#presets)
- [Common Patterns](#common-patterns)
- [Testing Plugins](#testing-plugins)
- [Publishing](#publishing)

---

## Plugin Structure

### Minimal Plugin

```javascript
// babel-plugin-my-transform.js
module.exports = function myTransformPlugin(babel) {
  const { types: t } = babel;

  return {
    name: 'my-transform',
    visitor: {
      // Visitor methods go here
    }
  };
};
```

### Full Plugin With Lifecycle

```javascript
module.exports = function(babel) {
  const { types: t, template } = babel;

  return {
    name: 'my-transform',

    // Runs once before traversal starts (per file)
    pre(state) {
      this.foundImports = new Set();
    },

    visitor: {
      ImportDeclaration(path) {
        this.foundImports.add(path.node.source.value);
      },

      CallExpression(path) {
        // Access per-file state
        if (this.foundImports.has('my-lib')) {
          // transform...
        }
      }
    },

    // Runs once after traversal completes (per file)
    post(state) {
      if (this.foundImports.size > 0) {
        console.log(`Processed imports from: ${[...this.foundImports].join(', ')}`);
      }
    }
  };
};
```

### Plugin in TypeScript

```typescript
import type { PluginObj, NodePath } from '@babel/core';
import type { CallExpression } from '@babel/types';

export default function myPlugin(babel: typeof import('@babel/core')): PluginObj {
  const { types: t } = babel;

  return {
    name: 'my-plugin',
    visitor: {
      CallExpression(path: NodePath<CallExpression>) {
        // fully typed
      }
    }
  };
}
```

## Visitor API

### Entry and Exit

```javascript
visitor: {
  // Called when entering the node (top-down)
  FunctionDeclaration(path) {
    console.log('entering', path.node.id.name);
  },

  // Explicit enter/exit
  ClassDeclaration: {
    enter(path) {
      console.log('entering class', path.node.id.name);
    },
    exit(path) {
      console.log('leaving class', path.node.id.name);
    }
  }
}
```

### Multiple Visitor Types

```javascript
visitor: {
  // Same handler for multiple node types
  'FunctionDeclaration|ArrowFunctionExpression'(path) {
    // handles both
  },

  // Or use aliases
  Function(path) {
    // handles FunctionDeclaration, FunctionExpression,
    // ArrowFunctionExpression, ObjectMethod, ClassMethod
  }
}
```

### Visitor Aliases

Babel provides aliases that match groups of related node types:

| Alias | Matches |
|-------|---------|
| `Function` | FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ObjectMethod, ClassMethod |
| `Statement` | All statement types |
| `Expression` | All expression types |
| `Declaration` | All declaration types |
| `Loop` | ForStatement, WhileStatement, DoWhileStatement, ForInStatement, ForOfStatement |
| `Scopable` | BlockStatement, FunctionDeclaration, Program, etc. |

## Path Methods

### Navigation

```javascript
path.node          // The AST node
path.parent        // Parent AST node
path.parentPath    // Parent path (with methods)
path.key           // Key in parent (e.g., 'body', 'arguments')
path.listKey       // If in array, the array key
path.inList         // Whether the node is in an array

// Traversal
path.get('body')            // Get child path by key
path.get('arguments.0')    // Get first argument path
path.getSibling(0)          // Get sibling by index
path.getNextSibling()       // Next sibling
path.getPreviousSibling()   // Previous sibling

// Ancestry
path.findParent(p => p.isIfStatement())   // Walk up tree
path.find(p => p.isProgram())             // Walk up to matching ancestor
path.getAncestry()                         // Array of all ancestor paths
path.getStatementParent()                  // Nearest enclosing statement
path.getFunctionParent()                   // Nearest enclosing function
```

### Type Checks

```javascript
path.isIdentifier()                        // Is this an Identifier?
path.isIdentifier({ name: 'foo' })        // Is this identifier named 'foo'?
path.isMemberExpression()
path.isCallExpression()
path.isReferencedIdentifier()              // Is this identifier used as a value (not declaration)?

// On nodes directly
t.isIdentifier(node)
t.isIdentifier(node, { name: 'foo' })
t.isStringLiteral(node, { value: 'hello' })
```

### Mutation

```javascript
// Replace this node
path.replaceWith(newNode);

// Replace with multiple nodes (only in statement position)
path.replaceWithMultiple([node1, node2]);

// Replace with source string (parsed at that position)
path.replaceWithSourceString('console.log("injected")');

// Insert siblings (only works if node is in a list)
path.insertBefore(newNode);
path.insertAfter(newNode);

// Remove
path.remove();

// Hoist to closest scope
path.hoist();

// Skip traversal of children
path.skip();

// Stop all traversal
path.stop();
```

### Comments

```javascript
// Add leading comment
t.addComment(node, 'leading', ' This was auto-generated');

// Add trailing comment
t.addComment(node, 'trailing', ' end of block');

// Transfer comments from old node to new
t.inheritsComments(newNode, oldNode);

// Or when replacing:
path.addComment('leading', ' transformed by my-plugin');
```

## Builder Helpers (types)

The `t` (types) object has builders for every AST node type. Builder parameter names match the node's field names.

### Most-Used Builders

```javascript
// Identifiers and literals
t.identifier('name')
t.stringLiteral('hello')
t.numericLiteral(42)
t.booleanLiteral(true)
t.nullLiteral()
t.templateLiteral(quasis, expressions)

// Expressions
t.callExpression(callee, args)
t.memberExpression(object, property, computed)  // computed=true for obj[prop]
t.arrowFunctionExpression(params, body, async)
t.assignmentExpression('=', left, right)
t.binaryExpression('+', left, right)
t.logicalExpression('&&', left, right)
t.conditionalExpression(test, consequent, alternate)
t.objectExpression(properties)
t.arrayExpression(elements)
t.spreadElement(argument)
t.awaitExpression(argument)
t.newExpression(callee, args)
t.taggedTemplateExpression(tag, quasi)

// Object/Property
t.objectProperty(key, value, computed, shorthand)
t.objectMethod('method', key, params, body)
t.spreadElement(argument)

// Statements
t.expressionStatement(expression)
t.returnStatement(argument)
t.ifStatement(test, consequent, alternate)
t.blockStatement(body)
t.variableDeclaration('const', [declarator])
t.variableDeclarator(id, init)
t.throwStatement(argument)
t.tryStatement(block, handler, finalizer)

// Functions and classes
t.functionDeclaration(id, params, body, generator, async)
t.classDeclaration(id, superClass, body)
t.classBody(body)
t.classMethod('method', key, params, body, computed, static)

// Imports
t.importDeclaration(specifiers, source)
t.importDefaultSpecifier(local)
t.importSpecifier(local, imported)
t.importNamespaceSpecifier(local)
t.exportNamedDeclaration(declaration, specifiers, source)
t.exportDefaultDeclaration(declaration)

// JSX
t.jsxElement(openingElement, closingElement, children, selfClosing)
t.jsxOpeningElement(name, attributes, selfClosing)
t.jsxClosingElement(name)
t.jsxAttribute(name, value)
t.jsxIdentifier('Component')
t.jsxExpressionContainer(expression)
t.jsxSpreadAttribute(argument)
t.jsxText('hello')

// TypeScript
t.tsTypeAnnotation(typeAnnotation)
t.tsTypeReference(typeName, typeParameters)
t.tsAsExpression(expression, typeAnnotation)
```

### Template Utility

For complex node construction, `template` is often cleaner:

```javascript
const { template } = babel;

// Build a statement
const buildRequire = template(`
  const %%importName%% = require(%%source%%);
`);

const ast = buildRequire({
  importName: t.identifier('myLib'),
  source: t.stringLiteral('my-lib')
});

// Build an expression
const buildWrapper = template.expression(`
  process.env.NODE_ENV !== 'production' ? %%expression%% : undefined
`);

// Smart mode (auto-detects statement vs expression)
const buildAny = template.smart(`console.log(%%msg%%)`);
```

## Scope API

Babel's scope analysis tracks variable bindings, references, and shadowing.

```javascript
// Get a binding by name
const binding = path.scope.getBinding('myVar');
// binding.path — where the variable was declared
// binding.references — number of references
// binding.referencePaths — array of paths referencing this binding
// binding.constantViolations — paths where the binding is reassigned
// binding.constant — true if never reassigned
// binding.kind — 'var', 'let', 'const', 'param', 'module', etc.

// Check if a name exists in scope
path.scope.hasBinding('myVar')  // includes parent scopes
path.scope.hasOwnBinding('myVar')  // this scope only
path.scope.hasReference('myVar')  // used as a reference anywhere

// Generate a unique name
const uid = path.scope.generateUidIdentifier('temp');
// → { type: 'Identifier', name: '_temp' } (guaranteed unique)

const uidName = path.scope.generateUid('temp');
// → '_temp' (string)

// Register a new binding
path.scope.push({
  id: t.identifier('newVar'),
  init: t.numericLiteral(0),
  kind: 'let'
});

// Rename a binding (updates all references automatically)
path.scope.rename('oldName', 'newName');

// Crawl scope (rebuild scope info after AST mutation)
path.scope.crawl();
```

### When to Crawl Scope

After significant AST mutations (inserting declarations, moving blocks), Babel's scope info can become stale. Call `path.scope.crawl()` if:
- You introduced a new binding and need to query scope
- You moved a declaration to a different scope
- Binding lookups return unexpected results after a transform

## State Management

### Per-File State

```javascript
return {
  pre() {
    // Reset state for each file
    this.importedNames = new Map();
    this.needsRuntime = false;
  },
  visitor: {
    ImportDeclaration(path) {
      this.importedNames.set(
        path.node.source.value,
        path.node.specifiers.map(s => s.local.name)
      );
    },
    CallExpression(path) {
      if (this.importedNames.has('my-lib')) {
        this.needsRuntime = true;
      }
    }
  },
  post() {
    if (this.needsRuntime) {
      // Add runtime import in post()
    }
  }
};
```

### Cross-Visitor Communication

State on `this` is shared across all visitors in the same plugin for the same file. Use `pre()` to initialize and `post()` to finalize.

## Plugin Options

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['./my-plugin.js', { runtime: true, importSource: '@custom/jsx' }]
  ]
};

// In the plugin
module.exports = function(babel, options) {
  const { runtime = false, importSource = 'react' } = options;

  return {
    visitor: {
      JSXElement(path) {
        if (runtime) {
          // use automatic JSX runtime
        }
      }
    }
  };
};
```

### Validate Options

```javascript
module.exports = function(babel) {
  return {
    name: 'my-plugin',
    visitor: { /* ... */ }
  };
};

// Define option schema (Babel validates this)
module.exports.schema = [{
  runtime: { type: 'boolean' },
  importSource: { type: 'string' }
}];
```

## Presets

A preset is a function that returns a set of plugins (and optionally other presets):

```javascript
// babel-preset-my-preset.js
module.exports = function(api, options = {}) {
  const { typescript = false, react = false } = options;

  return {
    plugins: [
      require('./plugin-transform-a'),
      require('./plugin-transform-b'),
      typescript && require('@babel/plugin-transform-typescript'),
      react && require('@babel/plugin-transform-react-jsx'),
    ].filter(Boolean),

    presets: [
      // Can include other presets
    ]
  };
};
```

### Plugin/Preset Ordering

- Plugins run **before** presets
- Plugins run **first to last**
- Presets run **last to first** (reversed)

This matters when transforms depend on each other.

## Common Patterns

### Replace `require()` with `import`

```javascript
visitor: {
  VariableDeclaration(path) {
    const decl = path.node.declarations[0];
    if (!decl?.init || !t.isCallExpression(decl.init)) return;
    if (!t.isIdentifier(decl.init.callee, { name: 'require' })) return;
    if (decl.init.arguments.length !== 1) return;

    const source = decl.init.arguments[0];
    if (!t.isStringLiteral(source)) return;

    let specifiers;
    if (t.isIdentifier(decl.id)) {
      // const foo = require('bar') → import foo from 'bar'
      specifiers = [t.importDefaultSpecifier(decl.id)];
    } else if (t.isObjectPattern(decl.id)) {
      // const { a, b } = require('bar') → import { a, b } from 'bar'
      specifiers = decl.id.properties.map(prop => {
        if (t.isRestElement(prop)) return null; // Can't convert rest
        return t.importSpecifier(prop.value, prop.key);
      }).filter(Boolean);
    } else {
      return; // Can't convert
    }

    path.replaceWith(t.importDeclaration(specifiers, source));
  }
}
```

### Inject Runtime Helper

```javascript
pre() {
  this.helperAdded = false;
},
visitor: {
  CallExpression(path) {
    if (this.needsHelper(path) && !this.helperAdded) {
      const program = path.findParent(p => p.isProgram());
      program.unshiftContainer('body',
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier('_helper'))],
          t.stringLiteral('my-runtime/helper')
        )
      );
      this.helperAdded = true;
    }
  }
}
```

### Compile-Time Constants (Dead Code Elimination)

```javascript
visitor: {
  MemberExpression(path) {
    if (
      t.isIdentifier(path.node.object, { name: 'process' }) &&
      t.isIdentifier(path.node.property, { name: 'env' }) &&
      path.parentPath.isMemberExpression()
    ) {
      const envKey = path.parent.property.name;
      const envValue = process.env[envKey];
      if (envValue !== undefined) {
        path.parentPath.replaceWith(t.stringLiteral(envValue));
      }
    }
  }
}
```

## Testing Plugins

### With `@babel/core` Directly

```javascript
const babel = require('@babel/core');
const plugin = require('../my-plugin');

function transform(code, opts = {}) {
  return babel.transformSync(code, {
    plugins: [[plugin, opts]],
    parserOpts: { plugins: ['jsx', 'typescript'] },
    filename: 'test.tsx', // Needed for some plugins
  }).code;
}

describe('my-plugin', () => {
  it('transforms basic case', () => {
    const input = `import { old } from 'lib'; old();`;
    const expected = `import { new as old } from 'lib'; old();`;
    expect(transform(input)).toBe(expected);
  });

  it('leaves unrelated code alone', () => {
    const input = `const x = 1;`;
    expect(transform(input)).toBe(input);
  });
});
```

### With `babel-plugin-tester`

```javascript
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../my-plugin');

pluginTester({
  plugin,
  pluginName: 'my-plugin',
  fixtures: path.join(__dirname, 'fixtures'),
  // or inline tests:
  tests: [
    {
      title: 'basic transform',
      code: `import { old } from 'lib';`,
      output: `import { new } from 'lib';`,
    },
    {
      title: 'no change for unrelated code',
      code: `const x = 1;`,
      snapshot: false, // won't create snapshot
    },
    {
      title: 'throws on invalid input',
      code: `badPattern()`,
      error: /Expected import/,
    }
  ]
});
```

## Publishing

### Package Structure

```
babel-plugin-my-transform/
├── src/
│   └── index.js
├── lib/              # Compiled output
├── test/
├── package.json
└── README.md
```

### `package.json`

```json
{
  "name": "babel-plugin-my-transform",
  "version": "1.0.0",
  "main": "lib/index.js",
  "keywords": ["babel-plugin"],
  "peerDependencies": {
    "@babel/core": "^7.0.0"
  }
}
```

Babel automatically resolves plugin names: `"plugins": ["my-transform"]` will find `babel-plugin-my-transform`. Similarly, `"presets": ["my-preset"]` finds `babel-preset-my-preset`.
