# SCSS Class Index — UIDL / Nebula Runtime

> Indexed from `app-host/src/global.scss`, `app-host/src/styles/`, and `rui-components/src/assets/scss/`.
> Each entry: class name · what it does · when/where to use.
> Verified against source SCSS files.

---

## 1. Layout & App Structure

| Class | What It Does | When to Use |
|---|---|---|
| `.main` | Full viewport (`100vh × 100vw`) flex-column container | Root app shell wrapper |
| `.ui-container` | Flex-column, `margin-left: 42px`, sidebar offset | Main content area with sidebar offset |
| `.ui-container-full` | Removes left margin; full-width layout | Pages that should ignore the sidebar |
| `.ui-body` | `width: 100%` | Body content inner wrapper |
| `.container` | `width: 98%; margin: 0 auto` | Centred page content area |
| `.container-sm/md/lg/xl` | `max-width: 100%` at `≥1201px` | Responsive container overrides |
| `.loginroot` | `height: 100vh; width: 100%; background: rgba(229,232,241,0.93)` | Login page root |
| `.loginload` | `position: fixed; top: 45%; left: 45%` | Login page loading spinner position |
| `.pageheader` | Navy-blue `<header>` with secondary colour text | Page-level header bar |
| `.searchheadercontainer` | White bg, box-shadow, `padding: 15px 10px; margin-bottom: 15px` | Search filter header row |
| `.recordcontainer` | `width: 98%; background: white; box-shadow: 0 0 4px #ddd` | Main record/detail content card |

---

## 2. Flex Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.flex-center` | `display:flex; align-items:center` | Vertically centre items in a row |
| `.flex-start` | `display:flex; align-items:flex-start` | Top-align flex items |
| `.flex-space-between` | `display:flex; justify-content:space-between` | Spread items to opposite ends |
| `.flex-center-center` | `display:flex; align-items:center; justify-content:center` | Full centring in both axes |
| `.flex-center-start` | `display:flex; align-items:center; justify-content:flex-start` | Vertically centred, start-aligned |
| `.flex-center-end` | `display:flex; align-items:center; justify-content:flex-end` | Vertically centred, end-aligned |
| `.flex-center-space-between` | `display:flex; align-items:center; justify-content:space-between` | Centred + spread |
| `.flex-center-space-even` | `display:flex; align-items:center; justify-content:space-evenly` | Centred + even gaps |
| `.flex-row` | `flex-direction: row` | Explicit horizontal flex direction |
| `.flex-column` | `flex-direction: column` | Explicit vertical flex direction |
| `.inline-flex-center` | `display:inline-flex; align-items:center` | Inline flex, vertically centred |
| `.inline-flex-center-center` | `display:inline-flex; align-items:center; justify-content:center` | Inline flex, fully centred |
| `.inline-flex-center-space-between` | `display:inline-flex; align-items:center; justify-content:space-between` | Inline flex, centred + spread |
| `.mob-flex-end` | Mobile: `flex-start; flex-direction:column` | Mobile flex column override |

---

## 3. Alignment Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.aligntop` | `align-items: flex-start` | Align flex children to top |
| `.alignmiddle` | `align-items: center` | Align flex children to middle |
| `.alignbottom` | `align-items: flex-end` | Align flex children to bottom |
| `.alignleft` | `text-align: left` | Left-align text content |
| `.aligncenter` | `text-align: center` | Centre-align text content |
| `.alignright` | `text-align: right` | Right-align text content |
| `.text-left` | `text-align: left` | Left-align text (modern alias) |
| `.text-center` | `text-align: center` | Centre-align text (modern alias) |
| `.text-right` | `text-align: right` | Right-align text (modern alias) |

---

## 4. Padding Utilities

### Token-based Padding ($-s scale: 4/8/12/16/20/24/32/48px)

| Class | Value | Class | Value |
|---|---|---|---|
| `.pt-half-s` | `4px` | `.pt-one-s` | `8px` |
| `.pt-one-half-s` | `12px` | `.pt-two-s` | `16px` |
| `.pt-three-s` | `24px` | `.pb-half-s` | `4px` |
| `.pb-one-s` | `8px` | `.pb-one-half-s` | `12px` |
| `.pb-two-s` | `16px` | `.pb-three-s` | `24px` |
| `.pb-six-s` | `48px` | `.pl-half-s` | `4px` |
| `.pl-one-s` | `8px` | `.pl-one-half-s` | `12px` |
| `.pl-two-s` | `16px` | `.pl-two-half-s` | `20px` |
| `.pl-three-s` | `24px` | `.pl-four-s` | `32px` |
| `.pl-six-s` | `48px` | `.pr-half-s` | `4px` |
| `.pr-one-s` | `8px` | `.pr-one-half-s` | `12px` |
| `.pr-two-s` | `16px` | `.pr-two-half-s` | `20px` |
| `.pr-three-s` | `24px` | `.pr-four-s` | `32px` |
| `.pr-six-s` | `48px` | `.p-one-s` | `8px` |
| `.p-two-s` | `16px` | `.p-three-s` | `24px` |
| `.p-six-s` | `48px` | — | — |

