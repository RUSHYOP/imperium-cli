# RXDS Color System

> **Source:** [Figma — Colors page](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=1-2)

---

## Guidelines

### Purpose of Color

Colors affect how a design looks and feels, elicit emotion, and reflect brand personality. Good colors attract and convert users; bad colors turn users away and create accessibility issues.

### Choosing the Palette

A palette should contain **neutral**, **primary**, and **accent** colors — plus **feedback** colors (success, warning, error) if forms are essential.

| Category | Role | Key shades |
|----------|------|------------|
| **Neutral** | Text, form fields, backgrounds, dividers | Gray 25–900 |
| **Primary** | Interactive elements — buttons, links, inputs | Primary 25–900 |
| **Accent / Secondary** | Supporting / attention-grabbing (labels, badges) | Blue, Indigo, Pink, etc. |
| **Feedback** | Semantic states — success, warning, error | Success, Warning, Error |

### Best Practices

- Every colour has specific meaning guidelines — honour them for consistency.
- Combining Light and Dark shades of the same colour is safe — dark-shade text on a light background is readable.
- **No Dark shade should be used as a background.**
- Non-Dark colours have `:active` and `:hover` shades — use only for those states.

### Do's

| Guideline | Explanation |
|-----------|-------------|
| **Primary 500 for primary actions** | Actions stand out when only primary buttons/links use this colour |
| **White for content backgrounds** | Important information appears without interference |
| **White for input backgrounds** | Exception: mobile apps use gray for input backgrounds |
| **Information 25 for page background** | Avoids blinding white; works well with white Cards |
| **Success 500 for success states** | Alert, Badge, Text success type |
| **Warning 500 for warning states** | Alert, Badge, Text warning type — explain what you're warning about |
| **Error 500 for critical / destructive** | Error states, negative info, destructive action buttons |

### Don'ts

| Guideline | Explanation |
|-----------|-------------|
| Don't use product colour to highlight info | Use bigger font sizes / heavier weights instead |
| Don't use product colour for focus states | Focus rings have their own design |
| Don't use product colours for backgrounds | Use Cloud colours or Light shades only |
| Don't use green for "Next" buttons | Reserve success buttons for success alerts only |
| Don't use orange to highlight info | Use other colours if highlighting is essential |

### Accessibility (WCAG 2.1)

| Level | Ratio | Use |
|-------|-------|-----|
| **A** (low) | < 4.5:1 | Not suitable for text. OK for decorations. |
| **AA** (minimum) | ≥ 4.5:1 | **Required** for all crucial UI — text, buttons, forms |
| **AAA** (high) | ≥ 7:1 | Nice-to-have — strive for it where possible |

> Maintain at least **4.5:1** (AA) for all crucial UI elements.
> Tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), Figma plugin "A11y - Color Contrast Checker".

---

## Primary Colors

### Primary

| Shade | Hex |
|-------|-----|
| 25 | `#F5FAFF` |
| 50 | `#EAF4FF` |
| 100 | `#CFE7FF` |
| 200 | `#AFD7FF` |
| 300 | `#70B7FF` |
| 400 | `#1F85F2` |
| **500** | **`#0066CC`** |
| 600 | `#005BB5` |
| 700 | `#004A99` |
| 800 | `#003D82` |
| 900 | `#002F66` |

### Success

| Shade | Hex |
|-------|-----|
| 25 | `#F6FEF9` |
| 50 | `#ECFDF3` |
| 100 | `#D1FADF` |
| 200 | `#A6F4C5` |
| 300 | `#6CE9A6` |
| 400 | `#34C98B` |
| **500** | **`#0E9F63`** |
| 600 | `#067F4F` |
| 700 | `#04633E` |
| 800 | `#034E31` |
| 900 | `#023A26` |

### Warning

| Shade | Hex |
|-------|-----|
| 25 | `#FFFCF5` |
| 50 | `#FFFAEB` |
| 100 | `#FEF0C7` |
| 200 | `#FEDF89` |
| 300 | `#FEC84B` |
| 400 | `#E6A11A` |
| **500** | **`#C76A00`** |
| 600 | `#A35600` |
| 700 | `#7F4200` |
| 800 | `#623200` |
| 900 | `#4A2600` |

### Error

| Shade | Hex |
|-------|-----|
| 25 | `#FFFBFA` |
| 50 | `#FEF3F2` |
| 100 | `#FEE4E2` |
| 200 | `#FECDCA` |
| 300 | `#FDA29B` |
| 400 | `#F26A5B` |
| **500** | **`#D63A2E`** |
| 600 | `#B92B21` |
| 700 | `#8F1F18` |
| 800 | `#6F1712` |
| 900 | `#54110D` |

### Information

| Shade | Hex |
|-------|-----|
| 25 | `#F8F9FC` |
| 50 | `#EBEFF9` |
| 100 | `#D9E0F5` |
| 200 | `#C0CCEE` |
| 300 | `#8EA2E1` |
| 400 | `#5C79D3` |
| **500** | **`#4264CC`** |
| 600 | `#2C49A3` |
| 700 | `#253E8A` |
| 800 | `#1E3371` |
| 900 | `#182858` |

