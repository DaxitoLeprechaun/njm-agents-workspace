

# NJM OS — Agentic Operating System Evolution

## What We're Building

Transform the current single-page prototype into a multi-level routed workspace with proper navigation, state management, and the Shadcn Sheet component for document viewing. Keep the existing glassmorphism design system and nature background.

## Architecture

```text
App.tsx
├── /                        → AppLayout + AgencyHubView
├── /brand/:id/ceo           → AppLayout + CEOWorkspaceView
├── /brand/:id/pm            → AppLayout + PMWorkspaceView
└── *                        → NotFound
```

## Changes

### 1. Centralized Data Layer (`src/data/brands.ts`)
- Export mock brand data, strategic vectors (8 items with validated/pending state, summaries), and PM artifacts
- Define TypeScript interfaces: `Brand`, `StrategicVector`, `Artifact`
- Include `LIBRO_VIVO_SCHEMA` and `TARJETA_SUGERENCIA_UI` placeholder types for future backend integration

### 2. App Layout (`src/layouts/AppLayout.tsx`)
- Persistent wrapper: nature background + overlay + sidebar + `<Outlet />`
- Extract background/overlay from Index.tsx into this shared layout
- Sidebar receives current route context via `useParams` and `useLocation`

### 3. Routing (`App.tsx`)
- Add nested routes under `AppLayout`:
  - `/` renders AgencyHubView
  - `/brand/:id/ceo` renders CEOWorkspaceView
  - `/brand/:id/pm` renders PMWorkspaceView
- Remove the old `useState`-based view switching

### 4. Sidebar (`AppSidebar.tsx`)
- Use `useNavigate` + `useParams` for real navigation
- CEO/PM links disabled (greyed out) when no brand is selected (no `:id` in URL)
- When brand is selected, links point to `/brand/:id/ceo` and `/brand/:id/pm`
- Active state derived from `useLocation` with proper color highlights

### 5. Agency Hub (`AgencyHubView.tsx`)
- Click brand card → `navigate(/brand/${id}/ceo)` instead of callback
- No other visual changes; keep existing glassmorphism cards

### 6. CEO Workspace (`CEOWorkspaceView.tsx`)
- Read `:id` from `useParams`, filter vectors by brand
- 8 Strategic Vector cards with two states:
  - **Incomplete**: rose-500 accent border, "Pendiente" badge, "Upload Doc" button
  - **Validated**: emerald-500 accent, checkmark, shows extracted data summary
- "Generar Libro Vivo" button appears only when all 8 vectors are validated
- Bottom pill: "Invocar CEO para Auditoría" (purple theme)
- Toggle vector state on click for demo purposes

### 7. PM Workspace (`PMWorkspaceView.tsx`)
- Locked state: if brand's Libro Vivo is not complete, show a locked overlay with message
- Artifact cards with hover tooltips showing metadata (Status, Framework used)
- Click "Completado" artifact → opens Shadcn `<Sheet>` (replaces custom DocumentDrawer)
- Bottom pill: "Consultar PM / Ejecutar Táctica" (emerald theme)

### 8. Document Sheet (`DocumentSheet.tsx` — replaces DocumentDrawer)
- Use Shadcn `<Sheet side="right">` component
- Custom width override to ~40% of screen via className
- Content: suggestion card (emerald) + structured markdown editor area
- Footer: "Proponer Ajustes" (secondary) + "Aprobar y Guardar" (emerald primary)
- Professional, non-chat appearance

### 9. Minor Adjustments
- Remove `src/pages/Index.tsx` monolithic page (logic moves to layout + individual route pages)
- Keep all existing CSS variables, glass utilities, and tailwind config unchanged

## Files Summary

| File | Action |
|------|--------|
| `src/data/brands.ts` | Create |
| `src/layouts/AppLayout.tsx` | Create |
| `src/components/njm/DocumentSheet.tsx` | Create (replaces DocumentDrawer) |
| `src/App.tsx` | Rewrite routes |
| `src/pages/Index.tsx` | Simplify to render AgencyHubView |
| `src/pages/CEOPage.tsx` | Create (route wrapper) |
| `src/pages/PMPage.tsx` | Create (route wrapper) |
| `src/components/njm/AppSidebar.tsx` | Refactor to use routing |
| `src/components/njm/AgencyHubView.tsx` | Use navigate instead of callback |
| `src/components/njm/CEOWorkspaceView.tsx` | Add vector toggle logic, locked Libro Vivo button |
| `src/components/njm/PMWorkspaceView.tsx` | Add tooltips, locked state, Sheet trigger |

