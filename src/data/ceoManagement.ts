/* ── CEO Management Mode — Types & Mock Data ────────────── */

export type TaskType = "analysis" | "structure" | "strategy" | "delegation";
export type Priority = "high" | "medium" | "low";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type AutonomyLevel = 0 | 1 | 2;

export interface CEOTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  priority: Priority;
}

export interface PMSubmission {
  id: string;
  taskName: string;
  framework: string;
  submittedAt: Date;
  status: SubmissionStatus;
  reasoning: string;
  resultPreview: string;
}

export interface AgentLogEntry {
  timestamp: Date;
  agent: "CEO" | "PM";
  message: string;
}

/* ── Mock Data ──────────────────────────────────────────── */

export const CEO_ROADMAP_TASKS: CEOTask[] = [
  {
    id: "ceo-t1",
    type: "analysis",
    title: "Auditoría de Competidores",
    description: "Analizar posicionamiento y estrategia de los 5 competidores principales.",
    priority: "high",
  },
  {
    id: "ceo-t2",
    type: "structure",
    title: "Definir Arquitectura de Marca",
    description: "Establecer sub-marcas, extensiones y jerarquía de productos.",
    priority: "high",
  },
  {
    id: "ceo-t3",
    type: "strategy",
    title: "Roadmap de Crecimiento Q3",
    description: "Diseñar plan de expansión con KPIs y milestones trimestrales.",
    priority: "medium",
  },
  {
    id: "ceo-t4",
    type: "delegation",
    title: "Briefing de Contenidos al PM",
    description: "Preparar brief estratégico para la producción de contenido del próximo sprint.",
    priority: "low",
  },
];

export const PM_SUBMISSIONS: PMSubmission[] = [
  {
    id: "pm-s1",
    taskName: "Análisis de Mercado LATAM",
    framework: "SOSTAC",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    status: "pending",
    reasoning:
      "Basado en el framework SOSTAC (Situation, Objectives, Strategy, Tactics, Action, Control), se realizó un análisis exhaustivo del mercado LATAM.\n\n**Situación actual:** La marca tiene un 3.2% de penetración en la región, concentrada en México y Colombia.\n\n**Objetivos:** Alcanzar 8% de market share en 18 meses.\n\n**Estrategia:** Penetración vía alianzas locales y marketing de contenido en español neutro.",
    resultPreview:
      "# Análisis de Mercado LATAM — Q2 2026\n\n## Hallazgos clave\n- Oportunidad en Brasil (TAM: $2.4B)\n- Competidor principal: Marca X con 12% share\n- Canal preferido: Instagram + TikTok (67% reach)\n\n## Recomendaciones\n1. Lanzar campaña piloto en São Paulo\n2. Alianza con distribuidor regional\n3. Adaptar pricing al poder adquisitivo local\n\n## KPIs propuestos\n| Métrica | Target | Plazo |\n|---------|--------|-------|\n| Market share | 5% | Q4 2026 |\n| CAC | <$18 | Q3 2026 |\n| NPS | >45 | Q1 2027 |",
  },
  {
    id: "pm-s2",
    taskName: "Estrategia de Contenido",
    framework: "Jobs-to-be-Done",
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago — bottleneck
    status: "pending",
    reasoning:
      "Aplicando el framework Jobs-to-be-Done (Christensen), se identificaron 4 jobs principales del público objetivo.\n\n**Job 1:** 'Cuando necesito posicionar mi marca, quiero una estrategia clara para no desperdiciar presupuesto.'\n\n**Job 2:** 'Cuando lanzo un producto nuevo, quiero saber qué canales usar para maximizar impacto.'",
    resultPreview:
      "# Estrategia de Contenido — Sprint 7\n\n## Pilares de contenido\n1. **Educativo** — Guías y frameworks (40%)\n2. **Casos de éxito** — Social proof (30%)\n3. **Producto** — Features y demos (20%)\n4. **Cultura** — Behind the scenes (10%)\n\n## Calendario\n- Lunes: Artículo largo (blog)\n- Miércoles: Carrusel (IG/LinkedIn)\n- Viernes: Video corto (TikTok/Reels)",
  },
  {
    id: "pm-s3",
    taskName: "Benchmark Visual de Identidad",
    framework: "Análisis Semiótico",
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
    status: "pending",
    reasoning:
      "Utilizando análisis semiótico (Barthes), se decodificaron los sistemas de signos visuales de 8 competidores directos.\n\n**Denotación:** Paletas frías dominan el sector (72% usan azules/grises).\n\n**Connotación:** Las marcas líderes proyectan 'confianza tecnológica' mediante tipografías sans-serif geométricas.",
    resultPreview:
      "# Benchmark Visual — Identidad de Marca\n\n## Análisis comparativo\n- 8 competidores analizados\n- Tendencia: minimalismo geométrico\n- Diferenciador disponible: paleta cálida + tipografía humanista\n\n## Recomendación\nAdoptar una identidad visual que contraste con el sector usando colores cálidos y formas orgánicas para comunicar cercanía.",
  },
];

export const AGENT_LOG_ENTRIES: AgentLogEntry[] = [
  { timestamp: new Date(Date.now() - 30 * 60 * 1000), agent: "CEO", message: "Evaluando submissions pendientes del PM..." },
  { timestamp: new Date(Date.now() - 28 * 60 * 1000), agent: "PM", message: "Análisis de Mercado LATAM completado. Enviando a revisión." },
  { timestamp: new Date(Date.now() - 20 * 60 * 1000), agent: "PM", message: "Estrategia de Contenido generada con framework JTBD." },
  { timestamp: new Date(Date.now() - 15 * 60 * 1000), agent: "CEO", message: "Priorizando: Estrategia de Contenido marcada como cuello de botella (>4h)." },
  { timestamp: new Date(Date.now() - 10 * 60 * 1000), agent: "PM", message: "Benchmark Visual finalizado. Pendiente de aprobación." },
  { timestamp: new Date(Date.now() - 5 * 60 * 1000), agent: "CEO", message: "3 submissions en cola. Esperando intervención humana." },
];

export const AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, { label: string; description: string }> = {
  0: { label: "Aprobación total", description: "Todas las tareas requieren revisión" },
  1: { label: "Solo entregables", description: "Auto-aprobar tareas intermedias" },
  2: { label: "Autonomía total", description: "Notificar solo al completar" },
};

/* ── Helpers ────────────────────────────────────────────── */

export function getTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  return `hace ${Math.floor(diffH / 24)}d`;
}

export function isBottleneck(date: Date, thresholdHours = 4): boolean {
  return Date.now() - date.getTime() > thresholdHours * 60 * 60 * 1000;
}
