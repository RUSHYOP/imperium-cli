# Timeline

Sequential event display showing chronological items. Available in Horizontal and Vertical layouts.

## When to Use
- Activity logs and history feeds
- Project milestones and roadmaps
- Process step tracking

## Horizontal Timeline
Side-scrolling timeline for date-based events.

**Sub-components:** Horizontal Timeline, Horizontal Node, Atoms

Set IDs: `39120:51967` (Horizontal Timeline), `39120:51934` / `39120:51941` (Atoms)

## Vertical Timeline
Top-to-bottom timeline for activity feeds.

**Sub-components:** Vertical Timeline, Vertical Node, Timeline Header, Atoms

Set IDs: `21517:148116` (Vertical Timeline), `21507:141491` / `23678:37961` (Atoms)

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| default (vertical) | A vertical line running down the centre; left side shows date headers (e.g. "Wed, Oct 2020") with a blue filled circle node and "21" count badge; right side shows event rows with title, "Badge" chip (blue), info icon, "Transaction Date" sub-label, and an optional "Button Text" action button; multiple date groups shown |
| left-aligned | Same vertical structure but date labels and nodes are left-aligned, events flow to the right |

### Anatomy of a vertical timeline node
- **Date header node**: filled blue circle with a number badge (e.g. "21"), date label left, description lines left
- **Event node**: small grey unfilled circle on the centre line; right side has bold title + "Badge" chip + info icon; below that a "Transaction Date" sub-label; optional action button below sub-label
- Connector line: thin light grey vertical line connecting nodes

### Visual notes
- Blue filled circle nodes mark date group headers; grey small circles mark individual events
- Date labels appear on the left of the centre line; event details on the right
- Badge chips are blue outlined; info icons are grey circle-i style
- Action buttons on events use the secondary/outlined button style
- Horizontal timeline: nodes arranged left-to-right with connecting horizontal line (not shown in current screenshots)

## Do not use when
- Showing **future steps** in a guided workflow — use **Stepper**
- Events need to be acted on or navigated between — use **ListView**

## Notes
- Horizontal suits date-range overviews; Vertical suits feeds and logs
- Timeline Header adds a date/section label above a group of nodes