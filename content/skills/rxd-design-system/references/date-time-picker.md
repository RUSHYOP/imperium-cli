# Date & Time Pickers

Suite of date and time selection components for various input scenarios.

## Components

### DatePicker
Single date selection with year/month/date views.

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Active, Selected, Filled | Default |
| Type | Year, Date, Month | Date |

Set ID: `37524:38538`

### DateRangePicker
Select a start and end date range.

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Active, Selected, Filled | Default |
| Type | With Tab, Without Tab | With Tab |

Set ID: `37524:52777`

### TimePicker
Time-only selection.

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Active, Selected, Filled | Default |
| Type | With Tab | With Tab |

Set ID: `37524:45504`

### DateTimePicker
Combined date and time selection.

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Active, Selected, Filled | Default |
| Type | With Tab, Without Tab | With Tab |

Set ID: `37520:79984`

### DateTimeRangePicker
Combined date-time range (start to end).

Set ID: `37524:78082`

### Inplace Calendar
Inline embedded calendar — no popup required.

Set ID: `25504:197545`

## When to Use
- **DatePicker** — single date fields (birth date, due date)
- **DateRangePicker** — date ranges (booking, reporting period)
- **TimePicker** — time-only fields (alarms, schedule)
- **DateTimePicker** — when both date and time are needed
- **DateTimeRangePicker** — scheduling with start/end datetime
- **Inplace Calendar** — always-visible calendar in dashboards or planners

## Notes
- Mobile variants (Date and Time Picker_Mobile) adapt to touch inputs
- Tab variants add segmented navigation between date/time views

## Visual Variants (from Storybook)

### DatePicker
- Full-width input field, light gray/blue-tinted background, no visible border outline in default state
- Filled state shows a date value: "04/18/2025" (MM/DD/YYYY format)
- Calendar icon on the right side to trigger the date picker popup
- Format: MM/DD/YYYY

### DateRangePicker
- Full-width input field with light background
- Placeholder text: "MM/DD/YYYY" (empty/default state)
- Calendar icon on the right side
- Format: MM/DD/YYYY (same as DatePicker)

### DateTimePicker
- Compact input (not full-width — sized to content)
- Filled state shows: "08/16/2022 07:22 AM"
- Calendar icon appears inline to the right of the value (not at field edge)
- Format: MM/DD/YYYY HH:MM AM/PM (12-hour format)

### TimePicker
- Compact input (not full-width — sized to content)
- Filled state shows: "21:22:48" (HH:MM:SS, 24-hour format)
- Calendar/clock icon appears inline to the right of the value
- Format: HH:MM:SS (24-hour)

### Visual Observations
- DatePicker and DateRangePicker use full-width layout with a right-edge calendar icon
- DateTimePicker and TimePicker use a compact/auto-width layout with the icon placed next to the value
- DateTimePicker uses 12-hour AM/PM format; TimePicker uses 24-hour HH:MM:SS format
- Light blue-tinted or very light gray backgrounds distinguish these from plain text inputs