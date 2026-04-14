

# NJM OS — Cierre de Brechas (Parte 2)

4 mejoras para llevar el frontend de prototipo a producción.

---

## A. Responsiveness (Adaptación Móvil)

Los grids ya usan breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) en CEO y Hub. Las brechas reales son:

- **DocumentSheet**: Forzado a `sm:max-w-[40vw]` — en móvil debe ser `w-full` (100%).
- **ExecutionConsole**: Usa `left-16` (asume sidebar visible) — en móvil debe ser `left-0`.
- **AppSidebar**: No tiene colapso móvil — necesita un hamburger menu o auto-hide bajo 768px.
- **Floating action buttons**: `fixed bottom-8 left-1/2` puede solaparse con la consola en pantallas pequeñas.
- **DataIngestionModal**: Ya es responsive por ser un Dialog centrado. Sin cambios.

**Archivos a modificar**: `DocumentSheet.tsx`, `ExecutionConsole.tsx`, `AppSidebar.tsx`, `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`

---

## B. Error Boundaries + Skeletons

- Crear un componente `ErrorBoundary.tsx` (React class component con `componentDidCatch`) que muestre un mensaje elegante con botón "Reintentar" cuando cualquier vista crashee.
- Crear un componente `WorkspaceSkeleton.tsx` con cards tipo Skeleton (usando el `<Skeleton>` de Shadcn que ya existe) para mostrar mientras se cargan datos.
- Envolver cada workspace (CEO, PM, LibroVivo, Hub) con el ErrorBoundary en `App.tsx`.
- Agregar estados de carga simulados en las vistas (actualmente todo es síncrono, pero la estructura queda lista para cuando se conecte la API de Python).

**Archivos a crear**: `src/components/njm/ErrorBoundary.tsx`, `src/components/njm/WorkspaceSkeleton.tsx`
**Archivos a modificar**: `App.tsx` (envolver rutas con ErrorBoundary)

---

## C. Micro-Animaciones (Framer Motion)

No instalar `framer-motion` (dependencia pesada). En su lugar, usar CSS transitions + Tailwind `animate-*` que ya están configuradas, más agregar keyframes nuevos:

- **Card status transition**: Cuando una card pasa de rojo a verde, agregar `transition-all duration-500` con un breve scale pulse (`scale-[1.03]` por 300ms).
- **Sidebar active indicator**: Animar el indicator bar con `transition-all duration-300`.
- **Execution Console steps**: Cada step que cambia a "done" hace un brief flash verde.
- **Page transitions**: Agregar `animate-fade-in` a todas las vistas (ya presente en la mayoría, falta en Settings).

**Archivos a modificar**: `tailwind.config.ts` (nuevos keyframes: `success-pulse`, `step-complete`), `CEOWorkspaceView.tsx` (card transition al validar), `index.css` (keyframes adicionales)

---

## D. Autenticación (Solo Estructura UI)

No implementar auth real ahora (requiere backend). En su lugar, crear la **estructura UI** lista para conectar:

- Crear `LoginPage.tsx`: Página de login con campos email/password, botón "Iniciar Sesión", y branding NJM OS. Diseño glassmorphism consistente con el resto.
- Crear un `AuthGuard.tsx` que simule protección de rutas (mock: siempre autenticado, pero la estructura queda para conectar Supabase Auth después).
- Agregar ruta `/login` en `App.tsx`.
- Agregar botón "Cerrar Sesión" en la parte inferior del sidebar.

**Archivos a crear**: `src/pages/LoginPage.tsx`, `src/components/njm/AuthGuard.tsx`
**Archivos a modificar**: `App.tsx`, `AppSidebar.tsx`

---

## Resumen de Cambios

| Archivo | Acción | Brecha |
|---------|--------|--------|
| `DocumentSheet.tsx` | Editar — full-width en móvil | A |
| `ExecutionConsole.tsx` | Editar — left-0 en móvil | A |
| `AppSidebar.tsx` | Editar — colapso móvil + logout | A, D |
| `CEOWorkspaceView.tsx` | Editar — card pulse animation | C |
| `PMWorkspaceView.tsx` | Editar — floating button spacing | A |
| `ErrorBoundary.tsx` | Crear | B |
| `WorkspaceSkeleton.tsx` | Crear | B |
| `LoginPage.tsx` | Crear | D |
| `AuthGuard.tsx` | Crear | D |
| `App.tsx` | Editar — ErrorBoundary + /login | B, D |
| `tailwind.config.ts` | Editar — nuevos keyframes | C |
| `index.css` | Editar — keyframes adicionales | C |

Total: 6 archivos nuevos, 6 archivos editados. Sin dependencias nuevas.

