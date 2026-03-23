# Circular Progress

Radial progress indicator showing completion percentage. Available in full-circle and half-circle variants.

## When to Use
- Displaying percentage completion (upload, process, score)
- KPI or metric visualisation in dashboards
- Loading state with known progress

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Full-Circular-Progress, Half-Circular-Progress | Half-Circular-Progress |
| SupportText | False, True | False |
| Size | 2XSmall, XSmall, Small, Medium, Large, XLarge | XLarge |

## Notes
- Half-circle suits dashboard gauges; full-circle for general progress
- SupportText adds a descriptive label below the indicator

## Visual Variants (from Storybook)

### Full circular (playground.png)
- Compact full-circle progress ring centered on a light gray background
- Blue arc showing ~70% complete, with a thin light-gray unfilled arc as the track
- Percentage text "70%" rendered in dark/charcoal text at the center of the ring
- Ring is medium size — demonstrates the most common use case for a KPI or score display
- The filled arc starts from the top (12 o'clock) and proceeds clockwise