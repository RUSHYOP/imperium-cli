# Component Index — UIDL / Nebula Platform

> Auto-indexed from RUI atoms and Swift runtime wrappers.
> Sources: `nebula-components/packages/rui-components/src/atoms/` · `swift-runtime-dev-stable/src/wrapper/`

---

## Layout & Container Components

| Component | controlType | File | Description |
|---|---|---|---|
| Container | container | `rui/atoms/container/NbContainer.tsx` | Basic layout container; supports orientation, alignment, and background |
| Row | row | `swift/wrapper/row/index.tsx` | Horizontal flex layout row; wraps children in a flex-row |
| Column | column | `swift/wrapper/column/index.tsx` | Vertical flex layout column; wraps children in a flex-column |
| Panel | panel | `rui/atoms/panel/NbPanel.tsx` | Bordered container with optional header, body, and footer slots |
| Card | card | `rui/atoms/card/NbCard.tsx` | Content card with header, body, footer; supports elevation/shadow |
| CardContainer | cardcontainer | `swift/wrapper/cardcontainer/index.tsx` | Multi-card grid wrapper with equal-height support |
| Footer | footer | `rui/atoms/footer/NbDiv.tsx` | Page footer container (renders as `<div>`) |
| InputGroup | inputgroup | `swift/wrapper/inputgroup/index.tsx` | Container that groups an input with prefix/suffix addons |
| MicroFrontend | microfrontend | `rui/atoms/micro-frontend/NbMicrofrontend.tsx` | Embeds a separate micro-frontend app inside the page |
| WindowResizeObserver | — | `rui/atoms/windowresizeobserver/WindowResizeObserver.tsx` | Utility: fires callbacks on window resize events |
| ColumnSwitch | columnswitch | `rui/atoms/columnswitch/NbColumnSwitch.tsx` | Toggles between single-column and multi-column layout |
| DataContainer | datacontainer | `rui/atoms/datacontainer/` | Binds a data source and renders child components with it |

---

## Form Input Components

| Component | controlType | File | Description |
|---|---|---|---|
| TextBox / TextField | textbox | `rui/atoms/textbox/` · `swift/wrapper/textfield/` | Single-line text input with label and validation |
| TextArea | textarea | `swift/wrapper/textarea/index.tsx` | Multi-line text input area |
| Numeric | numeric | `swift/wrapper/Numeric/index.tsx` | Number input with precision, min/max, and formatting |
| Currency | currency | `swift/wrapper/currency/index.tsx` | Currency amount input with locale formatting |
| Phone | phone | `rui/atoms/phone/` | Phone number input with country code selection |
| Password | password | (archive) | Password input with show/hide toggle |
| Checkbox | checkbox | `rui/atoms/checkbox/NbCheckbox.tsx` | Single boolean checkbox input |
| Radio | radio | `rui/atoms/radio/NbRadio.tsx` | Single radio button (part of a RadioGroup) |
| RadioGroup | radiogroup | `rui/atoms/radiogroup/NbRadioGroup.tsx` | Group of radio buttons for single-select |
| Switch | switch | `swift/wrapper/switch/index.tsx` | Toggle switch for on/off state |
| ToggleButton | togglebutton | `rui/atoms/togglebutton/NbToggleButtonGroup.tsx` | Group of toggle buttons with mutual or multi selection |
| Combo | combo | `rui/atoms/combo-new/NbCombo.tsx` | Searchable dropdown with autocomplete (active version) |
| Dropdown | dropdown | `swift/wrapper/dropdown/index.tsx` | Standard dropdown/select list |
| MultiSelect | multiselect | `swift/wrapper/multiselect/index.tsx` | Multi-selection dropdown with tags |
| AutoSuggest | autosuggest | `rui/atoms/autosuggest/NbAutosuggest.tsx` | Type-ahead suggestion input |
| Search | search | `rui/atoms/search/NbSearch.tsx` | Search input with option list |
| DatePicker | datePicker | `rui/atoms/datepicker/NbDatePicker.tsx` | Single date selection with calendar popup |
| DateRangePicker | dateRangePicker | `rui/atoms/daterangepicker/NbDateRangePicker.tsx` | Selects a start and end date range |
| DateTimePicker | dateTimepicker | `swift/wrapper/datetimepicker/index.tsx` | Combined date + time selection |
| TimePicker | timePicker | `rui/atoms/timepicker/NbTimePicker.tsx` | Time-only selection picker |
| Time | timefield | `swift/wrapper/time/index.tsx` | Time input field wrapper |
| InPlaceCalendar | inplacecalendar | `swift/wrapper/inplacecalendar/index.tsx` | Inline (always-visible) calendar picker |
| WeekCalendar | weekCalendar | `swift/wrapper/weekCalendar/index.tsx` | Week-based calendar view and selection |
| Rating | rating | `rui/atoms/rating/NbRating.tsx` | Star rating input (1–N stars) |
| Slider | slider | `swift/wrapper/slider/index.tsx` | Range slider for numeric values |
| ColorPicker | colorpicker | `swift/wrapper/colorPicker/index.tsx` | Color selection palette input |
| Form | form | `rui/atoms/form/NbForm.tsx` | Form container with submission, validation, and reset |
| Label | label | `rui/atoms/label/NbLabel.tsx` | Text label for form fields |
| Attachment | attachment | `swift/wrapper/attachment/index.tsx` | File upload with drag-drop and multi-file support |
| ImageAttach | imageattach | `swift/wrapper/imageattach/index.tsx` | Image upload attachment with preview |
| ButtonGroup | buttongroup | `swift/wrapper/buttongroup/index.tsx` | Grouped toggle buttons for mutually exclusive selection |

