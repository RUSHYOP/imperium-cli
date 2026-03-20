# Input Field

Standard text input for forms. Supports label, hint text, icons, and validation states.

## When to Use
- Any single-line text entry (name, email, search query)
- Form fields requiring validation feedback
- Inputs with leading/trailing icon affordances

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Placeholder, Filled, Focus-Filled, Focus-Placeholder, Disabled-Filled, Disabled-Placeholder | Placeholder |
| Status | Normal, Success, Error | Normal |
| Size | Regular, Small, Large | Regular |

**Toggles:** Label, Hint Text, Left Icon, Right Icon

## Do not use when
- Input requires multiple lines — use **TextArea**
- Input is numbers only — use **Numeric**
- Input follows a strict format (card, phone, SSN) — use **Mask Field** or **Phone**
- Input combines with an attached control (unit, prefix) — use **InputGroup**

## Notes
- Use Error status with hint text to show validation messages
- Three sizes to match different information density needs

## Visual Variants (from Storybook)

### Component Name
The Storybook story is labelled **NbTextbox** (playground story title). The component is referred to as "Input Field" in the Figma design system.

### Sizes
Three sizes shown side by side in the all-in-one story:
- **Large Input**
- **Medium Input**
- **Small Input**
- **Material Input** (a separate variant with material-design-style floating label)

### States (per size)
- **Default** — empty placeholder text ("Input Field")
- **Default Error** — red border, red caption message below
- **Default Success** — green border, green caption message below
- **Default Disabled** — grayed out, not interactive
- Each state has a caption message shown below the field

### Icon Variants (per size + state)
- **Icon Left** — icon appears inside the field on the left
- **Icon Right** — icon appears inside the field on the right
- **Icon group right** — two icons stacked on the right side (double icon)
- **Icon right left** — icons on both sides simultaneously

The icon shown is a downward-pointing chevron/filter icon.

### Password Variant
A separate story (**NbPassword**) shows a password input:
- Masked value displayed as dots (••••••••)
- Eye icon on the right to toggle visibility
- Mandatory field indicator (red asterisk on the label)

### Playground
Shows a Medium-size textbox with icon left and icon right simultaneously, value "textbox", confirming double-icon configuration works at runtime.