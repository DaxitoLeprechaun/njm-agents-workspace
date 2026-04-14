// ─── Types ───────────────────────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  sector: string;
  status: "Activo" | "En Setup" | "Pausado";
  health: number;
  libroVivoComplete: boolean;
}

export interface StrategicVector {
  id: string;
  brandId: string;
  name: string;
  category: string;
  validated: boolean;
  summary?: string;
}

export interface Artifact {
  id: string;
  brandId: string;
  name: string;
  description: string;
  status: "Completado" | "Pendiente" | "En Progreso";
  framework?: string;
}

// Placeholder types for future LangGraph integration
export interface LibroVivoSchema {
  brandId: string;
  vectors: StrategicVector[];
  generatedAt?: string;
  signedBy?: string;
}

export interface TarjetaSugerenciaUI {
  type: "alignment" | "warning" | "insight";
  title: string;
  description: string;
  source: string;
  confidence: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────
export const brands: Brand[] = [
  { id: "1", name: "Disrupt", sector: "SaaS B2B", status: "Activo", health: 80, libroVivoComplete: true },
  { id: "2", name: "NovaTech", sector: "FinTech", status: "Activo", health: 65, libroVivoComplete: false },
  { id: "3", name: "Meridian", sector: "HealthTech", status: "En Setup", health: 30, libroVivoComplete: false },
  { id: "4", name: "Apex Growth", sector: "E-Commerce", status: "Activo", health: 92, libroVivoComplete: true },
  { id: "5", name: "Lumina AI", sector: "AI/ML", status: "Pausado", health: 45, libroVivoComplete: false },
];

export const strategicVectors: StrategicVector[] = [
  { id: "v1", brandId: "1", name: "Propósito de Marca", category: "Core", validated: true, summary: "Democratizar la estrategia de consultoría mediante IA agentic." },
  { id: "v2", brandId: "1", name: "Audiencia Objetivo", category: "Business", validated: true, summary: "CTOs y VPs de Producto en empresas SaaS B2B de 50-500 empleados." },
  { id: "v3", brandId: "1", name: "Propuesta de Valor", category: "Core", validated: false },
  { id: "v4", brandId: "1", name: "Posicionamiento", category: "Business", validated: true, summary: "Primer OS de consultoría estratégica impulsado por agentes de IA." },
  { id: "v5", brandId: "1", name: "Identidad Visual", category: "Brand", validated: false },
  { id: "v6", brandId: "1", name: "Tono y Voz", category: "Brand", validated: true, summary: "Profesional, directo, empoderador. Sin jerga innecesaria." },
  { id: "v7", brandId: "1", name: "Estrategia de Canales", category: "Growth", validated: false },
  { id: "v8", brandId: "1", name: "KPIs Estratégicos", category: "Growth", validated: true, summary: "MRR, NPS, CAC/LTV ratio, Time-to-Value, Churn Rate." },
];

export const artifacts: Artifact[] = [
  { id: "a1", brandId: "1", name: "Análisis Ansoff", description: "Matriz de crecimiento estratégico", status: "Completado", framework: "Ansoff Matrix" },
  { id: "a2", brandId: "1", name: "Business Case Q3", description: "Justificación de inversión trimestral", status: "Completado", framework: "Lean Canvas" },
  { id: "a3", brandId: "1", name: "Roadmap Producto", description: "Plan de desarrollo 12 meses", status: "En Progreso", framework: "NOW-NEXT-LATER" },
  { id: "a4", brandId: "1", name: "Análisis Competitivo", description: "Benchmark del sector SaaS", status: "Completado", framework: "Porter's Five Forces" },
  { id: "a5", brandId: "1", name: "Plan de Go-To-Market", description: "Estrategia de lanzamiento", status: "Pendiente", framework: "GTM Playbook" },
  { id: "a6", brandId: "1", name: "OKRs Q3-Q4", description: "Objetivos y resultados clave", status: "En Progreso", framework: "OKR Framework" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getVectorsForBrand(brandId: string): StrategicVector[] {
  return strategicVectors.filter((v) => v.brandId === brandId);
}

export function getArtifactsForBrand(brandId: string): Artifact[] {
  return artifacts.filter((a) => a.brandId === brandId);
}