---

## Navigation Components

| Component | controlType | File | Description |
|---|---|---|---|
| Button | button | `rui/atoms/button/` · `swift/wrapper/button/` | Clickable action button with primary/secondary/ghost variants |
| Hyperlink | Hyperlink | `rui/atoms/hyperlink/NbHyperlink.tsx` | Clickable link, optionally with icon; use for navigation (not actions) |
| Link | link | `rui/atoms/link/` · `swift/wrapper/link/` | Navigation link element |
| FloatingButton | floatingButton | `rui/atoms/floatingbutton/NbFloatingButton.tsx` | Floating action button (FAB) fixed to screen |
| SplitButton | splitButton | `rui/atoms/splitbutton/` · `swift/wrapper/splitButton/` | Button with secondary dropdown actions |
| MenuButton | menuButton | `rui/atoms/menu-button/NbMenuButton.tsx` | Button that opens a dropdown menu |
| ActionIcon | actionIcon | `swift/wrapper/actionIcon/index.tsx` | Icon-only clickable action button |
| Breadcrumbs | breadcrumbs | `swift/wrapper/breadcrumbs/index.tsx` | Navigation breadcrumb trail showing current page hierarchy |
| Tabs | tabs | `swift/wrapper/tabs/index.tsx` | Tab bar for switching between panel views |
| Stepper | stepper | `rui/atoms/stepper/NbStepper.tsx` | Multi-step process indicator with navigation |
| Pagination | pagination | `rui/atoms/pagination/NbPagination.tsx` | Page navigation with previous/next and page numbers |
| Dropdown (menu) | dropdown | `swift/wrapper/dropdown/index.tsx` | Dropdown menu selection list |

---

## Data Display Components

| Component | controlType | File | Description |
|---|---|---|---|
| Heading | heading | `rui/atoms/heading/NbHeading.tsx` | Semantic heading (H1–H6) with size and style |
| Paragraph | paragraph | `rui/atoms/paragraph/NbParagraph.tsx` | Multi-line text paragraph element |
| Display | display | `swift/wrapper/display/index.tsx` | Read-only text display (value output) |
| Label (display) | label | `rui/atoms/label/NbLabel.tsx` | Static text label (also used as display) |
| DateDisplay | datedisplay | `rui/atoms/datedisplay/NbDateDisplay.tsx` | Formatted date display (read-only) |
| Separator | separator | `rui/atoms/separator/NbSeparator.tsx` | Visual divider line |
| Icon | icon | `swift/wrapper/icon/index.tsx` | Renders an icon from the icon library |
| Avatar | avatar | `swift/wrapper/avatar/index.tsx` | User profile image with fallback initials |
| AvatarGroup | avatarGroup | `rui/atoms/avatargroup/NbAvatarGroup.tsx` | Stacked group of Avatar components |
| Badge | badge | `swift/wrapper/badge/index.tsx` | Small status/count indicator on another element |
| Tag | tag | `swift/wrapper/tag/index.tsx` | Single label/chip element |
| Tags | tags | `swift/wrapper/tags/index.tsx` | Multiple tag chips display |
| Table | table | `swift/wrapper/table/index.tsx` | Data table with rows, columns, sorting, and pagination |
| ListView | listview | `swift/wrapper/listview/index.tsx` | Scrollable list with selection and filtering |
| TreeGrid | treegrid | `rui/atoms/treegrid/` | Hierarchical tree grid with expand/collapse |
| Chart | chart | `swift/wrapper/chart/index.tsx` | Data chart (bar, line, pie, etc.) |
| HeatMap | heatmap | `swift/wrapper/heatmap/index.tsx` | Heat map visualization for density data |
| OrgChart | orgChart | `rui/atoms/orgchart/NbOrgChart.tsx` | Organizational hierarchy chart |
| Timeline | timeline | `swift/wrapper/timeline/index.tsx` | Vertical timeline of events |
| Carousel | carousel | `rui/atoms/carousel/NbCarousel.tsx` | Rotating image/content slideshow |
| JSONViewer | jsonViewer | `swift/wrapper/jsonviewer/index.tsx` | JSON data viewer with syntax highlighting |
| DiffCheck | diffcheck | `rui/atoms/diffcheck/NbDiffCheck.tsx` | Side-by-side content diff comparison |
| ProgressBar | progressbar | `rui/atoms/progressbar/NbProgressBar.tsx` | Linear progress bar (determinate/indeterminate) |
| Progress | progress | `rui/atoms/progress/NbProgress.tsx` | General progress indicator |

