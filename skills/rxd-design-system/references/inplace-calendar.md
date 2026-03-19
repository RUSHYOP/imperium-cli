# InPlace Calendar

Inline calendar component that renders a full month grid directly on the page without requiring a popover or modal trigger.

## When to Use
- Date selection directly within a form or panel without a date picker dropdown
- Scheduling or booking views where the calendar should always be visible
- Dashboard widgets requiring persistent date context

## Properties

| Property | Options | Default |
|----------|---------|---------|
| (Observed from screenshots) | See Visual Variants below | — |

## Do not use when
- Space is limited and a compact date input is needed — use **DatePicker**
- A date range needs to be selected — use **DateRangePicker**
- The calendar is only needed on demand — use **DatePicker** with its popup

## Notes
- The InPlace calendar renders the full month grid inline, not in a floating overlay
- Today's date is highlighted with a blue filled circle
- Navigation arrows allow moving between months and years

## Visual Variants (from Storybook)

### Default / Playground (VisualInplacecalendar/playground.png)
- Full month grid rendered inline showing "Mar, 2026"
- Navigation controls at top: double left chevron (prev year), single left chevron (prev month), month+year title "Mar, 2026", single right chevron (next month), double right chevron (next year)
- Column headers: Su, Mo, Tu, We, Th, Fr, Sa
- Full 5-row date grid with dates 1–31
- Today (18) highlighted with a blue filled rounded square/circle in the primary blue color with white text
- All other dates in plain dark text on white background
- Width is fixed/compact (~310px) — not full width
- Clean white background with no outer border visible
- Light gray background on the overall page area
