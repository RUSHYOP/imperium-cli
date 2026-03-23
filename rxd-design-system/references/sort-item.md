# SortItem

Draggable list item for reordering collections via drag-and-drop.

## When to Use
- Sortable/reorderable lists
- Priority or sequence management
- Kanban or task board items

## Properties

| Property | Options | Default |
|----------|---------|---------|
| EnableShadow | False, True | False |
| EnableBackground | False, True | False |
| LeftBorderColor | Primary, Secondary, Warning, Success, Error, Custom, None | None |
| State | Default, WhileDragging, WhileDropping, DragDisabled | Default |
| Size | Small, Medium, Large | Small |
| EnableLeftBorder | False, True | False |

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default | A list titled "Countries"; 5 rows each with a coloured left-border stripe (India=blue, Australia=grey, New Zealand=amber/yellow, England=green, Japan=red); each row shows the country name as the main label; a three-dot vertical context menu button on the far right of each row; thin divider lines between rows |

### Visual notes
- LeftBorderColor values map to stripe colours: Primary=blue, Secondary=grey, Warning=amber, Success=green, Error=red, None=no stripe
- EnableLeftBorder must be True for the colour stripe to appear
- Rows have a clean white background by default; EnableBackground=True adds a light grey fill
- EnableShadow=True adds a subtle drop shadow (useful when WhileDragging state is active)
- States:
  - **Default** — normal resting row
  - **WhileDragging** — row is elevated/shadowed, lifted from the list
  - **WhileDropping** — row is being positioned into a new slot
  - **DragDisabled** — row cannot be reordered (drag handle hidden or greyed)
- Three-dot context menu button on the right edge provides actions for each item
- Sizes: Small, Medium, Large control row height and text size

## Notes
- LeftBorderColor adds a status indicator stripe on the left edge