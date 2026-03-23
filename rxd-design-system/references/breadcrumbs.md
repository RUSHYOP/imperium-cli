# Breadcrumbs

Navigation trail showing the user's current location within a hierarchy.

## When to Use
- Multi-level page structures with parent-child relationships
- Application navigation where users need to backtrack
- File/folder browser paths

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Icons | True, False | True |
| Device | Desktop, Mobile | Desktop |

## Sub-components
- **Breadcrumbs_chips** — individual breadcrumb chip/segment

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default | Three-level trail: "Parent" (blue link) > "Child" (blue link) > "Grandchild" (grey, current); chevron `>` separator between each segment |
| highlight-selected-list | Not available in screenshots directory |

### Visual notes
- Active/current segment is rendered in dark grey (non-clickable)
- Ancestor segments render as blue hyperlinks (`#0064D2`)
- Separator is a `>` chevron character in grey
- No border or background — breadcrumbs sit flush inline

## Notes
- Mobile variant condenses the trail for smaller screens
- Icons toggle adds leading icons to each breadcrumb segment