// PM Management — Types & Mock Data

export interface Epic {
  id: string;
  title: string;
  description: string;
  assignedBy: "CEO";
  status: "active" | "completed";
  constraints: string[];
}

export interface PMSubTask {
  id: string;
  epicId: string;
  title: string;
  type: "research" | "analysis" | "document" | "data" | "strategy";
  status: "backlog" | "executing" | "review" | "done";
  priority: "high" | "medium" | "low";
  parentId?: string;
}

export interface PMConstraint {
  id: string;
  label: string;
  active: boolean;
}

export interface ProductionContext {
  taskId: string;
  taskTitle: string;
  sources: string[];
  contextSnippet: string;
  generatedOutput: string;
}

export type KanbanColumnId = "backlog" | "executing" | "review" | "done";

export interface KanbanColumn {
  id: KanbanColumnId;
  label: string;
  dotColor: string;
}

// ── Mock Data ──

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "backlog", label: "Backlog", dotColor: "bg-muted-foreground" },
  { id: "executing", label: "Ejecutando", dotColor: "bg-agency" },
  { id: "review", label: "En Revisión CEO", dotColor: "bg-amber-500" },
  { id: "done", label: "Completado", dotColor: "bg-pm" },
];

export const ACTIVE_EPIC: Epic = {
  id: "epic-1",
  title: "Estrategia de Lanzamiento LATAM",
  description: "Diseñar la estrategia Go-To-Market completa para la expansión en mercados latinoamericanos, incluyendo análisis competitivo, pricing y canales de distribución.",
  assignedBy: "CEO",
  status: "active",
  constraints: ["Budget <$5K", "Deadline Q3 2026", "Solo mercados Tier 1"],
};

export const PM_CONSTRAINTS: PMConstraint[] = [
  { id: "c1", label: "Budget < $5K", active: true },
  { id: "c2", label: "Deadline Q3 2026", active: true },
  { id: "c3", label: "Solo mercados Tier 1", active: false },
];

export const PM_SUBTASKS: PMSubTask[] = [
  { id: "st-1", epicId: "epic-1", title: "Raspar competidores locales", type: "research", status: "done", priority: "high" },
  { id: "st-2", epicId: "epic-1", title: "Analizar estructura de precios", type: "analysis", status: "done", priority: "high" },
  { id: "st-3", epicId: "epic-1", title: "Generar tabla comparativa", type: "data", status: "executing", priority: "high" },
  { id: "st-4", epicId: "epic-1", title: "Redactar GTM Playbook", type: "document", status: "review", priority: "medium" },
  { id: "st-5", epicId: "epic-1", title: "Definir canales de distribución", type: "strategy", status: "backlog", priority: "medium" },
  { id: "st-6", epicId: "epic-1", title: "Identificar partners estratégicos", type: "research", status: "backlog", priority: "low" },
  { id: "st-7", epicId: "epic-1", title: "Validar pricing con datos locales", type: "analysis", status: "backlog", priority: "high" },
  { id: "st-8", epicId: "epic-1", title: "Crear deck de presentación", type: "document", status: "done", priority: "low" },
];

export const PRODUCTION_CONTEXTS: Record<string, ProductionContext> = {
  "st-3": {
    taskId: "st-3",
    taskTitle: "Generar tabla comparativa",
    sources: [
      "Libro Vivo → Vector: Posicionamiento Competitivo",
      "Framework: Porter's Five Forces",
      "Dato externo: Reporte Statista LATAM 2025",
    ],
    contextSnippet: `## Fragmento del Libro Vivo\n\n**Posicionamiento:** Diferenciación por servicio premium en segmento medio-alto.\n\n**Competidores directos:** 3 players con pricing agresivo.\n\n**Ventaja competitiva:** Integración vertical + soporte 24/7.`,
    generatedOutput: `| Competidor | Precio Base | Market Share | Diferenciador |\n|-----------|------------|-------------|---------------|\n| CompA     | $2,400/yr  | 34%         | Precio bajo   |\n| CompB     | $3,800/yr  | 28%         | Integraciones |\n| CompC     | $1,900/yr  | 15%         | Freemium      |\n| **Nosotros** | **$3,200/yr** | **—** | **Servicio premium** |\n\n### Análisis\n\nPosición competitiva sólida en el segmento medio-alto. El pricing propuesto de $3,200/yr se ubica estratégicamente por debajo de CompB pero con propuesta de valor superior.\n\n**Recomendación:** Mantener pricing y reforzar narrativa de soporte 24/7 como diferenciador clave.`,
  },
  "st-4": {
    taskId: "st-4",
    taskTitle: "Redactar GTM Playbook",
    sources: [
      "Libro Vivo → Vector: Canales de Adquisición",
      "Framework: GTM Playbook",
      "Sub-tarea completada: Tabla Comparativa",
    ],
    contextSnippet: `## Fragmento del Libro Vivo\n\n**Canales prioritarios:** LinkedIn Ads, partnerships B2B, contenido orgánico.\n\n**Budget asignado:** $4,800 para Q3.\n\n**KPI objetivo:** 150 MQLs / mes.`,
    generatedOutput: `# GTM Playbook — LATAM Q3 2026\n\n## 1. Segmento Objetivo\nEmpresas medianas (50-200 empleados) en México, Colombia y Chile.\n\n## 2. Canales de Activación\n- **LinkedIn Ads:** $2,000/mes — segmentación por cargo\n- **Partnerships:** 5 integradores locales identificados\n- **Content:** 4 artículos/mes + 1 webinar\n\n## 3. Messaging\n> "La plataforma que tu equipo realmente va a usar."\n\n## 4. Timeline\n- Semana 1-2: Setup de campañas\n- Semana 3-4: Launch partnerships\n- Semana 5+: Optimización por datos`,
  },
};

export function getSubtasksByStatus(status: KanbanColumnId): PMSubTask[] {
  return PM_SUBTASKS.filter((t) => t.status === status);
}

export function getProductionContext(taskId: string): ProductionContext | null {
  return PRODUCTION_CONTEXTS[taskId] || null;
}

export function isReviewBottleneck(task: PMSubTask): boolean {
  return task.status === "review";
}
