

# UX Polish — Skeletons, Toasts de Estado y Empty States

3 mejoras de pulido visual. Sin dependencias nuevas.

---

## 1. Skeleton Screens en CEO y PM

Al navegar entre CEO y PM, simular un loading de 500ms mostrando `WorkspaceSkeleton` antes de renderizar el contenido real. Mismo patrón que ya usa `AgencyHubView` con `useState(true)` + `useEffect` timer.

**Archivos a modificar**: `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`
- Agregar `const [isLoading, setIsLoading] = useState(true)` + `useEffect` con 500ms timer
- Si `isLoading`, retornar `<WorkspaceSkeleton />` con configuración apropiada (CEO: 8 cards, PM: 6 cards en 3 columnas)
- El skeleton se muestra antes de cualquier otra lógica (brand not found, locked, etc.)

---

## 2. Toasts de Estado por Agente

Agregar toasts más descriptivos y con emoji cuando los agentes completan acciones. Ya existe infraestructura con `sonner`.

**Archivos a modificar**: `BrandContext.tsx`
- En `runCEOAudit`: al completar cada step, emitir toast con detalle: `toast.success("✅ CEO: Auditoría de vectores completada", { description: "8 vectores estratégicos analizados para {brandName}" })`
- En `runPMExecution`: al completar cada step intermedio, emitir toast informativo: `toast("📊 PM: Evaluando Framework Ansoff...")`, y al final toast de éxito: `toast.success("✅ PM: Análisis Porter generado con éxito")`
- En `signLibroVivo`: agregar toast `toast.success("✅ CEO: Libro Vivo firmado y sellado")`
- En `toggleVector` / `validateAllVectors`: agregar toast de confirmación

**Archivos a modificar**: `BrandContext.tsx`

---

## 3. Empty States Profesionales

Mejorar los estados vacíos existentes con mensajes específicos por contexto.

**Archivos a modificar**: `PMWorkspaceView.tsx`, `CEOWorkspaceView.tsx`
- **PM bloqueado** (ya existe pero mejorar): Cambiar el mensaje a "El Agente PM está esperando la firma del Libro Vivo para empezar a operar. Dirígete al workspace del CEO para completar la validación." Usar el componente `EmptyState` existente con icono `Lock`.
- **CEO sin vectores**: Agregar empty state si `getVectors()` retorna array vacío, usando `EmptyState` con icono `Inbox` y CTA "Iniciar Auditoría".
- **PM sin artefactos completados**: Mostrar empty state contextual cuando todos los artifacts están en "Pendiente".

---

## Resumen

| Archivo | Cambio |
|---------|--------|
| `CEOWorkspaceView.tsx` | Skeleton loading + empty state sin vectores |
| `PMWorkspaceView.tsx` | Skeleton loading + empty state mejorado (bloqueado + sin artefactos) |
| `BrandContext.tsx` | Toasts descriptivos en signLibroVivo, runCEOAudit, runPMExecution |

Total: 3 archivos modificados. Sin archivos nuevos.

