# Tag / Tag Group

Small labelled chip for categorisation, filtering, or metadata. Tag Group arranges multiple tags together.

## When to Use
- Content categorisation and filtering
- Status labels on cards or list items
- Selected filter chips that can be removed

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Color | Primary, Neutral, Warning, Error, Custom, Success | Primary |
| Size | xsmall, small, medium, large | xsmall |
| State | Disabled, Default, Hover, Pressed | Default |

## Sub-components
- **Tag Group** — container that arranges multiple tags

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| playground | A single selected-state row showing: a checkmark icon, a user avatar icon, a bullet dot, "tag 1" label, the number "2", and an "x" close icon — all in blue on a white background with a blue border; represents a multi-element tag chip |
| tag-group | Three tags in a row: "tag 1 x", "tag 2 x", "tag 3 x" (each blue-outlined chip with close button) plus a "+3" overflow chip and a "+" add button; demonstrates the Tag Group container layout |

### Visual notes
- Tag chip: blue border (`#0064D2`), blue text, optional leading icon/avatar, optional trailing close "x"
- Sizes: xsmall (default, compact), small, medium, large
- Colors: Primary (blue), Neutral (grey), Warning (amber), Error (red), Success (green), Custom
- States: Default, Hover (slightly elevated), Pressed (depressed), Disabled (greyed, no interaction)
- Tag Group: horizontal row of chips; when overflow occurs, a "+N" chip appears; an optional "+" button adds new tags
- The number beside the label (e.g. "2") can represent a count or badge value inside the chip

## Do not use when
- Label is overlaid on another element (icon, nav item) — use **Badge**
- Item is a named action — use **Button**
- Label is a read-only status inside a form field — use **Display**

- Tag Group Set ID: `24233:13395`