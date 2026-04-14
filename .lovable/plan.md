

# Agent Hub — Dashboard Dinámico del Agente CEO (Dual-Phase)

## Context

The current `CEOWorkspaceView` shows vectors in a flat grid. This redesign introduces a **two-phase UI** based on `agentHealth` (derived from vector validation percentage):

- **Phase 1 (Setup)**: Health < 100% — diagnostic/onboarding mode with health metric, pending tasks list, and urgent action card
- **Phase 2 (Operational)**: Health = 100% — collapsed command bar + PM initialization workspace

The existing vector validation logic, audit system, and Libro Vivo signing remain intact.

---

## Architecture

`agentHealth` is computed from existing data: `(validatedVectors / totalVectors) * 100`. No new state needed — it's a derived value from `getVectors()`.

`pendingTasks` maps to unvalidated vectors (each pending vector = a task like "Validar Identidad Visual").

The Phase 2 PM initialization panel is purely UI — it uses existing `signLibroVivo` and navigation patterns.

---

## Changes

### 1. Rewrite `CEOWorkspaceView.tsx`

**Phase 1 (Setup) — Top section**: 3-card grid:
- **Card 1 — Health Metric**: SVG circular progress ring (reuse pattern from `BrandOverviewView`) showing `agentHealth%`. Text: "Requiere configuración para operar" when < 100%.
- **Card 2 — Triaje / Pendientes**: Compact checklist of pending vectors with gray/green checkmarks. Each item shows vector name + category.
- **Card 3 — Acción Urgente**: Highlighted card (ceo accent border) showing the first pending vector as urgent task. Contains "Iniciar Onboarding" button that opens `DataIngestionModal` and a small drag-and-drop zone.

Below the 3 cards: the existing vector grid with filters (preserved from current implementation).

**Phase 2 (Operational) — When health = 100%**:
- Top 3 cards collapse into a single horizontal bar: "Agente CEO: Operativo (100%)" with a "Ver Configuración" toggle button to expand/collapse the detail view.
- Below the bar: **PM Initialization Workspace** panel with:
  - Tag selectors for "Habilidades del PM" (Análisis Competitivo, Research, Generación de Contenido, Roadmapping)
  - Slider or radio for "Nivel de Autonomía" (Supervisado, Semi-Autónomo, Autónomo)
  - "Inicializar Agente PM" terminal-style button (triggers `signLibroVivo` if not signed, or navigates to PM workspace)
- The Libro Vivo signing button integrates naturally into this workspace.

**State**: Add `showConfig` boolean toggle for the collapse/expand in Phase 2. Add `pmSkills` and `pmAutonomy` local state for the PM setup form.

**Transition**: Use Tailwind `transition-all duration-500` for the card collapse animation. Cards use `max-h-0 overflow-hidden` when collapsed vs `max-h-[400px]` when expanded.

### 2. Minor update to `BrandContext.tsx`

No changes needed — `agentHealth` is derived client-side from existing `getVectors()`.

---

## File Summary

| File | Action |
|------|--------|
| `src/components/njm/CEOWorkspaceView.tsx` | Rewrite with dual-phase UI |

Total: 1 file modified. No new files, no new dependencies.

