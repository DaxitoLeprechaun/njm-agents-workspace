

# PM Workspace — 4 Nucleos (Modo Ejecucion)

Rewrite completo del `PMWorkspaceView.tsx` para transformarlo de un grid de artefactos a un dashboard tactico de 4 nucleos, coherente con la estructura del CEO.

```text
┌─────────────────────────────────────────────────────┐
│  HEADER (breadcrumb: Hub > Brand > Agente PM)       │
├─────────────────────────────────────────────────────┤
│  NUCLEO 1: Contexto Operativo y Estado              │
│  [Salud PM 100%] [Épica Activa] [Terminal] [Config] │
│  Panel de Constraints (restricciones del PM)        │
├───────────────────────┬─────────────────────────────┤
│  NUCLEO 2:            │  NUCLEO 3:                  │
│  Motor de Desglose    │  Tablero Táctico (Kanban)   │
│  (Tree-view de sub-   │  Backlog | Ejecutando |     │
│   tareas generadas)   │  En Revisión | Completado   │
├───────────────────────┴─────────────────────────────┤
│  NUCLEO 4: Terminal de Producción (Split View)      │
│  Izq: Contexto/fuentes  │  Der: Output generado     │
└─────────────────────────────────────────────────────┘
```

---

## Datos — `src/data/pmManagement.ts` (nuevo)

Types and mock data:

- **Epic**: `{ id, title, assignedBy: "CEO", status, constraints: string[] }` — the active objective from the CEO
- **PMSubTask**: `{ id, epicId, title, type, status: 'backlog'|'executing'|'review'|'done', priority }` — breakdown items
- **KanbanColumn**: 4 columns (Backlog, Ejecutando, En Revisión CEO, Completado)
- **ProductionContext**: `{ sources: string[], taskTitle, contextSnippet, generatedOutput }` — split view data
- **PMConstraint**: `{ id, label, active: boolean }` — restrictions like "Budget <$5K", "Deadline Q3"

Mock: 1 active epic ("Estrategia de Lanzamiento LATAM"), 6-8 sub-tasks across kanban columns, 3 constraints, production context for one active task.

## UI — Rewrite `PMWorkspaceView.tsx`

### Header
- Keep existing breadcrumb (Hub > Brand > Agente PM)
- Update subtitle to "Modo Ejecución · Agente PM"

### Nucleo 1 — Contexto Operativo
- Health ring (reuse pattern from CEO) showing PM health at 100%
- **Épica Activa** card: shows the CEO-assigned epic title + description prominently
- Action buttons: "Ver Terminal" (toggle console), "Constraints" (toggle collapsible)
- Collapsible **Constraints panel**: list of toggleable restriction badges (budget, timeline, scope limits)

### Nucleo 2 — Motor de Desglose (Breakdown Engine)
- Glass card with tree-view/nested list of sub-tasks derived from the active epic
- Each item: checkbox-style status dot, title, type icon (`Search` for research, `Table` for data, `FileText` for doc)
- Footer buttons: "Re-generar Desglose" (re-shuffle sub-tasks with toast) and "Agregar Sub-tarea" (adds placeholder)
- Indented children with subtle left border line for hierarchy

### Nucleo 3 — Tablero Táctico (Mini Kanban)
- 4 columns as vertical stacked lists (not horizontal scroll — fits the viewport)
- Column headers with dot + count badge: `Backlog (3)`, `Ejecutando (1)`, `En Revisión CEO (1)`, `Completado (2)`
- Task cards: compact — ID tag, title, priority dot (red/amber/green), type icon
- Cards in "En Revisión CEO" get the bottleneck glow if >4h (reuse `isBottleneck`)
- Click a card → selects it for the Terminal de Producción (Nucleo 4)

### Nucleo 4 — Terminal de Producción (Split View)
- Full-width section, divided 40/60
- **Left panel**: "Contexto" — shows source snippets (Libro Vivo fragments, frameworks referenced), monospace, dark glass
- **Right panel**: "Output" — shows generated content (markdown-style formatted text), slightly lighter glass
- Header shows the selected task name + status badge
- If no task selected, show empty state: "Selecciona una tarea del tablero para ver su producción"

### Floating Action Button
- Keep existing pattern but label: "Ejecutar Tarea Seleccionada"
- Triggers `runPMExecution` from BrandContext (reuses existing execution console)

---

## Files

| File | Action |
|------|--------|
| `src/data/pmManagement.ts` | Create — types, mock data for epics, sub-tasks, kanban, constraints, production context |
| `src/components/njm/PMWorkspaceView.tsx` | Rewrite — 4-nucleus layout replacing artifact grid |

Total: 1 new file, 1 modified. No new dependencies.

