# Popover

Floating content container triggered by a click or hover. Use for contextual information or controls.

## When to Use
- Inline help or definitions
- Mini forms or actions in context
- Rich tooltips with interactive content

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | Small, Medium | Medium |

## Do not use when
- Content is a single short text hint — use **Tooltip**
- User must not be able to continue without acting — use **Modal**
- Content is a full form or detail view — use **Drawer**

## Visual Variants (from Storybook)

### Popovernew — default story
- Story renders a "Popover" button (ghost/outlined, small) that opens the popover on click
- The popover floats near its trigger anchor — screenshot captures closed/trigger state

### Popovernew — rxd story
- "RXD Popover" button (ghost/outlined) as the trigger
- Same trigger-based pattern, confirming the popover appears adjacent to the trigger element

### Popovernew — scroll-popover story
- Trigger: "Hello" text with a gear icon and a chevron-down — functions as a collapsible row trigger
- Full-width bottom-anchored popover layout (appears below the trigger bar)
- Shows popovers can be used in more complex anchoring scenarios (e.g., below a settings row)

### Popovernew — with-min-height story
- Trigger: "Click to open popover with minHeight" (outlined button)
- Confirms the `minHeight` property controls minimum popover height

## Notes
- Use Tooltip for simple text hints; Popover for rich/interactive content
- Popover trigger is a separate element (Button or custom) — the Popovernew component wraps the floating content
- Supports `minHeight` property for taller content scenarios
- Can be anchored to any trigger element including rows, buttons, or icon controls