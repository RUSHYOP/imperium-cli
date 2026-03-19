# Week Calendar

Week-based calendar view showing day-by-day content.

## When to Use
- Weekly scheduling and planning views
- Availability or booking calendars
- Week-at-a-glance dashboards

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Status | Default, Disabled | Default |
| Enable Border | True, False | True |
| Enable Separator | True, False | False |

## Sub-components
- **Day** — individual day column
- **Navigation** — week navigation controls
- **Title** — week/date range title
- **Week** — week row container

- Week Calendar Set ID: `24738:185456`

## Visual Variants (from Storybook)

### Default (default.png)
- Compact single-week strip showing "Jan 2024 (Week 4)"
- Left/right chevron navigation arrows on either side of the week title
- Column headers: S, M, T, W, T, F, S (Sunday through Saturday)
- Date numbers in a single row: 21, 22, 23, 24, 25, 26, 27
- Today (21) highlighted with a blue filled circle and white text
- All other dates shown in plain dark text on white background
- No border visible — clean minimal styling with light background
- Very compact height — just header + one row of dates