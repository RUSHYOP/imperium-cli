# Modal

Overlay dialog that captures user attention for confirmations, forms, or information.

## When to Use
- Confirmations and destructive action warnings
- Forms that should not navigate away
- Information dialogs and alerts

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | XSmall, Small, Medium, Large, Full Screen | Medium |

**Toggles:** Header, Footer

## Do not use when
- Content is secondary and should not block the workflow — use **Drawer (Sidedraw)**
- Content is brief and non-blocking — use **Popover** or **Toast Message**
- User just needs a hover hint — use **Tooltip**

## Visual Variants (from Storybook)

### Dialogmodal — rxd story
- Story shows a single "Open Modal" button (primary, blue) that triggers the dialog
- The modal itself is rendered as an overlay — screenshot captures the closed/trigger state only
- Confirms the component uses a trigger-based pattern (button opens the modal programmatically)

### Visual structure (from design system)
- **Header:** title text with optional close (X) icon
- **Body:** scrollable content area
- **Footer:** action buttons (primary + ghost pattern)
- Backdrop overlay dims the page behind the modal

## Notes
- Use the smallest size that fits the content
- Full Screen is for complex multi-step workflows
- The trigger button is not part of the modal component — it is a separate Button placed in the parent page