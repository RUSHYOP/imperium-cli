# Stepper

Multi-step progress indicator for guided workflows. Available in Horizontal, Vertical, and Mobile layouts.

## When to Use
- Multi-step forms and wizards
- Onboarding flows
- Process or workflow status tracking

## Horizontal Stepper
For desktop workflows with visible step names.

**Sub-components:** Horizontal Stepper, Horizontal Step, Horizontal Connector, Steps

Set ID (Horizontal Stepper): `20946:89506`

## Vertical Stepper
For sidebar placement or detailed step descriptions.

**Sub-components:** Vertical Stepper, Vertical Step, Vertical Connector, Vertical Substep, Steps, Atoms

Set ID (Vertical Stepper): `20946:89039`

## Mobile Stepper
Compact variant for small screens.

**Sub-components:** Mobile_Stepper

Set ID (Mobile_Stepper): `13093:29851`
## Do not use when
- Steps are non-sequential and user can jump freely — use **Tabs**
- User is retracing a completed path — use **Breadcrumbs**
- Showing historical events, not future steps — use **Timeline**
## Step Variants (from Storybook)

The stepper exposes individual step state variants. Each step node is a numbered circle connected by a horizontal line.

### Step state variants (all-step-variants story)
| Variant name | Visual |
|---|---|
| Variant - Completed | Grey circle, number inside, no blue highlight; step label normal weight |
| Variant - Current | Blue filled circle, number inside (white text), bold blue step label below |
| Variant - Default | Grey circle, number inside, grey step label below |
| Variant - Error | Grey circle (no distinct red in screenshot), “Variant - Error” label |
| Variant - Success | Grey circle, “Variant - Success” label |
| Variant - Warning | Grey circle, “Variant - Warning” label |

### Stepper — default story (Step 1, 6 total)
- Horizontal stepper with 6 step nodes
- Step 1 is **Current** (blue filled circle, number “1”, bold blue label “Steps 1aaaaaaaa”)
- Steps 2-6 are **Default** (grey circles, grey labels)
- Connector line between each node
- Body area below stepper: “Step 1 of 6” subtitle, “Step 1” heading (h2), lorem ipsum body text
- Navigation: “Next →” button (ghost/outlined) bottom-right only (first step has no Previous)

### Stepper — all-step-variants story (Step 2, 6 total)
- Step 1: Completed (grey circle “1”, label “Steps 1 / Variant - Competed”)
- Step 2: Current (blue circle “2”, bold blue label “Steps 2 / Variant - Current”)
- Step 3: Default (grey “3”, “Steps 3 / Variant - Default”)
- Step 4: Error (grey “4”, “Steps 4 / Variant - Error”)
- Step 5: Success (grey “5”, “Steps 5 / Variant - Success”)
- Step 6: Warning (grey “6”, “Steps 6 / Variant - Warning”)
- Navigation: “Previous” (ghost left) + “Next” (ghost right) both visible at step 2+

### Navigation pattern
- First step: only “Next →” button (right-aligned)
- Middle steps: “Previous” (left) + “Next” (right)
- Last step: “Previous” + final action button

## Notes
- Horizontal layout best for 3-7 steps
- Vertical layout supports sub-steps and longer descriptions
- Mobile stepper condenses for touch navigation
- Step label text can be long (truncation not observed — full text shown below circle)
- Connector line between steps is a thin horizontal rule; completed portion does not change color in default theme
- The “nbstepper” label appears as the component identifier in stories