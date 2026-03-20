# Panel

Contained surface area for grouping content with optional border and shadow.

## When to Use
- Wrapping form sections or content groups
- Sidebar panels
- Dashboard sections

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Enable Border | True, False | True |
| Enable Shadow | False, True | True |
| Size | Small, Medium | Medium |

## Do not use when
- Content has a distinct header + body + footer structure — use **Card**
- Content needs to slide in as an overlay — use **Drawer**
- Content is a modal requiring user acknowledgement — use **Modal**

## Visual Variants (from Storybook)

### Panel — default story
- Flat white surface with a thin grey top border
- **Header row:** small icon (lightbulb), bold header text left-aligned, three-dot kebab menu + chevron-up (collapse) icon right-aligned
- **Body:** paragraph text (lorem ipsum), no visible footer in default
- Header is collapsible — chevron indicates expanded state

### Panel — rxds-stories (full-featured)
- **Header:** avatar (circle, blue), home icon, bold "Section Title" + support text, green checkmark badge, "Badge" pill, right-side Badge x2, download icons x2, three-dot kebab
- **Body:** empty-state illustration (W3Schools logo), "No Data Available" heading, description text, "Retry" (primary) + "Contact Support" (ghost) buttons
- Shows all optional slot areas: left avatar zone, status badge, action buttons in header, content with empty state

- Component Set ID: `4788:10621`