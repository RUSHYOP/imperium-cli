# HTML Preview Guide

How to create an HTML preview page using RXDS CSS classes before converting to UIDL JSON.
The preview uses the standalone `rxds.css` + `rxds.js` from the html-kit
(`nebula-components-f-rxd2_vite/html-kit/`).

---

## Purpose

The HTML preview is a **design validation tool** — it shows the page layout and component
arrangement before committing to UIDL JSON. It is NOT a pixel-perfect runtime replica.

Use it to:
- Validate layout structure (rows, columns, spacing)
- Verify component selection and placement
- Check visual hierarchy (heading sizes, button prominence)
- Confirm responsive behavior (desktop/tablet/mobile)
- Get user approval before building the full UIDL

---

## HTML Template

Every preview page follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview: [Page Name]</title>
<link rel="stylesheet" href="../nebula-components-f-rxd2_vite/html-kit/rxds.css">
<script defer src="../nebula-components-f-rxd2_vite/html-kit/rxds.js"></script>
<style>
  body { font-family: var(--nb-font); background: var(--nb-bg); color: var(--nb-text); }
  .uidl-preview { padding: 24px; max-width: 1440px; margin: 0 auto; }
</style>
</head>
<body>
<div class="container-fluid uidl-preview">
  <!-- rows and columns here -->
</div>
</body>
</html>
```

---

## Component CSS Class Reference

### Layout (Bootstrap 4 Grid)
```html
<div class="container-fluid">
  <div class="row mb-three-s">
    <div class="col-lg-6 col-md-6 col-sm-12">...</div>
    <div class="col-lg-6 col-md-6 col-sm-12">...</div>
  </div>
</div>
```

### Typography
```html
<!-- Heading -->
<div class="nb-heading nb-heading--h1">Page Title</div>
<div class="nb-heading nb-heading--h2">Section Title</div>
<div class="nb-heading nb-heading--h4">Sub-section</div>

<!-- Paragraph -->
<p class="nb-paragraph">Body text content goes here.</p>

<!-- Label -->
<label class="nb-label">Field Label</label>
<label class="nb-label nb-label--required">Required Field</label>

<!-- Separator -->
<hr class="nb-separator">
```

### Buttons
```html
<!-- Variants: contained | outlined | text -->
<!-- Colors: primary | secondary | success | error | warning | info -->
<button class="nb-btn nb-btn--contained nb-btn--primary">Submit</button>
<button class="nb-btn nb-btn--outlined nb-btn--primary">Cancel</button>
<button class="nb-btn nb-btn--text nb-btn--primary">Skip</button>
<button class="nb-btn nb-btn--contained nb-btn--error">Delete</button>

<!-- Sizes: xsmall | small | medium | large -->
<button class="nb-btn nb-btn--contained nb-btn--primary nb-btn--medium">Medium</button>

<!-- Disabled -->
<button class="nb-btn nb-btn--contained nb-btn--primary nb-btn--disabled" disabled>Disabled</button>
```

### Form Inputs
```html
<!-- Textbox (full width) -->
<div class="nb-textbox nb-textbox--full">
  <label class="nb-textbox__label">Field Name</label>
  <div class="nb-textbox__wrap">
    <input class="nb-textbox__input" placeholder="Enter value...">
  </div>
</div>

<!-- Textbox states: nb-textbox--error, nb-textbox--disabled, nb-textbox--required, nb-textbox--success -->
<div class="nb-textbox nb-textbox--full nb-textbox--required">
  <label class="nb-textbox__label required">Email</label>
  <div class="nb-textbox__wrap">
    <input class="nb-textbox__input" placeholder="email@example.com">
  </div>
</div>

<!-- Textarea -->
<div class="nb-textbox nb-textbox--full">
  <label class="nb-textbox__label">Description</label>
  <div class="nb-textbox__wrap">
    <textarea class="nb-textbox__input nb-textbox__input--textarea" rows="4" placeholder="Enter description..."></textarea>
  </div>
</div>

<!-- Dropdown / Combo -->
<div class="nb-combo nb-combo--full">
  <label class="nb-combo__label">Category</label>
  <div class="nb-combo__wrap">
    <select class="nb-combo__input">
      <option value="">Select...</option>
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
  </div>
</div>

<!-- Numeric -->
<div class="nb-textbox nb-textbox--full">
  <label class="nb-textbox__label">Amount</label>
  <div class="nb-textbox__wrap">
    <input class="nb-textbox__input" type="number" placeholder="0">
  </div>
</div>

<!-- Date Picker (static representation) -->
<div class="nb-textbox nb-textbox--full">
  <label class="nb-textbox__label">Start Date</label>
  <div class="nb-textbox__wrap">
    <input class="nb-textbox__input" type="date">
  </div>
</div>
```

### Selection Controls
```html
<!-- Switch -->
<label class="nb-switch">
  <input type="checkbox" class="nb-switch__input" checked>
  <span class="nb-switch__slider"></span>
  <span class="nb-switch__label">Enable notifications</span>
</label>

<!-- Checkbox -->
<label class="nb-checkbox">
  <input type="checkbox" class="nb-checkbox__input">
  <span class="nb-checkbox__box"></span>
  <span class="nb-checkbox__label">I agree to terms</span>
</label>

