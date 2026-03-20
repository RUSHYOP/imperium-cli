# Search

Full-featured search component with basic and advanced modes, attribute filtering, and results display.

## When to Use
- Global application search
- Filtered data exploration
- Quick-find with favourites and recent searches

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Active | Active |
| Search Type | Basic, Basic + Attribute, Advance, Advance + Attribute | Basic |

## Sub-components
- **Search Field** — the text input
- **Search Results** — results dropdown
- **Results** — individual result item
- **Advance icon** — toggle for advanced mode
- **Search - Favourite Name - Context Menu** — saved search context menu

## Do not use when
- Only a single field typeahead is needed — use **AutoSuggest**
- Input is a generic text field with no suggestions/results — use **Input Field**
- Filtering is column-level in a table — use **Column Switch** + table filters

## Notes
- Basic for simple keyword search; Advance adds field-level filters
- Attribute variants add structured metadata filters