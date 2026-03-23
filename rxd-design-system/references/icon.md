# Icon

Standalone icon component with configurable size, style, and semantic colour.

## When to Use
- Visual indicators alongside text
- Button or navigation icons
- Status and category markers

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | XXXS, XXS, XS, S, M, L, XL, XXL | XXXS |
| Type | Stroke, Fill | Fill |
| Color | Primary, Neutral, Success, Error, Warning, Info, Bluegray, Freshgreen, Turquoise, Bluelight, Royalblue, Pink, Purple, Indigo, Rose, Orange, Brown, NA, Blue | NA |

## Notes
- Stroke type for outlined icons; Fill for solid icons
- NA colour inherits from parent context

## Visual Variants (from Storybook)

### Icon catalog (single.png)
- Grid view of icons with a search bar at top
- Icons are rendered in blue (primary color) at medium size
- Naming convention visible: `{Name}Filled` and `{Name}Stroke` — e.g. ActionFilled, ActionStroke, ActivityFilled, ActivityHeartFilled, ActivityHeartStroke, AddFilled, AddStroke, AddcartFilled, AddcartStroke, AdddocuFilled, AddfileFilled, AddfileStroke
- Filled variants use solid blue shapes; Stroke variants use outlined blue line drawings
- All icons displayed at uniform size on a white/light background grid

### Single icon (default.png)
- Minimal checkmark icon rendered in blue — demonstrates a single XS/S size icon in stroke style with default NA color inheriting primary blue from context