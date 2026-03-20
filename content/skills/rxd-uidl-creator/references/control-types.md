# Available Control Types

These are the exact `controlType` string values recognized by the Swift Runtime engine.
The runtime checks `Object.values(Control).some(value => value === metadata?.controlType)`.
If no match is found, the runtime renders **"Control Type Not Available yet"**.

## Complete Control Type Enum (exact strings)

Source of truth: Nebula Studio `metadataDefinition.json` (75 components).

```
container, row, column,
textbox, textarea, numeric, dropdown, checkbox, switch, radiogroup,
datePicker, dateTimepicker, dateRangePicker, timePicker, phone, autosuggest,
search, colorpicker, multiselect, inputgroup, buttongroup, pattern,
heading, paragraph, label, display, icon, badge, toolTipBadge, avatar, avatarGroup,
Hyperlink, actionIcon, tag, separator, jsonViewer,
button, splitButton, floatingButton, menuButton,
panel, card, tab, accordion, stepper, cardcontainer, carousel, Div, form,
listview, listviewinline, tree,
dialogModal, quickHelp, loader, pageLoader,
video, image, iframe, attachment, imageattach,
circularProgress, progressbar, rating, slider,
pagination, weekCalendar, inplacecalendar,
chart, heatmap, orgChart, timeline,
richTextEditor, textEditor, reportViewer,
orgChart, map
```

### CASE-SENSITIVE WARNING
- `Hyperlink` — capital H (NOT `hyperlink`)
- `Div` — capital D (NOT `div`)
- `avatarGroup` — camelCase
- `splitButton` — camelCase
- `menuButton` — camelCase
- `floatingButton` — camelCase
- `actionIcon` — camelCase
- `dateTimepicker` — note lowercase 'p'
- `dateRangePicker` — note uppercase 'P'
- `circularProgress` — camelCase
- `cardcontainer` — all lowercase
- `listviewinline` — all lowercase
- `richTextEditor` — camelCase
- `toolTipBadge` — camelCase

### IMPORTANT: "combo" is DEPRECATED
The old `combo` controlType is deprecated. Use `dropdown` instead. The designer and runtime both use `dropdown` as the active controlType for single-select dropdowns.

## Component Categories

| Category | controlTypes |
|---|---|
| **Layout** | `container`, `row`, `column`, `Div`, `iframe` |
| **Form** | `textbox`, `textarea`, `label`, `display`, `heading`, `paragraph`, `radiogroup`, `inputgroup`, `phone`, `imageattach`, `checkbox`, `datePicker`, `dateTimepicker`, `colorpicker`, `rating`, `attachment`, `switch`, `numeric`, `timePicker`, `buttongroup`, `dateRangePicker`, `dropdown`, `multiselect`, `search`, `pattern`, `reportViewer`, `richTextEditor`, `textEditor` |
| **Page** | `panel`, `card`, `tab`, `icon`, `inplacecalendar`, `avatar`, `badge`, `toolTipBadge`, `weekCalendar`, `listview`, `cardcontainer`, `accordion`, `avatarGroup`, `separator`, `autosuggest`, `tag`, `timeline`, `carousel`, `quickHelp`, `stepper`, `tree` |
| **Action** | `button`, `menuButton`, `actionIcon`, `splitButton`, `floatingButton`, `slider`, `listviewinline` |
| **Navigation** | `pagination`, `Hyperlink` |
| **Media** | `image`, `video` |
| **Data Visualization** | `jsonViewer`, `orgChart`, `chart`, `heatmap` |
| **Progress/Loaders** | `circularProgress`, `progressbar`, `loader`, `pageLoader` |
| **Map** | `map` |

## Layout Component Hierarchy

These constants determine which components can hold children:

**LAYOUT_COMPONENTS** (accept `children`):
`container`, `row`, `column`, `tabpanel`, `panel`, `card`, `tab`, `accordion`, `popover`, `Div`, `form`

**PARENT_LAYOUT_COMPONENTS** (valid drop targets in designer):
`container`, `panel`, `popover`, `card`, `tab`, `accordion`, `cardcontainer`, `Div`, `form`

**LAYOUT_PARENT_COMPONENTS** (the grid hierarchy — must nest in this order):
`container` → `row` → `column`

---

## Commonly Used Types and Their Props

### Structural (Container → Row → Column → Leaf)

#### `container`
- `containerType`: `"fluid"` (default) or `"fixed"`
- `styles`: **JSON string** e.g. `"{\"backgroundColor\":\"#fff\"}"`
- `className`: Bootstrap/grid plus runtime/global utility classes
- `margin`: preferred runtime spacing e.g. `"mb-two-s"`
- `layout.colLayout.lg.height`: height string — **runtime reads height from HERE, not from styles JSON**
- Default: `containerType: "fluid"`, `visibility: true`, `children: []`

#### `row`
- `styles`: `{}` (empty object, NOT a string)
- `className`: e.g. `"no-gutters h-100"`
- `margin`: e.g. `"mb-two-s"`
- `layout.colLayout.lg.alignItems`: `"center"`, `"stretch"`, `"start"`, `"end"`
- `layout.colLayout.lg.justifyContent`: `"center"`, `"between"`, `"around"`, `"start"`, `"end"`
- `layout.colLayout.lg.height`: height string (runtime applies via inline style)

