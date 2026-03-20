# Button

Primary action trigger. Supports multiple visual variants, status colours, and sizes.

## When to Use
- Form submissions and primary CTAs
- Dialog confirmations and cancellations
- Toolbar and card actions

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Primary, Secondary, Tertiary | Primary |
| Status | Default, Success, Warning, Error, Neutral | Default |
| State | Default, Hover, Pressed, Disabled | Default |
| Size | XS, Small, Medium, Large | XS |
| Enabled Stretched | Enabled | Enabled |

**Toggles:** Icon Left, Icon Right, Text

## Do not use when
- Action has no text label and fits in a toolbar — use **ActionIcon**
- Action is purely navigation to another page — use **Hyperlink**
- Action is one of two equal alternatives with shared context — use **SplitButton**
- Action opens a list of sub-options — use **MenuButton**

## Notes
- Use Primary for the main CTA, Secondary for alternatives, Tertiary for low-emphasis actions
- Icons can appear on left, right, or both sides; Text can be hidden for icon-only use
- Status colours convey semantic meaning (Success = confirm, Error = destructive)

## Visual Variants (from Storybook)

### Colors
Two color tracks observed in the all-in-one story:
- **Default** — medium blue filled (solid) or outlined (ghost) or text-only style
- **Primary** — darker/brighter blue filled (solid) or outlined (ghost) or text-only style

### Styles (per color)
- **Solid** (filled background)
- **Ghost** (outlined, no fill)
- **Text** (no border, no fill — link-like)

### Sizes (per style)
- **Large**
- **Medium**
- **Small**

### States
- Normal (active)
- **Disabled** — all sizes have a disabled variant shown with reduced opacity

### Icon Placement
Each style and size comes in four icon variants:
- No icon (label only)
- **Icon Left** — icon appears before the label
- **Icon Right** — icon appears after the label
- **Icon both sides** (Icon-right-left) — icon on both left and right of label

### Icon-Only Button
A separate icon-only story shows a single square button with just an icon (no text label), rendered in Default/Ghost style at Small size.

### Playground
Shows a Text-style button with icon left and icon right at Small size (label "Small"), confirming the icon-both-sides configuration is supported.