<!-- Radio Group (horizontal) -->
<div class="nb-radio-group nb-radio-group--horizontal">
  <label class="nb-radio"><input type="radio" name="priority" value="low"><span class="nb-radio__dot"></span> Low</label>
  <label class="nb-radio"><input type="radio" name="priority" value="medium" checked><span class="nb-radio__dot"></span> Medium</label>
  <label class="nb-radio"><input type="radio" name="priority" value="high"><span class="nb-radio__dot"></span> High</label>
</div>
```

### Display Components
```html
<!-- KPI Display -->
<div class="nb-display">
  <span class="nb-display__label">Total Revenue</span>
  <span class="nb-display__value">$1,245,000</span>
</div>

<!-- Badge -->
<span class="nb-badge nb-badge--success">Active</span>
<span class="nb-badge nb-badge--error">Overdue</span>
<span class="nb-badge nb-badge--warning">Pending</span>
<span class="nb-badge nb-badge--info">In Review</span>
```

### Cards & Panels
```html
<!-- Card -->
<div class="nb-card">
  <div class="nb-card__header">
    <div class="nb-card__title">Card Title</div>
    <div class="nb-card__subtitle">Subtitle text</div>
  </div>
  <div class="nb-card__body">
    <!-- Container → Row → Col → Leaves inside body -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">Content here</div>
      </div>
    </div>
  </div>
  <div class="nb-card__footer">
    <button class="nb-btn nb-btn--text nb-btn--primary">Action</button>
  </div>
</div>

<!-- Panel (collapsible) -->
<div class="nb-panel">
  <div class="nb-panel__header">
    <span class="nb-panel__title">Section Title</span>
    <span class="nb-panel__toggle">▾</span>
  </div>
  <div class="nb-panel__body">Panel content</div>
</div>

<!-- Accordion -->
<div class="nb-accordion">
  <div class="nb-panel">
    <div class="nb-panel__header"><span class="nb-panel__title">Section 1</span></div>
    <div class="nb-panel__body">Content 1</div>
  </div>
  <div class="nb-panel">
    <div class="nb-panel__header"><span class="nb-panel__title">Section 2</span></div>
    <div class="nb-panel__body" style="display:none">Content 2</div>
  </div>
</div>
```

### Navigation
```html
<!-- Tabs -->
<div class="nb-tabs">
  <div class="nb-tabs__list">
    <button class="nb-tabs__tab nb-tabs__tab--active">Overview</button>
    <button class="nb-tabs__tab">Details</button>
    <button class="nb-tabs__tab">History</button>
  </div>
  <div class="nb-tabs__panel">Tab content here</div>
</div>

<!-- Breadcrumbs -->
<nav class="nb-breadcrumb">
  <a href="#" class="nb-breadcrumb__item">Home</a>
  <span class="nb-breadcrumb__separator">/</span>
  <a href="#" class="nb-breadcrumb__item">Settings</a>
  <span class="nb-breadcrumb__separator">/</span>
  <span class="nb-breadcrumb__item nb-breadcrumb__item--active">Profile</span>
</nav>
```

### Data / ListView
```html
<div class="nb-listview">
  <div class="nb-listview__toolbar">
    <span class="nb-listview__title">Employee List</span>
    <div class="nb-listview__actions">
      <input class="nb-listview__search" placeholder="Search...">
    </div>
  </div>
  <table class="nb-listview__table">
    <thead>
      <tr>
        <th>Name</th><th>Department</th><th>Status</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td><td>Engineering</td>
        <td><span class="nb-badge nb-badge--success">Active</span></td>
        <td><a class="nb-hyperlink">Edit</a></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Misc
```html
<!-- Hyperlink -->
<a class="nb-hyperlink">View Details →</a>

<!-- Image -->
<img class="nb-image" src="..." alt="Description" style="max-width:100%">

<!-- Action Icon -->
<div class="nb-action-icon" title="Filter">
  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
    <!-- SVG path -->
  </svg>
</div>
```

---

## Spacing Classes

Use these on rows (via `class="row mb-three-s"`) or wrappers:

| Class | Pixels | Use For |
|---|---|---|
| `mb-half-s` | 4px | Tight spacing (label to input) |
| `mb-one-s` | 8px | Minimal spacing |
| `mb-two-s` | 16px | Standard row spacing |
| `mb-three-s` | 24px | Section spacing |
| `mb-four-s` | 32px | Major section breaks |
| `p-two-s` | 16px padding | Column/container padding |
| `p-three-s` | 24px padding | Card/panel body padding |

---

## Flex Utilities

```html
<!-- Multiple items side-by-side -->
<div class="col-lg-12 d-flex flex-wrap align-items-center" style="gap:8px">
  <button class="nb-btn nb-btn--contained nb-btn--primary">Save</button>
  <button class="nb-btn nb-btn--outlined nb-btn--primary">Cancel</button>
</div>

<!-- Right-aligned content -->
<div class="col-lg-6 d-flex justify-content-end align-items-center" style="gap:8px">
  <button class="nb-btn nb-btn--contained nb-btn--primary">Create</button>
</div>
```

---

## File Naming Convention

- UIDL JSON: `projects/my-page.json`
- HTML preview: `projects/my-page-preview.html`
- Always co-locate the preview alongside the UIDL file
