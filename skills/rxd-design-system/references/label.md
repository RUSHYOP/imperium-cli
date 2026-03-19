# Label

Form field label with optional mandatory indicator.

## When to Use
- Labelling any form control (inputs, selects, checkboxes)
- Section or field labels in read-only views

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Mandatory | True, False | False |
| Size | Small, Medium, Large | Small |

## Notes
- Mandatory adds an asterisk (*) indicator

## Visual Variants (from Storybook)

- **Default**: Label text in small gray/muted weight above a descriptive body line. Example shows "Label" text followed by "Lorem Ipsum is simply dummy text of the printing and typesetting industry" as a subordinate line — demonstrating label + helper-text pairing.
- **Playground variant**: Renders a rounded pill/chip-style container (white card with border and box-shadow) containing an icon (heart outline), label text "Label", a chevron ">" separator, and a blue badge showing a count (e.g. "5"). This is the interactive/compound Label used in navigation chips or breadcrumb-style indicators.
- The pill form has: white background, rounded corners (~8px), blue primary text, blue badge (primary-500 fill with white number), and a soft `sm` shadow.
- Icon slot supports any RXDS icon to the left of the label text.