#### `column`
- `styles`: `{}` (empty object)
- `className`: e.g. `"h-100 p-0 d-flex align-items-center"`
- Context rule: if the column contains direct `row` children, keep it breakpoint-only; use flex/alignment classes only when the column directly contains non-row children (leaf components or a nested container/panel)
- `layout.colLayout.lg.col`: number 1-12 (column width)
- `layout.colLayout.md.col`: number 1-12
- `layout.colLayout.sm.col`: number 1-12
- `layout.colLayout.lg.height`: height string
- `layout.colLayout.lg.alignItems`, `justifyContent`: flex alignment

#### `Div` (capital D!)
- `position`: `"absolute"` | `"relative"` (default) | `"fixed"`
- `divStyle`: object `{ bottom, height, width, left }` — e.g. `{ "height": "50px", "width": "100%" }`
- Children: **flat array** (Pattern 1)
- Generic wrapper without Bootstrap grid classes

#### `form`
- Minimal wrapper, default is just `{ "controlType": "form" }`
- Children: **flat array** (Pattern 1)

---

### Input Components

#### `textbox`
- `caption`: label text (default: `"Textbox"`)
- `value`: initial value (default: `"text"`)
- `placeholder`: placeholder text
- `variant`: `"standard"` (default) | `"outlined"` | `"filled"`
- `size`: `"small"` (default) | `"medium"` | `"large"`
- `inputFieldType`: `"text"` (default) | `"password"`
- `enableInheritWidth`: boolean (default: `false`) — set `true` for full parent width
- `hideCaption`: boolean (default: `false`)
- `mandatory`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `isReadonly`: boolean (default: `false`)
- `error`: boolean (default: `false`)
- `success`: boolean (default: `false`)
- `autoFill`: `"on"` | `"off"` (default: `"off"`)
- `tabIndex`: number (default: `0`)
- `enableTooltip`: boolean (default: `true`)
- `className`: CSS classes (e.g. `"wd-100"` for full width)

#### `inputgroup` (combo container — NOT a simple text input)
- **⚠️ CONTAINER TYPE** — `inputgroup` is classified as a layout container (like `row`/`column`). It expects children OR a `comboData` object. The runtime accesses `comboData.options` unconditionally.
- **DO NOT use `inputgroup` for plain email / password / text entry fields** — this crashes the runtime with `TypeError: Cannot read properties of undefined (reading 'options')`.
- **Use `textbox` for all simple text inputs** (email, password, name, search, etc.) on any page type.
- `inputgroup` correct usage: grouped input with an attached dropdown/combo (e.g., phone country-code + number, currency symbol + amount)
  - `comboData`: `{ options: [...], optionLabel: "label", optionValue: "value", defaultValue: "..." }` — **required when used as combo**
  - `comboValue`: currently selected combo value

#### `textarea`
- Same caption/label pattern as textbox
- `rows`: number (default: `12`), `cols`: number (default: `12`)
- `variant`: `"standard"` (default)
- `size`: `"small"` (default)
- `enableResize`: boolean (default: `false`)
- `width`: string (default: `"100%"`)
- `counter`: boolean (default: `false`), `maxCount`: number (default: `100`)

#### `numeric`
- `caption`: label (default: `"Enter the value"`)
- `value`: string (default: `"4566"`)
- `variant`: `"contained"` (default)
- `size`: `"medium"` (default)
- `precision`: number (default: `0`)
- `thousandSeperator`: string (default: `","`)
- `groupStyle`: `"thousand"` (default) | `"wan"` | `"lakh"` | `"none"`
- `minValue`: number (default: `-999999`), `maxValue`: number (default: `999999`)
- `incrementDecrementValue`: number (default: `2`)
- `showCounterIcon`: boolean (default: `true`)
- `showCaption`: boolean (default: `true`)
- `prefix`, `suffix`: string decorators
- `enableInheritWidth`: boolean (default: `false`)

#### `dropdown` (single-select — replaces deprecated "combo")
- `caption`: label (default: `"Select Value"`)
- `placeholder`: string (default: `"Select Value"`)
- `variant`: `"standard"` (default)
- `size`: `"small"` (default)
- `options`: data source (string or array)
- `optionLabel`: string key for display text (default: `"label"`)
- `optionValue`: string key for value (default: `"value"`)
- `optionRender`: string key for render text (default: `"label"`)
- `isSearchable`: boolean (default: `true`)
- `filterKey`: JSON string array of searchable keys (default: `"[\"label\", \"value\"]"` )
- `width`: string (default: `"100%"`)
- `noValue`: string for empty state text (default: `"No Value"`)
- `mandatory`, `disabled`, `readOnly`, `error`, `success`: booleans
- `enableInheritWidth`: boolean (default: `false`)
- `isInitialPopoverOpen`: boolean (default: `false`)

#### `checkbox`
- `caption`: label — renders ABOVE if `hideCaption` is `false` (default: `"CheckBox"`)
- `hideCaption`: boolean (default: `false`) — set to `true` to hide the above-label
- `title`: inline label text — renders NEXT TO the checkbox (default: `"Title"`)
- `hideTitle`: boolean (default: `false`) — set to `false` to show the inline label
- `checked`: string `"false"` (**⚠️ MUST be a string, NOT a boolean!** Using `true`/`false` booleans causes import failure.)
- `size`: `"large"` (default) | `"small"` | `"medium"`
- `variant`: `"default"` (default)
- `isCheckboxButton`: boolean (default: `true`)
- `buttonVariant`: `"solid"` (default)
- `indeterminate`: boolean (default: `false`)
- `enableHintText`: boolean, `hintText`: string
- `error`: boolean (default: `false`)
- **For inline label next to checkbox**: use `hideCaption: true` + `title: "Label text"` + `hideTitle: false`

