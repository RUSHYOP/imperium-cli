# Tree

Hierarchical tree view for browsing nested data structures.

## When to Use
- File/folder browsers
- Category hierarchies
- Organisational or menu structure navigation

## Sub-components
- **Tree Unit** — expandable/collapsible tree node
- **Cell** — leaf-level item in the tree

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default-full | Search bar at top-right with a sort/expand toggle button; rows show: right-pointing chevron (expand), a square icon, bold item label (e.g. "Root Item 1") with a blue dot badge, and sub-text below (e.g. "Subtext for root-1"); three-dot context menu button on the far right of each row; 6 root items shown |
| deepnested-tree | Same layout with fewer items (2 visible) for demonstrating deep expand; each row shows item label, blue dot, description sub-text, and three-dot menu |
| with-menu-items | Similar structure; items show context menus are accessible; search + sort controls at top |
| with-no-data | Same search/sort header but body shows a "No Data Available" empty state with an illustration, "Please check back later." message, and "Retry" (primary) + "Contact Support" (secondary) action buttons |

### Visual notes
- Tree header zone: full-width Search input field + a sort/collapse-all toggle button (top-right corner)
- Each row layout: [chevron] [icon] [label + blue dot badge] / [sub-text] — [three-dot menu]
- Chevron points right when collapsed; rotates down when expanded
- Blue dot badge on the item label indicates a status or notification
- Sub-text sits below the label in smaller, lighter grey text
- Three-dot (ellipsis) context menu appears on the right end of each row
- Empty state: centred illustration + heading + sub-text + action buttons

## Do not use when
- Hierarchy represents org/reporting structure — use **OrgChart**
- Items are flat with no nesting — use **ListView** or **Table**
- Hierarchy is very shallow (1–2 levels) — use **Accordion** or nested lists

- Cell Set ID: `16311:15848`