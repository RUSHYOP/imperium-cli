# Table

Full-featured data table with headers, rows, cells, footer, and optional title bar.

## When to Use
- Structured data display (records, transactions, inventory)
- Sortable and filterable data grids
- Reports and data exports

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Default, Zebra | Default |
| Type | Single Line, Multiline | Single Line |
| Enable Border | True, False | False |

**Toggles:** Header, Footer

## Sub-components
- **Table-Title** — table heading / caption area
- **Table-Header** — column headers with sort controls
- **Table-Row** — data row container
- **Table-Cell** — individual data cell
- **Table-Footer** — summary row or pagination area

## Do not use when
- Rows need toolbar, bulk actions, and column configuration — use **ListView**
- Items are visual tiles, not column-aligned rows — use **Card Container**
- Data is hierarchical/nested — use **Tree**

## Notes
- Zebra variant adds alternating row colours for readability
- Multiline type allows cell content to wrap
- Use with Pagination for large data sets