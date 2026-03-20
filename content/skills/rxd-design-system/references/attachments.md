# Attachments

File upload and attachment display component. Lets users upload files and view attached documents or media.

## When to Use
- File upload areas in forms
- Displaying lists of attached files with metadata
- Drag-and-drop upload zones

## Properties

| Property | Options | Default |
|----------|---------|---------|
| Device | Desktop | Desktop |
| Type | Upload, View Attachments | Upload |
| Upload Status | Default, Drag and Drop, Only Cards, URL First | Default |

## Sub-components
- **Attachment-Card** — individual file card showing name, size, and status
- **File Upload** — upload input area with drag-and-drop support

- File Upload Set ID: `29346:210750`

## Visual Variants (from Storybook)

### Story: Default (Upload)
- Large dashed-border drop zone area with a light blue background
- Upload icon (cloud with arrow) centered at the top of the drop zone
- Primary call-to-action: "Click to Upload" (in blue link style) followed by "or drag or drop"
- Sub-text below: "SVG, PNG, JPG, GIF or PDF (Maximum File Size 5 MB)"
- Divider "OR" below the drop zone
- Second input method: label "IMPORT URL *" (required, red asterisk) with a text field showing placeholder "Add File URL"
- Import URL field has a cloud/download icon on the right

### Visual Observations
- Two upload methods are offered simultaneously: drag-and-drop zone and URL import
- The drop zone uses a light blue tinted background with a dashed border to signal interactivity
- Accepted file types are stated explicitly: SVG, PNG, JPG, GIF, PDF
- File size limit of 5 MB is shown in the drop zone text
- "OR" separator between methods is centered and visually distinct
- The URL import field is labeled as required with a red asterisk
- The story label reflects the "Default" upload status variant