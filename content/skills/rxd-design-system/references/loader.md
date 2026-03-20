# Loader / Page Loader

Spinning indicator for in-progress operations. Page Loader shows a linear progress bar for full-page loads.

## Loader Properties

| Property | Options | Default |
|----------|---------|---------|
| Angle | 0â€“330 (30Â° increments) | 0 |
| Size | Large, Medium, Small | Large |

## Page Loader Properties

| Property | Options | Default |
|----------|---------|---------|
| Status | Complete, Start | Start |

## When to Use
- **Loader** — inline or overlay spinner during async operations
- **Page Loader** — top-of-page linear bar during route navigation

## Do not use when
- The content structure is known and can be previewed — use **Skeleton Animation**
- Progress percentage is known — use **ProgressBar** or **Circular Progress**
- No data exists (operation complete, zero results) — use **Empty States**

- Page Loader Set ID: `6251:5076`

## Visual Variants (from Storybook)

### Loader (default.png)
- Centered spinner on a white background with theme-rxd applied
- Spinner is a partial arc/ring in light blue (not a full circle) — the arc is approximately 270° showing motion
- Text label "Loader" appears below the spinner in small dark gray text
- The arc color is a soft/muted blue matching the RXDS primary palette

### Loader trigger example (trigger-element-example.png)
- Shows usage of the Loader as an overlay on content containers
- "Show Loader" button at top triggers the loader
- Two content boxes visible: "First Box Content" (light gray bg) and "Second Box Content" (darker gray bg)
- Demonstrates loader overlaying specific sections of a page rather than full page

### Page Loader / Progress bar (ProgressAndLoadingIndicatorsProgress/default.png)
- Horizontal linear bar fixed at the top of the page (like a browser loading indicator)
- Blue filled portion (~50% complete) on a light gray/white background track
- The bar has a subtle shadow below it separating from the page content
- theme-rxd selector visible — confirms this is the in-progress/Start state