#### `switch`
- `caption`: label (default: `"NbSwitch"`)
- `hideCaption`: boolean (default: `true`)
- `checked`: string `"false"` (**⚠️ MUST be a string, NOT a boolean!**)
- `size`: `"small"` (default)
- `rightLabel`: string (default: `"On"`)
- `hintText`: string (default: `"Select payslips"`)
- `enableHintText`: boolean (default: `true`)
- `disabled`: boolean, `error`: boolean

#### `radiogroup`
- `caption`: label (default: `"Group"`)
- `isRadioButton`: boolean (default: `true`)
- `size`: `"large"` (default)
- `alignment`: `"horizontal"` (default) | `"vertical"`
- `valueField`: string key (default: `"code"`)
- `displayField`: string key (default: `"text"`)
- `selectedValue`: string (default: `"r1"`)
- `options`: JSON string array, e.g. `"[{\"code\":\"r1\",\"text\":\"Radio1\"},{\"code\":\"r2\",\"text\":\"Radio2\"}]"`
- `buttonVariant`: string
- `disabled`: boolean

#### `datePicker`
- `caption`: label (default: `"Caption"`) with `showCaption: true`
- `variant`: `"standard"` (default)
- `size`: `"small"` (default)
- `dateFormat`: string (default: `"MM/DD/YYYY"`)
- `value`: string (default: empty)
- `numberOfMonths`: number (default: `1`)
- `minDate`, `maxDate`: date strings
- `onlyYearPicker`, `onlyMonthPicker`: booleans
- `disableYearPicker`, `disableMonthPicker`: booleans
- `enableIcon`: boolean, `enableButtons`: boolean

#### `dateTimepicker` (note lowercase 'p'!)
- Same as datePicker plus:
- `dateFormat`: default `"MM/DD/YYYY hh:mm:ss A"`
- `currentDateTimeButton`: boolean (default: `true`)
- `enableIcon`: boolean (default: `true`)

#### `timePicker`
- `caption`: label (default: `"Time Picker"`)
- `value`: string (default: `"12:00:00"`)
- `timeFormat`: string (default: `"HH:mm:ss"`)
- `timeSeperator`: string (default: `":"`)
- `calendarPosition`: `"bottom"` (default)
- `size`: `"medium"` (default), `variant`: `"standard"` (default)
- `width`: string (default: `"235px"`)

#### `dateRangePicker`
- `variant`: `"standard"`, `size`: `"small"`
- `dateFormat`: string, `numberOfMonths`: number
- `enableMenuList`: boolean, `menuList`: array

#### `multiselect`
- `type`: `"regular"` (default) | `"nested"`
- `variant`: `"default"` (default) | `"countonly"`
- `size`: `"medium"` (default)
- `maxItems`: number (default: `2`)
- `enableSearch`: boolean (default: `false`)
- `enableInheritWidth`: boolean (default: `true`)

#### `phone`
- `caption`: label (default: `"Phone"`)
- `size`: `"medium"` (default)
- `enableSearch`: boolean (default: `true`)
- `searchPlaceholder`: string (default: `"search"`)
- `searchNotFound`: string (default: `"Not Found"`)

#### `autosuggest`
- `caption`: label (default: `"Autosuggest"`)
- `variant`: `"default"` (default), `size`: `"small"` (default)
- `autoSuggestConfig`: object with badge/label visibility config
- `enablePopoverPortal`: boolean (default: `true`)
- `fetchOnLoad`: boolean (default: `false`)

#### `colorpicker`
- `variant`: string, `size`: string
- `typeVariant`: string, `enableSearch`: boolean
- `enableInheritWidth`: boolean

#### `search`
- `searchType`: `"basic"` (default) | `"advance"` | `"advance_with_filter"`
- `size`: `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- `caption`: string (default: `"Search"`)
- `hideCaption`: boolean (default: `false`)
- `enableRecentSearch`: boolean (default: `true`)
- `favouriteData`: JSON string array (default: `"[]"`)
- `popupHeight`: string (default: `""`)
- `enableDynamicWidth`: boolean (default: `false`)
- **Full defaults for search bars:**
  ```json
  {
    "controlType": "search",
    "searchType": "basic",
    "size": "md",
    "caption": "Search",
    "hideCaption": false,
    "enableRecentSearch": true,
    "favouriteData": "[]",
    "popupHeight": "",
    "enableDynamicWidth": false
  }
  ```

#### `pattern`
- `size`, `placeholder`, `autoFill`: `"on"` | `"off"`
- `characterInfo`: pattern definition
- `enableInheritWidth`: boolean

#### `slider`
- `min`: number (default: `0`), `max`: number (default: `10`), `step`: number (default: `1`)
- `valueLabelDisplay`: `"auto"` (default) | `"off"` | `"on"`
- `orientation`: `"horizontal"` (default) | `"vertical"`
- `track`: `"normal"` (default) | `"inverted"`
- `size`: `"small"` (default) | `"medium"`
- `color`: `"primary"` (default) | `"secondary"`
- `displayField`, `valueField`: string keys for marks data

---

### Display Components

#### `heading`
- `content`: text to display (**NOT** `caption`)
- `tag`: `"h1"` | `"h2"` | `"h3"` | `"h4"` | `"h5"` | `"h6"`
- `weight`: `"normal"` | `"bold"` | `"lighter"` | `"bolder"`
- `color`: hex color string (default: use RXDS neutral-900 `#182858`)
- `enableWordWrap`: boolean, `enableWordLineWrap`: boolean
- `wordLineWrap`: number (1–4 lines)
- `enableTooltip`: boolean

