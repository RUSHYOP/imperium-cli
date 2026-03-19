# Tabs

Tabbed navigation for switching between related content views.

## When to Use
- Switching between related content sections on the same page
- Settings panels with categorised options
- Dashboard view toggles

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Horizontal-Tab, Vertical-Tab | Horizontal-Tab |

## Sub-components
- **Tab-Header** — the tab bar container
- **Tab-Title** — individual tab label/button
- **Tab** — content panel associated with a tab

## Do not use when
- Sections should all be visible at once and can collapse — use **Accordion**
- Navigation moves through a **sequential required flow** — use **Stepper**
- Navigating between different pages — use **Breadcrumbs** or router navigation

## Visual Variants (from Storybook)

### Tabs/Pills/Text (light background)
- Pill-shaped tab buttons in a horizontal row
- **Active tab (Tab 1):** white pill with blue bold label, elevated appearance (slight shadow or white fill against light grey container)
- **Inactive tabs (Tab 2, Tab 3):** no fill, grey text, flat
- Container: light grey rounded rectangle housing all tabs
- Content area: plain text below ("Tabs content here 1")

### Tabs/Pills/Text/Dark
- Same pill layout but on a slightly darker container background
- Active tab remains white pill with blue text; inactive tabs have no fill, grey text
- Content area below tabs: "Tabs content here 1"

### Tabs/Pills/Text (second instance — appears identical to first)
- Another light-background horizontal pill tab row (Tab 1 active, blue)

### Tabs/Pills/Text (Vertical layout)
- Vertical tab list: tab buttons stacked in a left column (white card panel)
- **Active tab (Tab 1):** white background, blue bold text, full-width row in panel
- **Inactive tabs:** no fill, grey text
- Content area appears to the right of the tab panel: "Tabs content here 1"
- Panel has a subtle border/shadow

### Tab states
| State | Visual |
|-------|--------|
| Active | White pill / white row, blue bold text |
| Inactive | No fill, grey text |
| Hover | Not explicitly shown in screenshots |

## Notes
- Horizontal for top-of-content navigation; Vertical for sidebar-style tabs
- Pill style used for both horizontal and vertical — rounded container for the active indicator
- Tab content area renders below (horizontal) or to the right (vertical) of the tab strip
- Component name in stories: `Tabs/Pills/Text` and `Tabs/Pills/Text/Dark`