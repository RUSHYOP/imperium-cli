# File Viewer (ElementFileviewer)

Embedded document viewer for displaying file contents inline within a page. Renders different file types (PDF, XLSX, CSV, DOCX, TXT, HTML) inside a contained viewer panel with a toolbar.

## When to Use
- Inline document preview without opening a separate app
- Showing report outputs, attachments, or generated files
- Allowing users to read/search documents in-context
- Displaying data exports (CSV, XLSX) or formatted reports (PDF, DOCX)

## Do Not Use When
- You need file upload → use Attachments or ImageAttach
- You need to edit the file → use an appropriate editor component
- The file is an image → use Image component

## Supported File Types

| Type | Icon Color | Notes |
|------|-----------|-------|
| PDF | Red (`#CC0000` badge) | Search, download, print toolbar |
| XLSX | Green (spreadsheet icon) | Search, download, print toolbar |
| CSV | Green (CSV badge) | Search, download, print toolbar |
| DOCX | Blue (DOCX badge) | Search, download, print toolbar |
| TXT | Blue-gray (TXT badge) | Renders plain text with monospace font |
| HTML | Blue (HTML badge) | Renders the HTML document inline |

## Properties

| Property | Options | Default |
|----------|---------|---------|
| fileUrl / src | URL or path to the file | — |
| fileType | pdf, xlsx, csv, docx, txt, html | auto-detected |
| showToolbar | true / false | true |

## Toolbar

Every file type shows a consistent top toolbar with:
- **File type badge** (top-left): Colored icon + file extension label + dropdown chevron (for switching files or type)
- **Search bar** (center): Full-width text input with search icon — searches content within the document
- **Download button** (top-right): Arrow-down icon — downloads the file
- **Print button** (top-right): Printer icon — opens print dialog

## Visual Variants (from Storybook)

- **pdf-viewer**: Toolbar shows red PDF badge. Document renders in the content area below. Search bar centered. Download and print icons top-right.
- **xlsx-viewer**: Toolbar shows green spreadsheet icon + "XLSX" label with dropdown chevron. Same toolbar layout (search, download, print).
- **csv-viewer**: Toolbar shows green CSV badge. Same toolbar pattern.
- **docx-viewer**: Toolbar shows blue DOCX badge. Document content area below.
- **txt-viewer**: Toolbar shows TXT badge. Content renders as raw monospace text — plain text file displayed verbatim with line breaks preserved. No formatting.
- **html-viewer**: Toolbar shows blue HTML badge. Content renders the actual HTML — shows formatted headings, bold text, etc. Example showed "HTML Document Example" as an H1 with paragraph body text rendered in the viewer.

## Notes
- The viewer fills its container width — typically used in a full-width column or panel
- The content area below the toolbar renders the file inline (not as an external link)
- TXT files preserve whitespace and use a monospace font
- HTML files render live HTML — be cautious with untrusted HTML content
- The toolbar is consistent across all file types; only the badge/icon changes
- Component is identified as `NbReportViewer` in the platform component library
