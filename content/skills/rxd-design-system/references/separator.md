# Separator

Horizontal or vertical divider line between content sections.

## When to Use
- Dividing content sections
- Separating list items or groups
- Visual hierarchy between adjacent elements

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Orientation | Horizontal, Vertical | Horizontal |
| Color | Light, Dark | Light |
| HorizontalSpacing | None, Small, Medium, Large | None |
| VerticalSpacing | Small, Medium, Large, None | None |

## Visual Variants (from Storybook)

### Separator — default story
- A single thin horizontal line spanning the full width of the container
- Very subtle — renders as a 1px light grey rule
- No labels, icons, or text — purely decorative divider

### Visual characteristics
- Horizontal: full-width rule, 1px height, light grey color
- Vertical: full-height rule, 1px width (renders within a flex/inline container)
- Light color variant: very faint grey, near-invisible on white backgrounds
- Dark color variant: more visible grey rule

- Component Set ID: `23266:149860`