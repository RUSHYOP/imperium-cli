# Accessibility

> Extracted from [RXDS Accessibility page](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=136-45262) in the Ramco Xperience Design System.

---

## Why Accessibility Matters

- **Inclusivity** — products usable by all individuals, including those with disabilities
- **Legal compliance** — many countries mandate web/mobile accessibility; non-compliance risks lawsuits, fines, remediation orders
- **Market reach** — accessible products attract a broader, more diverse customer base
- **Better UX for everyone** — accessibility improvements (contrast, keyboard nav, clear labels) benefit all users

---

## WCAG Principles (POUR)

All designs must satisfy the four WCAG principles. Start at **AA level** as a baseline; consider AAA for specific cases.

| Principle | Meaning |
|-----------|---------|
| **Perceivable** | Information and UI components must be presentable in ways users can perceive |
| **Operable** | UI components and navigation must be operable by all input methods |
| **Understandable** | Information and operation of the UI must be understandable |
| **Robust** | Content must be robust enough to be interpreted by a wide variety of user agents and assistive technologies |

---

## Color & Contrast

### Contrast Ratios

| Element | Minimum Ratio |
|---------|---------------|
| Regular text (< 24px) | **4.5 : 1** |
| Large text (≥ 24px) | **3 : 1** |
| Interactive elements (buttons, links) | **3 : 1** |

### Guidelines

- Use dark text on light background or vice versa — avoid colours with similar brightness
- **Never rely solely on colour** to convey information; always pair with icons, labels, or patterns
- Test designs with colour blindness simulators (protanopia, deuteranopia, tritanopia, achromatopsia, etc.)

### Colour Vision Deficiency Types

| Type | Description |
|------|-------------|
| Protanomaly | Shifted red-cone sensitivity |
| Protanopia | Complete lack of red cones |
| Deuteranomaly | Shifted green-cone sensitivity |
| Deuteranopia | Complete lack of green cones |
| Tritanomaly | Shifted blue-cone sensitivity |
| Tritanopia | Complete lack of blue cones |
| Achromatomaly | Reduced sensitivity to most colours |
| Achromatopsia | Complete absence of colour vision |

---

## Typography & Readability

| Rule | Guideline |
|------|-----------|
| **Font family** | Standard sans-serif fonts; avoid decorative fonts for body text |
| **Line height** | ≥ 1.5× font size |
| **Line length** | 45–80 characters (~66 cpl) for body text; 30–40 characters for mobile |
| **Heading line length** | Break long headings across multiple lines |
| **Alignment** | Left-align for LTR languages, right-align for RTL; avoid full justification |
| **Overlapping text** | Content must remain readable at 200% zoom with no horizontal scrolling |

---

## Keyboard Navigation & Focus States

- All interactive elements (buttons, links, form fields) must be reachable via **Tab** key in a logical, predictable order
- Interactive elements must have **distinct focus styles** (outlines or colour changes)
- **Never create keyboard traps** — focus must move smoothly through all content
- Support both single-point and multi-point gestures for mobile accessibility

---

## Images, Media & Alt Text

- Provide **descriptive alt text** for all meaningful images
- Include **captions or transcripts** for audio/video content
- Video controls must be **keyboard-accessible**
- Evaluate **voice recognition compatibility** with input fields

---

## Form Accessibility

- Clearly identify and describe form errors for all users, including screen reader users
- Provide **real-time validation** and feedback on form fields
- All form controls must have associated labels

---

## ARIA Guidelines

ARIA (Accessible Rich Internet Applications) attributes provide semantic information to assistive technologies. Use them to describe roles, states, and properties of interactive elements.

### Commonly Used ARIA Roles

