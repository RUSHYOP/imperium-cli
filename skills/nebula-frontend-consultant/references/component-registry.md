# Component Registry — All controlTypes

This is the authoritative list of every valid `controlType` that can appear in Nebula Studio UIDL metadata. These are the exact strings from `ComponentsRef.ts` — the single source of truth.

**Casing matters.** The UIDL pipeline, MCP tools, and any code that generates or validates metadata must use these exact strings. No Nb* prefix. No guessing.

---

## Full Registry (75 components)

### Layout & Structure

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `container` | container | Root page container |
| `row` | row | Grid row inside container |
| `column` | column | Grid column (col: "1"-"12") |
| `Div` | Div | Generic div wrapper |
| `iframe` | iframe | Embedded iframe |

### Containers & Panels

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `panel` | panel | Collapsible panel with `panelConfig` |
| `card` | card | Simple card |
| `cardcontainer` | cardcontainer | Card container — uses `template: { body: [], header: [] }` not children |
| `tab` | tab | Tabbed container — children is `{ "Tab1": [...], "Tab2": [...] }` not array |
| `accordion` | accordion | Collapsible sections with `accordionConfig` |
| `stepper` | stepper | Multi-step wizard with `stepperConfig` |
| `form` | form | Form container |
| `pattern` | pattern | Reusable pattern container |

### Text & Display

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `label` | label | Static text label |
| `heading` | heading | Heading text |
| `paragraph` | paragraph | Paragraph text |
| `display` | display | Display-only field |
| `icon` | icon | Icon display |
| `image` | image | Image display |
| `separator` | separator | Visual divider |
| `jsonViewer` | jsonViewer | JSON viewer/formatter |
| `video` | video | Video player |

### Text Inputs

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `textbox` | textbox | Single-line text input |
| `textarea` | textarea | Multi-line text input |
| `numeric` | numeric | Numeric input |
| `phone` | phone | Phone number input |
| `search` | search | Search input |
| `richTextEditor` | richTextEditor | Rich text (WYSIWYG) |
| `textEditor` | textEditor | Code/text editor |

### Selection Inputs

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `checkbox` | checkbox | Checkbox |
| `radiogroup` | radiogroup | Radio button group |
| `switch` | switch | Toggle switch |
| `dropdown` | dropdown | Single-select dropdown |
| `multiselect` | multiselect | Multi-select dropdown |
| `autosuggest` | autosuggest | Autocomplete with `autoSuggestConfig` |
| `tag` | tag | Tag/chip input |
| `rating` | rating | Star rating |
| `slider` | slider | Range slider |

### Date & Time Inputs

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `datePicker` | datePicker | Date picker (camelCase!) |
| `dateTimepicker` | dateTimepicker | Date+time picker (note: lowercase 'p' in picker) |
| `timePicker` | timePicker | Time picker |
| `dateRangePicker` | dateRangePicker | Date range picker |
| `colorpicker` | colorpicker | Color picker (all lowercase) |
| `weekCalendar` | weekCalendar | Week calendar view |
| `inplacecalendar` | inplacecalendar | Inline calendar |

### File Inputs

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `attachment` | attachment | File attachment |
| `imageattach` | imageattach | Image attachment |

### Buttons & Actions

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `button` | button | Standard button (lowercase!) |
| `buttongroup` | buttongroup | Button group |
| `splitButton` | splitButton | Split button with dropdown |
| `floatingButton` | floatingButton | Floating action button |
| `menuButton` | menuButton | Menu/dropdown button with `menuButtonConfig` |
| `actionIcon` | actionIcon | Clickable icon button |
| `Hyperlink` | Hyperlink | Hyperlink (PascalCase with capital H!) |

### Navigation & Feedback

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `pagination` | pagination | Page pagination |
| `badge` | badge | Notification badge |
| `tooltip` | tooltip | Tooltip |
| `popover` | popover | Popover with `popoverTemplate` |
| `loader` | loader | Loading indicator |
| `pageLoader` | pageLoader | Full-page loader |
| `circularProgress` | circularProgress | Circular progress indicator |
| `progressbar` | progressbar | Linear progress bar |
| `quickHelp` | quickHelp | Help tooltip with `quickHelpConfig` |

