# Designer Save / Import Contract

This reference captures the three shapes now in play. Use the right one for the right job.

## 1. Local Authoring File

This is the default artifact under `/Users/admin/Codes/uidl/projects/*.json`.

```json
[
  {
    "id": "container-page",
    "controlType": "container",
    "containerType": "fluid",
    "children": []
  }
]
```

- This is a **bare metadata array**
- It does **not** include `pageId`
- It is the default file shape for MCP create/save/edit operations

## 2. Designer Import / Export Bundle

This is the wrapped bundle used by Nebula Designer import/export flows.

```json
{
  "pageId": "page-id-from-server",
  "metadata": [ ... ],
  "dataQueries": [],
  "transforms": [],
  "queryEvents": [],
  "retainQueryName": false,
  "retainComponentId": true
}
```

- `pageId` is required when you want a Designer-importable bundle
- `metadata` is still the same canonical UIDL array
- `dataQueries`, `transforms`, and `queryEvents` are passthrough fields in v1 authoring

## 3. API Save Payload

This is the payload shape sent to the page metadata API.

```json
{
  "pageId": "page-id-from-server",
  "metadata": "{\"pageInfo\":{},\"metadata\":[...],\"queryEvents\":[]}"
}
```

- `metadata` is a JSON string, not a nested object
- The stringified object is built from `constructMetadata(metadata, pageInfo, queryEvents)`

## Practical Rule

- Author locally as a bare metadata array
- Export to a wrapped bundle only for Designer import/export
- Export to the API save payload only when calling page metadata APIs