#### `paragraph`
- `content`: text to display (default: `"This is paragraph"`)
- `color`: hex color (default: use RXDS neutral-700 `#344054`)
- `size`: font size, `weight`: font weight
- `enableFormatting`: boolean
- `enableTooltip`: boolean

#### `label`
- `content`: text (default: `"label"`)
- `wordWrap`: `"wordbreak"` (default) | `"nowrap"`
- `mandatory`: boolean (shows asterisk)
- `size`: font size
- `skipPreferences`: boolean

#### `display`
- `displayTitle`: top label text (e.g. `"Total Orders"`)
- `displayValue`: value text below (e.g. `"1,234"`)
- `type`: `"form"` | `"default"` (default: `"default"`)
- `size`: `"small"` | `"medium"` | `"large"` (default: `"medium"`)
- `alignment`: `"left"` (default) | `"center"` | `"right"`
- `displayPriority`: `"top"` (default) | `"bottom"` — title position relative to value
- `icon`: boolean (default: `false`) — show icon
- `hideTitle`: boolean (default: `false`)
- `hideValue`: boolean (default: `false`)
- `overflow`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `skipPreferences`: boolean (default: `false`)
- `valueColor`, `titleColor`: hex colors (e.g. `"#182858"`, `"#667085"`)
- Default layout: `col: "4"` (takes 1/3 width) — but use `col: 2` for dashboard KPI rows with 6 items
- **Full defaults for dashboard KPI usage:**
  ```json
  {
    "controlType": "display",
    "displayTitle": "Metric Label",
    "displayValue": "0",
    "type": "default",
    "size": "medium",
    "alignment": "left",
    "displayPriority": "top",
    "disabled": false,
    "hideTitle": false,
    "hideValue": false,
    "overflow": false,
    "icon": false,
    "skipPreferences": false
  }
  ```

#### `Hyperlink` (capital H!)
- `content`: link text (**NOT** `caption`)
- `url`: link URL (**NOT** `href`)
- `variant`: `"default"` | `"primary"` — **REQUIRED**, omitting causes import failure / blank render
- `size`: `"small"` | `"regular"` (NOT `"medium"` or `"large"`)
- `wordWrap`: string
- `openLinkinSamePage`: boolean
- `enableNavigation`: boolean
- **When to use `Hyperlink` vs `button`:** Use `Hyperlink` for navigation links, inline text links, and secondary link-style actions (e.g., "Forgot password?", "Request access", "Learn more"). Never use `button variant="text"` for link-style actions.
- **⚠️ IMPORT-BREAKING MISTAKES:**
  - Missing `variant` — every Hyperlink node MUST have `variant: "default"` or `variant: "primary"`.
  - Using `caption` instead of `content` — the prop is `content`, not `caption`.
  - Using `href` instead of `url` — the prop is `url`, not `href`.

#### `separator`
- `orientation`: `"horizontal"` | `"vertical"`
- `color`: hex color
- `horizontalSpacing`, `verticalSpacing`: spacing values
- `minHeight`: min height
- `className`: CSS classes

#### `badge`
- `content`: text
- `size`: string, `borderRadius`: string
- `showBorder`: boolean, `dotbadge`: boolean
- `badgeType`: `"normal"` (default) | `"icononly"`
- `customColor`: boolean, `customColorCode`: string
- `enableTooltip`: boolean, `enableBadgeAction`: boolean

#### `icon`
- `iconKey`: icon identifier string
- `size`: string, `color`: hex color
- `style`: object, `title`: tooltip text
- Default layout: `col: "1"` (narrow column)

#### `image`
- `imageSrc`: image source URL (NOT `src`)
- `variant`: string
- `imageStyle`: style object
- `borderRadius`: `"0"` through `"40"` (in steps of 4)
- `aspectRatio`: `"1:1"` | `"3:2"` | `"16:9"` | `"21:9"` | `"3:1"`
- `enableOverlay`: boolean

#### `avatar`
- `type`: `"text"` | `"icon"` | `"image"`
- `size`: string
- `status`: `"online"` | `"offline"` | `"away"` | `"inactive"` | `"active"` | `"blocked"`
- `tooltipContent`: string, `tooltipPosition`: string (12 positions)
- `showBorder`: boolean, `disabled`: boolean

#### `avatarGroup`
- `maxLimit`: number
- `disabled`: boolean

#### `tag`
- `size`: string, `color`: string
- `addTags`: boolean, `moreTags`: boolean
- `customColor`: boolean, `customColorCode`: string
- `maxItems`: number
- `tagItems`: array of tag data

---

### Action Components

