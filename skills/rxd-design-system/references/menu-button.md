# MenuButton

Button that opens a dropdown menu of actions. Combines button and menu in one control.

## When to Use
- Actions with sub-options (export as PDF/CSV/Excel)
- Navigation menus triggered by a button
- Compact action groups

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Enable Padding | True, False | True |
| Color | Primary, Secondary | Primary |
| State | Default, Hover, Pressed, Disabled | Default |
| Size | Small, Medium, Large | Small |
| Variant | Default, Icon Only | Default |

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default | Shows "MenuButton" label above; a row with a left-pointing arrow icon, bold blue "Bharath" text, a count badge "21", and a down-chevron dropdown trigger; button is borderless, appears inline |

### Visual notes
- The default variant is rendered without a visible button border — it looks like a text + badge + chevron row
- Blue text label (`#0064D2`) acts as the button face
- Count badge appears between the label and the chevron
- Icon Only variant removes label, showing only the chevron/icon
- Colors: Primary uses blue, Secondary uses neutral grey tones

## Notes
- Icon Only variant removes the text label for compact toolbars