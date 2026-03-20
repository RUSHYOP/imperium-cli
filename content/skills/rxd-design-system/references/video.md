# Video

Video player component with controls, thumbnail preview, and title bar.

## When to Use
- Embedded video content
- Media libraries and galleries
- Tutorial or onboarding videos

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Type | Video Player-Playing, Thumbnail, Video Player-Paused | Thumbnail |

## Sub-components
- **Play-Bar** — playback controls
- **Title Bar** — video title overlay

- Video Set ID: `25578:953`

## Visual Variants (from Storybook)

- **DataVisualizationVideo / playground**: Full-width video player rendered with a cinematic nature video (waterfall/forest scene) as the background. Overlaid elements:
  - **Title bar** (top-left): Small avatar/icon circle, bold white "Title" text, and gray "Description" subtitle line
  - **Top-right**: Settings/options icon (gear/cog) in a dark circular button
  - **Center**: Large circular play button (white circle with dark play triangle) — indicates paused/thumbnail state
  - **Bottom bar**: Progress scrubber line showing current timestamp (e.g., "0:00 / 0:18") on the left, volume icon and fullscreen icon on the right
- The video component fills its container width and uses a 16:9 aspect ratio by default
- Thumbnail type shows the poster image with the play button overlay (no controls visible until hover)
- Playing state shows animated playback controls
- The component is dark-themed with white overlay controls on the video content