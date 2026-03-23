# AutoSuggest

Typeahead input that displays matching suggestions as the user types. Filters a list in real time.

## When to Use
- Search fields that benefit from real-time suggestions
- Form fields with a large set of known values
- Command palettes or quick-access inputs

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Default, Support Text, No Data | Default |

## Sub-components
- **AutoSuggest-List-Item** — individual suggestion row

## Do not use when
- Options are a fixed short list (≤15) — use **Combo**
- Multiple values can be selected — use **MultiSelect**
- Full search with results and filters is needed — use **Search**

## Notes
- "No Data" variant shows an empty-state message when no matches are found
- "Support Text" adds secondary text to each suggestion item

## Visual Variants (from Storybook)

### RXD Default (rxd-default.png)
- Label "Autosuggest" with a red asterisk (required field indicator) above the input
- Input field showing placeholder text "Search" with a filter/sort icon on the right edge
- Standard text-input appearance with light border

### RXD Support Text (rxd-support-text.png)
- Label "Autosuggest" (no asterisk — optional field)
- Same input field layout with filter icon on right — no placeholder text visible
- Identical dimensions to default; support text would appear below input when suggestions render

### Playground (playground.png)
- Shows a "Confirm" button in the center — this is the playground trigger to invoke the autosuggest dropdown interactively; not a visual of the dropdown itself