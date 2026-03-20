# MultiSelect

Multi-selection dropdown allowing users to pick multiple values from a list.

## When to Use
- Filters with multiple selectable criteria
- Tag or category assignment
- Any form field requiring multiple selections

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Selected, Filled, Active, Loading | Default |

## Sub-components
- **MultiSelect - List** — dropdown list container
- **MultiSelectInput** — the input trigger/display
- **MultiSelectOptions** — individual option row

## Do not use when
- Only one option can be selected — use **Combo** or **Radio**
- All options should be visible without a dropdown — use **Checkbox** group
- Options are large and need real-time filtering — use **AutoSuggest** with multi-pick

## Notes
- Loading state shows a spinner while options are fetched
- Selected items appear as chips/tags in the input

## Visual Variants (from Storybook)

### Story: RXD (Default)
- Full-width multiselect input with a label "Choose *" (required marker in red)
- Two selected chips visible inside the input: "Item1 ×" and "Item2 ×" — chips have a close (×) button
- Chevron-down icon on the right to open the dropdown
- Light border, white background
- State: Filled / Multiple selections active

### Visual Observations
- Required label is shown above the field with a red asterisk
- Selected values render as removable chips (pill tags with × dismiss button) inside the input field
- Chevron-down on the far right opens the dropdown list
- No visible search/filter icon in the closed state
- Chips sit inline to the left, with the dropdown arrow fixed to the right