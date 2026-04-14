

# NJM OS — 3 Módulos: Día Cero, Alta de Marca, y Dashboard de Pendientes

## Context

The app already has: Login, Agency Hub with brand cards, CEO/PM workspaces, Settings, DataIngestionModal with drag-and-drop. The new modules add a pre-Hub onboarding layer and enhance brand creation and triage workflows.

---

## Módulo 1: "Día Cero" — Onboarding Wizard

A new page/view that shows when the agency has not been configured yet. Uses localStorage flag `njm-agency-setup`.

**Create** `src/components/njm/DayCeroView.tsx`:
- **Empty State**: Centered screen with `Hexagon` icon, "Ningún espacio de trabajo detectado", and "Inicializar Agencia" button
- **Wizard** (4 steps in a full-width modal/overlay):
  - Step 1: Agency Name (`Building` icon + Input)
  - Step 2: Main Objectives (`Target` icon + Textarea)
  - Step 3: Operation Style (`Layers` icon + tag selector with options: "Consultivo", "Operativo", "Híbrido", "Automatizado")
  - Step 4: Values/Mission (`Heart` icon + Textarea)
- Navigation: "Siguiente", "Atrás", "Completar Setup" buttons
- On complete: save to localStorage, toast success, redirect to Hub
- Step indicator: numbered dots with active state using `glass` styling

**Create** `src/context/AgencyContext.tsx`:
- Store agency profile (name, objectives, style, values)
- `isSetupComplete` boolean
- Persist to localStorage

**Modify** `src/pages/Index.tsx`:
- Check `isSetupComplete` — if false, render `<DayCeroView />` instead of `<AgencyHubView />`

---

## Módulo 2: Alta de Marca con Motor de Ingesta Dual

Enhanced brand creation flow with two distinct dropzones.

**Create** `src/components/njm/NewBrandModal.tsx`:
- Full-width `Dialog` with two sections:
  - **Sección 1 — Datos Base**: Name (`Building`), Industry/Sector (`Briefcase`), Short Description (`FileText`) — all with glassmorphism inputs
  - **Sección 2 — Motor de Ingesta**: Two visually distinct dropzones side by side:
    - **Dropzone A** "Ingesta Visual & Brandbook" (`Palette` icon, dashed border with `ceo` color accent) — accepts images, PDFs for logos/palettes/typography
    - **Dropzone B** "Ingesta Estratégica & Contexto" (`BookOpen` icon, dashed border with `pm` color accent) — accepts docs for manuals, sales history, briefs
  - Each dropzone: drag hover state, file list with remove buttons, file size display
- "Crear Marca" button, toast on success
- Reuses existing drag-and-drop patterns from `DataIngestionModal`

**Modify** `src/components/njm/AgencyHubView.tsx`:
- Wire the "Agregar Marca" button to open `<NewBrandModal />`

**Modify** `src/context/BrandContext.tsx`:
- Add `addBrand(brand)` function to dynamically add brands to state
- New brands start with `status: "En Setup"`, `health: 0`

---

## Módulo 3: Dashboard de Pendientes (Triaje)

Enhance brand cards with granular status badges and contextual CTAs.

**Create** `src/data/brandTriage.ts`:
- Type: `BrandTriageStatus = 'pending_interview' | 'missing_docs' | 'ready_for_research' | 'complete'`
- Badge config map: label, color, icon for each status
- Mock triage data per brand

**Modify** `src/components/njm/AgencyHubView.tsx`:
- Add triage badges to each brand card:
  - "Falta Ingesta Documental" (amber badge) — when no docs uploaded
  - "Entrevista Pendiente" (orange badge) — when interview not done
  - "Falta Investigación de Mercado" (slate badge) — when research not started
- Add contextual CTA button per card:
  - If `pending_interview` → "Completar Entrevista"
  - If `missing_docs` → "Subir Documentos"
  - If `ready_for_research` → "Iniciar Análisis Agéntico" with `Sparkles` icon
  - If `complete` → "Ver Dashboard"
- Add circular "Agent Readiness" indicator replacing or alongside the existing health bar
- High-density layout inspired by Vercel/Linear aesthetic

---

## Summary

| File | Action | Module |
|------|--------|--------|
| `src/components/njm/DayCeroView.tsx` | Create | 1 |
| `src/context/AgencyContext.tsx` | Create | 1 |
| `src/components/njm/NewBrandModal.tsx` | Create | 2 |
| `src/data/brandTriage.ts` | Create | 3 |
| `src/pages/Index.tsx` | Modify | 1 |
| `src/components/njm/AgencyHubView.tsx` | Modify | 2, 3 |
| `src/context/BrandContext.tsx` | Modify | 2 |
| `src/layouts/AppLayout.tsx` | Modify | 1 (wrap AgencyProvider) |

Total: 4 new files, 4 modified. No new dependencies.

