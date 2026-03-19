# AST Node Reference

Complete catalog of AST node types for the JavaScript/TypeScript ecosystem. Covers ESTree (ESLint, jscodeshift) and Babel AST extensions.

## Table of Contents
- [ESTree Standard Nodes](#estree-standard-nodes)
- [Babel Extensions](#babel-extensions)
- [JSX Nodes](#jsx-nodes)
- [TypeScript Nodes](#typescript-nodes)
- [Node Relationships Cheat Sheet](#node-relationships-cheat-sheet)
- [Differences Between ESTree and Babel AST](#differences-between-estree-and-babel-ast)

---

## ESTree Standard Nodes

These are defined by the ESTree spec and shared across ESLint, jscodeshift (via recast), and acorn.

### Program

```
Program {
  type: 'Program'
  body: [ Statement | ModuleDeclaration ]
  sourceType: 'module' | 'script'
}
```

### Declarations

```
VariableDeclaration {
  kind: 'var' | 'let' | 'const'
  declarations: [ VariableDeclarator ]
}

VariableDeclarator {
  id: Pattern
  init: Expression | null
}

FunctionDeclaration {
  id: Identifier
  params: [ Pattern ]
  body: BlockStatement
  generator: boolean
  async: boolean
}

ClassDeclaration {
  id: Identifier
  superClass: Expression | null
  body: ClassBody
}

ClassBody {
  body: [ MethodDefinition | PropertyDefinition | StaticBlock ]
}

MethodDefinition {
  key: Expression
  value: FunctionExpression
  kind: 'constructor' | 'method' | 'get' | 'set'
  computed: boolean
  static: boolean
}

PropertyDefinition {
  key: Expression
  value: Expression | null
  computed: boolean
  static: boolean
}
```

### Statements

```
ExpressionStatement { expression: Expression }
BlockStatement { body: [ Statement ] }
ReturnStatement { argument: Expression | null }
IfStatement { test: Expression, consequent: Statement, alternate: Statement | null }
SwitchStatement { discriminant: Expression, cases: [ SwitchCase ] }
SwitchCase { test: Expression | null, consequent: [ Statement ] }
ForStatement { init, test, update, body }
ForInStatement { left, right, body }
ForOfStatement { left, right, body, await }
WhileStatement { test, body }
DoWhileStatement { body, test }
TryStatement { block, handler: CatchClause | null, finalizer: BlockStatement | null }
CatchClause { param: Pattern | null, body: BlockStatement }
ThrowStatement { argument: Expression }
BreakStatement { label: Identifier | null }
ContinueStatement { label: Identifier | null }
LabeledStatement { label: Identifier, body: Statement }
WithStatement { object, body }
DebuggerStatement { }
EmptyStatement { }
```

### Expressions

```
Identifier { name: string }
Literal { value: string | number | boolean | null | RegExp, raw: string }

CallExpression { callee: Expression, arguments: [ Expression | SpreadElement ] }
NewExpression { callee: Expression, arguments: [ Expression | SpreadElement ] }
MemberExpression { object, property, computed, optional }
  // computed: false → obj.prop  |  computed: true → obj[prop]

AssignmentExpression { operator: string, left: Pattern, right: Expression }
BinaryExpression { operator: string, left: Expression, right: Expression }
LogicalExpression { operator: '||' | '&&' | '??', left, right }
UnaryExpression { operator: string, prefix: boolean, argument: Expression }
UpdateExpression { operator: '++' | '--', argument, prefix }
ConditionalExpression { test, consequent, alternate }
SequenceExpression { expressions: [ Expression ] }
YieldExpression { argument: Expression | null, delegate: boolean }
AwaitExpression { argument: Expression }
TaggedTemplateExpression { tag: Expression, quasi: TemplateLiteral }
TemplateLiteral { quasis: [ TemplateElement ], expressions: [ Expression ] }
TemplateElement { value: { raw, cooked }, tail: boolean }

ArrowFunctionExpression { params, body, async, expression }
  // expression: true → body is an Expression (concise form)
  // expression: false → body is a BlockStatement

FunctionExpression { id, params, body, generator, async }

ObjectExpression { properties: [ Property | SpreadElement ] }
Property { key, value, kind: 'init' | 'get' | 'set', method, shorthand, computed }
ArrayExpression { elements: [ Expression | SpreadElement | null ] }
SpreadElement { argument: Expression }
RestElement { argument: Pattern }

ClassExpression { id, superClass, body }
MetaProperty { meta: Identifier, property: Identifier }
  // import.meta, new.target

ChainExpression { expression: CallExpression | MemberExpression }
  // Wraps optional chaining: a?.b, a?.()

ImportExpression { source: Expression }
  // Dynamic import: import('module')
```

### Patterns (destructuring)

```
ObjectPattern { properties: [ AssignmentProperty | RestElement ] }
ArrayPattern { elements: [ Pattern | null ] }
AssignmentPattern { left: Pattern, right: Expression }
  // Default values: { a = 1 } or [x = 0]
```

### Module Declarations

```
ImportDeclaration {
  specifiers: [ ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier ]
  source: Literal
}

ImportSpecifier { imported: Identifier, local: Identifier }
  // import { foo as bar } → imported='foo', local='bar'

ImportDefaultSpecifier { local: Identifier }
  // import Foo from 'mod' → local='Foo'

ImportNamespaceSpecifier { local: Identifier }
  // import * as Foo from 'mod' → local='Foo'

ExportNamedDeclaration {
  declaration: Declaration | null
  specifiers: [ ExportSpecifier ]
  source: Literal | null
}

ExportSpecifier { local: Identifier, exported: Identifier }
ExportDefaultDeclaration { declaration: Expression | Declaration }
ExportAllDeclaration { source: Literal, exported: Identifier | null }
```

## Babel Extensions

Babel's AST extends ESTree with these additional or modified nodes:

### Literals (Babel splits them)

ESTree uses a single `Literal` node. Babel uses specific types:
```
StringLiteral { value: string }
NumericLiteral { value: number }
BooleanLiteral { value: boolean }
NullLiteral { }
RegExpLiteral { pattern: string, flags: string }
BigIntLiteral { value: string }
DecimalLiteral { value: string }
```

### Additional Expression Nodes

```
OptionalMemberExpression { object, property, computed, optional }
OptionalCallExpression { callee, arguments, optional }
  // Babel represents optional chaining differently than ESTree
  // ESTree wraps in ChainExpression; Babel uses dedicated types

BindExpression { object, callee }
  // obj::func (proposal)

DoExpression { body: BlockStatement }
  // do { expr } (proposal)

PipelinePrimaryTopicReference { }
  // # in pipeline operator (proposal)

RecordExpression { properties }
TupleExpression { elements }
  // Record and Tuple proposals
```

### Decorator

```
Decorator { expression: Expression }
  // @decorator on classes and class members
  // Found in ClassDeclaration.decorators, MethodDefinition.decorators, etc.
```

### Class Properties (Babel-specific fields)

```
ClassProperty {
  key: Expression
  value: Expression | null
  static: boolean
  computed: boolean
  decorators: [ Decorator ]
  accessibility: 'public' | 'private' | 'protected' | null
  readonly: boolean
  typeAnnotation: TypeAnnotation | null
}

ClassPrivateProperty {
  key: PrivateName
  value: Expression | null
  static: boolean
}

ClassPrivateMethod {
  key: PrivateName
  kind: 'method' | 'get' | 'set'
  params: [ Pattern ]
  body: BlockStatement
  static: boolean
}

PrivateName { id: Identifier }
  // #privateField
```

## JSX Nodes

```
JSXElement {
  openingElement: JSXOpeningElement
  closingElement: JSXClosingElement | null
  children: [ JSXElement | JSXText | JSXExpressionContainer | JSXSpreadChild | JSXFragment ]
}

JSXOpeningElement {
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
  attributes: [ JSXAttribute | JSXSpreadAttribute ]
  selfClosing: boolean
}

JSXClosingElement {
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
}

JSXAttribute {
  name: JSXIdentifier | JSXNamespacedName
  value: StringLiteral | JSXExpressionContainer | JSXElement | null
}

JSXSpreadAttribute { argument: Expression }
  // <Comp {...props} />

JSXIdentifier { name: string }
  // <div> → name='div', <MyComp> → name='MyComp'

JSXMemberExpression { object, property }
  // <Lib.Component />

JSXNamespacedName { namespace: JSXIdentifier, name: JSXIdentifier }
  // <xml:lang> (rare in React, common in SVG)

JSXExpressionContainer { expression: Expression | JSXEmptyExpression }
  // {expression} inside JSX

JSXSpreadChild { expression: Expression }
  // {...children} inside JSX children

JSXText { value: string, raw: string }
  // Plain text between tags

JSXFragment { openingFragment, closingFragment, children }
  // <> ... </>

JSXEmptyExpression { }
  // {} with nothing inside
```

### JSX Membership Checks

When checking if a JSX element is a specific component:

```javascript
// Simple: <Button>
node.name.type === 'JSXIdentifier' && node.name.name === 'Button'

// Member: <UI.Button>
node.name.type === 'JSXMemberExpression' &&
  node.name.object.name === 'UI' &&
  node.name.property.name === 'Button'

// Helper for both
function getJSXElementName(node) {
  if (node.name.type === 'JSXIdentifier') return node.name.name;
  if (node.name.type === 'JSXMemberExpression') {
    return `${getJSXElementName({ name: node.name.object })}.${node.name.property.name}`;
  }
  return null;
}
```

## TypeScript Nodes

TypeScript adds a large number of nodes. These are the most commonly encountered in transforms:

### Type Annotations

```
TSTypeAnnotation { typeAnnotation: TSType }
  // : string, : number, etc.

TSTypeReference {
  typeName: Identifier | TSQualifiedName
  typeParameters: TSTypeParameterInstantiation | null
}
  // Array<string>, Promise<void>, MyType

TSQualifiedName { left, right }
  // Namespace.Type

TSTypeParameterInstantiation { params: [ TSType ] }
  // <string, number> in generic usage

TSTypeParameterDeclaration { params: [ TSTypeParameter ] }
  // <T extends Base> in generic definition

TSTypeParameter {
  name: string
  constraint: TSType | null
  default: TSType | null
}
```

### Primitive Types

```
TSStringKeyword        // string
TSNumberKeyword        // number
TSBooleanKeyword       // boolean
TSAnyKeyword           // any
TSVoidKeyword          // void
TSNeverKeyword         // never
TSUnknownKeyword       // unknown
TSNullKeyword          // null
TSUndefinedKeyword     // undefined
TSBigIntKeyword        // bigint
TSSymbolKeyword        // symbol
TSObjectKeyword        // object
TSIntrinsicKeyword     // intrinsic
```

### Compound Types

```
TSUnionType { types: [ TSType ] }              // string | number
TSIntersectionType { types: [ TSType ] }       // A & B
TSArrayType { elementType: TSType }             // string[]
TSTupleType { elementTypes: [ TSType ] }        // [string, number]
TSOptionalType { typeAnnotation: TSType }       // Used in tuple: [string?]
TSRestType { typeAnnotation: TSType }           // Used in tuple: [...string[]]
TSFunctionType { params, returnType }           // (a: string) => void
TSConditionalType { checkType, extendsType, trueType, falseType }
TSIndexedAccessType { objectType, indexType }   // T['key']
TSMappedType { typeParameter, typeAnnotation, optional, readonly }
TSLiteralType { literal }                       // 'hello' | 42
TSTemplateLiteralType { quasis, types }         // `prefix_${string}`
TSInferType { typeParameter }                   // infer U
```

### Type Declarations

```
TSInterfaceDeclaration {
  id: Identifier
  typeParameters: TSTypeParameterDeclaration | null
  extends: [ TSExpressionWithTypeArguments ]
  body: TSInterfaceBody
}

TSInterfaceBody { body: [ TSPropertySignature | TSMethodSignature | ... ] }

TSPropertySignature {
  key: Expression
  typeAnnotation: TSTypeAnnotation
  optional: boolean
  readonly: boolean
  computed: boolean
}

TSTypeAliasDeclaration {
  id: Identifier
  typeParameters: TSTypeParameterDeclaration | null
  typeAnnotation: TSType
}

TSEnumDeclaration { id: Identifier, members: [ TSEnumMember ] }
TSEnumMember { id, initializer }

TSModuleDeclaration { id, body }
  // namespace Foo { ... } or module 'foo' { ... }
```

### Type Assertions and Cast

```
TSAsExpression { expression: Expression, typeAnnotation: TSType }
  // expr as Type

TSTypeAssertion { typeAnnotation: TSType, expression: Expression }
  // <Type>expr (angle-bracket syntax)

TSNonNullExpression { expression: Expression }
  // expr!

TSSatisfiesExpression { expression: Expression, typeAnnotation: TSType }
  // expr satisfies Type
```

## Node Relationships Cheat Sheet

Quick reference for "what contains what":

```
Program
  └─ body[]
     ├─ ImportDeclaration → specifiers[], source
     ├─ ExportNamedDeclaration → declaration, specifiers[], source
     ├─ VariableDeclaration → declarations[]
     │  └─ VariableDeclarator → id (Pattern), init (Expression)
     ├─ FunctionDeclaration → id, params[], body (BlockStatement)
     ├─ ClassDeclaration → id, superClass, body (ClassBody)
     │  └─ ClassBody → body[]
     │     ├─ MethodDefinition → key, value (FunctionExpression)
     │     └─ PropertyDefinition → key, value
     ├─ ExpressionStatement → expression
     │  └─ CallExpression → callee, arguments[]
     │     └─ MemberExpression → object, property
     ├─ IfStatement → test, consequent, alternate
     ├─ ForStatement → init, test, update, body
     └─ ReturnStatement → argument
```

For JSX:
```
JSXElement
  ├─ openingElement (JSXOpeningElement)
  │  ├─ name (JSXIdentifier | JSXMemberExpression)
  │  └─ attributes[]
  │     ├─ JSXAttribute → name (JSXIdentifier), value
  │     └─ JSXSpreadAttribute → argument
  ├─ closingElement (JSXClosingElement | null)
  └─ children[]
     ├─ JSXText
     ├─ JSXExpressionContainer → expression
     ├─ JSXElement (nested)
     └─ JSXFragment
```

## Differences Between ESTree and Babel AST

| Feature | ESTree | Babel |
|---------|--------|-------|
| **Literals** | Single `Literal` node | Split: `StringLiteral`, `NumericLiteral`, etc. |
| **Optional chaining** | `ChainExpression` wrapper | `OptionalMemberExpression` / `OptionalCallExpression` |
| **Property** | `Property` with `kind` | `ObjectProperty` and `ObjectMethod` split |
| **Method definition** | `MethodDefinition` | `ClassMethod` |
| **Property definition** | `PropertyDefinition` | `ClassProperty` |
| **Decorators** | Not in spec | `Decorator` node on classes/methods |
| **Type annotations** | Not in spec | Full TS/Flow node types |
| **Import attributes** | `ImportDeclaration.attributes` | `ImportDeclaration.assertions` (older) |

When writing transforms, know which AST format your tool uses:
- **ESLint** → ESTree
- **jscodeshift** → ESTree (via recast/ast-types)
- **Babel plugins** → Babel AST
- **SWC** → SWC AST (similar to Babel but in Rust structs)

For node type checking, use the tool's utilities (`t.isIdentifier()` for Babel, `j.Identifier.check()` for jscodeshift) rather than comparing `node.type` strings directly — they handle aliases and edge cases.
