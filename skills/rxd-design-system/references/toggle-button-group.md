# ToggleButtonGroup

Segmented control for mutually exclusive options displayed as connected buttons.

## When to Use
- View mode toggles (grid/list, day/week/month)
- Style selectors (alignment, font weight)
- Any mutually exclusive option set (2â€“5 items)

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Horizontal, Vertical | Horizontal |
| W/O Border & Separator | True, False | True |
| Size | XS, Small, Medium, Large | XS |

## Sub-components
- **ToggleButton** — individual button in the group

## Do not use when
- Selecting the option switches a major content view — use **Tabs**
- More context or a hint is needed per option — use **Radio**
- Only one item needs to be toggled on/off — use **Switch** or **ActionIconToggle**

- ToggleButton Set ID: `4575:51983`