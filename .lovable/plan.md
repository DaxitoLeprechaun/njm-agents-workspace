

# Recomendaciones para NJM OS — Plan de Mejoras

## 1. Animaciones y transiciones con Framer Motion
Agregar `framer-motion` para animar las transiciones entre vistas (Agency → CEO → PM) con fade/slide suaves, y animar la entrada escalonada de las cards (stagger). También mejorar la animación del DocumentDrawer con spring physics en lugar del CSS actual.

**Ejecución:** Instalar `framer-motion`, crear un componente `AnimatedView` wrapper, aplicar `AnimatePresence` en Index.tsx para las transiciones entre vistas.

---

## 2. Panel de Actividad de Agentes en tiempo real
Agregar una barra inferior o panel colapsable que muestre un "feed" de actividad de los agentes AI — mensajes como "CEO Agent validó Propósito de Marca", "PM Agent generó Business Case Q3", con timestamps y avatares temáticos. Esto refuerza la narrativa de que los agentes trabajan en background.

**Ejecución:** Crear componente `AgentActivityFeed.tsx` con datos mock y animaciones de entrada. Posicionarlo como un panel colapsable en la parte inferior de la pantalla.

---

## 3. Breadcrumbs y navegación contextual
Actualmente al seleccionar una marca se cambia a la vista CEO pero no hay forma de saber qué marca está seleccionada ni de volver atrás fácilmente. Agregar un breadcrumb glass ("Hub > Disrupt > CEO Dashboard") en el header.

**Ejecución:** Crear componente `Breadcrumb.tsx`, pasar el estado de marca seleccionada, y agregar navegación de retorno.

---

## 4. Temas de naturaleza intercambiables
Ofrecer 3-4 fondos de naturaleza (bosque, océano, montaña, atardecer) seleccionables desde el botón de Settings del sidebar. Cada uno ajusta sutilmente los tints del overlay.

**Ejecución:** Generar 3 fondos adicionales, crear un `ThemeSelector` modal en Settings, y almacenar la preferencia en `localStorage`.

---

## 5. Notificaciones y badges en el sidebar
Agregar badges numéricos en los iconos del sidebar (ej: "3" en PM indicando documentos pendientes, un punto en CEO indicando vectores sin validar). Refuerza la sensación de sistema vivo.

**Ejecución:** Agregar lógica de conteo en `AppSidebar.tsx` con badges animados usando puntos rojos/emerald.

---

## Orden de implementación sugerido

| Prioridad | Feature | Impacto |
|-----------|---------|---------|
| 1 | Breadcrumbs y navegación contextual | Usabilidad crítica |
| 2 | Animaciones con Framer Motion | Sensación premium |
| 3 | Panel de Actividad de Agentes | Narrativa del producto |
| 4 | Notificaciones/badges en sidebar | Sistema vivo |
| 5 | Temas de naturaleza intercambiables | Personalización |

Puedo implementar todas estas mejoras en secuencia. Indica cuáles quieres que ejecute o si prefieres todas.