#### `button`
- `caption`: button text
- `variant`: `"contained"` | `"outlined"` | `"text"`
- `color`: `"primary"` (default) | `"secondary"` | `"success"` | `"error"` | `"warning"` | `"info"`
- `size`: `"small"` (default) | `"medium"` | `"large"`
- `className`: e.g. `"wd-100"` for full width
- `disabled`: boolean (default: `false`)
- `tooltip`: tooltip text
- `tabIndex`: number (default: `0`)
- `enableTooltip`: boolean (default: `true`)
- `hideCaption`: boolean
- **⚠️ IMPORT-BREAKING MISTAKES:**
  - `variant: "primary"` is **INVALID** — `"primary"` is a `color` value, NOT a variant. Use `variant: "contained"` for a solid primary button.
  - Never confuse `color` and `variant`. A primary contained button is `{ "variant": "contained", "color": "primary" }`.

#### `actionIcon`
- `Icon`: icon key string (e.g. `"FilterFilled"`, `"SettingsFilled"`, `"MoreVerticalFilled"`)
- `variant`: string, `size`: string (e.g. `"medium"`), `color`: string
- `disabled`: boolean (default: `false`)
- `enableToggleAction`: boolean, `toggleClick`: value
- `showDotBadge`: boolean (default: `false`), `showBorder`: boolean (default: `false`)
- **REQUIRED — badge configs (RUNTIME WILL CRASH WITHOUT THESE):**
  - `badgeFieldProps`: `{ "controlType": "badge", "size": "xsmall", "color": "success" }`
  - `badgeCountConfig`: `{ "controlType": "badge", "size": "xsmall", "color": "success", "content": "", "borderType": "without-border", "customColor": false, "count": true }`
  - `badgeIconConfig`: `{ "controlType": "badge", "size": "xsmall", "badgeType": "icononly", "iconOnly": "AddfileFilled", "borderType": "without-border", "visibility": true, "customColor": false }`
- Without `badgeFieldProps`, `badgeCountConfig`, and `badgeIconConfig`, the runtime throws `TypeError: Cannot read properties of undefined (reading 'margin')` at NbActionIcon.tsx line 112.

#### `splitButton`
- `displayValue`: button label text
- `variant`: string, `size`: string, `color`: string
- `disabled`: boolean
- `displayField`, `valueField`: string keys for options
- `LeftIcon`, `RightIcon`: icon key strings
- `options`: array of option objects

#### `menuButton`
- `label`: button label text
- `variant`: `"text-only"` | `"icon-only"` | `"text-icon"` | `"text-badge"` | `"text-icon-badge"`
- `type`: `"primary"` | `"secondary"`
- `size`: `"small"` | `"medium"` | `"large"`
- `disabled`: boolean
- `data`: menu items array

#### `floatingButton`
- `content`: button text
- `type`: string, `shape`: string
- `variant`: string, `label`: string
- `enableShadow`: boolean, `enableBorder`: boolean
- `leftIconKey`, `rightIconKey`: icon strings

#### `buttongroup`
- `enableBorder`: boolean
- `size`: string, `direction`: string
- `multiSelect`: boolean
- `selectedValue`: string
- `options`: array of button options

---

### Media Components

#### `video`
- `videoSource`: `"YOUTUBE"` | `"VIMEO"` | `"FACEBOOK"` | `"LOCAL"`
- `url`: video URL (full URL)
- `enableAutoPlay`: boolean
- `enableFullScreen`: boolean
- `orientation`: string (e.g. `"LANDSCAPE"`)
- `title`: title text, `description`: description text
- `borderRadius`: string
- **IMPORTANT**: Video height is aspect-ratio locked. LANDSCAPE = `(parentWidth * 9) / 16` pixels. It will NEVER fill 100% height of a tall container.

#### `iframe`
- `src`: URL, `title`: title text
- `srcdoc`: inline HTML content
- `allowTransparency`: boolean, `allowfullscreen`: boolean
- `loading`: `"lazy"` (default) | `"eager"`
- `height`: number (default: `200`), `width`: number (default: `200`)

#### `attachment`
- `type`: `"upload"` | `"viewAttachments"`
- `uploadStatus`: `"default"` | `"dragAndDrop"` | `"onlyCards"` | `"urlFirst"`
- `multiple`: boolean, `maxSizeInMB`: number
- `acceptedFileFormats`: string
- `enableDelete`, `enableDownload`, `enableRetry`, `enableCheckBox`: booleans

#### `imageattach`
- `enableCrop`: boolean, `enableDelete`: boolean
- `enableReUpload`: boolean, `enableReset`: boolean
- `acceptInput`: `"all"` | `"image/png"` | `"image/jpeg"` | `"image/jpg"`

---

### Layout Components (Children Containers)

These components accept nested content in their body. The body content **must still follow the Container → Row → Column → Leaf hierarchy** for proper grid layout. Every child node goes through `ControlAdapter` — the same rendering pipeline as root-level nodes.