| Role | Purpose |
|------|---------|
| `alert` | Important/critical information requiring attention (error messages, notifications) |
| `alertdialog` | Dialog conveying important alerts requiring immediate action |
| `button` | Clickable element performing an action |
| `checkbox` | Multi-select control for toggling options |
| `combobox` | Text input + dropdown for manual entry or selection |
| `dialog` | Modal/popup requiring user interaction |
| `grid` / `gridcell` | Spreadsheet-like data layout and its cells |
| `group` | Collection of related elements |
| `heading` | Section/page title for semantic structure |
| `label` | Descriptive label for form controls |
| `link` | Hyperlink for navigation |
| `list` / `listitem` | Structured list of items |
| `listbox` | Selection list allowing one or more picks |
| `menu` / `menuitem` | Options/commands list (dropdown, nav menu) |
| `navigation` | Elements for navigating within page/app |
| `option` | Individual option in a listbox/dropdown |
| `progressbar` | Task/process completion indicator |
| `radio` / `radiogroup` | Single-select option and its group |
| `region` | Perceivable content section for screen readers |
| `row` / `rowgroup` / `rowheader` | Table row, group of rows, and row header |
| `columnheader` | Header of a table column |
| `status` | Current status/condition of a component |
| `switch` | On/off toggle control |
| `tab` / `tablist` / `tabpanel` | Tab navigation and content panels |
| `table` | Tabular data |
| `textbox` | Text input field |
| `tooltip` | Additional info on hover/focus |

### Commonly Used ARIA States & Properties

| Attribute | Purpose |
|-----------|---------|
| `aria-activedescendant` | Currently active descendant in a container |
| `aria-autocomplete` | Whether/what type of autocompletion is provided |
| `aria-busy` | Element is currently loading/processing |
| `aria-checked` | Checkbox/radio is checked/selected |
| `aria-colindex` / `aria-rowindex` | Position of cell in table |
| `aria-controls` | Element(s) controlled by this element |
| `aria-current` | Current item in a set (active tab, current page) |
| `aria-describedby` | Element(s) providing additional description |
| `aria-disabled` | Element is non-interactive |
| `aria-expanded` | Collapsible element is expanded/collapsed |
| `aria-haspopup` | Element triggers a popup menu/dialog/tooltip |
| `aria-hidden` | Hidden from accessibility tree |
| `aria-invalid` | Form field value is invalid |
| `aria-label` | Text label for assistive technologies |
| `aria-labelledby` | Element(s) serving as label |
| `aria-live` | Content is live-updated |
| `aria-multiselectable` | Multiple selections allowed |
| `aria-orientation` | Horizontal/vertical orientation |
| `aria-owns` | Element(s) owned by this element |
| `aria-posinset` / `aria-setsize` | Item position and total count in a set |
| `aria-pressed` | Toggle button pressed state |
| `aria-readonly` | Field is read-only |
| `aria-required` | Field is required |
| `aria-roledescription` | Accessible role description |
| `aria-selected` | Option is selected |
| `aria-valuemax` / `aria-valuemin` / `aria-valuenow` / `aria-valuetext` | Range widget values |

### ARIA in RXDS Components — Example (Accordion)

```html
<div id="Accordion-child-1" role="region">
  <div
    role="button"
    aria-expanded="false"
    aria-controls="Accordion-child-1_content"
    aria-labelledby="Accordion-child-1_ShowMore"
  >
    <div id="Accordion-child-1_ShowMore">Show More</div>
    <div role="heading" aria-hidden="true">
      <svg>...</svg>
    </div>
  </div>
  <div id="Accordion-child-1_content" aria-hidden="true" aria-disabled="true">
    Content for Item 1
  </div>
</div>
```

**Accordion ARIA mapping:**
- Roles: `region`, `button`, `heading`
- States: `aria-expanded`, `aria-controls`, `aria-labelledby`, `aria-disabled`, `aria-hidden`

---

## Key Considerations Checklist

1. **User testing** — test with diverse users including those with disabilities
2. **Inclusive design principles** — cater to diverse needs and abilities
3. **Regular accessibility audits** — ensure ongoing WCAG compliance
4. **Responsive content** — automatic adjustment to all screen sizes, no horizontal scrolling
5. **Accessible interactions** — support keyboard, touch (single-point and multi-point gestures)
6. **Zoom compatibility** — content readable at 200% zoom
