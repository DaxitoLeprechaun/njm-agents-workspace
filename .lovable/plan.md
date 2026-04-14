

# NJM OS — 4 Piezas Finales del Frontend

## Resumen

Implementar las 4 piezas UI faltantes: (1) Modal de ingesta de datos, (2) Consola de razonamiento del agente, (3) Visor del Libro Vivo, y (4) Página de configuración global.

---

## 1. Estación de Ingesta — Data Onboarding Modal

**Archivo**: `src/components/njm/DataIngestionModal.tsx`

- Shadcn `<Dialog>` con dos secciones dentro:
  - **Zona Drag & Drop**: Div estilizado con borde dashed, iconos de archivo, estados hover/active. Acepta visualmente PDFs/Excel (sin backend real, solo UI mock con estado local de archivos "subidos").
  - **Textarea estructurada**: Preguntas del CEO según el vector seleccionado (ej. "¿Cuál es la promesa única de valor?"). Usar `<Textarea>` de Shadcn.
- Footer con botones "Cancelar" y "Enviar al CEO" (emerald).
- Recibe `vectorName` y `vectorCategory` como props para contextualizar las preguntas.

**Integración en `CEOWorkspaceView.tsx`**:
- Botón "Upload Doc" → abre el modal en modo drag & drop.
- Botón "Briefing" → abre el modal en modo textarea/preguntas.
- Ambos botones ya existen en las cards pendientes; solo falta conectarlos al modal.

---

## 2. Consola de Razonamiento — Agent Execution Log

**Archivo**: `src/components/njm/ExecutionConsole.tsx`

- Panel fijo en la parte inferior de la pantalla (bottom drawer), altura ~200px, aparece solo durante `isScanning`.
- Estilo terminal minimalista: fondo slate-950, tipografía mono, bordes glass.
- Muestra pasos secuenciales con iconos de estado:
  - `[✓]` completado (emerald)
  - `[⏳]` en progreso (amber, con pulse)
  - `[ ]` pendiente (muted)
- Los pasos se derivan del `scanningVectorId` actual y la lista de vectores pendientes.
- Animación de entrada slide-up, salida slide-down.

**Integración**:
- Renderizar en `CEOWorkspaceView` y `PMWorkspaceView` condicionalmente.
- En BrandContext, agregar un array `executionSteps` que se actualiza durante `runCEOAudit`.
- Para el PM, agregar lógica similar con pasos tipo "Leyendo Libro Vivo → Evaluando Framework → Redactando..."

**Cambios en `BrandContext.tsx`**:
- Nuevo estado: `executionLog: { label: string; status: 'done' | 'active' | 'pending' }[]`
- Se actualiza en cada paso del `runCEOAudit` para alimentar la consola.

---

## 3. Visor del Libro Vivo

**Archivo**: `src/components/njm/LibroVivoViewer.tsx`
**Página**: `src/pages/LibroVivoPage.tsx`
**Ruta**: `/brand/:id/libro-vivo`

- Full-screen Sheet (Shadcn `<Sheet>` al 80% de ancho) O página dedicada. Recomiendo **página dedicada** para que tenga su propia URL y se pueda compartir.
- Layout tipo manual de marca premium:
  - Header con nombre de marca, fecha de firma, badge "Firmado por CEO".
  - Secciones divididas por categoría: **Núcleo**, **Negocio**, **Audiencia**, **Marca**, **Growth**.
  - Cada sección muestra los vectores validados con su summary, en cards de solo lectura con tipografía serif/elegante.
  - Al final: sección "Matriz Cognitiva del PM" con los parámetros que el CEO define para el agente PM.
- Datos consumidos desde `BrandContext.getVectors(id)`.
- Accesible desde: botón "Ver Libro Vivo" en CEO (post-firma) y link en sidebar/breadcrumb.

**Cambios en `App.tsx`**: Agregar ruta `/brand/:id/libro-vivo`.
**Cambios en `AppSidebar.tsx`**: Agregar icono BookOpen como tercer item de agente (solo visible si Libro Vivo está firmado).

---

## 4. Estación de Configuración Global

**Archivo**: `src/components/njm/SettingsView.tsx`
**Página**: `src/pages/SettingsPage.tsx`
**Ruta**: `/settings`

- Layout estándar con secciones en tabs o accordion:
  - **API Keys**: Campo de input para clave de Anthropic (tipo password, con toggle show/hide). Guardado en estado local (mock, sin backend).
  - **Rutas Locales**: Input de texto para ruta absoluta de exportación. Placeholder: `/Users/tu-usuario/NJM_OS/Marcas/`.
  - **Gestión de Marcas**: Lista de marcas actuales con acciones: renombrar (inline edit) y dar de baja (con confirmación via AlertDialog).
- Botón "Guardar Configuración" con toast de confirmación.

**Cambios en `App.tsx`**: Agregar ruta `/settings`.
**Cambios en `AppSidebar.tsx`**: El botón de engranaje navega a `/settings` en lugar de ser decorativo.

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `src/components/njm/DataIngestionModal.tsx` | Crear |
| `src/components/njm/ExecutionConsole.tsx` | Crear |
| `src/components/njm/LibroVivoViewer.tsx` | Crear |
| `src/components/njm/SettingsView.tsx` | Crear |
| `src/pages/LibroVivoPage.tsx` | Crear |
| `src/pages/SettingsPage.tsx` | Crear |
| `src/context/BrandContext.tsx` | Agregar executionLog + lógica PM |
| `src/components/njm/CEOWorkspaceView.tsx` | Conectar modal + consola + link Libro Vivo |
| `src/components/njm/PMWorkspaceView.tsx` | Agregar consola de ejecución |
| `src/components/njm/AppSidebar.tsx` | Settings navega a /settings, agregar Libro Vivo |
| `src/App.tsx` | Agregar rutas /settings y /brand/:id/libro-vivo |
| `src/data/brands.ts` | Agregar datos mock para Libro Vivo sections |

