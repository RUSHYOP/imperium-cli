# Badge

Small status descriptor for counts, labels, or indicators. Often paired with icons or navigation items.

## When to Use
- Notification counts on icons or tabs
- Status labels (active, pending, error)
- Category or metadata tags in lists

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | xsmall, small, medium, large | xsmall |
| Border Type | W/O Border, With Border, Solid | W/O Border |
| Badge Type | Normal, Icon Only | Normal |
| Color | Primary, Warning, Success, Error, Neutral, Dark Gray | Primary |

**Toggles:** Count, Left Icon, Right Icon, Dot Badge

## Sub-components
- **Dot_Badge** — minimal dot indicator without text

## Do not use when
- Label is standalone (not overlaid on another element) — use **Tag**
- Message is transient feedback after an action — use **Toast Message**
- Colour is a status on a row or list item — use **Tag** with colour variant

## Notes
- Use Dot_Badge for simple presence/status without a count
- Solid border type provides a filled background style

## Visual Variants (from Storybook)

### Badge
- Default (default.png): Small circular badge with a white number "5" on a green/success background — count badge style with no border
- Without Custom Color (without-custom-color.png): Pill-shaped badge with text "Badge badge badge badge" on a solid blue (primary) background — demonstrates the text/label badge in solid border style

### Dot Badge (VisualBadgedot)
- dot-badge.png: Minimal single dot rendered in a theme-rxd context — a very small blue filled circle with no text, shown at its smallest scale; theme selector visible in corner confirming theme-rxd