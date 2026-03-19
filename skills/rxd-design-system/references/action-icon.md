# ActionIcon / ActionIconToggle

Compact icon-only buttons for triggering actions. ActionIconToggle adds a persistent on/off state.

## When to Use
- Toolbar actions (edit, delete, share, bookmark)
- Compact controls where a text label is not needed
- Toggle states like favourite, pin, or visibility

## ActionIcon Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Primary, Secondary, Tertiary | Primary |
| Status | Default, Neutral | Default |
| State | Default, Hover, Pressed, Disabled | Default |
| Size | XS, Small, Medium, Large | XS |

## ActionIconToggle Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | On, Off | On |
| State | Default, Hover, Pressed, Disabled | Default |
| Size | XS, Small, Medium, Large | XS |

## Notes
- Always pair with a tooltip for accessibility
- Toggle variant provides visual feedback for on/off states

## Visual Variants (from Storybook)

- **icon story**: A small square icon button (~28×28px) showing a save/floppy-disk icon in blue (primary-500). Top-right corner shows a small green filled circle (success dot/badge). The button has a very subtle border/shadow — appears as a flat white tile with the icon. Demonstrates ActionIcon with a status indicator overlay.
- **toggle-action story**: Same save/floppy-disk icon but in a toggled-off state — icon appears in a muted/gray tone (neutral-400) indicating the inactive/off state. No badge or status dot visible. Very compact — fits tightly in a toolbar context.

**Visual summary**:
- Active/on state: icon in primary-500 blue, optionally with a green status dot
- Inactive/off state: icon in neutral-400 gray
- Button frame: ~28–32px square, white background, subtle border or no border depending on variant
- XS size is the default and most compact option