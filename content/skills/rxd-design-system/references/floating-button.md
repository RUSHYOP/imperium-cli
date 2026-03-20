# Floating Button

Elevated action button that floats above content, typically in the bottom corner. May expand into a speed-dial menu.

## When to Use
- Primary creation action (e.g. "New Item") on mobile
- Quick-access action menu (speed dial)
- Persistent action that should always be reachable

## FloatingButtons Properties

| Property | Options | Default |
|----------|---------|---------|
| Shape | Default, Round | Default |
| Type | Primary, Neutral | Primary |
| Variant | Default, Only Icon | Default |
| Size | Small, Medium, Large | Small |
| State | Default, Hover, Pressed, Disabled | Default |
| Style | Filled, Outlined | Filled |

## Sub-components
- **FloatingButtonMenu** — expanded speed-dial menu items

## Notes
- Use Round shape for a classic FAB look; Default for a more rectangular shape
- Speed-dial pattern via FloatingButtonMenu for multiple related actions

## Visual Variants (from Storybook)

- **Default**: A white rounded-square button (~44×44px) positioned in the bottom-left corner of the viewport. Contains a gear/settings icon (outline style, neutral-600 color). Subtle `sm` box-shadow for elevation. No label text visible — icon-only variant.
- **Draggable**: Identical to Default appearance but repositioned to bottom of viewport — the button can be dragged anywhere on screen. Same white rounded-square with gear icon.
- **Floating with Popover (Badge variant)**: The button displays the gear icon plus an orange badge pill in the top-right corner showing a count ("23"). Badge uses warning-500 (`#E68A00`) background with white text. Demonstrates the notification/count overlay pattern on the FAB.
- **Default story (Label variant)**: A white pill-shaped button in the top-left area with a heart icon, "Label" text, a ">" chevron, and a blue badge ("5") — this is the label+badge variant showing the expanded floating button with action label.

**Layout behavior**: The floating button is positioned absolutely/fixed, overlapping page content. It does not affect document flow.