> **Responsive variants**: prefix with `tab-` (tablet ≤1000px) or `mob-` (mobile ≤767px). E.g. `.mob-no-padding`, `.tab-pt-one-s`.

---

## 5. Margin Utilities

### Token-based Margin ($-s scale)

| Class | Value | Class | Value |
|---|---|---|---|
| `.mb-half-s` | `4px` | `.mb-one-s` | `8px` |
| `.mb-one-half-s` | `12px` | `.mb-two-s` | `16px` |
| `.mb-three-s` | `24px` | `.mb-four-s` | `32px` |
| `.mb-six-s` | `48px` | `.mb-ten-s` | `80px` |
| `.mt-quarter-s` | `2px` | `.mt-half-s` | `4px` |
| `.mt-one-s` | `8px` | `.mt-two-s` | `16px` |
| `.mt-three-s` | `24px` | `.mt-four-s` | `32px` |
| `.mt-six-s` | `48px` | `.mt-ten-s` | `80px` |
| `.ml-half-s` | `4px` | `.ml-one-s` | `8px` |
| `.ml-two-s` | `16px` | `.ml-three-s` | `24px` |
| `.ml-four-s` | `32px` | `.ml-six-s` | `48px` |
| `.mr-half-s` | `4px` | `.mr-one-s` | `8px` |
| `.mr-two-s` | `16px` | `.mr-three-s` | `24px` |
| `.mr-four-s` | `32px` | `.mr-six-s` | `48px` |

> **Responsive variants**: prefix with `tab-` or `mob-`. E.g. `.tab-mb-two-s`, `.mob-mt-one-s`.

---

## 6. Typography Utilities

### Font Size

| Class | Size | When to Use |
|---|---|---|
| `.font-11` | `11px` | Captions, metadata, tiny labels |
| `.font-12` | `12px` | Helper text, secondary info |
| `.font-14` | `14px` | Standard small body text |
| `.font-16` | `16px !important` | Standard body text |
| `.font-xxs` | `10px (0.625rem)` | Smallest readable text |
| `.font-xs` | `12px (0.75rem)` | Extra-small text |
| `.font-s` | `13px (0.813rem)` | Small text |
| `.font-m` | `14px (0.9rem)` | Medium text |
| `.font-r` | `16px (1rem)` | Regular/default text |
| `.font-l` | `20px (1.3rem)` | Large text |
| `.font-xl` | `24px (1.5rem)` | Extra-large text |
| `.font-xxl` | `32px (2rem)` | Display text |
| `.font-head` | `20px (1.3rem)` | Page heading |

### Font Weight

| Class | Weight | When to Use |
|---|---|---|
| `.font-light` | `300` | Light/thin text |
| `.font-regular` | `400` | Normal body weight |
| `.font-medium` | `500` | Slightly emphasised |
| `.font-semibold` | `600` | Sub-headings, labels |
| `.font-bold` | `700` | Strong emphasis |
| `.font-black` | `900` | Maximum weight display text |

### Text Transforms & Whitespace

| Class | What It Does | When to Use |
|---|---|---|
| `.allcaps` | `text-transform: uppercase` | ALL-CAPS labels |
| `.pre-wrap` | `white-space: pre-wrap` | Preserve newlines in display text |

---

## 7. Colour Utilities

### Text Colours

