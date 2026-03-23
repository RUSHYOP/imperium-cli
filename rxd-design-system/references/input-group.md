# InputGroup

Combined input with attached control — bundles a text field with a combo, numeric, or additional text input.

## When to Use
- Inputs that need a unit selector (currency, measurement)
- Compound fields like phone number with country code
- Search with category filter attached

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Numeric, Combo, Textbox | Combo |
| State | Placeholder, Filled, Focus-Filled, Focus-Placeholder, Disabled-Filled, Disabled-Placeholder | Placeholder |
| Size | Regular, Small, Large | Regular |
| Status | Normal, Success, Error | Normal |

## Notes
- Combo variant attaches a dropdown; Numeric attaches a number spinner; Textbox attaches a plain text field

## Visual Variants (from Storybook)

### Story: With Numeric Field
- Label "Currency" appears above the component
- Left side: full-width dropdown (combo) showing selected value "USD" with a chevron-down
- Right side: numeric spinner input showing value "4,566" with up/down arrows on the far right
- The two fields share a single border and are visually connected (inline, no gap)
- State: Filled (both fields have values)

### Story: With Text Field
- Label "Name" appears above the component
- Left side: dropdown (combo) showing selected prefix "Mr." with a chevron-down
- Right side: plain textbox showing placeholder text "textbox"
- The two fields share a single border (inline layout)
- State: Left filled (prefix selected), right in placeholder state

### Visual Observations
- InputGroup always renders as two inline fields sharing one container/border
- Left field is always a Combo (dropdown) in the screenshots; right field varies (Numeric or Textbox)
- Labels appear above the combined group, not on individual fields
- Numeric variant on the right includes up/down stepper arrows
- Values in the dropdown and input are independent — one can be filled while the other is empty