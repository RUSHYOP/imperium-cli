# Design System Reference

> **This file must be populated with your project's design system before the skill can do its best work.**
>
> If this file is empty when the skill runs, it will stop and ask you to provide your design system documentation.

## How to populate this file

Add the following information from your project's design system:

### Components
List your component library's available components with their variant props and usage guidelines. Example:

```
Button: variant (default | destructive | outline | secondary | ghost | link), size (default | sm | lg | icon)
Input: type (text | email | password | number), disabled, placeholder
Card: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
Dialog: DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
```

### Design Tokens
Document your spacing scale, color palette, typography scale, border radius, and shadow values. Example:

```
Spacing: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16 (in 0.25rem increments)
Colors: background, foreground, primary, secondary, muted, accent, destructive (with foreground variants)
Font sizes: xs(0.75rem), sm(0.875rem), base(1rem), lg(1.125rem), xl(1.25rem), 2xl(1.5rem), 3xl(1.875rem)
Border radius: sm, md, lg, xl, 2xl, full
```

### Patterns and Conventions
Document any component composition patterns, layout conventions, or usage rules specific to your design system. Example:

```
- Forms use Label + Input + error message pattern (never floating labels)
- Cards always have CardHeader with CardTitle
- Destructive actions require confirmation via AlertDialog
- Mobile navigation uses Sheet component, not a custom drawer
```

### Import Paths
Where do components live? Example:

```
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

---

> **Tip**: If your project uses shadcn/ui, you can add the relevant component docs here.
> If your project uses a custom design system, paste or summarize your Storybook/Figma documentation.
> If your project uses Material UI, Chakra, Ant Design, etc., add the relevant subset you actively use.
