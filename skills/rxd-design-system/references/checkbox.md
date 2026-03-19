# Checkbox

Binary selection control supporting checked, unchecked, and intermediate states.

## When to Use
- Multi-option selection in forms
- Accepting terms and conditions
- Bulk select / select-all patterns in lists

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | md, lg | md |
| Type | Default, Hover, Active, Active-Hover, Intermediate, Intermediate-Hover, Disabled, Active-Disabled, Intermediate-Disabled, Error, Error-Hover | Default |
| Text | False, True | False |
| Hint Txt | False, True | False |

## Do not use when
- Only one option can be selected — use **Radio**
- The toggle takes effect immediately (not on form submit) — use **Switch**
- Selecting from a long list — use **MultiSelect** (dropdown) or **Combo**

## Notes
- Intermediate state is used for "select all" when only some children are selected
- Text and Hint Text toggles add label and helper text alongside the control

## Visual Variants (from Storybook)

### Check Variants (the standard checkbox control)
Three visual check states:
- **Regular** — standard checked checkbox (blue fill, white checkmark)
- **Regular Grid** — checked checkbox with a grid/table context style (same visual appearance)
- **Regular Indeterminate** — partially selected state (blue fill, white dash/minus icon)

### Label Variants
Each check state also has a "Caption" version with a text label alongside:
- **Regular Caption** — checked + label text "Checkbox"
- **Regular Grid Caption** — grid style + label text "Checkbox"
- **Regular Indeterminate Caption** — indeterminate + label text "Checkbox"

### Disabled States
All three check variants have disabled versions (reduced opacity):
- **Regular Disabled**
- **Regular Grid Disabled**
- **Regular Indeterminate Disabled**
- Disabled + Caption versions for each of the above

### Button-Style Checkboxes
Separate solid and ghost button-style checkbox variants:
- **Solid Active** — filled dark blue button ("Solid Active")
- **Solid Disabled** — gray filled button ("Solid Disabled")
- **Ghost Active** — outlined blue button ("Ghost Active")
- **Ghost Disabled** — outlined gray button ("Ghost Disabled")

### Playground
Shows an unchecked checkbox with label "Check me" and hint text "Check me" below it, confirming the label and hint text toggles work together.