### Gray

| Shade | Hex |
|-------|-----|
| 25 | `#FCFCFD` |
| 50 | `#F9FAFB` |
| 100 | `#F2F4F7` |
| 200 | `#EAECF0` |
| 300 | `#D0D5DD` |
| 400 | `#98A2B3` |
| **500** | **`#667085`** |
| 600 | `#475467` |
| 700 | `#344054` |
| 800 | `#1D2939` |
| 900 | `#101828` |

### Black & White

| Name | Hex |
|------|-----|
| Black | `#000000` |
| White | `#FFFFFF` |

---

## Secondary Colors

### Blue Gray

| Shade | Hex |
|-------|-----|
| 25 | `#FCFCFD` |
| 50 | `#F8F9FC` |
| 100 | `#EAECF5` |
| 200 | `#D5D9EB` |
| 300 | `#AFB5D9` |
| 400 | `#717BBC` |
| **500** | **`#4E5BA6`** |
| 600 | `#3E4784` |
| 700 | `#363F72` |
| 800 | `#293056` |
| 900 | `#101323` |

### Fresh Green

| Shade | Hex |
|-------|-----|
| 25 | `#FCFEF6` |
| 50 | `#F7FCE8` |
| 100 | `#F0F9D5` |
| 200 | `#DBF19D` |
| 300 | `#C3E566` |
| 400 | `#A3D31D` |
| **500** | **`#8EB819`** |
| 600 | `#779A15` |
| 700 | `#617E11` |
| 800 | `#4C620D` |
| 900 | `#36460A` |

### Turquoise

| Shade | Hex |
|-------|-----|
| 25 | `#F2FDFC` |
| 50 | `#E9FBFA` |
| 100 | `#D7F7F4` |
| 200 | `#BDF1ED` |
| 300 | `#88E7DF` |
| 400 | `#53DCD1` |
| **500** | **`#27BFB3`** |
| 600 | `#1E9288` |
| 700 | `#187770` |
| 800 | `#135D57` |
| 900 | `#0E423E` |

### Blue Light

| Shade | Hex |
|-------|-----|
| 25 | `#F5FBFF` |
| 50 | `#F0F9FF` |
| 100 | `#E0F2FE` |
| 200 | `#B9E6FE` |
| 300 | `#7CD4FD` |
| 400 | `#36BFFA` |
| **500** | **`#0BA5EC`** |
| 600 | `#0086C9` |
| 700 | `#026AA2` |
| 800 | `#065986` |
| 900 | `#0B4A6F` |

### Blue

| Shade | Hex |
|-------|-----|
| 25 | `#F5FAFF` |
| 50 | `#EFF8FF` |
| 100 | `#D1E9FF` |
| 200 | `#B2DDFF` |
| 300 | `#84CAFF` |
| 400 | `#53B1FD` |
| **500** | **`#2E90FA`** |
| 600 | `#1570EF` |
| 700 | `#175CD3` |
| 800 | `#1849A9` |
| 900 | `#194185` |

### Royal Blue

| Shade | Hex |
|-------|-----|
| 25 | `#F5F7FF` |
| 50 | `#F0F3FE` |
| 100 | `#D9E3FC` |
| 200 | `#BDCAFA` |
| 300 | `#98ACF7` |
| 400 | `#5D7DF2` |
| **500** | **`#2D57EE`** |
| 600 | `#123EDD` |
| 700 | `#1036C0` |
| 800 | `#0D2EA2` |
| 900 | `#0B2585` |

### Indigo

| Shade | Hex |
|-------|-----|
| 25 | `#F5F8FF` |
| 50 | `#EEF4FF` |
| 100 | `#E0EAFF` |
| 200 | `#C7D7FE` |
| 300 | `#A4BCFD` |
| 400 | `#8098F9` |
| **500** | **`#6172F3`** |
| 600 | `#444CE7` |
| 700 | `#3538CD` |
| 800 | `#2D31A6` |
| 900 | `#2D3282` |

### Purple

| Shade | Hex |
|-------|-----|
| 25 | `#FAFAFF` |
| 50 | `#F4F3FF` |
| 100 | `#EBE9FE` |
| 200 | `#D9D6FE` |
| 300 | `#BDB4FE` |
| 400 | `#9B8AFB` |
| **500** | **`#7A5AF8`** |
| 600 | `#6938EF` |
| 700 | `#5925DC` |
| 800 | `#4A1FB8` |
| 900 | `#3E1C96` |

### Pink

| Shade | Hex |
|-------|-----|
| 25 | `#FEF6FB` |
| 50 | `#FDF2FA` |
| 100 | `#FCE7F6` |
| 200 | `#FCCEEE` |
| 300 | `#FAA7E0` |
| 400 | `#F670C7` |
| **500** | **`#EE46BC`** |
| 600 | `#DD2590` |
| 700 | `#C11574` |
| 800 | `#9E165F` |
| 900 | `#851651` |

### Rose

