# Rating

Star-based or social-engagement rating component for user feedback.

## When to Use
- Product or content reviews
- User satisfaction ratings
- Social engagement indicators (likes, reactions)

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Variant | Star, Social | Star |

## Sub-components
- **Star** / **Star-Item** — individual star rating element
- **Social** / **Social-Item** — social engagement element (likes, etc.)

## Notes
- Star variant for traditional 1–5 star reviews
- Social variant for like/dislike or reaction-style feedback

## Visual Variants (from Storybook)

### Story: Rating (Playground)
- Label “Rating” shown above the star row
- 10 stars total displayed in a horizontal row
- First 5 stars are filled/yellow (active), last 5 stars are empty/gray (inactive)
- Numeric value “50” displayed to the right of the stars
- Stars are large, prominently sized

### Visual Observations
- The rating scale can be 10 stars (not always 5 stars as commonly assumed)
- The current rating value is shown as a number to the right of the star row
- Active stars are filled yellow/gold; inactive stars are outlined/gray
- The label “Rating” appears above the component as a heading/label