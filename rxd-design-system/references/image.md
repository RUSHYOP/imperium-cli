# Image / Image Attach

Image display component with aspect ratio and shape controls. Image Attach provides attachment-style image handling.

## When to Use
- Content images with consistent aspect ratios
- Thumbnails, avatars, and media previews
- Image upload previews (Image Attach)

## Image Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Placeholder, On Hover Overlay, On Hover Placeholder Overlay | Default |
| Ratio | 1:1, 21:9, 16:9, 3:1, 3:2 | 1:1 |
| Style | Regular, Rounded, Circle | Regular |

## Notes
- Placeholder state shows a fallback when no image is loaded
- Hover overlay provides actions or info on mouse-over

## Visual Variants (from Storybook)

### Shape styles (all-in-one.png)
Three stacked variants of the same photograph (person walking up stairs in clouds):
- **Circle**: Image cropped into a perfect circle — content is centered and masked to round shape
- **Rounded**: Image with rounded corners (large border-radius) — rectangular but with softened edges
- **Square**: Image with no border-radius — fully rectangular, standard crop

### Playground (playground.png)
- Shows `NbImage` component label in top-left
- Displays a 3D illustration (padlock with shield and X badge) — used as a placeholder/fallback image asset
- Confirms the component name used in React is `NbImage`