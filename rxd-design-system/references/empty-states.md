# Empty States

Placeholder content shown when a view has no data to display.

## When to Use
- First-time use screens with no content yet
- Search results returning zero matches
- Filtered views with no matching items

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Illustration, Icon | Illustration |

## Notes
- Illustration type is more engaging for first-time experiences
- Icon type is more compact for inline empty states (tables, lists)

## Visual Variants (from Storybook)

### Illustration type (default.png and rxds.png — same result)
- Centered layout on a light gray background
- Large illustration image at top: a W3Schools/badge-style logo used as placeholder illustration
- Bold heading "No Data Available" in dark text
- Sub-text "Please check back later." in lighter gray text
- Two CTA buttons below: "Retry" (primary/filled blue) and "Contact Support" (secondary/outlined)
- Ample vertical whitespace above and below the illustration — centered in the viewport
- This represents the Illustration type with actions