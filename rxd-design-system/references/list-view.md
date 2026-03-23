# ListView

Full-featured data list with header, toolbar, rows, cells, and footer. Supports column configuration, checkboxes, and downloads.

## When to Use
- Data-heavy views (record lists, file browsers)
- Master-detail patterns
- Reports with column sorting and toolbar actions

## Properties

| Property | Options | Default |
|----------|---------|---------|
| EnableBorder | False, True | False |
| EnableCheckbox | True, False | True |

## Sub-components
- **ListView-Header** — column headers
- **ListView-Toolbar** — action bar (search, filter, bulk actions)
- **ListView-Row** — data row
- **ListView-Cell** — individual cell in a row
- **ListView-Footer** — pagination and summary
- **ListView-Title** — list title
- **Header-Left** / **Header-Right** — left/right header sections
- **Column Chooser-Body** — column visibility picker
- **Download_Files** — export/download actions

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default | Title bar with avatar + Badge chip, toolbar with Search input + upload/download/filter/add/settings icon buttons, column headers with sort arrow, checkbox rows, Hyperlink cells, Pagination footer, bulk-action "Toggle Selection" button at bottom |
| customized | Same structure but custom columns (Name, Dept, DOB, DOJ, Gender), row-level edit/view icon buttons on the right, no filter button in toolbar |
| default-with-border-rows | Full list with divider borders between every row, no title bar, search-only toolbar, settings icon only; demonstrates dense scrollable view |
| pagination | Minimal list: 4 columns (First Name, Last Name, Email, Phone), settings icon only, full Pagination bar; shows list without title/toolbar chrome |
| virtualized | Very long scrollable list (hundreds of rows) rendered via virtual scroll; demonstrates performance mode |
| custom-types | Rows contain mixed cell types: avatar, image, switch toggle, badge, heading, paragraph, hyperlink — shows rich cell content capability |
| lazy-loading | Large dataset loaded progressively; pagination bar at bottom with page numbers |

### Toolbar icons (left-to-right as seen)
Upload, Download, Filter, Add (circle-plus), Settings (gear)

### Visual notes
- Title sits in top-left with optional avatar and Badge chip
- Search field always appears in toolbar right zone
- Checkbox column is leftmost when enabled; rows without selection show unchecked box on hover
- Hyperlinks in cells render in blue (`#0064D2`)
- Pagination uses the standard Pagination component (first/prev/numbered/next/last)