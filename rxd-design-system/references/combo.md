# Combo

Dropdown selection input supporting single-line and multiline display with optional leading visuals.

## When to Use
- Single selection from a predefined list
- When the options list is too long for radio buttons
- Fields that need avatar or icon context alongside selections

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Placeholder, Filled | Placeholder |
| Type | Single Line, Multiline | Single Line |
| OnLeft | Blank, Avatar, Icon, Box Icon | Blank |

## Do not use when
- Multiple values can be selected — use **MultiSelect**
- The list is large and needs real-time filtering — use **AutoSuggest**
- Options are always visible (≤7) — use **Radio**

## Notes
- OnLeft adds visual context (avatar, icon) to the selected value
- Multiline type allows wrapping for long option labels

## Visual Variants (from Storybook)

### Story: With Default Icon
- A full-width single-line combo input showing placeholder text "Normal"
- Green border (active/focused state), standard chevron-down (v) icon on the right
- State: Placeholder/Normal

### Story: With Custom Icon
- Same full-width single-line layout but the right-side icon is a circular chevron (custom icon variant)
- Green border, placeholder text "Normal"
- State: Placeholder/Normal

### Story: Multi Line Select
- Full-width combo showing a filled selection: "admin role"
- Green border, standard chevron-down icon on the right
- State: Filled (value selected)

### Visual Observations
- Border color is green when the field is active/focused
- Label appears above the field (e.g., label is implied by the containing form)
- Chevron icon on the right side indicates it is a dropdown
- Custom icon variant replaces the plain chevron with a circular/styled icon
- No visible avatar or icon to the left in these stories; OnLeft property controls that separately