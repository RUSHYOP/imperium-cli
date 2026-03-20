# Carousel

Horizontally scrolling content slider with navigation indicators.

## When to Use
- Image galleries or hero banners
- Feature highlights or onboarding walkthroughs
- Browsing cards when horizontal space is limited

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Dots, Number, Dots with bottom arrows, Number With Bottom Arrows | Dots |
| Cut-Card On Sides | False, True | False |

## Visual Variants (from Storybook)

| Story | What is visible |
|-------|----------------|
| rxd (Dots) | Single card visible; card has heading, paragraph, "Tagname" badge chip (blue, top-right), and a footer content area; left/right arrow navigation buttons on outer edges; 6 filled/unfilled dot indicators centred below the card — first dot is blue (active), rest are grey |
| rxd-number-of-items (Number) | Two cards visible side by side; same card structure; 3 dot indicators below with first active; demonstrates multi-card-per-view layout |

### Visual notes
- Navigation arrows are circular ghost buttons on the left and right outer edges of the carousel track
- Dot indicators appear horizontally centred below the slide area
- Active dot: filled blue circle; inactive dots: empty/grey circles
- Card content: title (bold), paragraph text, optional badge chip (blue filled), optional nested content area
- When Cut-Card On Sides is True, the adjacent card is partially visible at the left/right edge to hint scrollability
- Number variant shows a numeric counter (e.g. "1 / 6") instead of or alongside dots

## Notes
- Dots indicator for fewer slides; Number indicator for longer sequences
- Cut-Card On Sides peeks adjacent cards to hint at scrollability