#### `card`
- `enableHeader`: boolean (default: `true`) — show/hide the header section
- `enableFooter`: boolean (default: `true`) — show/hide the footer section
- `enableBody`: boolean (default: `true`) — show/hide the body section
- `enableMedia`: boolean (default: `false`) — show/hide the media slot
- `enablePadding`: boolean (default: `true`) — toggle internal padding
- `type`: `"with-border"` (default) | `"with-shadow"` | `"without-border-shadow"`
- `size`: `"small"` | `"medium"` | `"large"` (default) | `"xlarge"`
- `hideCaption`: boolean (default: `false`) — hide card caption/label
- `EnableCardBorder`: boolean — toggle card border
- `EnableCardShadow`: boolean — toggle card shadow
- `EnableHeaderBorder`: boolean — toggle header bottom border
- `EnableFooterBorder`: boolean — toggle footer top border
- `statusBorderColor`: `"purple"` | `"green"` | `"red"` | `"yellow"` | `"blue"` | `"orange"` | `"grey"`
- `numberOfCardsInRow`: number (default: `1`)
- `headerAlignment`: string — header content alignment
- `disabledHover`: boolean — disable hover effect
- **Header sub-object props** (when `enableHeader: true`):
  - `header.title`: string — card title text
  - `header.enableHeaderTemplate`: boolean — use custom header template
  - `header.showOption`: boolean — show options menu
  - `header.showAvatar`: boolean — show avatar in header
  - `header.avatarConfig`: object — avatar settings
  - `header.showCheckbox`: boolean — show checkbox in header
  - `header.showBadge1`, `header.showBadge2`: boolean — show badges
  - `header.showRightHeaderIcon`: boolean — show right-side icon
  - `header.showPopper`: boolean — show popper
  - `header.menu`: array — dropdown menu items
- **Children**: Pattern 2 named-slot `{ header: [], body: [], footer: [] }` — each slot contains ControlAdapter children (container → row → column → leaf)
- **Common usage — section wrapper** (hide header/footer, show body only):
  ```json
  {
    "controlType": "card",
    "enableHeader": false,
    "enableFooter": false,
    "enableBody": true,
    "type": "with-border",
    "size": "large",
    "hideCaption": true,
    "EnableCardBorder": true,
    "EnableCardShadow": false,
    "children": {
      "header": [],
      "body": [
        { "controlType": "container", "containerType": "fluid", "children": [
          { "controlType": "row", "children": [
            { "controlType": "column", "children": [ /* leaf components */ ] }
          ]}
        ]}
      ],
      "footer": []
    }
  }
  ```

#### `panel`
- `panelStyle`: object — custom panel styles
- `showHeader`: boolean — show/hide panel header
- Children: **flat array** (Pattern 1)

#### `tab`
- `tabDefinition`: array of `{ id, title }` — defines tabs
- `defaultSelected`: string — tab id to show by default
- Children: **tab-keyed dictionary** (Pattern 3)
- **Fragment support:** When tab IDs use the `FG...` prefix convention (e.g. `"FG020_tab-overview"`), the runtime extracts the fragmentId and namespaces all child component IDs with `appendKey(children, fragmentId)`. No API calls — tab fragments just namespace existing children.

#### `accordion`
- `expandMultiple`: boolean — allow multiple panels open
- Children: **flat array** (Pattern 1)

#### `stepper`
- `stepperPosition`: string — position of stepper indicator
- **Fragment-based children:** Each step can load its content from a separate UIDL (fragment) via:
  - `step.fragment.fragmentId` — namespace string (e.g. `"FG001"`), prefixed to all child IDs
  - `step.fragment.value` — the `pageId` of the fragment UIDL to load
  - `step.fragment.activityName` — used for RVW/deployed API calls
- The runtime fetches each fragment via `GetPageDetails(pageId)`, prefixes all IDs with `{fragmentId}_`, and renders via `LayoutRenderer`
- Output parameters are namespaced as `{fragmentId}_{outParam}` for cross-step data access
- Fragment state tracked in `fragmentStateStore` (Zustand)
- Children: array of step objects, each with `{ id, label, fragment: { fragmentId, value, activityName } }`

**Stepper with fragments example:**
```json
{
  "controlType": "stepper",
  "id": "stepper-wizard",
  "children": [
    {
      "id": "step-1",
      "label": "Personal Info",
      "fragment": {
        "fragmentId": "FG001",
        "value": "page-id-for-personal-info",
        "activityName": ""
      }
    },
    {
      "id": "step-2",
      "label": "Address",
      "fragment": {
        "fragmentId": "FG002",
        "value": "page-id-for-address",
        "activityName": ""
      }
    }
  ]
}
```

#### `dialogModal`
- `body`: string prop for simple text content (NOT children-based nesting for simple dialogs)
- **Fragment-based content:** For complex dialog content, load a separate UIDL fragment:
  - `fragmentId`: string — namespace for the fragment's component IDs
  - `pageId`: string — the pageId of the fragment UIDL to load
  - `fragmentOutParams`: object — output parameter mappings back to the caller
  - `dialogTransformData`: object — transform/preprocess data for binding
- The runtime sets the fragment as active, runs data transforms, and renders the fragment content inside the modal
- **Simple dialog (text body):**
  ```json
  {
    "controlType": "dialogModal",
    "id": "dialog-confirm",
    "body": "Are you sure you want to delete this item?"
  }
  ```
- **Complex dialog (fragment):**
  ```json
  {
    "controlType": "dialogModal",
    "id": "dialog-edit-user",
    "fragmentId": "FG010",
    "pageId": "page-id-for-edit-form",
    "fragmentOutParams": {},
    "body": ""
  }
  ```

---

#### Children Structure Patterns

There are three different patterns for how components hold body content:

**Pattern 1: Flat children array** — Panel, Accordion, Form, Div
```json
{
  "controlType": "panel",
  "children": [
    { "controlType": "container", "children": [
      { "controlType": "row", "children": [
        { "controlType": "column", "children": [
          { "controlType": "heading", "content": "Inside panel" }
        ]}
      ]}
    ]}
  ]
}
```

