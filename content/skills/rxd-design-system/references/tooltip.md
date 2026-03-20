# Tooltip

Small text label that appears on hover to describe an element.

## When to Use
- Explaining icon-only buttons
- Showing full text for truncated content
- Providing additional context without cluttering the UI

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Theme | Dark, Light | Dark |

## Do not use when
- Content is longer than one line or includes links/buttons — use **Popover**
- Content should be persistently visible — use **Label** or inline text
- Guidance covers multiple topics — use **QuickHelp**

## Notes
- Dark theme for light UIs; Light theme for dark UIs
- Use Popover instead for interactive or multi-line content

## Visual Variants (from Storybook)

### Tooltip playground (VisualTooltip/playground.png)
- Shows a "Confirm" button centered on a white background — the tooltip appears on hover of this trigger element; the screenshot shows the idle state before hover
- The playground is interactive; no tooltip bubble is visible in the static screenshot

Note: The VisualTooltip directory contains only a playground.png (interactive demo) and rxd.png (which did not render visible content). The tooltip itself is a hover-triggered floating label and cannot be captured in static screenshots easily.