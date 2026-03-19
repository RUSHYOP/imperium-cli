# Pagination

Page navigation control for splitting large data sets into pages.

## When to Use
- Tables and list views with many records
- Search results spanning multiple pages
- Any data set that benefits from paged navigation

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Number-First Level, Number-Middle Level, Number-Last Level, Item View, Page View, Value Entry | Number-First Level |

## Sub-components
- **Page Number_Web** — desktop page number button
- **Page Number_Mobile** — mobile page number button
- **Pagination_Mobile** — complete mobile pagination bar

## Do not use when
- Continuous browsing is preferred over discrete pages — use **Infinite Scroll**
- List is short enough to show entirely — no pagination needed
## Notes
- Item View shows "1â€“20 of 200" style; Page View shows "Page 1 of 10"
- Value Entry allows direct page number input
- Mobile variants adapt for touch targets