**Pattern 2: Named-slot children object** — Card
Card uses `{ header: [], body: [], footer: [] }` — NOT a flat array:
```json
{
  "controlType": "card",
  "children": {
    "header": [
      { "controlType": "container", "children": [ /* row → col → leaf */ ] }
    ],
    "body": [
      { "controlType": "container", "children": [ /* row → col → leaf */ ] }
    ],
    "footer": [
      { "controlType": "container", "children": [ /* row → col → leaf */ ] }
    ]
  }
}
```

**Pattern 3: Tab-keyed children dictionary** — Tabs
Tabs key children by the tab IDs from `tabDefinition`:
```json
{
  "controlType": "tab",
  "tabDefinition": [
    { "id": "tab1", "title": "Tab One" },
    { "id": "tab2", "title": "Tab Two" }
  ],
  "children": {
    "tab1": [
      { "controlType": "container", "children": [ /* row → col → leaf */ ] }
    ],
    "tab2": [
      { "controlType": "container", "children": [ /* row → col → leaf */ ] }
    ]
  }
}
```

Properties for panel, card, tab, accordion, etc. are documented in the Structural section above.

---

### Progress & Feedback Components

#### `circularProgress`
- `type`: `"FullCircularProgress"` (default) | `"HalfCircularProgress"`
- `progress`: number (0–100) — percentage filled
- `showPercentage`: boolean (default: `true`) — show percentage label
- `size`: `"small"` | `"medium"` (default) | `"large"`
- `trackColor`: hex color — background track color
- `progressColor`: hex color — filled progress color
- `labelColor`: hex color — percentage text color

#### `progressbar`
- `color`: string, `variant`: string, `size`: string, `data`: object

#### `loader`
- `active`: boolean, `withOverlay`: boolean, `size`: string
- `loaderDescription`: string, `color`: string, `position`: string

#### `pageLoader`
- `color`: string, `data`: object

#### `rating`
- `numberOfStars`: number, `step`: number, `defaultValue`: number
- `variant`: string, `showPercentage`: boolean, `showNumber`: boolean

---

### Data Display Components

#### `listview`
- `fieldDefs`: column definitions array — each column: `{ "fieldName": "name", "caption": "Name", "dataType": "text", "width": "200px", "alignment": "left", "sortable": true, "visible": true }`
- `uniqueKeyId`: string — the field key used as unique row identifier (e.g. `"id"`)
- `mode`: `"virtualized"` | `"lazyloading"` | `"normal"` (default: `"normal"`)
- `additionalItemsMode`: `"None"` | `"OverWrite"` | `"Merge"` (default: `"OverWrite"`)
- `canShowToolbar`: boolean (default: `true`), `canShowHeader`: boolean (default: `true`)
- `listViewHeight`: string (e.g. `"400px"`), `maxToolbarIcons`: number (default: `3`)
- `showCheckbox`: boolean (default: `false`)
- **REQUIRED sub-objects (toolbar/row features break without these):**
  - `toolSettings`: toolbar config
    ```json
    "toolSettings": {
      "search": { "enable": true, "searchPlaceholder": "Search..." },
      "settingsConfig": {
        "columnSwitch": { "enable": true },
        "density": { "enable": true }
      }
    }
    ```
  - `rowSettings`: row behavior config
    ```json
    "rowSettings": {
      "viewFullRow": false,
      "enableEditRow": true,
      "editRowType": "inplace",
      "enableContextMenu": false,
      "enableDeleteRow": false,
      "enableRowNavigation": false,
      "rowNavigationURL": "",
      "enableSubListview": false
    }
    ```
  - `noDataScreen`: empty state config
    ```json
    "noDataScreen": {
      "enableNoDataScreen": true,
      "text": "No records found",
      "subText": "Adjust your filters or try a different search.",
      "imageSrc": ""
    }
    ```
- **Full listview template:**
  ```json
  {
    "controlType": "listview",
    "fieldDefs": [
      { "fieldName": "id", "caption": "ID", "dataType": "text", "width": "80px", "alignment": "left", "sortable": true, "visible": true },
      { "fieldName": "name", "caption": "Name", "dataType": "text", "width": "200px" }
    ],
    "uniqueKeyId": "id",
    "mode": "normal",
    "additionalItemsMode": "OverWrite",
    "canShowToolbar": true,
    "canShowHeader": true,
    "listViewHeight": "400px",
    "maxToolbarIcons": 3,
    "showCheckbox": false,
    "toolSettings": { "search": { "enable": true, "searchPlaceholder": "Search..." }, "settingsConfig": { "columnSwitch": { "enable": true }, "density": { "enable": true } } },
    "rowSettings": { "viewFullRow": false, "enableEditRow": true, "editRowType": "inplace", "enableContextMenu": false, "enableDeleteRow": false, "enableRowNavigation": false, "rowNavigationURL": "", "enableSubListview": false },
    "noDataScreen": { "enableNoDataScreen": true, "text": "No records found", "subText": "Try a different search.", "imageSrc": "" }
  }
  ```

#### `listviewinline`
- `fieldDefs`: column definitions, `items`: data array
- `canShowToolbar`: boolean, `canShowHeader`: boolean
- `maxVisibleColumns`: number, `maxToolbarIcons`: number

#### `tree`
- `treeConfig`: tree structure config, `maxrootLevel`: number
- `enableFullContent`: boolean, `enableNoDataScreen`: boolean

#### `timeline`
- `timelineDetails`: array, `lineVariant`: `"solid"` | `"dashed"` | `"dotted"`