---

## Feedback & Overlay Components

| Component | controlType | File | Description |
|---|---|---|---|
| Tooltip | tooltip | `rui/atoms/tooltip/NbTooltip.tsx` | Hover tooltip with brief information |
| QuickHelp | quickHelp | `rui/atoms/quickhelp/NbQuickhelp.tsx` | Help icon with popover explanation |
| Popover | popover | `rui/atoms/popover-new/NbPopover.tsx` | Click-triggered floating popover (active version) |
| Dialog | dialog | `swift/wrapper/dialog/index.tsx` | Modal confirmation dialog |
| DialogModal | dialogModal | `swift/wrapper/dialogmodal/index.tsx` | Full modal with header, body, footer slots |
| Loader | loader | `swift/wrapper/loader/index.tsx` | Inline spinner/loading indicator |
| PageLoader | pageLoader | `rui/atoms/pageloader/NbPageLoader.tsx` | Full-page loading overlay |
| CircularProgress | circularprogress | `swift/wrapper/circularprogress/index.tsx` | Circular progress spinner |

---

## Media Components

| Component | controlType | File | Description |
|---|---|---|---|
| Image | image | `rui/atoms/image/NbImage.tsx` | Responsive image with lazy loading |
| Video | video | `rui/atoms/video/NbVideo.tsx` | Video player with controls |
| IFrame | iframe | `rui/atoms/iframe/NbIframe.tsx` | Embedded external content via `<iframe>` |
| Maps | map | `swift/wrapper/maps/index.tsx` | Map visualization (Google Maps / Leaflet) |

---

## Specialized / Advanced Components

| Component | controlType | File | Description |
|---|---|---|---|
| RichTextEditor | richTextEditor | `swift/wrapper/richTextEditor/index.tsx` | WYSIWYG rich text editor |
| TextEditor | textEditor | `swift/wrapper/textEditor/index.tsx` | Code/text editor with syntax highlighting |
| Box | — | `swift/wrapper/box.tsx` | Generic box element (low-level layout primitive) |
| ContextMenu | contextmenu | `rui/atoms/contextmenu/NbContextmenu.tsx` | Right-click context menu |
| Popover (legacy) | popover | `rui/atoms/popover/NbPopover.tsx` | Legacy popover (use `popover-new` instead) |
| Combo (legacy) | combo | `rui/atoms/combo-new/` | Legacy combo (use `combo-new` instead) |

---

## Summary

| Category | Count |
|---|---|
| Layout & Container | 12 |
| Form Input | 31 |
| Navigation | 13 |
| Data Display | 23 |
| Feedback & Overlay | 8 |
| Media | 4 |
| Specialized | 6 |
| **Total** | **~97** |

### Key Conventions

- **RUI atoms** follow `NbComponentName.tsx` + `NbComponentName.props.tsx`
- **Swift wrappers** use `index.tsx` inside a named folder
- **controlType** = the UIDL JSON string used in `"controlType"` field
- **Active vs Legacy**: prefer `combo-new`, `popover-new` over legacy versions
- **`inputgroup`** is a layout container, NOT a text input field
- **`textbox`** is the correct controlType for text input (not `textfield` or `input`)
- **`Hyperlink`** = navigation to URL; **`button`** = triggers an action
