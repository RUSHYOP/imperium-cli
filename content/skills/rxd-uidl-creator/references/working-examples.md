# Working UIDL Examples

These are complete, tested UIDL files that render correctly in the Swift Runtime.
Use them as templates when building new pages.

## Table of Contents
1. [Minimal Single-Column Page](#minimal-single-column-page)
2. [Two-Column Login Page with Video](#two-column-login-page-with-video) — Special layout (nested containers exception)
3. [Dashboard Page with KPIs and Data Table](#dashboard-page) — **STANDARD flat architecture**
4. [Component Showcase Page](#component-showcase-page) — Card-sectioned catalog of all component variants

---

## Minimal Single-Column Page

The simplest possible UIDL page: one container, one row, one column, one heading.
Use this as a starting skeleton.

```json
[
  {
    "id": "container-main",
    "controlType": "container",
    "containerType": "fluid",
    "styles": "{\"padding\":\"20px\"}",
    "className": "",
    "visibility": true,
    "isDragging": false,
    "selectedComponentId": "",
    "componentDropped": [],
    "index": 0,
    "accept": "Component",
    "dropPosition": { "x": 0, "y": 0 },
    "currentLayout": "DESKTOP",
    "layout": {
      "colLayout": {
        "lg": {}
      }
    },
    "children": [
      {
        "id": "row-main",
        "controlType": "row",
        "styles": {},
        "visibility": true,
        "isDragging": false,
        "selectedComponentId": "",
        "componentDropped": [],
        "index": 0,
        "accept": "Component",
        "dropPosition": { "x": 0, "y": 0 },
        "currentLayout": "DESKTOP",
        "layout": {
          "colLayout": {
            "lg": {}
          }
        },
        "children": [
          {
            "id": "col-main",
            "controlType": "column",
            "styles": {},
            "visibility": true,
            "isDragging": false,
            "selectedComponentId": "",
            "componentDropped": [],
            "index": 0,
            "accept": "Component",
            "dropPosition": { "x": 0, "y": 0 },
            "currentLayout": "DESKTOP",
            "layout": {
              "colLayout": {
                "lg": { "col": 12 },
                "md": { "col": 12 },
                "sm": { "col": 12 }
              }
            },
            "children": [
              {
                "id": "heading-title",
                "controlType": "heading",
                "visibility": true,
                "isDragging": false,
                "selectedComponentId": "",
                "componentDropped": [],
                "index": 0,
                "accept": "Component",
                "dropPosition": { "x": 0, "y": 0 },
                "content": "Hello World",
                "tag": "h1",
                "weight": "bold",
                "color": "#333333",
                "layout": {
                  "colLayout": {
                    "lg": { "col": 12 },
                    "md": { "col": 12 },
                    "sm": { "col": 12 }
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
]
```

**Key observations:**
- Root is an array `[...]`
- Every node has the designer fields (`isDragging`, `selectedComponentId`, `componentDropped`, `index`, `accept`, `dropPosition`)
- `visibility: true` on every node
- Container/row/column have `currentLayout: "DESKTOP"` (leaf components don't need it)
- Container `styles` is a JSON string; row `styles` is an empty object `{}`
- `layout.colLayout` is present on every node

---

## Two-Column Login Page with Video

A fullscreen two-column layout: video on the left, login form on the right.
This is a complete, production-tested example (772 lines).

### Visual Layout
```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│    Dark Background   │    [Sign In]          │
│    with Video        │    Welcome back!      │
│    Player            │                      │
│                      │    [Email________]    │
│                      │    [Password_____]    │
│                      │    ☐ Remember  Forgot?│
│                      │    [  Sign In  ]      │
│                      │    ─────────────      │
│                      │    No account? Create │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

### Structure Breakdown
```
container-outer (fluid, 100vh, p-0, overflow hidden)
 └── row-main (no-gutters h-100, alignItems: stretch)
      ├── col-video (col-6, h-100 p-0)
      │    └── container-video-card (fluid, dark bg, 100% height, flex center)
      │         └── row-video → col-video-inner (wd-100)
      │              └── video-player (YOUTUBE, LANDSCAPE)
      │
      └── col-login (col-6, h-100, flex center)
           └── container-login-card (fluid, white bg, maxWidth 500px, padding 60px 80px)
                ├── row-title → heading-signin (h3) + para-subtitle
                ├── row-email → textbox-email (outlined, enableInheritWidth)
                ├── row-password → textbox-password (outlined, enableInheritWidth)
                ├── row-options → checkbox-remember + link-forgot (Hyperlink)
                ├── row-signin → btn-signin (contained, primary, wd-100)
                ├── row-divider → sep-divider (horizontal)
                └── row-footer → para-noaccount + btn-create (text variant)
```

### Critical Design Decisions Explained

**1. Fullscreen height via `lg.height`, not styles:**
```json
"layout": { "colLayout": { "lg": { "height": "100vh" } } }
```
The container wrapper always does `{ ...JSON.parse(styles), height: lg.height }`.
If you put `"height":"100vh"` in the styles string, the wrapper overwrites it with
an empty string from `lg.height`. So height MUST go in `layout.colLayout.lg.height`.

**2. Removing gutters for edge-to-edge:**
The row uses `className: "no-gutters h-100"` which removes the 15px padding from
child columns and the -15px margin from the row itself.

**3. Video column (dark background trick):**
The video player calculates its height from aspect ratio, so it won't fill 100% height.
The workaround: wrap it in a dark-background container with `display: flex; alignItems: center;
justifyContent: center` and set the container height to `100%` via `lg.height: "100%"`.

**4. Login form centering:**
The login column uses `className: "h-100 d-flex align-items-center justify-content-center"`
to vertically and horizontally center its child container. This is valid because the column's
direct child is a nested container, not a Row. The inner container has
`maxWidth: 500px` to constrain form width.

**5. Textbox full-width:**
Textboxes need `enableInheritWidth: true` AND `className: "wd-100"` to fill
their container width. Without `enableInheritWidth`, textboxes render at a fixed width.

**6. Checkbox with inline label:**
```json
"hideCaption": true,    // hides the top caption
"title": "Remember me", // the inline label text
"hideTitle": false       // shows the inline label
```

**7. Row spacing:**
Each form row uses `margin: "mb-two-s"` for consistent spacing. The title row uses
`margin: "mb-three-s"` for extra space below the heading.

**8. Container padding without `p-0` conflict:**
The login container uses `className: ""` (not `p-0`) because Bootstrap's `p-0`
uses `!important` and would override the custom `padding: 60px 80px` in styles.

### Full JSON

```json
[
  {
    "id": "container-outer",
    "controlType": "container",
    "containerType": "fluid",
    "styles": "{\"padding\":\"0px\",\"margin\":\"0px\",\"overflow\":\"hidden\"}",
    "className": "p-0",
    "visibility": true,
    "isDragging": false,
    "selectedComponentId": "",
    "componentDropped": [],
    "index": 0,
    "accept": "Component",
    "dropPosition": { "x": 0, "y": 0 },
    "currentLayout": "DESKTOP",
    "layout": {
      "colLayout": {
        "lg": { "height": "100vh" }
      }
    },
    "children": [
      {
        "id": "row-main",
        "controlType": "row",
        "styles": {},
        "className": "no-gutters h-100",
        "visibility": true,
        "isDragging": false,
        "selectedComponentId": "",
        "componentDropped": [],
        "index": 0,
        "accept": "Component",
        "dropPosition": { "x": 0, "y": 0 },
        "currentLayout": "DESKTOP",
        "layout": {
          "colLayout": {
            "lg": {
              "alignItems": "stretch"
            }
          }
        },
        "children": [
          {
            "id": "col-video",
            "controlType": "column",
            "styles": {},
            "visibility": true,
            "isDragging": false,
            "selectedComponentId": "",
            "componentDropped": [],
            "index": 0,
            "accept": "Component",
            "dropPosition": { "x": 0, "y": 0 },
            "currentLayout": "DESKTOP",
            "className": "h-100 p-0",
            "layout": {
              "colLayout": {
                "lg": { "col": 6 },
                "md": { "col": 6 },
                "sm": { "col": 12 }
              }
            },
            "children": [
              {
                "id": "container-video-card",
                "controlType": "container",
                "containerType": "fluid",
                "styles": "{\"backgroundColor\":\"#1a1a2e\",\"padding\":\"0px\",\"overflow\":\"hidden\",\"width\":\"100%\",\"display\":\"flex\",\"alignItems\":\"center\",\"justifyContent\":\"center\"}",
                "className": "p-0",
                "visibility": true,
                "isDragging": false,
                "selectedComponentId": "",
                "componentDropped": [],
                "index": 0,
                "accept": "Component",
                "dropPosition": { "x": 0, "y": 0 },
                "currentLayout": "DESKTOP",
                "layout": {
                  "colLayout": {
                    "lg": { "height": "100%" }
                  }
                },
                "children": [
                  {
                    "id": "row-video",
                    "controlType": "row",
                    "styles": {},
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 0,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {
                          "alignItems": "center",
                          "justifyContent": "center"
                        }
                      }
                    },
                    "children": [
                      {
                        "id": "col-video-inner",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "className": "wd-100",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "video-player",
                            "controlType": "video",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "videoSource": "YOUTUBE",
                            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "enableAutoPlay": false,
                            "enableFullScreen": true,
                            "orientation": "LANDSCAPE",
                            "caption": "",
                            "hideCaption": true,
                            "minVideoWidth": 600,
                            "minVideoHeight": 500,
                            "className": "wd-100",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "col-login",
            "controlType": "column",
            "styles": {},
            "visibility": true,
            "isDragging": false,
            "selectedComponentId": "",
            "componentDropped": [],
            "index": 1,
            "accept": "Component",
            "dropPosition": { "x": 0, "y": 0 },
            "currentLayout": "DESKTOP",
            "className": "h-100 d-flex align-items-center justify-content-center",
            "layout": {
              "colLayout": {
                "lg": { "col": 6 },
                "md": { "col": 6 },
                "sm": { "col": 12 }
              }
            },
            "children": [
              {
                "id": "container-login-card",
                "controlType": "container",
                "containerType": "fluid",
                "styles": "{\"backgroundColor\":\"#ffffff\",\"padding\":\"60px 80px\",\"width\":\"100%\",\"maxWidth\":\"500px\",\"display\":\"flex\",\"flexDirection\":\"column\",\"justifyContent\":\"center\"}",
                "className": "",
                "visibility": true,
                "isDragging": false,
                "selectedComponentId": "",
                "componentDropped": [],
                "index": 0,
                "accept": "Component",
                "dropPosition": { "x": 0, "y": 0 },
                "currentLayout": "DESKTOP",
                "layout": {
                  "colLayout": {
                    "lg": {}
                  }
                },
                "children": [
                  {
                    "id": "row-title",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-three-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 0,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {
                          "alignItems": "center",
                          "justifyContent": "center"
                        }
                      }
                    },
                    "children": [
                      {
                        "id": "col-title",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "className": "text-center",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "heading-signin",
                            "controlType": "heading",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "content": "Sign In",
                            "tag": "h3",
                            "weight": "bold",
                            "color": "#333333",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          },
                          {
                            "id": "para-subtitle",
                            "controlType": "paragraph",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 1,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "content": "Welcome back! Please enter your details.",
                            "color": "#888888",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-email",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-two-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 1,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {}
                      }
                    },
                    "children": [
                      {
                        "id": "col-email",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "textbox-email",
                            "controlType": "textbox",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "caption": "Email",
                            "value": "",
                            "placeholder": "Enter your email",
                            "variant": "outlined",
                            "size": "medium",
                            "inputFieldType": "email",
                            "enableInheritWidth": true,
                            "className": "wd-100",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-password",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-two-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 2,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {}
                      }
                    },
                    "children": [
                      {
                        "id": "col-password",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "textbox-password",
                            "controlType": "textbox",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "caption": "Password",
                            "value": "",
                            "placeholder": "Enter your password",
                            "variant": "outlined",
                            "size": "medium",
                            "inputFieldType": "password",
                            "enableInheritWidth": true,
                            "className": "wd-100",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-options",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-two-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 3,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {
                          "alignItems": "center",
                          "justifyContent": "between"
                        }
                      }
                    },
                    "children": [
                      {
                        "id": "col-remember",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 6 },
                            "md": { "col": 6 },
                            "sm": { "col": 6 }
                          }
                        },
                        "children": [
                          {
                            "id": "checkbox-remember",
                            "controlType": "checkbox",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "caption": "Remember me",
                            "hideCaption": true,
                            "title": "Remember me",
                            "hideTitle": false,
                            "checked": false,
                            "name": "rememberMe",
                            "size": "large",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      },
                      {
                        "id": "col-forgot",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 1,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "className": "text-right",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 6 },
                            "md": { "col": 6 },
                            "sm": { "col": 6 }
                          }
                        },
                        "children": [
                          {
                            "id": "link-forgot",
                            "controlType": "Hyperlink",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "content": "Forgot password?",
                            "url": "#",
                            "variant": "default",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-signin",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-two-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 4,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {}
                      }
                    },
                    "children": [
                      {
                        "id": "col-signin",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "btn-signin",
                            "controlType": "button",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "caption": "Sign In",
                            "variant": "contained",
                            "color": "primary",
                            "size": "medium",
                            "className": "wd-100",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-divider",
                    "controlType": "row",
                    "styles": {},
                    "margin": "mb-two-s",
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 5,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {}
                      }
                    },
                    "children": [
                      {
                        "id": "col-divider",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "sep-divider",
                            "controlType": "separator",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "orientation": "horizontal",
                            "color": "#e0e0e0",
                            "weight": "thin",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": "row-footer",
                    "controlType": "row",
                    "styles": {},
                    "visibility": true,
                    "isDragging": false,
                    "selectedComponentId": "",
                    "componentDropped": [],
                    "index": 6,
                    "accept": "Component",
                    "dropPosition": { "x": 0, "y": 0 },
                    "currentLayout": "DESKTOP",
                    "layout": {
                      "colLayout": {
                        "lg": {
                          "alignItems": "center",
                          "justifyContent": "center"
                        }
                      }
                    },
                    "children": [
                      {
                        "id": "col-footer",
                        "controlType": "column",
                        "styles": {},
                        "visibility": true,
                        "isDragging": false,
                        "selectedComponentId": "",
                        "componentDropped": [],
                        "index": 0,
                        "accept": "Component",
                        "dropPosition": { "x": 0, "y": 0 },
                        "currentLayout": "DESKTOP",
                        "className": "d-flex flex-row align-items-center justify-content-center",
                        "layout": {
                          "colLayout": {
                            "lg": { "col": 12 },
                            "md": { "col": 12 },
                            "sm": { "col": 12 }
                          }
                        },
                        "children": [
                          {
                            "id": "para-noaccount",
                            "controlType": "paragraph",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 0,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "content": "Don't have an account?",
                            "color": "#888888",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          },
                          {
                            "id": "btn-create",
                            "controlType": "button",
                            "visibility": true,
                            "isDragging": false,
                            "selectedComponentId": "",
                            "componentDropped": [],
                            "index": 1,
                            "accept": "Component",
                            "dropPosition": { "x": 0, "y": 0 },
                            "caption": "Create Account",
                            "variant": "text",
                            "color": "primary",
                            "size": "medium",
                            "layout": {
                              "colLayout": {
                                "lg": { "col": 12 },
                                "md": { "col": 12 },
                                "sm": { "col": 12 }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
```

---

## Dashboard Page with KPIs and Data Table {#dashboard-page}

A standard dashboard page using the **FLAT architecture** — ONE container-fluid with all rows at the same level. No nested containers. This is the DEFAULT pattern for most pages.

### Visual Layout
```
┌──────────────────────────────────────────────────────────────┐
│  Buyer Hub                              [To Do] [Analytics]  │
│  Monitor, manage, and act on purchase transactions           │
├──────────────────────────────────────────────────────────────┤
│  PRs Awaiting │ POs Pending │ Overdue POs │ GRNs   │ ...    │
│  3            │ 12          │ 5           │ 28     │ ...    │
├──────────────────────────────────────────────────────────────┤
│  Purchase Records                [Download] [⚙] [⋮]         │
│  All your purchase records...                                │
├──────────────────────────────────────────────────────────────┤
│  [🔍 Search records...]                                      │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  PR Number │ PR Date   │ Vendor    │ Status  │ Amount  │ │
│  │  PR-001    │ 01/15/25  │ Acme Corp │ Open    │ $5,200  │ │
│  │  PR-002    │ 01/16/25  │ Beta LLC  │ Pending │ $3,100  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Structure Breakdown (FLAT — no nested containers)
```
container-fluid (buyer-hub-page)
  ├── row-header (mb-three-s) → col(6)+col(6)
  │    ├── heading + paragraph
  │    └── buttons (outlined, right-aligned)
  ├── row-stats (mb-two-s) → 6×col(2)
  │    └── display components DIRECTLY in columns (no wrapper containers)
  ├── row-records-header (mb-two-s) → col(6)+col(6)
  │    ├── heading + paragraph
  │    └── button + actionIcons (with REQUIRED badge configs)
  ├── row-search (mb-two-s) → col(4)
  │    └── search component
  └── row-table → col(12)
       └── listview (with fieldDefs, toolSettings, rowSettings, noDataScreen)
```

### Key Design Decisions

**1. Flat architecture — NO nested containers:**
Every row sits directly inside the single container-fluid. Display KPI components go directly into `col-2` columns — no wrapper container with borderRadius/boxShadow needed. The display component SCSS handles its own visual appearance.

**2. Container styles are minimal:**
```json
"styles": "{\"backgroundColor\":\"\"}"
```
No random `borderRadius`, `boxShadow`, `border`, or `padding` on inner elements.

**3. actionIcon MUST have badge configs:**
Without `badgeFieldProps`, `badgeCountConfig`, and `badgeIconConfig`, the runtime crashes with `TypeError: Cannot read properties of undefined (reading 'margin')`.

**4. display component needs ALL defaults:**
```json
"type": "default", "size": "medium", "alignment": "left", "displayPriority": "top",
"disabled": false, "hideTitle": false, "hideValue": false, "overflow": false,
"icon": false, "skipPreferences": false
```

**5. listview needs sub-objects:**
`toolSettings`, `rowSettings`, and `noDataScreen` must be present.

### Condensed Structure JSON (key nodes only — omitting designer fields for brevity)

```json
[
  {
    "id": "buyer-hub-page",
    "controlType": "container",
    "containerType": "fluid",
    "styles": "{\"backgroundColor\":\"\"}",
    "className": "",
    "layout": { "colLayout": { "lg": {} } },
    "children": [
      {
        "id": "row-header",
        "controlType": "row",
        "styles": {},
        "margin": "mb-three-s",
        "layout": { "colLayout": { "lg": { "alignItems": "center", "justifyContent": "between" } } },
        "children": [
          {
            "id": "col-header-left", "controlType": "column",
            "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } },
            "children": [
              { "id": "heading-title", "controlType": "heading", "content": "Buyer Hub", "tag": "h2", "color": "#182858", "className": "mb-1" },
              { "id": "para-subtitle", "controlType": "paragraph", "content": "Monitor, manage, and act on purchase transactions", "color": "#667085" }
            ]
          },
          {
            "id": "col-header-right", "controlType": "column",
            "className": "d-flex justify-content-end",
            "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } },
            "children": [
              { "id": "btn-todo", "controlType": "button", "caption": "To Do", "variant": "outlined", "color": "secondary", "size": "small", "className": "mr-2" },
              { "id": "btn-analytics", "controlType": "button", "caption": "Analytics", "variant": "outlined", "color": "secondary", "size": "small" }
            ]
          }
        ]
      },
      {
        "id": "row-stats",
        "controlType": "row",
        "styles": {},
        "margin": "mb-two-s",
        "layout": { "colLayout": { "lg": {} } },
        "children": [
          {
            "id": "col-s1", "controlType": "column",
            "layout": { "colLayout": { "lg": { "col": 2 }, "md": { "col": 4 }, "sm": { "col": 6 } } },
            "children": [
              {
                "id": "display-s1", "controlType": "display",
                "displayTitle": "PRs Awaiting Conversion", "displayValue": "3",
                "titleColor": "#667085", "valueColor": "#182858",
                "type": "default", "size": "medium", "alignment": "left", "displayPriority": "top",
                "disabled": false, "hideTitle": false, "hideValue": false, "overflow": false, "icon": false, "skipPreferences": false
              }
            ]
          }
        ]
      },
      {
        "id": "row-records-header",
        "controlType": "row",
        "styles": {},
        "margin": "mb-two-s",
        "layout": { "colLayout": { "lg": { "alignItems": "center", "justifyContent": "between" } } },
        "children": [
          {
            "id": "col-rh-left", "controlType": "column",
            "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } },
            "children": [
              { "id": "heading-records", "controlType": "heading", "content": "Purchase Records", "tag": "h4", "color": "#182858", "className": "mb-1" }
            ]
          },
          {
            "id": "col-rh-right", "controlType": "column",
            "className": "d-flex justify-content-end align-items-center",
            "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } },
            "children": [
              {
                "id": "ai-filter", "controlType": "actionIcon",
                "Icon": "FilterFilled", "size": "medium", "variant": "default",
                "disabled": false, "showDotBadge": false, "showBorder": false,
                "badgeFieldProps": { "controlType": "badge", "size": "xsmall", "color": "success" },
                "badgeCountConfig": { "controlType": "badge", "size": "xsmall", "color": "success", "content": "", "borderType": "without-border", "customColor": false, "count": true },
                "badgeIconConfig": { "controlType": "badge", "size": "xsmall", "badgeType": "icononly", "iconOnly": "AddfileFilled", "borderType": "without-border", "visibility": true, "customColor": false }
              }
            ]
          }
        ]
      },
      {
        "id": "row-search",
        "controlType": "row",
        "styles": {},
        "margin": "mb-two-s",
        "layout": { "colLayout": { "lg": {} } },
        "children": [
          {
            "id": "col-search", "controlType": "column",
            "layout": { "colLayout": { "lg": { "col": 4 }, "md": { "col": 6 }, "sm": { "col": 12 } } },
            "children": [
              {
                "id": "search-records", "controlType": "search",
                "searchType": "basic", "size": "md", "caption": "Search",
                "hideCaption": false, "enableRecentSearch": true,
                "favouriteData": "[]", "popupHeight": "", "enableDynamicWidth": false
              }
            ]
          }
        ]
      },
      {
        "id": "row-table",
        "controlType": "row",
        "styles": {},
        "margin": "",
        "layout": { "colLayout": { "lg": {} } },
        "children": [
          {
            "id": "col-table", "controlType": "column",
            "layout": { "colLayout": { "lg": { "col": 12 }, "md": { "col": 12 }, "sm": { "col": 12 } } },
            "children": [
              {
                "id": "lv-records", "controlType": "listview",
                "fieldDefs": [
                  { "fieldName": "prNumber", "caption": "PR Number", "dataType": "text", "width": "140px" },
                  { "fieldName": "prDate", "caption": "PR Date", "dataType": "text", "width": "120px" },
                  { "fieldName": "vendor", "caption": "Vendor", "dataType": "text", "width": "200px" },
                  { "fieldName": "status", "caption": "Status", "dataType": "text", "width": "120px" },
                  { "fieldName": "amount", "caption": "Amount", "dataType": "text", "width": "120px" }
                ],
                "uniqueKeyId": "prNumber",
                "mode": "normal",
                "canShowToolbar": true,
                "canShowHeader": true,
                "listViewHeight": "400px",
                "showCheckbox": false,
                "toolSettings": { "search": { "enable": true }, "settingsConfig": { "columnSwitch": { "enable": true }, "density": { "enable": true } } },
                "rowSettings": { "viewFullRow": false, "enableEditRow": false, "enableContextMenu": false, "enableDeleteRow": false },
                "noDataScreen": { "enableNoDataScreen": true, "text": "No records found", "subText": "Try adjusting your filters.", "imageSrc": "" }
              }
            ]
          }
        ]
      }
    ]
  }
]
```

**NOTE:** The above JSON is condensed for readability. In production, every node must also include the designer fields: `visibility`, `isDragging`, `selectedComponentId`, `componentDropped`, `index`, `accept`, `dropPosition`, and `currentLayout` (on containers/rows/columns). See the full working file at `samples/06-buyer-hub.json`.

---

### Key Differences from Login Page Example

| Aspect | Login Page | Dashboard Page |
|--------|-----------|---------------|
| Architecture | Nested containers (special) | Flat — single container-fluid |
| Inner containers | Dark video panel + white form card | None — all rows at top level |
| Container styles | Heavy (bg, padding, maxWidth, flex) | Minimal (backgroundColor only) |
| Height | 100vh fullscreen | Auto (scrollable) |
| Components | textbox, checkbox, Hyperlink | display, search, listview, actionIcon |
| When to use | Fullscreen split layouts only | **Standard — use for most pages** |

---

## Component Showcase Page

A comprehensive catalog page showing all component variants, colors, sizes, and states. Uses the flat architecture with `card` components (header/footer hidden) as section wrappers.

### Visual Layout
```
┌─────────────────────────────────────────────┐
│  Component Showcase                         │
│  All available components with variants...  │
├─────────────────────────────────────────────┤
│  Buttons                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ Contained Variant                       │ │
│ │ [Primary] [Secondary] [Success] [Error] │ │
│ │ Outlined Variant                        │ │
│ │ [Primary] [Secondary] [Success] [Error] │ │
│ │ Text Variant / Sizes / Disabled         │ │
│ └─────────────────────────────────────────┘ │
│  Text Inputs                                │
│ ┌─────────────────────────────────────────┐ │
│ │ [Standard] [Outlined] [Filled]          │ │
│ │ [Dropdown] [Numeric]  [DatePicker]      │ │
│ └─────────────────────────────────────────┘ │
│  Selection Controls / Display / Typography  │
│  Actions & Progress                         │
└─────────────────────────────────────────────┘
```

### Structure Breakdown
```
container-fluid (showcase-page, minimal styles)
  ├── row-page-title → col → heading(h2) + paragraph
  ├── row-hd-buttons → col → heading(h4) "Buttons"
  ├── row-cd-buttons → col → card(enableHeader:false, enableFooter:false)
  │    └── body → container → sub-label rows + button rows (d-flex flex-wrap)
  ├── row-hd-inputs → col → heading(h4) "Text Inputs"
  ├── row-cd-inputs → col → card → body → container → variant/size/type rows
  ├── row-hd-selection → col → heading(h4) "Selection Controls"
  ├── row-cd-selection → col → card → body → checkbox/switch/radiogroup rows
  ├── row-hd-display → col → heading(h4) "Display & Status"
  ├── row-cd-display → col → card → body → display/badge/avatar/separator rows
  ├── row-hd-typography → col → heading(h4) "Typography"
  ├── row-cd-typography → col → card → body → h1-h6/weights/paragraphs rows
  ├── row-hd-actions → col → heading(h4) "Actions & Progress"
  └── row-cd-actions → col → card → body → actionIcon/rating/slider/circularProgress rows
```

### Key Design Decisions

**1. Card as section wrapper:**
```json
{
  "controlType": "card",
  "enableHeader": false,
  "enableFooter": false,
  "enableBody": true,
  "type": "with-border",
  "size": "large",
  "hideCaption": true,
  "EnableCardBorder": true,
  "EnableCardShadow": false,
  "children": { "header": [], "body": [ /* container → rows → cols → leaves */ ], "footer": [] }
}
```

**2. Multiple components side-by-side in one column:**
Use `d-flex flex-wrap` on column, `mr-two-s mb-two-s` on each leaf:
```json
{
  "controlType": "column",
  "className": "d-flex flex-wrap align-items-center",
  "children": [
    { "controlType": "button", "caption": "Primary", "color": "primary", "className": "mr-two-s mb-two-s" },
    { "controlType": "button", "caption": "Success", "color": "success", "className": "mr-two-s mb-two-s" }
  ]
}
```

**3. Sub-labels within card body:**
Use `heading` with `tag: "h6"` and neutral-700 color for variant group labels within a section.

**4. No custom CSS:**
All visual appearance comes from component props (variant, color, size, type) and Bootstrap utility classes. Zero inline styles on containers beyond minimal `backgroundColor`.

**5. Python generator for large pages:**
The 7985-line JSON was generated via `samples/gen_showcase.py` with helper functions for each component type. This avoids manual JSON errors when building 200+ node pages.

### Stats
- **7985 lines**, **254 nodes**, **22 component types**
- 6 sections: Buttons, Text Inputs, Selection Controls, Display & Status, Typography, Actions & Progress
- Components showcased: button, textbox, dropdown, numeric, datePicker, checkbox, switch, radiogroup, display, badge, avatar, separator, heading, paragraph, actionIcon, rating, slider, circularProgress, card

**Full file:** `samples/07-component-showcase.json`
**Generator script:** `samples/gen_showcase.py`