#### `jsonViewer`
- `data`: JSON data, `indent`: number, `collapse`: boolean
- `enableClipboard`: boolean, `sortKeys`: boolean
- `searchFilter`: `"value"` | `"key"` | `"all"`

---

### Data Visualization Components

#### `chart`
- `chartConfig`: full chart config, `gridLines`: `"VERTICAL"` | `"BOTH"` | `"NONE"` | `"HORIZONTAL"`
- `height`: string

#### `heatmap`
- `variant`: `"sequential"` | `"diverging"` | `"categorical"`
- `height`: string, `showTooltip`: boolean, `data`: array, `cellradius`: number

#### `orgChart`
- `orgchartConfig`: org chart config, `containerColumn`: string

#### `map`
- `provider`: `"here"` | `"google"`, `apiKey`: string
- `center`: coords, `zoom`: number, `lat`/`lng`: coords

---

### Miscellaneous Components

#### `richTextEditor`
- `placeholder`: string, `saveType`: `"HTML"` | `"JSON"`, `options`: toolbar config

#### `textEditor`
- `placeholder`: string, `data`: content, `showToolbar`: boolean, `readOnly`: boolean

#### `reportViewer`
- `DefaultfileType`: string, `fileStreamData`: data, `height`/`width`: strings

#### `weekCalendar`
- `startDay`: `"Sun"` | `"Mon"`, `selectedDay`: string, `isReadonly`: boolean

#### `inplacecalendar`
- `dateFormat`: string, `value`: string, `numberOfMonths`: number
- `onlyMonthPicker`, `onlyYearPicker`: booleans

---

### Components That DON'T Work Well
- `icon`: Renders empty in runtime (no icon library loaded)
- Themed rui classes (`rxd-bg-*`, `rxd-text-*`, `grey*`, `white-bg`) may NOT work — they depend on a theme wrapper ancestor that isn't guaranteed

---

## Component Color / Variant / Size Catalog

Quick-reference for all available values per component. Use these exact strings.

### Button
| Prop | Values |
|------|--------|
| `variant` | `"contained"`, `"outlined"`, `"text"` — **NOT** `"primary"` (that is a color!) |
| `color` | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` |
| `size` | `"small"`, `"medium"`, `"large"` |

### Hyperlink
| Prop | Values |
|------|--------|
| `variant` | `"default"`, `"primary"` — **REQUIRED** (missing = import failure) |
| `size` | `"small"`, `"regular"` — NOT `"medium"` or `"large"` |
| `content` | link text — **NOT** `caption` |
| `url` | link href — **NOT** `href` |

### Badge
| Prop | Values |
|------|--------|
| `color` | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` |
| `size` | `"xsmall"`, `"small"`, `"medium"`, `"large"` |
| `badgeType` | `"normal"`, `"icononly"` |

### Avatar
| Prop | Values |
|------|--------|
| `type` | `"text"`, `"icon"`, `"image"` |
| `status` | `"online"`, `"offline"`, `"away"`, `"active"`, `"inactive"`, `"blocked"` |
| `size` | `"xsmall"`, `"small"`, `"medium"`, `"large"`, `"xlarge"` |

### Card
| Prop | Values |
|------|--------|
| `type` | `"with-border"`, `"with-shadow"`, `"without-border-shadow"` |
| `size` | `"small"`, `"medium"`, `"large"`, `"xlarge"` |
| `statusBorderColor` | `"purple"`, `"green"`, `"red"`, `"yellow"`, `"blue"`, `"orange"`, `"grey"` |

### Heading
| Prop | Values |
|------|--------|
| `tag` | `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"` |
| `weight` | `"normal"`, `"bold"`, `"lighter"`, `"bolder"` |

### Textbox
| Prop | Values |
|------|--------|
| `variant` | `"standard"`, `"outlined"`, `"filled"` |
| `size` | `"small"`, `"medium"`, `"large"` |

### Slider
| Prop | Values |
|------|--------|
| `color` | `"primary"`, `"secondary"` |
| `size` | `"small"`, `"medium"` |
| `orientation` | `"horizontal"`, `"vertical"` |
| `track` | `"normal"`, `"inverted"` |

### Circular Progress
| Prop | Values |
|------|--------|
| `type` | `"FullCircularProgress"`, `"HalfCircularProgress"` |
| `size` | `"small"`, `"medium"`, `"large"` |

---

## Multiple Components in One Column

To place multiple leaf components side-by-side in a single column (e.g., a row of buttons or badges), use `d-flex flex-wrap` on the column and spacing classes on each leaf:

```json
{
  "controlType": "column",
  "className": "d-flex flex-wrap align-items-center",
  "children": [
    { "controlType": "button", "caption": "Primary", "color": "primary", "className": "mr-two-s mb-two-s" },
    { "controlType": "button", "caption": "Success", "color": "success", "className": "mr-two-s mb-two-s" },
    { "controlType": "button", "caption": "Error", "color": "error", "className": "mr-two-s mb-two-s" }
  ]
}
```

Key points:
- Column: `className: "d-flex flex-wrap align-items-center"` — flex container with wrapping
- Each leaf: `className: "mr-two-s mb-two-s"` — right margin + bottom margin for gutters
- Works for buttons, badges, avatars, actionIcons, or any inline-sized component
- The last component in the row can omit `mr-2` (optional, no visual impact)
