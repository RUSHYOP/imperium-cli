# Skeleton Animation

Placeholder loading animation that mimics content layout while data is being fetched.

## When to Use
- Initial page load placeholders
- Content areas waiting for async data
- Improving perceived performance

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Property 1 | Default, Variant2, Variant3, Variant4 | Default |

## Do not use when
- Content structure is unknown — use **Loader** (spinner)
- No data will ever appear (empty result) — use **Empty States**
- Progress percentage is deterministic — use **ProgressBar**

## Notes
- Place skeleton shapes matching the expected content layout for best UX