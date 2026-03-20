# OrgChart

Hierarchical organisation chart showing reporting relationships with expandable nodes.

## When to Use
- Organisational structure visualisation
- Team hierarchy browsing
- Reporting-line exploration

## Properties

| Property | Options | Default |
|----------|---------|---------|
| State | Collapsed, Expanded-3 Column, Expanded-2 Column, Expanded-1 Column | Collapsed |

## Sub-components
- **Org_Chart_Cards** — individual person/role card
- **Org_Chart_Connectors** — lines connecting cards

## Notes
- Multiple expansion levels control how many columns of reports are visible

## Visual Variants (from Storybook)

### Default / RXDS styled (default.png)
- Full hierarchical tree on a white gridded background
- Cards use a muted red/salmon fill with white text
- Root node "Lao Lao" (general manager) at top center
- Second level: "Bo Miao", "Su Miao", "Hong Miao", "Chun Miao" (all department managers)
- Third level under Su Miao: "Tie Hua", "Hei Hei", "Pang Pang", "Yue Yue" (senior engineers)
- Fourth level under Hei Hei: "Dan Dan", "Xiang Xiang" (engineers)
- Connections use thin lines (not arrows) between levels
- Avatars/person icons shown in the header portion of select cards

### Custom org chart (custom-org-chart.png)
- White background, no grid
- Cards use white fill with rounded corners and subtle border — clean/modern style
- Vertical chain layout: Jane Smith (CEO) > John Doe (CTO) > Sarah Tech (VP of Technology) > Emily Cloud (Cloud Architect)
- At the bottom, a highlighted blue-bordered section shows sub-reports: Alex Solutions (avatar circle) and Priya Security (photo avatar)
- Person photos/avatars shown in the custom card style
- Two text lines per card: Name (bold), Title, Department in gray text