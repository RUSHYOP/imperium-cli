# Architecture & Key Patterns

## Three-Layer Architecture

```
Designer-Frontend/src/
├── infra/           ← Infrastructure layer
│   ├── assets/      ← Styles (SCSS), images, icons
│   ├── auth/        ← Azure AD MSAL authentication
│   ├── components/  ← Shared UI components, Parser (control renderer)
│   ├── config/      ← Component registry, metadataDefinition, app settings
│   ├── i18n/        ← Internationalization
│   └── redux/       ← Legacy Redux store (being replaced by Zustand)
│
├── presentation/    ← UI layer
│   ├── pages/       ← Feature pages (CanvasEditor, PageManagement, etc.)
│   ├── hooks/       ← Custom React hooks
│   ├── helpers/     ← View-layer helpers
│   ├── routes/      ← Route definitions
│   └── constants/   ← UI constants, control type enums, metadata defaults
│
├── services/        ← Business logic layer
│   ├── API/         ← API endpoint definitions
│   ├── stores/      ← Zustand stores (Designer, queries, user, token, etc.)
│   └── utils.ts     ← Metadata utility functions
│
├── types/           ← TypeScript type definitions
└── utils/           ← Shared utilities
```

### What Each Layer Owns

**Infra** — Things that don't change when business requirements change. Auth, HTTP client, component definitions, the rendering parser, design tokens. If you're adding a new controlType to the registry, you're working in infra.

**Presentation** — Everything the user sees. The canvas editor, property panels, page/module/app management screens, route definitions. If you're adding a new page or changing the designer UI, you're in presentation.

**Services** — How the app talks to the backend and manages state. API endpoint definitions, Zustand stores, GraphQL queries. If you're adding a new API call or store, you're in services.

---

## Key Patterns

### Component Registration (How to Add a New Component)

Three-step process documented in `docs/Infra/Components/How to add new component.md`:

1. **Install the package** — `yarn add @ramco-platform/studio-components` (or update version)
2. **Add to ComponentsRef.ts** — Add entry to the `ComponentReference` object with `{ element: ComponentWrapper, icon: IconComponent }`
3. **Add to metadataDefinition.json** — Define all props, events, actions, and default values for the new controlType

### Route Registration

Documented in `docs/Infra/How to add new page in route.md`. Routes use a `RouteType`:
```typescript
{ path: string, url: string, loadable: React.LazyExoticComponent, ComponentName: string }
```

### Menu Registration

Documented in `docs/Infra/How to add menu.md`. Menu items use `MenuItemType`:
```typescript
{ path: string, description: string, icon: ReactNode, id: string }
```

### AppSettings Pattern (No-Build Config)

Documented in `docs/Infra/How to use no build configuration changes.md`. Runtime configuration without rebuilding:
1. Register a key in the settings interface
2. Define the value in `public/appSettings.js` (loaded at runtime)
3. Access via `AppSettings.keyName` anywhere in the app

This means environment-specific config (API URLs, feature flags) doesn't require a rebuild.

### Draggable System

`docs/Infra/Components/Draggables.md` documents the DnD layer:
- `DraggableContainer` — Wraps a group of draggables
- `DraggableElement` — Individual draggable item
- `DroppableContainer` — A drop target zone
- `ResizableContainer` — A resizable boundary

The canvas editor uses React DnD 16 (HTML5 backend) for the drag-and-drop experience. Components are dragged from the palette, dropped onto the canvas `WorkArea.tsx`, and the drop handler creates the metadata entry in the Zustand store.

---

## State Management Architecture

### Zustand (Primary — New Features)

Multiple domain-specific stores:

| Store File | Export | Domain |
|---|---|---|
| `stores/Designer/index.ts` | `useMetaDataStore` | Page component tree, selection, page details |
| `stores/Designer/globalSettings.ts` | `useGlobalSettings` | Layout mode (DESKTOP/TABLET/MOBILE), work area width |
| `stores/currentStateStore.ts` | `useCurrentStateStore` | Global app state (application, module, page, queries, components) |
| `stores/dataQueriesStore.ts` | `useDataQueriesStore` | Data query CRUD and execution state |
| `stores/queryPanelStore.ts` | `useQueryPanelStore` | Query editor panel UI state |
| `stores/userStore.ts` | `useUserStore`, `useUserAttributeStore` | User info, roles, preferences, attributes |
| `stores/useTokenStore.ts` | `useTokenStore` | Authentication token |

### Redux (Legacy)

Located in `infra/redux/`. Legacy state management for older features. New features should use Zustand. When you encounter both in the same feature area, Zustand is the canonical source.

### React Query 3

Used for server state caching and synchronization. Works alongside Zustand — Zustand for client state, React Query for server state.

---

## Authentication Flow

1. User hits the app → MSAL 2.38.0 intercepts
2. Redirect to Azure AD login
3. On callback → MSAL extracts tokens (access + ID)
4. Tokens stored in `useTokenStore`
5. Axios interceptors attach Bearer token to every API request
6. OpenTelemetry interceptors add tracing headers

---

## Build & Dev

| Command | Purpose |
|---|---|
| `yarn install` | Install dependencies |
| `yarn dev` | Start dev server (port 5000) |
| `yarn build` | Production build |
| `yarn lint` | Run linting |

Build uses Vite 4.3.9 with Module Federation via `@originjs/vite-plugin-federation` — this allows the designer to be composed with other micro-frontends.

---

## Type System

Key type files:

| File | Contents |
|---|---|
| `types/Components.ts` | `ComponentBaseType` (controlType, id, styles, events), `RButtonType`, `RContainerType` — imports Nb*Props from studio-components |
| `types/Config.ts` | Configuration types |

`ComponentBaseType` is the base interface for all controls:
```typescript
{
  controlType: string;
  id: string;
  styles: object;
  onEvent: Function;
  onComponentOptionChanged: Function;
  setExposedVariable: Function;
  events: EventType[];
}
```

---

## Code Style

Google TypeScript Style Guide is the baseline. Commit format follows a structured convention (documented in the repo's CLAUDE.md).
