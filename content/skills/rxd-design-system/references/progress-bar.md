# ProgressBar

Linear progress indicator showing completion percentage.

## When to Use
- File upload progress
- Multi-step process progress
- Skill or capacity meters

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Default, Label Value Top, Label Value Bottom, Label Value Detailed | Default |
| Enable Tooltip | True | True |
| Size | Small, Medium | Small |
| Percentage | 0%, 20%, 40%, 50%, 60%, 80%, 100% | 0% |

## Do not use when
- Progress is radial/gauge style — use **Circular Progress**
- Progress percentage is unknown — use **Loader**
- Content is loading and structure is known — use **Skeleton Animation**

## Notes
- Label Value variants add textual percentage alongside the bar

## Visual Variants (from Storybook)

### ProgressBar default (ProgressAndLoadingIndicatorsProgressbar/default.png)
- Full-width horizontal bar
- Blue filled track (~5% complete) on a light gray background track
- Percentage label "5%" displayed to the right of the bar
- Very thin bar height — small/default size
- Clean minimal appearance with no label above

### Page Loader (ProgressAndLoadingIndicatorsPageloader/default.png)
- Full-width thin horizontal bar pinned at the top of the viewport (below the top edge)
- Blue filled ~50% with a light gray unfilled portion
- Has a subtle drop shadow below separating from page content
- theme-rxd selector in top-right corner confirms correct theme application
- This is the Start state with progress visible