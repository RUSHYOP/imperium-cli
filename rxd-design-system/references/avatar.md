# Avatar / AvatarGroup

Circular or square thumbnail representing a user or entity. AvatarGroup displays a stacked collection of avatars.

## When to Use
- User profile pictures, contact lists, comment authors
- Showing assignees or participants in a row (AvatarGroup)
- Placeholder when no image is available (icon/text fallback)

## Avatar Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | 3XSmall â€“ 2XLarge (8 sizes) | 3XSmall |
| Type | Icon, Image, Text | Icon |
| Style | Without Border, With Border | Without Border |
| Shape | Circle, Square | Circle |

**Toggles:** Status indicator

## AvatarGroup Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | L Group, M Group, S Group, XS Group, XXS Group, XL Group, XXL Group | XXL Group |

## Notes
- Use Text type for initials fallback when no image is available
- AvatarGroup truncates overflow with a "+N" indicator

## Visual Variants (from Storybook)

### Avatar
- Default (default.png): Large circle avatar with a small person icon centered on a light blue background — icon is faint/muted, low-contrast style
- RXD (rxd.png): Same large circle, light blue background, but person icon is a clear blue stroke outline — more prominent, higher contrast

### AvatarGroup
- Default (default.png): Stacked row — one large icon avatar on the left, followed by two "US" text initials avatars, then a "+8" overflow pill. All share the same light blue circle style with blue text/icon.
- RXD (rxd.png): Same layout but rendered slightly smaller/tighter — icon + "US" + "US" + "+8", without the outer grouping circle seen in the default variant.