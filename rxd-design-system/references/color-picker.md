# ColorPicker

Colour selection component with library presets and custom colour input.

## When to Use
- Theme or branding customisation
- User personalisation settings
- Design/annotation tools

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Custom Only, Library Only, Library + Custom | Library + Custom |
| Tab Selected | Custom, Library | Custom |

## Notes
- Library Only restricts to predefined palette; Custom Only shows free-form picker
- Library + Custom offers both tabs for flexibility

## Visual Variants (from Storybook)

### Story: NbColorPicker (Default/Playground)
- Component label shown: "NbColorPicker" above the field
- Full-width text input with placeholder text "Pick a color"
- Small color swatch preview box on the far right of the input (empty/white when no color selected)
- Very light background, subtle border
- State: Empty/Default (no color selected yet)

### Visual Observations
- Input field is full-width with a placeholder instructing the user to pick a color
- A small square color preview is embedded inside the input on the right side — it shows the currently selected color
- The color swatch starts empty (white/blank) in the default state
- Label "NbColorPicker" appears directly above the input — this is likely a Storybook story label, not the component's own label prop