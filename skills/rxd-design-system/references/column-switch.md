# Column Switch

Toggle control for showing/hiding columns in data views.

## When to Use
- Column configuration in tables or list views
- User-customisable data density settings

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Switch Column | False, True | False |

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default | A two-panel layout with "Ous" list on left and "Activities" list on right; each panel has a Search input and "Expand All" link; left items show "mapped" badge chips (blue outline); right items show checkboxes and count badges (e.g. "0 of 3"); a circular sync/refresh icon between panels; a blue "Save" button at the bottom-left |

### Visual notes
- The component is a column-assignment or mapping control, not a simple toggle switch
- Two columns (source and target) allow mapping/assignment between two datasets
- Left panel items show mapping status with a "mapped" badge (blue outlined chip)
- Right panel items show checkbox selection with count badges showing assigned/total
- Expand/collapse control with a chevron on each row
- Switch Column = True shows the assignment control; False hides it

- Component Set ID: `25482:3942`