| Class | Colour | When to Use |
|---|---|---|
| `.red` | `$red1 !important` | Error/danger text |
| `.green` | `$green1 !important` | Success/positive text |
| `.primary` | Theme primary colour | Brand-coloured text |
| `.successalert` | Theme success colour | Success state labels |
| `.infoalert` | Theme info colour | Informational labels |
| `.warningalert` | Theme warning colour | Warning state labels |
| `.dangeralert` | Theme error colour | Danger/error labels |
| `.closedalert` | `$blue2` | Closed/completed state |
| `.color-primary` | `$primary !important` | Override to primary colour |
| `.color-secondary` | `$secondary !important` | Override to secondary colour |
| `.color-danger` | `$danger !important` | Override to danger colour |
| `.color-success` | `$success !important` | Override to success colour |
| `.color-dark` | `$dark !important` | Dark text |
| `.color-light` | `$light !important` | Light text |
| `.color-aaa` | `#aaa` | Muted gray text |
| `.grey1` – `.grey6`, `.grey8` | Themed grey scale | Gray text levels (no `.grey7` class) |
| `.bluegrey1` – `.bluegrey8` | Themed blue-grey scale | Blue-grey text levels |

### Background Colours

| Class | Colour | When to Use |
|---|---|---|
| `.white-bg` / `.bg-white` | White | White card/section background |
| `.bg-lightgrey` | `$culturedwhite` | Very light gray background |
| `.bg-primary` | `$primary !important` | Primary brand background |
| `.bg-secondary` | `$secondary !important` | Secondary background |
| `.bg-danger` | `$danger !important` | Danger/error highlight |
| `.bg-success` | `$success !important` | Success highlight |
| `.bg-light` | `$light !important` | Light background |
| `.bg-dark` | `$dark !important` | Dark background |
| `.bg-purple` | `$accentpurple !important` | Purple accent background |
| `.bg-red` | `$accentred1 !important` | Red accent background |
| `.bg-green` | `$accentgreen !important` | Green accent background |
| `.primary-bg` | Theme primary | Themed primary background |
| `.successalert-bg` | Theme success | Success alert background |
| `.warningalert-bg` | Theme warning | Warning alert background |
| `.dangeralert-bg` | Theme error | Danger alert background |
| `.bg-grey1` – `.bg-grey6` | Themed grey scale | Grey section backgrounds |

---

## 8. Border Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.b-0` | `border: 0` | Remove all borders |
| `.b-1` | `1px solid themed(borderColor) !important` | Standard border |
| `.bb-0` | `border-bottom: 0 !important` | Remove bottom border |
| `.bb-1` | `1px solid themed(borderColor)` | Bottom border only |
| `.bt-1` | `1px solid themed(borderColor)` | Top border only |
| `.br-1` | `1px solid themed(borderColor)` (hides on tablet) | Right border |
| `.bl-1` | `1px solid themed(borderColor)` | Left border |

---

## 9. Divider Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.dvright::after` | Absolute 1px vertical line on right side (#c9cdd6) | Right column divider |
| `.dvleft::before` | Absolute 1px vertical line on left side | Left column divider |
| `.dvbottom::after` | Absolute 1px horizontal line on bottom (inset 10px) | Bottom section divider |
| `.dvtop::before` | Absolute 1px horizontal line on top (inset 5px) | Top section divider |
| `.divider` | 1px gray bar, `margin: 12px 8px`, `display: none` | Menu/sidebar divider (shown by JS) |
| `.hr-custom` | Full-width `border-bottom` line | Custom horizontal rule |

> **Note:** `.dv*` classes require `position: relative` on the parent element.

---

## 10. Sizing & Position Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.position-relative` | `position: relative` | Establish positioning context |
| `.position-absolute` | `position: absolute` | Absolutely position inside relative parent |
| `.float-right` / `.f-right` / `.right` | `float: right !important` | Float element to right |
| `.f-left` / `.left` | `float: left` | Float element to left |
| `.wd-100` | `width: 100%; float: left` | Full-width floated block |
| `.wd-50` | `width: 50%; float: left` | Half-width floated block |
| `.wd-auto` | `width: auto` | Auto-size width |
| `.w150px` | `width: 150px` | Fixed 150px width |
| `.w100px` | `width: 100px` | Fixed 100px width |
| `.w50px` | `width: 50px` | Fixed 50px width |
| `.mh-auto` | `min-height: auto` | Auto min-height |
| `.mh-2l` | `min-height: 38px` | Two-line min-height |

---

## 11. Visibility & Interaction Utilities

| Class | What It Does | When to Use |
|---|---|---|
| `.smart-hide:empty` | `display: none` when element has no content | Auto-hide empty containers |
| `.disabled` | `pointer-events: none; opacity: 0.5; cursor: not-allowed` | Show disabled state |
| `.pointer` | `cursor: pointer` | Indicate clickable element |
| `.cursor-text` | `cursor: text` | Text selection cursor |

---

## 12. Navigation & Sidebar Classes

