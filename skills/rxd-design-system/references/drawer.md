# Drawers (Sidedraw / Mobile Drawer)

Slide-in panels from the edge of the screen for secondary content, forms, or navigation.

## When to Use
- Detail views that overlay the main content
- Forms or filters that don't warrant a full page
- Mobile navigation menus

## Sidedraw Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | Fullscreen, Large, Medium, Small, XSmall | Fullscreen |

## Mobile Drawer Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | Full Screen, 3/4 Screen, Half Screen, 1/4 Screen | Full Screen |

## Sub-components
- **Sidedraw-Header** — drawer title bar with close action
- **Sidedraw-body** — scrollable content area
- **Mobile Drawer Header** — mobile-specific header
- **Mobile Footer** — mobile action bar

## Do not use when
- User must acknowledge before continuing — use **Modal**
- Content is a brief hint or small form — use **Popover**
- Content is a full peer-level view — use **Tabs**

## Notes
- Sidedraw is for desktop; Mobile Drawer is for touch devices with bottom-sheet-style sizes
- Multiple size presets control how much screen real estate the drawer occupies