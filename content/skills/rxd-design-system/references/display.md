# Display

Read-only label-value pair for presenting data in forms and cards.

## When to Use
- View-mode forms showing submitted data
- Detail panels and summary cards
- Information grids with label-value layout

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Label Type | Label & Value, Value & Label | Label & Value |
| Type | Form, Card | Form |
| Alignment | Left, Center, Right | Left |
| Size | Small, Medium, Large, X-Large | Small |

## Notes
- Form type uses horizontal layout; Card type uses stacked layout
- Label order can be flipped (value first) for emphasis

## Visual Variants (from Storybook)

### Story: Playground
- Label "Total Requested" rendered in a small, lighter-weight font
- Value "INR 38500" rendered in bold, larger text directly below the label
- No border, no background — plain inline display
- Stacked layout (label above, value below)
- State: Filled with a currency value

### Visual Observations
- The Display component renders as a plain label-value pair with no input affordances
- Label is thin/light text; value is bold and prominent
- Stacked layout (Card type) visible in this story — label on top, value underneath
- Currency-style values (e.g., "INR 38500") are a typical use case
- No box, no border, no background styling visible — purely typographic presentation