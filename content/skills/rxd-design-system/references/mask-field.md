# Mask Field

Input with predefined mask patterns for structured data entry (card numbers, dates, SSN, etc.).

## When to Use
- Credit card number entry
- Phone number, date, or SSN fields
- PIN codes and security codes

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Color | Default, Success, Error | Default |
| Size | Regular, Small, Large | Small |
| State | Placeholder-Dotted, Placeholder-Line, Filled, Focus, Filled-Focus, Disabled-Placeholder, Disabled-Filled | Placeholder-Dotted |
| Type | Card Number, Month/Year, Date, Phone Number, Security Code 6-Digit, Security Code 4-Digit, SSN, Pin Code, Currency | Card Number |

## Notes
- Automatically formats input based on the chosen mask type
- Dotted vs Line placeholder styles control the visual hint

## Visual Variants (from Storybook — ElementPatterntextbox)

- **otp-pattern**: Label "Enter 6-digit OTP". Full-width input with blue bottom-border focus line. Shows 6 dot placeholders (`• • • • • •`) for a masked PIN/OTP entry. Single input field — not separate boxes.
- **ssn-pattern**: Label "Social Security Number". Placeholder `* * * - * * - * * * *` with asterisk slots and dash separators. Light gray background, subtle border, full-width.
- **credit-card-pattern**: Label "Credit Card Number". Placeholder `* * * * - * * * * - * * * * - * * * *` — four groups of four asterisks separated by dashes.
- **phone-pattern**: Label "Phone Number". Placeholder `( * * * ) * * * * * - * * * * *` with parentheses and dash literal separators auto-inserted.
- **date-pattern**: Label "Date Pattern". Placeholder `L * B * H` — letter identifiers for date segments (L=day, B=month, H=year) with asterisk wildcards.
- **license-plate-pattern**: Alphanumeric pattern for license plate format.

**Visual summary**: All variants are single-line text inputs with a label above. Placeholders show the mask structure using asterisks/dots. The input matches the width of its container. On focus, a blue bottom-border highlight appears. Separator characters (dashes, parentheses, spaces) are shown but not editable — the cursor jumps over them automatically.

**Note**: In the component codebase, this component is `ElementPatterntextbox` (NbPatternTextbox), distinct from the Figma Mask Field component which uses the Type options listed in the Properties table above.