

# Modo Gestión del CEO — Dashboard Dual + Pull Request View + Terminal Log + Bottlenecks + Autonomía

## Resumen

Cuando todos los vectores están validados (Phase 2 / 100%), el CEO workspace se transforma en un "Modo Gestión" con dos columnas principales, un sistema de revisión tipo Pull Request, una consola de razonamiento, indicadores de cuello de botella, y un slider de autonomía por agente.

---

## Arquitectura de Datos

**Nuevos tipos y mock data** en `src/data/ceoManagement.ts`:

```typescript
interface CEOTask {
  id: string; type: 'analysis' | 'structure' | 'strategy' | 'delegation';
  title: string; description: string; priority: 'high' | 'medium' | 'low';
}

interface PMSubmission {
  id: string; taskName: string; framework: string;
  submittedAt: Date; // relative time display
  status: 'pending' | 'approved' | 'rejected';
  reasoning: string;  // "Basado en framework SOSTAC..."
  resultPreview: string; // markdown-like content
}
```

Mock: 4 CEO tasks (roadmap items), 3 PM submissions with varying ages for bottleneck demo.

---

## Cambios

### 1. Crear `src/data/ceoManagement.ts`
- Types + mock data for CEO roadmap tasks and PM submissions
- Agent log entries for the reasoning console
- Autonomy level config

### 2. Rewrite Phase 2 section in `CEOWorkspaceView.tsx`

**Replace** the current PM Initialization workspace (lines 279-347) with:

**A) Two-column layout** below the command bar:

- **Columna 1 — "Roadmap del CEO"**: Glass card with task list. Each item has:
  - Icon per type (`BarChart3` for analysis, `GitBranch` for structure, `Target` for strategy, `Forward` for delegation)
  - Task title + short description
  - Two buttons: "Ejecutar Tarea" (ceo accent) and "Delegar al PM" (muted)

- **Columna 2 — "Bandeja de Revisión (N)"**: Glass card with badge count in header. Each submission card shows:
  - PM avatar tag (small purple badge "Agente PM")
  - Task name + time ago ("hace 2h")
  - Two buttons: "Revisar & Aprobar" (green/pm accent) and "Rechazar" (destructive subtle)
  - **Bottleneck glow**: If `submittedAt` > 4 hours ago, the card gets a pulsing `ring-2 ring-amber-500/40 animate-pulse` border

**B) Pull Request Review Modal** — New component inline or separate:
- Opens when clicking "Revisar & Aprobar"
- Split view (two columns inside a Dialog):
  - Left: "Contexto & Framework" — shows `submission.reasoning` with framework name badge
  - Right: "Resultado del PM" — shows `submission.resultPreview` as formatted content
  - Bottom: "Aprobar" (green) + "Pedir Cambios" (amber) + textarea for feedback

**C) Reasoning Console** — Collapsible bottom panel:
- Similar to existing `ExecutionConsole` but for real-time agent logs
- Toggle button in command bar: `<Terminal />` "Ver Consola"
- Shows mock log entries: `[CEO] > Evaluando submissions pendientes...`, `[PM] > Tarea enviada a revisión`
- Monospace font, dark glass background, max-h with scroll

**D) Autonomy Slider** — Small section in the command bar or below it:
- Per-agent slider (currently just PM): 3 levels
  - Nivel 1: "Aprobación total" — all submissions require review
  - Nivel 2: "Solo entregables" — auto-approve intermediate tasks
  - Nivel 3: "Autonomía total" — notify only on completion
- Reuses existing `Slider` component
- Persisted in local state (visual only for now)

### 3. Add imports

New Lucide icons: `BarChart3`, `GitBranch`, `Target`, `Forward`, `Clock`, `User`, `XCircle`, `MessageCircle`

---

## Archivos

| Archivo | Acción |
|---------|--------|
| `src/data/ceoManagement.ts` | Crear — tipos y mock data |
| `src/components/njm/CEOWorkspaceView.tsx` | Modificar — rewrite Phase 2 con las 4 features |

Total: 1 archivo nuevo, 1 modificado. Sin dependencias nuevas.