| Class | What It Does | When to Use |
|---|---|---|
| `.menu` | Nested menu container | Sidebar menu wrapper |
| `.menutitle` | `padding: 20px; background: #0e2756; color: white` | Sidebar title bar |
| `.menugroup` | `padding-bottom: 10px` | Menu section group |
| `.menugroupheader` | `background: #f6f7fb; border-bottom; font-size: 14px` | Group section heading |
| `.submenugroup` | `font-size: 12px` | Sub-group wrapper |
| `.submenutitle` | `padding: 10px 10px 10px 20px; text-transform: capitalize` | Sub-section title |
| `.menulink a` | Block link with hover background `#f1f7f9` | Individual menu link item |
| `.menuicon` | `min-width/height: 24px; text-align: center; margin: 8px` | Menu item icon container |
| `.icononly` | `display: block; min-width/height: 24px; margin: 16px 8px 0` | Icon-only sidebar state |
| `.oucombo` | `display: none` (hidden by default) | OU selector in sidebar |
| `.cmbrole` | `margin: 8px` | Role combo in sidebar |
| `.bx--side-nav--expanded .oucombo` | `display: block` | Show OU when sidebar expanded |
| `.bx--side-nav--expanded .icononly` | `display: none` | Hide icon when sidebar expanded |

---

## 13. Table & Grid Classes

| Class | What It Does | When to Use |
|---|---|---|
| `.table` | `padding: 20px; cells: 6px padding; thead/tbody styling` | Table container wrapper |
| `.tablepagination` | Border + MUI pagination override styles | Pagination row below table |
| `.searchheader.MuiGrid-container` | `padding: 0 20px; item width: 300px` | Search filter header grid |

---

## 14. Component State Classes

| Class | What It Does | When to Use |
|---|---|---|
| `.tabfirst` | Tab group with `border-bottom` and primary indicator | First tab style |
| `.tabsecond` | Bordered tab group, no indicator height | Alternate tab style |
| `.nb-tabs` | Tab container with `border-top: 1px solid #e1e1e1` | Nebula tabs wrapper |
| `.nb-tabitems` | `border: none !important; border-top: 1px solid #e1e1e1 !important` | Tab items container |
| `.bx--tab-content` | `padding: 8px 0` | Tab panel content area |
| `.validation-msg` | `color: red; font-size: 12px` | Validation error message |
| `.customcard-selected` | `background: #b058ff; color: white` | Selected card highlight |
| `.leafIcon` | `24px × 24px; text-align: center` | Tree node leaf icon |
| `.BtSize` | `width: 100px; height: 60px` | Standard button sizing |
| `.uibar` | `display: flex; padding: 4px 8px` | Toolbar/action bar |
| `.nb_Checkbox` | Switch position fix | Checkbox switch adjustment |
| `.equal-row-height` | Flex cards with equal column height | Equal-height grid cards |
| `.img-wrapper` | `width: 100%` responsive images | Image container |
| `.simple-link` | `font-size: 12px; color: gray` | Simple inline hyperlink |

---

## 15. SCSS Variables Reference (`variables.scss`)

```scss
$quarter-s:    0.125rem;  // 2px
$half-s:       0.25rem;   // 4px
$one-s:        0.5rem;    // 8px  ← base unit
$one-half-s:   0.75rem;   // 12px
$one-three-s:  0.875rem;  // 14px
$two-s:        1rem;      // 16px
$two-half-s:   1.25rem;   // 20px
$three-s:      1.5rem;    // 24px
$three-half-s: 1.625rem;  // 26px
$four-s:       2rem;      // 32px
$five-s:       2.5rem;    // 40px
$six-s:        3rem;      // 48px
```

---

## Usage Quick Reference

| Goal | Classes to Use |
|---|---|
| Full-page hero layout | `.main` + `.ui-container` or `.ui-container-full` |
| Centred content area | `.container` |
| Two-column layout | `col-*` Bootstrap grid + `.dvright` for divider |
| Flex row, vertically centred | `.flex-center` |
| Flex row, spread apart | `.flex-space-between` |
| Small label text | `.font-12` + `.font-medium` |
| Required field asterisk | `.mandatory-label` on `<label>` |
| Disabled overlay | `.disabled` |
| Divider line between sections | `.dvbottom` (needs `position: relative` on parent) |
| Error message | `.validation-msg` |
| Hide when empty | `.smart-hide` |
| Sidebar with icon + text | `.menuicon` / `.icononly` toggled by `.bx--side-nav--expanded` |
