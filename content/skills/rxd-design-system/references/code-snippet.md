# Code Snippet

Displays formatted code blocks with syntax highlighting and copy functionality.

## When to Use
- Documentation pages with code examples
- API reference and developer guides
- Displaying configuration or JSON payloads

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Theme | Light, Dark | Light |

## Notes
- Dark theme suits dark-mode UIs or embedded terminal-style blocks

## Visual Variants (from Storybook)

- **DataVisualizationDiffcheck / playground**: Side-by-side diff viewer (not a code snippet per se, but related). Two columns — left (original, red-tinted rows with `-` prefix) and right (new, green-tinted rows with `+` prefix). Changed tokens within a line are highlighted with a darker red/green background pill. Line numbers shown on both sides. Example diff shows JSON property changes: `"name": "John Doe"` → `"name": "John Smith"`, age 30→31, email and street address changes. Uses a light monospace font on a white background.

**Note**: The DiffCheck component (`DataVisualizationDiffcheck`) is a separate component from Code Snippet. It provides a specialized two-panel before/after diff view, not a general code display block. Use DiffCheck for showing data/config changes; use Code Snippet for static code examples.