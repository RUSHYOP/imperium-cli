# Switch

Toggle control for binary on/off settings.

## When to Use
- Feature toggles and settings
- Enabling/disabling options in preferences
- Any binary state that takes effect immediately

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Default, Hover, Disable, Active, Active-Hover, Active-disable, Default-Error, Active-Error | Default |
| Hint Text | True, False | False |
| Text | False, True | False |
| Size | sm, md, lg | sm |

## Do not use when
- The setting requires a form submit to take effect — use **Checkbox**
- Multiple options can be selected together — use **Checkbox group**
- No label fits and the toggle is in a toolbar — use **ActionIconToggle**

## Notes
- Use Checkbox for multi-select forms; Switch for instant-effect toggles