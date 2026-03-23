# JSON Viewer

Interactive tree display for viewing and editing JSON data structures.

## When to Use
- Debugging or inspecting API payloads
- Configuration editors
- Data structure visualisation

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, On Hover, Row Edit, Drop Row | Default |

## Sub-components
- **Cell** — individual key-value row in the tree

## Notes
- Row Edit state enables inline editing of values
- Drop Row state shows the drag-and-drop reorder affordance

## Visual Variants (from Storybook)

- **default-json-viewer**: Renders a collapsible tree viewer for complex nested JSON. Shows expandable nodes with `v` toggle arrows. String values appear in their natural color (no syntax highlighting in default mode). Line numbers are not shown. Keys are plain text; values are plain text. Very compact rows — shows deeply nested objects and arrays. Example data was a large donut nutrition/food JSON with nested objects, arrays, and multiple levels of nesting.
- The viewer renders the full JSON tree in a monospace-style layout. Node collapse/expand is the primary interaction.
- Nested arrays show `v{...}` fold indicators for objects inside arrays.
- No toolbar, no search bar — pure tree display in the default state.