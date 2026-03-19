# Radio / RadioGroup

Single-selection control for choosing one option from a set. RadioGroup wraps multiple radios with layout and validation.

## When to Use
- Mutually exclusive choices (gender, priority, status)
- Short option lists (2â€“7 items)
- Use RadioGroup when options need shared validation

## Radio Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Hover, Active, Active-Hover, Disabled, Active-Disabled, Error, Error-Hover | Default |
| Hint Txt | True, False | False |
| Text | True, False | False |
| Size | md, lg | md |

## RadioGroup Properties

| Property | Options | Default |
|----------|---------|---------|
| Orientation | Vertical, Horizontal | Vertical |
| State | Default, Error | Error |
| Size | Medium, Large | Medium |
| Mandatory | True, False | True |

## Do not use when
- Multiple options can be selected — use **Checkbox**
- There are more than ~7 options — use **Combo** (dropdown)
- The toggle takes effect immediately without a form — use **ToggleButtonGroup** or **Switch**

- RadioGroup Set ID: `34615:30661`

## Visual Variants (from Storybook)

### Radio Button States
Three visual states shown in the all-in-one story (without label):
- **Regular** — unchecked, empty circle
- **Regular Disabled** — unchecked, grayed out circle
- **Checked Disabled** — checked (filled center), grayed out

Radio states with label ("Radio" prefix text):
- **Radio Regular** — checked (blue filled circle with white center dot) + label
- **Radio Regular Disabled** — checked, grayed out + label
- **Radio Checked Disabled** — checked disabled + label

### Button-Style Radio Variants
Separate solid and ghost button-style radio variants:
- **Solid Active** — filled dark blue button ("Solid")
- **Solid Disabled** — slightly muted dark blue button ("Solid Disabled")
- **Ghost Active** — outlined blue button ("Ghost")
- **Ghost Disabled** — outlined gray button ("Ghost Disabled")

### Playground
Shows a single unchecked radio button with no label, confirming minimal configuration.

### RadioGroup
The all-in-one story shows a horizontal RadioGroup:
- Three radio options labelled **One**, **Two**, **Three** in a horizontal row
- Each option has an empty circle (unchecked state)

The gender story shows a RadioGroup labelled **Gender** with two options:
- **Male** — checked (blue filled)
- **Female** — unchecked
- Rendered horizontally

### Radiogroup Playground
The playground story does not exist (screenshot missing); the gender-story confirms horizontal layout with a group label above the options.