# ESLint Custom Rules

Reference for writing custom ESLint rules with autofixers.

## Table of Contents
- [Rule Anatomy](#rule-anatomy)
- [AST Node Selectors](#ast-node-selectors)
- [Context API](#context-api)
- [Reporting Problems](#reporting-problems)
- [Autofixing](#autofixing)
- [Scope Analysis](#scope-analysis)
- [Testing With RuleTester](#testing-with-ruletester)
- [Common Rule Patterns](#common-rule-patterns)
- [Plugin Packaging](#plugin-packaging)

---

## Rule Anatomy

### Minimal Rule

```javascript
// lib/rules/no-foo.js
module.exports = {
  meta: {
    type: 'suggestion',          // 'problem' | 'suggestion' | 'layout'
    docs: {
      description: 'Disallow calls to foo()',
      recommended: true,
    },
    fixable: 'code',             // 'code' | 'whitespace' | null
    schema: [],                  // JSON Schema for rule options
    messages: {
      noFoo: 'Avoid using foo(). Use bar() instead.',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === 'foo') {
          context.report({
            node,
            messageId: 'noFoo',
            fix(fixer) {
              return fixer.replaceText(node.callee, 'bar');
            },
          });
        }
      },
    };
  },
};
```

### Meta Fields

| Field | Purpose |
|-------|---------|
| `type` | `'problem'` (likely error), `'suggestion'` (improvement), `'layout'` (formatting) |
| `docs.description` | Shown in rule listings |
| `docs.recommended` | If `true`, enabled in `plugin:xxx/recommended` |
| `fixable` | `'code'` for autofixes that change logic, `'whitespace'` for formatting only |
| `hasSuggestions` | `true` if the rule provides suggestions (user-applied fixes) |
| `schema` | JSON Schema defining rule options |
| `messages` | Message templates (use `messageId` in reports) |
| `deprecated` | `true` to mark as deprecated |
| `replacedBy` | Array of replacement rule names |

### Rule With Options

```javascript
module.exports = {
  meta: {
    schema: [
      {
        type: 'object',
        properties: {
          allowInTests: { type: 'boolean', default: false },
          maxDepth: { type: 'integer', minimum: 1, default: 3 },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowInTests = options.allowInTests ?? false;
    const maxDepth = options.maxDepth ?? 3;

    // Use options in visitors...
    return {};
  },
};
```

## AST Node Selectors

ESLint supports CSS-like selectors for AST nodes, which are often more concise than writing explicit visitors:

```javascript
create(context) {
  return {
    // Basic node type
    'CallExpression'(node) {},

    // Descendant: CallExpression inside IfStatement
    'IfStatement CallExpression'(node) {},

    // Child: direct child only
    'IfStatement > BlockStatement'(node) {},

    // Attribute: specific property value
    'CallExpression[callee.name="eval"]'(node) {},

    // Multiple: matches A or B
    'FunctionDeclaration, ArrowFunctionExpression'(node) {},

    // Negation: all calls EXCEPT to console.*
    'CallExpression:not([callee.object.name="console"])'(node) {},

    // :exit suffix — fires when LEAVING the node
    'FunctionDeclaration:exit'(node) {},

    // Nth-child (in body arrays)
    'BlockStatement > :first-child'(node) {},

    // Has: node that contains a specific descendant
    'IfStatement:has(ThrowStatement)'(node) {},
  };
}
```

Selectors are powerful for matching complex patterns without nested `if` checks.

## Context API

The `context` object provides everything a rule needs:

```javascript
create(context) {
  // Source code access
  const sourceCode = context.sourceCode;  // ESLint 9+ (or context.getSourceCode() legacy)

  // Get raw text
  sourceCode.getText(node);          // Text of a specific node
  sourceCode.getText();               // Entire file
  sourceCode.getText(node, 2, 2);    // With 2 chars before and after

  // Token traversal
  sourceCode.getTokenBefore(node);
  sourceCode.getTokenAfter(node);
  sourceCode.getFirstToken(node);
  sourceCode.getLastToken(node);
  sourceCode.getTokensBetween(node1, node2);

  // Comments
  sourceCode.getCommentsBefore(node);
  sourceCode.getCommentsAfter(node);
  sourceCode.getCommentsInside(node);

  // Scope (see Scope Analysis section)
  sourceCode.getScope(node);

  // Ancestors
  sourceCode.getAncestors(node);  // Array from Program to parent

  // Filename
  context.filename;       // Current file path
  context.physicalFilename;  // When using processors

  return {};
}
```

## Reporting Problems

### Basic Report

```javascript
context.report({
  node,                          // AST node to highlight
  messageId: 'errorMessage',     // From meta.messages
  data: { name: 'foo' },        // Template variables for message
});
```

### Message Templates

```javascript
meta: {
  messages: {
    unexpected: "Unexpected use of '{{name}}'. Use '{{replacement}}' instead.",
  },
},
create(context) {
  return {
    Identifier(node) {
      if (banned.includes(node.name)) {
        context.report({
          node,
          messageId: 'unexpected',
          data: {
            name: node.name,
            replacement: alternatives[node.name],
          },
        });
      }
    },
  };
}
```

### Location-Specific Reporting

```javascript
// Report at a specific location instead of a node
context.report({
  messageId: 'missingReturn',
  loc: {
    start: { line: 10, column: 0 },
    end: { line: 10, column: 5 },
  },
});

// Report on a specific part of a node
context.report({
  node,
  messageId: 'badProp',
  loc: node.key.loc,  // Highlight just the key, not the whole property
});
```

## Autofixing

### Fixer Methods

```javascript
fix(fixer) {
  // Replace a node's text
  return fixer.replaceText(node, 'newCode');

  // Replace a range [start, end]
  return fixer.replaceTextRange([start, end], 'newCode');

  // Insert before/after a node
  return fixer.insertTextBefore(node, 'prefix');
  return fixer.insertTextAfter(node, 'suffix');

  // Insert at specific position
  return fixer.insertTextBeforeRange([pos, pos], 'text');
  return fixer.insertTextAfterRange([pos, pos], 'text');

  // Remove a node
  return fixer.remove(node);

  // Remove a range
  return fixer.removeRange([start, end]);
}
```

### Multiple Fixes in One

Return an array or use a generator:

```javascript
fix(fixer) {
  return [
    fixer.replaceText(node.callee, 'newFunc'),
    fixer.insertTextBefore(node, '/* transformed */ '),
  ];
}

// Or with a generator
*fix(fixer) {
  yield fixer.replaceText(oldNode, 'new');
  yield fixer.insertTextAfter(otherNode, ';');
}
```

### Suggestions (User-Applied Fixes)

Suggestions are fixes that ESLint won't apply automatically — they show up in the IDE for the user to choose:

```javascript
meta: {
  hasSuggestions: true,
  messages: {
    avoidFoo: 'Avoid foo()',
    replaceWithBar: 'Replace with bar()',
    replaceWithBaz: 'Replace with baz()',
  },
},
create(context) {
  return {
    CallExpression(node) {
      if (node.callee.name === 'foo') {
        context.report({
          node,
          messageId: 'avoidFoo',
          suggest: [
            {
              messageId: 'replaceWithBar',
              fix(fixer) {
                return fixer.replaceText(node.callee, 'bar');
              },
            },
            {
              messageId: 'replaceWithBaz',
              fix(fixer) {
                return fixer.replaceText(node.callee, 'baz');
              },
            },
          ],
        });
      }
    },
  };
}
```

### Fix Safety Rules

1. **Don't change semantics accidentally.** If a fix could change what the code does in edge cases, make it a suggestion instead.
2. **Preserve comments.** Use `sourceCode.getCommentsInside(node)` and reattach them.
3. **Handle whitespace.** After removing a node, you might leave behind awkward blank lines or missing separators.
4. **Fixes must be idempotent.** After applying the fix, the rule shouldn't fire again on the fixed code.
5. **Fixes must not conflict.** If two fixes overlap the same range, ESLint drops both. Keep fix ranges as tight as possible.

## Scope Analysis

ESLint provides built-in scope analysis via `eslint-scope`:

```javascript
create(context) {
  return {
    Identifier(node) {
      const scope = context.sourceCode.getScope(node);

      // Find a variable by name in current scope chain
      const variable = findVariable(scope, node.name);

      // Check all references to a variable
      if (variable) {
        const writeRefs = variable.references.filter(ref => ref.isWrite());
        const readRefs = variable.references.filter(ref => ref.isRead());
      }
    },

    'Program:exit'(node) {
      // Get all declared variables in program scope
      const scope = context.sourceCode.getScope(node);
      for (const variable of scope.variables) {
        if (variable.references.length === 0) {
          // Unused variable
        }
      }
    },
  };
}

// Helper to find a variable in the scope chain
function findVariable(scope, name) {
  let current = scope;
  while (current) {
    const found = current.set.get(name);
    if (found) return found;
    current = current.upper;
  }
  return null;
}
```

## Testing With RuleTester

### Basic Tests

```javascript
const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-foo');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run('no-foo', rule, {
  valid: [
    // Strings or objects
    'bar()',
    'baz.foo()',  // Method call, not standalone foo()
    {
      code: 'foo()',
      options: [{ allowInTests: true }],
      filename: 'test/my.test.js',
    },
  ],

  invalid: [
    {
      code: 'foo()',
      errors: [{ messageId: 'noFoo' }],
    },
    {
      code: 'foo()',
      errors: [{ messageId: 'noFoo', line: 1, column: 1 }],
      output: 'bar()',  // Expected auto-fixed output
    },
    {
      code: 'foo(a, b)',
      errors: [{
        messageId: 'noFoo',
        suggestions: [
          { messageId: 'replaceWithBar', output: 'bar(a, b)' },
        ],
      }],
    },
  ],
});
```

### TypeScript Rules

```javascript
const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      project: './tsconfig.json',  // Needed for type-aware rules
    },
  },
});
```

## Common Rule Patterns

### Enforce Import Order

```javascript
create(context) {
  const imports = [];

  return {
    ImportDeclaration(node) {
      imports.push(node);
    },

    'Program:exit'() {
      for (let i = 1; i < imports.length; i++) {
        const prev = imports[i - 1].source.value;
        const curr = imports[i].source.value;

        if (getGroup(prev) > getGroup(curr)) {
          context.report({
            node: imports[i],
            messageId: 'wrongOrder',
            data: { current: curr, previous: prev },
          });
        }
      }
    },
  };
}

function getGroup(source) {
  if (source.startsWith('.')) return 2;  // relative
  if (source.startsWith('@/')) return 1; // aliased
  return 0;                               // external
}
```

### Detect Missing Cleanup in useEffect

```javascript
create(context) {
  return {
    'CallExpression[callee.name="useEffect"]'(node) {
      const callback = node.arguments[0];
      if (!callback) return;

      const body = callback.body;
      if (body.type !== 'BlockStatement') return;

      // Check if there's an addEventListener or setInterval without cleanup
      let hasSubscription = false;
      let hasCleanup = false;

      // Walk the effect body (simplified — real version should use scope)
      const code = context.sourceCode.getText(body);
      if (/addEventListener|setInterval|setTimeout/.test(code)) {
        hasSubscription = true;
      }
      if (/return\s*(\(\s*\))?\s*=>|removeEventListener|clearInterval|clearTimeout/.test(code)) {
        hasCleanup = true;
      }

      if (hasSubscription && !hasCleanup) {
        context.report({
          node,
          messageId: 'missingCleanup',
        });
      }
    },
  };
}
```

### Restrict Deep Nesting

```javascript
create(context) {
  const maxDepth = context.options[0]?.maxDepth ?? 4;
  let depth = 0;

  function enter(node) {
    depth++;
    if (depth > maxDepth) {
      context.report({
        node,
        messageId: 'tooDeep',
        data: { depth, maxDepth },
      });
    }
  }

  function exit() {
    depth--;
  }

  return {
    IfStatement: enter,
    'IfStatement:exit': exit,
    ForStatement: enter,
    'ForStatement:exit': exit,
    WhileStatement: enter,
    'WhileStatement:exit': exit,
    SwitchCase: enter,
    'SwitchCase:exit': exit,
  };
}
```

## Plugin Packaging

### Flat Config (ESLint 9+)

```javascript
// eslint-plugin-my-rules/index.js
const noFoo = require('./rules/no-foo');
const preferBar = require('./rules/prefer-bar');

const plugin = {
  meta: { name: 'eslint-plugin-my-rules', version: '1.0.0' },
  rules: {
    'no-foo': noFoo,
    'prefer-bar': preferBar,
  },
  configs: {},
};

// Define recommended config
plugin.configs.recommended = {
  plugins: { 'my-rules': plugin },
  rules: {
    'my-rules/no-foo': 'error',
    'my-rules/prefer-bar': 'warn',
  },
};

module.exports = plugin;
```

### Usage in eslint.config.js

```javascript
import myRules from 'eslint-plugin-my-rules';

export default [
  myRules.configs.recommended,
  {
    rules: {
      'my-rules/no-foo': ['error', { allowInTests: true }],
    },
  },
];
```
