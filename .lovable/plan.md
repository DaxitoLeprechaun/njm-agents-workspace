

# Recomendaciones para NJM OS — Siguiente Fase

Basado en el estado actual del proyecto, estas son las 5 mejoras prioritarias ordenadas por impacto:

---

## 1. Breadcrumb Contextual + Header Mejorado

Agregar un breadcrumb navegable en el header de cada workspace que muestre la jerarquía: **Hub > Agencia-Disrupt > CEO**.

- Usar el componente `Breadcrumb` de Shadcn que ya existe en el proyecto
- Integrar en el header de `CEOWorkspaceView` y `PMWorkspaceView`
- Links clickeables para navegar hacia atrás

**Archivos**: `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`

---

## 2. Animación "Invocar CEO para Auditoría"

Dar funcionalidad real al botón flotante del CEO. Al hacer clic, ejecutar una animación secuencial que "escanea" cada vector estratégico:

- Cada card se ilumina brevemente con un borde pulsante
- Los vectores incompletos cambian a validados uno por uno (con delay)
- Una vez completados todos, el botón "Generar Libro Vivo" aparece con animación
- Usar CSS transitions y `setTimeout` encadenados (sin dependencia de framer-motion)

**Archivos**: `CEOWorkspaceView.tsx`, posiblemente nueva utilidad de animación

---

## 3. Transición Animada entre Vistas

Agregar animaciones de entrada/salida al navegar entre las 3 vistas:

- Fade-in + slide sutil al montar cada workspace
- Cards con stagger animation (aparecen secuencialmente)
- Implementar con CSS `@keyframes` + clases de Tailwind (`animate-in`, delays escalonados)

**Archivos**: `AgencyHubView.tsx`, `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`, `index.css`

---

## 4. Estado Global con Context API

Actualmente los vectores se resetean al navegar. Crear un `BrandContext` que persista:

- Estado de vectores validados por marca
- Estado de `libroVivoComplete` modificable (cuando el CEO firma)
- Permitir que al firmar el Libro Vivo en CEO, el PM workspace se desbloquee dinámicamente

**Archivos**: Crear `src/context/BrandContext.tsx`, integrar en `AppLayout.tsx`

---

## 5. Notificaciones y Feedback Visual

Agregar toasts y micro-feedback para acciones del usuario:

- Toast al validar un vector ("Vector validado correctamente")
- Toast al firmar el Libro Vivo ("Libro Vivo generado — PM desbloqueado")
- Toast al aprobar un documento en el Sheet
- Usar el componente Sonner que ya está integrado

**Archivos**: `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`, `DocumentSheet.tsx`

---

## Orden de Ejecución Recomendado

1. **Estado Global** (prerequisito para que las demás features funcionen correctamente)
2. **Breadcrumb** (rápido, mejora la navegación inmediatamente)
3. **Notificaciones** (bajo esfuerzo, alto impacto en UX)
4. **Animación CEO Audit** (feature estrella para demos)
5. **Transiciones entre vistas** (polish final)

## Estimación

Total: ~5 archivos nuevos/modificados. Todo se implementa con las herramientas ya disponibles en el proyecto (Shadcn, Tailwind, React Context). Sin dependencias nuevas.

