# Slider

Range input control for selecting a value or range within defined bounds.

## When to Use
- Volume, brightness, or numeric range adjustment
- Price range filters
- Any continuous or discrete value selection within a range

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Label | Off, On | Off |
| Discrete | No, Yes | No |
| Variant | Value, Range | Value |
| Color | Primary, Neutral | Primary |
| Orientation | Vertical, Horizontal | Horizontal |
| Label Position | None, Down, Up, Right, Left | None |
| Size | Small, Medium | Small |
| Tooltip Position | None, Up, Down, Left, Right | None |
| Tooltip | Off, On | Off |

## Sub-components
- **Thumb** — draggable handle
- **Tick Mark** — discrete step indicators

## Notes
- Value variant for single-value; Range for dual-thumb min/max selection
- Discrete adds tick marks at fixed intervals