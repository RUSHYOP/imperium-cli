# Card / Card Container

Contained surface for grouping related content. Card Container arranges multiple cards in a grid.

## When to Use
- Dashboard widgets and summary tiles
- Product or content listings
- Grouping related form sections or information

## Card Properties

| Property | Options | Default |
|----------|---------|---------|
| Size | SM, MD, LG, XL | SM |
| Type | Border, Shadow, No Border + No Shadow | Border |
| States | Default, Hover, Active, Active Hover, Active Right | Default |

**Toggles:** Show Media, Show Header, Show Body, Show Footer

## Card Container Properties

| Property | Options | Default |
|----------|---------|---------|
| No of cards in a row | 1, 2, 3, 4 | 1 |
| Card space between | 8, 16, 24 | 8 |

## Sub-components
- **Card-Header** — title bar with actions
- **Card-Footer** — bottom actions or metadata

## Do not use when
- Content has no distinct header/body/footer structure — use **Panel**
- Items are rows of column-aligned data — use **Table** or **ListView**
- Only a simple bordered region is needed — use **Panel**
## Visual Variants (from Storybook)

### Card — default-card story
- Minimal card with a left avatar icon, bold title, body text, and a vertical blue right-border accent
- Three-dot overflow menu (kebab) in the top-right corner
- No explicit header/footer chrome visible; just title + body text

### Card — rxds-stories (full-featured card)
- **Header:** checkbox (top-left), icon, heading + sub-heading, right-side action area with “Tagname” hyperlink + icon
- **Body:** media placeholder text, hyperlink (“Apply”), tag row (Tagname x3, “+3” overflow badge, “+” add button)
- **Footer:** two label pairs on the left, two ghost/primary buttons (“Button Text”) on the right
- Demonstrates: Show Media (off in this story), Show Header (on), Show Body (on), Show Footer (on)

### Card Container — default story
- 3-column grid of minimal cards (NbCardContainer label visible)
- Each card: title, three lines of body text in varying weights
- Cards separated by white gutters; outer border visible on container

### Card Container — rxds-stories (lazy-loading / playground)
- 3-column grid of full-featured cards (NbCardContainer label, 10 rows = 30 cards)
- Each card shows: checkbox, icon, truncated heading, tag badges (“tag na...”, “tagname la...” in teal/green), three-dot menu
- Body: “[object Object]” placeholder, hyperlink, tag strip
- Footer: two label pairs + two buttons

## Notes
- Use Shadow type for elevated prominence; Border for flat contained style
- Card Container controls grid layout (1-4 columns) and gap spacing
- The right-border blue accent on default cards indicates an “active” or highlighted state
- Tag overflow badge (+N) appears when tags exceed visible row width