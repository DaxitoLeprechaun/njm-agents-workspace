

# CEO Dashboard — 4 Nucleos Principales

## Resumen

Reorganizar el Phase 2 (Modo Gestion) del CEO en **4 modulos visuales** claros, reemplazando el layout actual de 2 columnas + autonomy slider suelto.

```text
┌─────────────────────────────────────────────────────┐
│  HEADER (breadcrumb + titulo)                       │
├─────────────────────────────────────────────────────┤
│  NUCLEO 1: Estado del Agente CEO                    │
│  [Salud 100%] [Ver Libro] [Consola] [Config]        │
│  Autonomia slider + config colapsable               │
├───────────────────────┬─────────────────────────────┤
│  NUCLEO 2:            │  NUCLEO 3:                  │
│  Tareas Pendientes    │  Pendientes por Aprobar     │
│  (Roadmap del CEO +   │  (Bandeja de Revision       │
│   delegaciones al PM) │   del PM)                   │
├───────────────────────┴─────────────────────────────┤
│  NUCLEO 4: Core de Contrataciones                   │
│  [Agente PM ✓ Activo] [Agente MKT 🔒] [Agente X 🔒]│
│  Contratar / Configurar agentes subordinados        │
└─────────────────────────────────────────────────────┘
```

## Cambios en `CEOWorkspaceView.tsx`

### Nucleo 1 — Estado del Agente CEO (ya existe, se mantiene)
- Command bar actual con salud, Ver Libro Vivo, Consola, Configuracion
- Autonomy slider y config colapsable se quedan aqui
- Sin cambios significativos, solo agrupacion visual con titulo "Estado del Agente"

### Nucleo 2 — Tareas Pendientes (ya existe como "Roadmap del CEO")
- Se mantiene igual: lista de tareas con iconos, "Ejecutar Tarea" y "Delegar al PM"
- Se le agrega un header mas prominente: "Tareas Pendientes" con badge de conteo

### Nucleo 3 — Pendientes por Aprobar (ya existe como "Bandeja de Revision")
- Se mantiene igual: submissions del PM con bottleneck glow, botones Aprobar/Rechazar
- Sin cambios funcionales

### Nucleo 4 — Core de Contrataciones (NUEVO)
- Grid de tarjetas de agentes disponibles para "contratar":
  - **Agente PM**: estado activo si ya fue inicializado, con boton "Ir al PM" o "Inicializar"
  - **Agente de Marketing**: bloqueado (coming soon), icono lock
  - **Agente de Ventas**: bloqueado (coming soon)
- Cada tarjeta muestra: icono del agente, nombre, estado (Activo/Bloqueado), skills asignadas
- El boton "Inicializar Agente PM" se mueve aqui desde donde esta actualmente suelto
- Los selectores de skills del PM tambien se mueven a este nucleo (dentro de la tarjeta del PM)

### Reorganizacion del layout
- Nucleo 1: full-width bar (como esta)
- Nucleos 2 y 3: grid 2 columnas (como esta)
- Nucleo 4: full-width section debajo, con grid de 3 tarjetas de agentes

### Mock data para agentes
- Agregar a `ceoManagement.ts` un array `AVAILABLE_AGENTS` con 3 entries (PM, Marketing, Ventas) con campos: id, name, icon, status, skills, color

## Archivos

| Archivo | Accion |
|---------|--------|
| `src/data/ceoManagement.ts` | Agregar tipos y mock de agentes disponibles |
| `src/components/njm/CEOWorkspaceView.tsx` | Reorganizar Phase 2 en 4 nucleos |

Total: 2 archivos modificados. Sin dependencias nuevas.

