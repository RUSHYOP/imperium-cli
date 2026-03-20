# MCP Authoring

The UIDL MCP is metadata-first and foundation-first.

## Source of Truth

- Components come from the current component schema, Designer defaults, and node templates
- Layout stays on Bootstrap 12-column container → row → column
- CSS stays on verified runtime/component utility classes
- Local page files stay as bare metadata arrays under `/Users/admin/Codes/uidl/projects`

## Main MCP Jobs

### 1. Catalog Retrieval

Use these tools to fetch the current foundation before generating:

- `components.list`
- `components.get`
- `icons.get`
- `css.list`
- `guidelines.get`

### 2. UIDL Creation / Editing

Use these tools to create or modify page files:

- `pages.create`
- `pages.read`
- `uidl.children.create`
- `uidl.children.add`
- `uidl.children.replace`
- `uidl.children.remove`
- `uidl.generate`
- `uidl.save`

### 3. Validation / Export

Every generated or edited UIDL should pass through:

- `uidl.validate`
- `uidl.fix`
- `uidl.export`

## Supported Generation Modes

### `project`

Agent interprets the external project, splits it page-wise, maps it to supported components, then calls MCP with structured page specs or metadata.

### `screenshot`

Agent interprets the screenshot into rows, columns, and component specs, then calls MCP with structured page specs or metadata.

### `compose`

Agent composes pages directly from the current components and layout rules.

### `prompt`

Agent designs directly from prompts using the current guidelines, then calls MCP with structured page specs or metadata.

## Important Rule

The MCP is not a parallel UIDL dialect. It must always emit the same canonical metadata that Swift Runtime and Designer already understand.
