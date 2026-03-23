# Numeric

Number-only input field with increment/decrement controls and validation.

## When to Use
- Quantity selectors
- Numeric form fields (age, price, quantity)
- Settings with bounded numeric values

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Placeholder, Filled, Focus-Filled, Focus-Placeholder, Disabled-Filled, Disabled-Placeholder | Placeholder |
| Status | Normal, Success, Error | Normal |
| Size | Regular, Small, Large | Regular |

- Component Set ID: `37481:40427`

## Visual Variants (from Storybook)

### Sizes
Three sizes shown side by side in the all-in-one story:
- **Small**
- **Medium**
- **Large**

### States (per size)
Each size shows three rows:
1. **Normal / Default** — filled value (34,345.87), label "Enter the Value", hint text "Please enter values 0-9"
2. **Error** — red border, red hint text "Please enter values 0-9"
3. **Disabled** — grayed out, not interactive, same value displayed

### Appearance
- Right-aligned numeric value inside the field
- Up/down stepper arrows (▲▼) on the right edge of the field
- Label text above the field
- Caption/hint text below the field (red when in error state)
- Formatted number display with comma separators (e.g., 34,345.87)

### Playground
Shows a single Large-size numeric field:
- Label "Enter the value" with mandatory asterisk (red *)
- Value: 4,566
- Hint text below: "task triggered :"
- Up/down stepper arrows visible on right side