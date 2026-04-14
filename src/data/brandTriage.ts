import { AlertTriangle, FileX, Search, CheckCircle2, type LucideIcon } from "lucide-react";

export type BrandTriageStatus = "pending_interview" | "missing_docs" | "ready_for_research" | "complete";

export interface TriageBadgeConfig {
  label: string;
  className: string;
  icon: LucideIcon;
}

export const triageBadgeMap: Record<BrandTriageStatus, TriageBadgeConfig> = {
  pending_interview: {
    label: "Entrevista Pendiente",
    icon: AlertTriangle,
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  missing_docs: {
    label: "Falta Ingesta Documental",
    icon: FileX,
    className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  ready_for_research: {
    label: "Falta Investigación de Mercado",
    icon: Search,
    className: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  },
  complete: {
    label: "Listo",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
};

export interface TriageCTA {
  label: string;
  variant: "warning" | "primary" | "accent" | "default";
}

export const triageCTAMap: Record<BrandTriageStatus, TriageCTA> = {
  pending_interview: { label: "Completar Entrevista", variant: "warning" },
  missing_docs: { label: "Subir Documentos", variant: "primary" },
  ready_for_research: { label: "Iniciar Análisis Agéntico", variant: "accent" },
  complete: { label: "Ver Dashboard", variant: "default" },
};

// Mock triage status per brand
export const brandTriageData: Record<string, BrandTriageStatus> = {
  "1": "complete",
  "2": "missing_docs",
  "3": "pending_interview",
  "4": "complete",
  "5": "ready_for_research",
};