| Shade | Hex |
|-------|-----|
| 25 | `#FFF5F6` |
| 50 | `#FFF1F3` |
| 100 | `#FFE4E8` |
| 200 | `#FECDD6` |
| 300 | `#FEA3B4` |
| 400 | `#FD6F8E` |
| **500** | **`#F63D68`** |
| 600 | `#E31B54` |
| 700 | `#C01048` |
| 800 | `#A11043` |
| 900 | `#89123E` |

### Orange

| Shade | Hex |
|-------|-----|
| 25 | `#FFFAF5` |
| 50 | `#FFF6ED` |
| 100 | `#FFEAD5` |
| 200 | `#FDDCAB` |
| 300 | `#FEB273` |
| 400 | `#FD853A` |
| **500** | **`#FB6514`** |
| 600 | `#EC4A0A` |
| 700 | `#C4320A` |
| 800 | `#9C2A10` |
| 900 | `#7E2410` |

### Brown

| Shade | Hex |
|-------|-----|
| 25 | `#FDF9F7` |
| 50 | `#F8F0EC` |
| 100 | `#F0E3DE` |
| 200 | `#E7D0C8` |
| 300 | `#D3AA9C` |
| 400 | `#BF846F` |
| **500** | **`#A7624A`** |
| 600 | `#905440` |
| 700 | `#794736` |
| 800 | `#633A2C` |
| 900 | `#4D2D22` |

---

## Quick Reference

| # | Group | 500 (Base) | Category |
|---|-------|-----------|----------|
| 1 | Primary | `#0066CC` | Primary |
| 2 | Success | `#0E9F63` | Primary |
| 3 | Warning | `#C76A00` | Primary |
| 4 | Error | `#D63A2E` | Primary |
| 5 | Information | `#4264CC` | Primary |
| 6 | Gray | `#667085` | Primary |
| 7 | Black & White | `#000000` / `#FFFFFF` | Primary |
| 8 | Blue Gray | `#4E5BA6` | Secondary |
| 9 | Fresh Green | `#8EB819` | Secondary |
| 10 | Turquoise | `#27BFB3` | Secondary |
| 11 | Blue Light | `#0BA5EC` | Secondary |
| 12 | Blue | `#2E90FA` | Secondary |
| 13 | Royal Blue | `#2D57EE` | Secondary |
| 14 | Indigo | `#6172F3` | Secondary |
| 15 | Purple | `#7A5AF8` | Secondary |
| 16 | Pink | `#EE46BC` | Secondary |
| 17 | Rose | `#F63D68` | Secondary |
| 18 | Orange | `#FB6514` | Secondary |
| 19 | Brown | `#A7624A` | Secondary |

**Total: 19 color groups x 11 shades (25–900) + Black & White = 211 unique color values.**

---

## Gradients

Two gradient families — **Primary** and **Gray** — each with 7 presets following the same angle pattern.

### Primary Gradients

| Name | Type | Angle | CSS |
|------|------|-------|-----|
| Primary 600→500 | Conic | 90deg | `conic-gradient(from 90deg, #0073E6 0%, rgba(0,115,230,0) 100%)` |
| Primary 600→500 | Linear | 90deg | `linear-gradient(90deg, #0068CF 0%, #0073E6 100%)` |
| Primary 700→600 | Linear | 45deg | `linear-gradient(45deg, #0058AF 0%, #0068CF 100%)` |
| Primary 800→600 | Linear | 45deg | `linear-gradient(45deg, #00488F 0%, #0068CF 100%)` |
| Primary 800→600 | Linear | 90deg | `linear-gradient(90deg, #00488F 0%, #0068CF 100%)` |
| Primary 800→700 | Linear | 26.5deg | `linear-gradient(26.5deg, #00488F 0%, #0058AF 100%)` |
| Primary 900→600 | Linear | 45deg | `linear-gradient(45deg, #003870 0%, #0068CF 100%)` |

### Gray Gradients

| Name | Type | Angle | CSS |
|------|------|-------|-----|
| Gray 600→500 | Conic | 90deg | `conic-gradient(from 90deg, #475467 0%, rgba(71,84,103,0) 100%)` |
| Gray 600→500 | Linear | 90deg | `linear-gradient(90deg, #475467 0%, #667085 100%)` |
| Gray 700→600 | Linear | 45deg | `linear-gradient(45deg, #344054 0%, #475467 100%)` |
| Gray 800→600 | Linear | 45deg | `linear-gradient(45deg, #1D2939 0%, #475467 100%)` |
| Gray 800→600 | Linear | 90deg | `linear-gradient(90deg, #1D2939 0%, #475467 100%)` |
| Gray 800→700 | Linear | 26.5deg | `linear-gradient(26.5deg, #1D2939 0%, #344054 100%)` |
| Gray 900→600 | Linear | 45deg | `linear-gradient(45deg, #101828 0%, #475467 100%)` |

> Each family starts with a conic (angular) gradient fading to transparent, followed by 6 linear gradients at 90°, 45°, 45°, 90°, 26.5°, and 45° — dark-to-light direction.
