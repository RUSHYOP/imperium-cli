# Accordion

Collapsible panels that expand/collapse to show or hide content sections. Supports outline and line styles.

## When to Use
- Group related content that doesn't need to be visible at once
- FAQs, knowledge-base articles, settings panels
- Progressive disclosure in long forms

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Outline ACC, Line ACC | Outline ACC |
| State | Default, Hover, Active | Default |
| Device | Desktop, Mobile | Desktop |
| Size | Small, Medium | Medium |

**Toggles:** Body, Footer

## Do not use when
- Content views are **peer-level and switchable** — use **Tabs** instead
- Content must **overlay** the main page — use **Drawer (Sidedraw)**
- Only one section exists — use **Panel** directly

## Visual Variants (from Storybook)

### Accordion — default story (3 items, Outline style)
- Three accordion rows stacked vertically with thin border/shadow separating each
- **Header row:** avatar (circle), home icon, bold "Item One" + "Support text", green checkmark badge, "Badge" pill — right side: Badge x2, three-dot kebab, chevron-down (collapsed) or chevron-up (expanded)
- **Expanded item (first):** reveals "Content for Item 1" body text below header
- Remaining items are collapsed — chevron-down visible

### Accordion — with-footer story
- Same 3-item structure but the expanded item also shows a **footer row**
- Footer contains: upload icon + "upload" link, download icon + "download" link on left; "Button One" (ghost) + "Button Two" (primary) on right
- Collapsed items labelled "Item One collapsed" to distinguish from expanded item
- Confirms: footer is an optional toggle, visible only when enabled

## Notes
- Outline for bordered panels; Line for minimal divider style
- Mobile variant adapts touch targets and spacing
- Header supports: leading avatar, icon, title+support text, status badge, badge pills, trailing badge pills, kebab menu, collapse chevron
- Footer supports: leading icon-text pairs (upload/download links) and trailing action buttons