### Data Display & Visualization

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `table` | table | Data table |
| `listview` | listview | List view — uses `fieldDefs` not children |
| `listviewinline` | listviewinline | Inline list view |
| `chart` | chart | Chart widget |
| `heatmap` | heatmap | Heatmap widget |
| `orgChart` | orgChart | Org chart |
| `carousel` | carousel | Carousel/slider |
| `timeline` | timeline | Timeline widget |
| `tree` | tree | Tree view |
| `reportViewer` | reportViewer | Report viewer |
| `map` | map | Map widget |

### Avatars & Social

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `avatar` | avatar | User avatar |
| `avatarGroup` | avatarGroup | Avatar group |

### Composite / Special

| controlType | ComponentsRef key | Notes |
|---|---|---|
| `inputgroup` | inputgroup | Grouped inputs |
| `dialogModal` | dialogModal | Dialog/modal with `dialogProperties` |

---

## Nb* to controlType Mapping

When translating from the React component library (`@ramco-platform/studio-components`) to UIDL:

| React Component | UIDL controlType |
|---|---|
| `NbButton` | `button` |
| `NbTextbox` | `textbox` |
| `NbTextarea` | `textarea` |
| `NbCombo` / `NbDropdown` | `dropdown` |
| `NbCheckbox` | `checkbox` |
| `NbRadioGroup` | `radiogroup` |
| `NbSwitch` | `switch` |
| `NbCard` | `card` |
| `NbDialogModal` | `dialogModal` |
| `NbTab` | `tab` |
| `NbAccordion` | `accordion` |
| `NbBadge` | `badge` |
| `NbAvatar` | `avatar` |
| `NbLabel` | `label` |
| `NbTable` | `table` |
| `NbTooltip` | `tooltip` |
| `NbSeparator` | `separator` |
| `NbProgressBar` | `progressbar` |
| `NbNumeric` | `numeric` |
| `NbDatePicker` | `datePicker` |
| `NbDateTimePicker` | `dateTimepicker` |
| `NbTimePicker` | `timePicker` |
| `RContainer` | `container` |
| `RRow` | `row` |
| `RColumn` | `column` |

---

## Casing Cheat Sheet

**lowercase** (8): `button`, `container`, `row`, `column`, `tab`, `cardcontainer`, `listview`, `heatmap`

**PascalCase** (majority): `Textbox`, `Textarea`, `Numeric`, `Checkbox`, `RadioGroup`, `Switch`, `DatePicker`, `TimePicker`, `Display`, `Heading`, `Label`, `Image`, `Icon`, `Paragraph`, `Separator`, `SplitButton`, `FloatingButton`, `MenuButton`, `HyperLink`, `Panel`, `Accordion`, `Stepper`, `Form`, `DialogBox`, `PopOver`, `Table`, `ProgressBar`, `Timeline`, `OrgChart`, `Carousel`, `Tree`, `ImageAttach`, `Tag`, `AvatarGroup`, `WeekCalendar`, `Loader`, `Iframe`, `ReportViewer`, `QuickHelp`, `Pattern`, `JsonViewer`, `Dropdown`, `Search`, `MultiSelect`, `Div`

**camelCase** (mixed): `datePicker`, `dateTimepicker`, `dateRangePicker`, `dialogModal`, `radiogroup`, `buttongroup`, `colorpicker`, `multiselect`, `autosuggest`, `inputgroup`, `actionIcon`, `splitButton`, `floatingButton`, `menuButton`, `circularProgress`, `progressbar`, `pageLoader`, `quickHelp`, `jsonViewer`, `richTextEditor`, `textEditor`, `orgChart`, `weekCalendar`, `inplacecalendar`, `imageattach`, `avatarGroup`, `reportViewer`, `listviewinline`

> When in doubt: check `ComponentsRef.ts` in the codebase. This reference is a snapshot — the codebase is the live source of truth.
