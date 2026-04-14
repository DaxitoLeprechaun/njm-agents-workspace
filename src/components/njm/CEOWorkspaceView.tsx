import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { WorkspaceSkeleton } from "@/components/njm/WorkspaceSkeleton";
import { EmptyState } from "@/components/njm/EmptyState";
import {
  Inbox, ShieldCheck, CheckCircle2, AlertTriangle, FileUp, MessageSquare,
  Play, BookOpen, Eye, Filter, Info, ChevronDown, Settings2, Zap,
  Terminal, Sparkles, CircleDot, Layers, Lock,
  BarChart3, GitBranch, Target, Forward, Clock, XCircle, MessageCircle, User,
  ClipboardList, Megaphone, Handshake,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CEO_ROADMAP_TASKS, PM_SUBMISSIONS, AGENT_LOG_ENTRIES, AUTONOMY_LEVEL_LABELS,
  AVAILABLE_AGENTS,
  getTimeAgo, isBottleneck,
  type CEOTask, type PMSubmission, type AutonomyLevel,
} from "@/data/ceoManagement";

const CATEGORY_DEFINITIONS: Record<string, string> = {
  Core: "Vectores fundamentales que definen la esencia de la marca: propósito, propuesta de valor y diferenciación.",
  Business: "Vectores comerciales: audiencia objetivo, posicionamiento competitivo y modelo de negocio.",
  Brand: "Vectores de identidad: identidad visual, tono de voz y personalidad de marca.",
  Growth: "Vectores de crecimiento: canales de adquisición, KPIs estratégicos y estrategia de escalamiento.",
};

const PM_SKILLS = ["Análisis Competitivo", "Research", "Generación de Contenido", "Roadmapping"];

import { getBrand } from "@/data/brands";
import { useBrandContext } from "@/context/BrandContext";
import { toast } from "sonner";
import { DataIngestionModal } from "@/components/njm/DataIngestionModal";
import { ExecutionConsole } from "@/components/njm/ExecutionConsole";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

/* ── Sub-components ─────────────────────────────────────── */

function HealthRing({ pct, size = 96 }: { pct: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct === 100 ? "hsl(var(--pm))" : "hsl(var(--ceo))";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" opacity={0.3} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-all duration-700"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className="fill-foreground text-lg font-semibold" style={{ fontSize: size * 0.22 }}>
        {pct}%
      </text>
    </svg>
  );
}

function PendingChecklist({ vectors }: { vectors: { name: string; category: string; validated: boolean }[] }) {
  return (
    <ul className="space-y-1.5 max-h-[200px] overflow-auto scrollbar-thin pr-1">
      {vectors.map((v) => (
        <li key={v.name} className="flex items-center gap-2 text-xs">
          {v.validated
            ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-pm-fg" />
            : <CircleDot className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
          <span className={v.validated ? "text-muted-foreground line-through" : "text-foreground"}>{v.name}</span>
          <span className="ml-auto text-[10px] text-muted-foreground uppercase">{v.category}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Main Component ─────────────────────────────────────── */

export function CEOWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const brand = getBrand(id || "");
  const { getVectors, toggleVector, isLibroVivoComplete, signLibroVivo, isScanning, scanningVectorId, executionSteps, runCEOAudit } = useBrandContext();
  const vectors = getVectors(id || "");

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Derived health
  const validated = vectors.filter((v) => v.validated).length;
  const total = vectors.length;
  const agentHealth = total > 0 ? Math.round((validated / total) * 100) : 0;
  const allValidated = agentHealth === 100;
  const pendingVectors = vectors.filter((v) => !v.validated);
  const urgentVector = pendingVectors[0] || null;

  // Phase 2 / Management Mode state
  const [showConfig, setShowConfig] = useState(false);
  const [pmSkills, setPmSkills] = useState<string[]>(["Análisis Competitivo", "Research"]);
  const [pmAutonomy, setPmAutonomy] = useState<AutonomyLevel>(1);
  const [showConsole, setShowConsole] = useState(false);
  const [reviewSubmission, setReviewSubmission] = useState<PMSubmission | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [submissions, setSubmissions] = useState(PM_SUBMISSIONS);
  const [ceoTasks, setCeoTasks] = useState(CEO_ROADMAP_TASKS);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<"all" | "validated" | "pending">("all");

  const categories = useMemo(() => {
    const cats = new Set(vectors.map((v) => v.category));
    return ["Todos", ...Array.from(cats)];
  }, [vectors]);

  const filteredVectors = useMemo(() => {
    return vectors.filter((v) => {
      const matchCat = categoryFilter === "Todos" || v.category === categoryFilter;
      const matchStatus = statusFilter === "all" || (statusFilter === "validated" ? v.validated : !v.validated);
      return matchCat && matchStatus;
    });
  }, [vectors, categoryFilter, statusFilter]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"doc" | "briefing">("doc");
  const [modalVector, setModalVector] = useState({ name: "", category: "" });

  const openModal = (mode: "doc" | "briefing", vectorName: string, vectorCategory: string) => {
    setModalMode(mode);
    setModalVector({ name: vectorName, category: vectorCategory });
    setModalOpen(true);
  };

  const handleToggle = (vectorId: string) => {
    if (isScanning) return;
    const vector = vectors.find((v) => v.id === vectorId);
    toggleVector(id || "", vectorId);
    if (vector && !vector.validated) {
      toast.success("Vector validado correctamente");
    }
  };

  const handleSignLibroVivo = () => {
    signLibroVivo(id || "");
  };

  const handleAudit = () => {
    runCEOAudit(id || "", () => {
      toast.success("Auditoría completada", {
        description: "Todos los vectores han sido validados por el Agente CEO.",
      });
    });
  };

  const handleInitPM = () => {
    if (!isLibroVivoComplete(id || "")) {
      handleSignLibroVivo();
    }
    toast.success("✅ Agente PM inicializado", {
      description: `Skills: ${pmSkills.join(", ")} · Autonomía: ${AUTONOMY_LEVEL_LABELS[pmAutonomy].label}`,
    });
    setTimeout(() => navigate(`/brand/${id}/pm`), 800);
  };

  const toggleSkill = (skill: string) => {
    setPmSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  if (isLoading) {
    return <WorkspaceSkeleton cards={8} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />;
  }

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  if (vectors.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={Inbox}
          title="Sin vectores estratégicos"
          description="Esta marca aún no tiene vectores definidos. Inicia una auditoría para generar el ADN estratégico."
          actionLabel="Iniciar Auditoría"
          onAction={() => runCEOAudit(id || "")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-muted-foreground hover:text-foreground">Hub</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/brand/${id}/ceo`} className="text-muted-foreground hover:text-foreground">{brand.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agente CEO</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl glass bg-ceo/10">
            <ShieldCheck className="h-5 w-5 text-ceo-fg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard del CEO — <span className="text-ceo-fg">{brand.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Vectores Estratégicos · Guardián del ADN</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 pb-24">

        {/* ═══════ PHASE 2: Management Mode — 4 Núcleos ═══════ */}
        {allValidated && (
          <div className="mb-6 animate-fade-in space-y-6">

            {/* ── NÚCLEO 1: Estado del Agente CEO ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-ceo-fg" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 1 — Estado del Agente</h2>
              </div>

              <div className="flex items-center justify-between rounded-2xl px-6 py-4 glass-strong">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pm/20">
                    <CheckCircle2 className="h-5 w-5 text-pm-fg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Agente CEO: Modo Gestión (100%)</p>
                    <p className="text-xs text-muted-foreground">Todos los vectores validados · ADN completo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isLibroVivoComplete(id || "") && (
                    <button onClick={() => navigate(`/brand/${id}/libro-vivo`)} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground glass-subtle hover:shadow-md transition-all">
                      <Eye className="h-3.5 w-3.5" /> Ver Libro Vivo
                    </button>
                  )}
                  <button onClick={() => setShowConsole((p) => !p)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all glass-subtle hover:shadow-md ${showConsole ? "text-ceo-fg" : "text-muted-foreground hover:text-foreground"}`}>
                    <Terminal className="h-3.5 w-3.5" /> Consola
                  </button>
                  <button onClick={() => setShowConfig((p) => !p)} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all">
                    <Settings2 className="h-3.5 w-3.5" /> Configuración
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showConfig ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${showConfig ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl p-5 glass flex flex-col items-center">
                    <HealthRing pct={100} size={80} />
                    <p className="mt-2 text-xs text-pm-fg font-medium">Sistema operativo</p>
                  </div>
                  <div className="rounded-2xl p-5 glass col-span-2">
                    <PendingChecklist vectors={vectors} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl px-6 py-4 glass flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 shrink-0">
                  <Sparkles className="h-4 w-4 text-pm-fg" />
                  <span className="text-xs font-medium text-foreground">Autonomía del PM</span>
                </div>
                <div className="flex-1 max-w-xs">
                  <Slider value={[pmAutonomy]} onValueChange={([v]) => setPmAutonomy(v as AutonomyLevel)} min={0} max={2} step={1} />
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  <span className="text-foreground font-medium">{AUTONOMY_LEVEL_LABELS[pmAutonomy].label}</span>{" — "}{AUTONOMY_LEVEL_LABELS[pmAutonomy].description}
                </div>
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${showConsole ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                <div className="rounded-2xl border overflow-hidden" style={{ background: "hsla(220, 20%, 8%, 0.92)", borderColor: "hsla(0, 0%, 100%, 0.08)" }}>
                  <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
                    <div className="flex gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-pm/80" />
                    </div>
                    <span className="ml-2 text-[11px] font-mono text-white/40 uppercase tracking-widest">Razonamiento de Agentes — Log</span>
                  </div>
                  <div className="px-5 py-4 space-y-2 max-h-[200px] overflow-auto scrollbar-thin font-mono text-[13px]">
                    {AGENT_LOG_ENTRIES.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-white/20 text-[10px] shrink-0 mt-0.5">{entry.timestamp.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className={`shrink-0 text-[11px] font-bold ${entry.agent === "CEO" ? "text-ceo-fg" : "text-pm-fg"}`}>[{entry.agent}]</span>
                        <span className="text-white/70">{entry.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── NÚCLEOS 2 & 3: Tareas + Aprobaciones ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NÚCLEO 2: Tareas Pendientes */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-ceo-fg" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 2 — Tareas Pendientes</h2>
                  <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium glass-subtle text-muted-foreground">{ceoTasks.length}</span>
                </div>
                <div className="rounded-2xl p-5 glass-strong space-y-3">
                  {ceoTasks.map((task) => {
                    const IconMap: Record<string, typeof BarChart3> = { analysis: BarChart3, structure: GitBranch, strategy: Target, delegation: Forward };
                    const TaskIcon = IconMap[task.type] || Target;
                    return (
                      <div key={task.id} className="rounded-xl p-4 glass group hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ceo/10 shrink-0"><TaskIcon className="h-4 w-4 text-ceo-fg" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-foreground truncate">{task.title}</h3>
                              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${task.priority === "high" ? "bg-destructive/20 text-destructive" : task.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"}`}>{task.priority}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => toast.info(`Ejecutando: ${task.title}`)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-ceo-fg glass-subtle hover:shadow-md transition-all"><Play className="h-3 w-3" /> Ejecutar Tarea</button>
                          <button onClick={() => toast.info(`Delegando al PM: ${task.title}`)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all"><Forward className="h-3 w-3" /> Delegar al PM</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* NÚCLEO 3: Pendientes por Aprobar */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4 text-pm-fg" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 3 — Pendientes por Aprobar</h2>
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-pm/20 text-pm-fg">{submissions.filter((s) => s.status === "pending").length}</span>
                </div>
                <div className="rounded-2xl p-5 glass-strong space-y-3">
                  {submissions.filter((s) => s.status === "pending").map((sub) => {
                    const bottleneck = isBottleneck(sub.submittedAt);
                    return (
                      <div key={sub.id} className={`rounded-xl p-4 glass transition-all duration-300 ${bottleneck ? "ring-2 ring-amber-500/40 animate-pulse" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pm/20 shrink-0"><User className="h-3.5 w-3.5 text-pm-fg" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="rounded-full px-2 py-0.5 text-[9px] font-medium bg-pm/20 text-pm-fg">Agente PM</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {getTimeAgo(sub.submittedAt)}</span>
                              {bottleneck && <span className="text-[9px] text-amber-400 font-medium">⚠ Cuello de botella</span>}
                            </div>
                            <h3 className="text-sm font-medium text-foreground">{sub.taskName}</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Framework: {sub.framework}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => { setReviewSubmission(sub); setReviewFeedback(""); }} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all hover:shadow-md bg-pm/15 text-pm-fg"><CheckCircle2 className="h-3 w-3" /> Revisar & Aprobar</button>
                          <button onClick={() => { setSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, status: "rejected" as const } : s)); toast.error(`Rechazado: ${sub.taskName}`); }} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-destructive/80 glass-subtle hover:text-destructive hover:shadow-md transition-all"><XCircle className="h-3 w-3" /> Rechazar</button>
                        </div>
                      </div>
                    );
                  })}
                  {submissions.filter((s) => s.status === "pending").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-xs">Sin submissions pendientes</div>
                  )}
                </div>
              </section>
            </div>

            {/* ── NÚCLEO 4: Core de Contrataciones ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="h-4 w-4 text-ceo-fg" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 4 — Core de Contrataciones</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {AVAILABLE_AGENTS.map((agent) => {
                  const isActive = agent.status === "active";
                  const isLocked = agent.status === "locked";
                  const AgentIconMap: Record<string, typeof ClipboardList> = { "clipboard-list": ClipboardList, megaphone: Megaphone, handshake: Handshake };
                  const AgentIcon = AgentIconMap[agent.icon] || ClipboardList;
                  return (
                    <div key={agent.id} className={`rounded-2xl p-5 glass transition-all duration-300 ${isLocked ? "opacity-50" : "hover:shadow-lg hover:-translate-y-1"} ${isActive ? "border border-pm/30" : ""}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-pm/20" : "bg-muted/30"}`}>
                          {isLocked ? <Lock className="h-5 w-5 text-muted-foreground/50" /> : <AgentIcon className="h-5 w-5 text-pm-fg" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${isActive ? "bg-pm/20 text-pm-fg" : "bg-muted text-muted-foreground"}`}>
                          {isActive ? "Activo" : isLocked ? "Próximamente" : "Disponible"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {agent.skills.map((skill) => (
                          <span key={skill} className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${isActive && agent.id === "pm" ? (pmSkills.includes(skill) ? "bg-pm/20 text-pm-fg" : "glass-subtle text-muted-foreground cursor-pointer hover:text-foreground") : "glass-subtle text-muted-foreground"}`} onClick={() => { if (isActive && agent.id === "pm") toggleSkill(skill); }}>{skill}</span>
                        ))}
                      </div>
                      {isActive && agent.id === "pm" && (
                        <button onClick={handleInitPM} disabled={pmSkills.length === 0} className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed bg-pm/80 hover:bg-pm">
                          <Sparkles className="h-3.5 w-3.5" />
                          {isLibroVivoComplete(id || "") ? "Ir al Workspace PM" : "Inicializar Agente PM"}
                        </button>
                      )}
                      {isLocked && (
                        <div className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground/50 glass-subtle cursor-not-allowed">
                          <Lock className="h-3.5 w-3.5" /> Coming Soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* ═══════ PHASE 1: Setup ═══════ */}
        {!allValidated && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            {/* Card 1: Health */}
            <div className="rounded-2xl p-5 glass flex flex-col items-center justify-center text-center">
              <HealthRing pct={agentHealth} />
              <p className="mt-3 text-xs text-muted-foreground">
                Requiere configuración para operar
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {validated}/{total} vectores validados
              </p>
            </div>

            {/* Card 2: Triage */}
            <div className="rounded-2xl p-5 glass">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Triaje / Pendientes</h3>
              </div>
              <PendingChecklist vectors={vectors} />
            </div>

            {/* Card 3: Urgent */}
            {urgentVector && (
              <div className="rounded-2xl p-5 glass border border-ceo/30">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-ceo-fg" />
                  <h3 className="text-sm font-medium text-ceo-fg">Acción Urgente</h3>
                </div>
                <p className="text-sm font-medium text-foreground">{urgentVector.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{urgentVector.category}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openModal("doc", urgentVector.name, urgentVector.category)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground glass-subtle hover:shadow-md transition-all"
                  >
                    <FileUp className="h-3.5 w-3.5" /> Iniciar Onboarding
                  </button>
                  <button
                    onClick={() => openModal("briefing", urgentVector.name, urgentVector.category)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground glass-subtle hover:shadow-md hover:text-foreground transition-all"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Briefing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ Vector Grid (both phases) ═══════ */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground mr-1" />
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              <button
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  categoryFilter === cat ? "glass text-ceo-fg shadow-md" : "glass-subtle text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
              {cat !== "Todos" && CATEGORY_DEFINITIONS[cat] && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="glass-strong border-none max-w-[220px]">
                    <p className="text-xs">{CATEGORY_DEFINITIONS[cat]}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
          <div className="ml-auto flex gap-1.5">
            {(["all", "validated", "pending"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  statusFilter === s ? "glass text-foreground shadow-md" : "glass-subtle text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "Todos" : s === "validated" ? "Validados" : "Pendientes"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVectors.map((v, i) => {
            const isBeingScanned = scanningVectorId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => handleToggle(v.id)}
                className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] glass ${
                  isBeingScanned ? "ring-2 ring-ceo animate-pulse" : ""
                } ${v.validated ? "border-pm/20 hover:border-pm/40" : "border-destructive/20 hover:border-destructive/40"}`}
                style={{
                  ...(v.validated
                    ? { borderColor: "hsla(160, 84%, 39%, 0.2)" }
                    : { borderColor: "hsla(0, 84%, 60%, 0.2)" }),
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start gap-3">
                  {v.validated
                    ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pm-fg" />
                    : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{v.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium glass-subtle ${
                        v.validated ? "bg-pm/20 text-pm-fg" : "bg-destructive/20 text-destructive"
                      }`}>
                        {v.validated ? "Validado" : "Pendiente"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">{v.category}</p>
                    {v.validated && v.summary && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{v.summary}</p>
                    )}
                  </div>
                </div>
                {!v.validated && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal("doc", v.name, v.category); }}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground"
                    >
                      <FileUp className="h-3.5 w-3.5" /> Upload Doc
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal("briefing", v.name, v.category); }}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Briefing
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Libro Vivo buttons (Phase 1 only) */}
        {allValidated && !isLibroVivoComplete(id || "") && !allValidated && (
          <div className="mt-8 flex justify-center animate-fade-in">
            <button
              onClick={handleSignLibroVivo}
              className="flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 glass-strong"
              style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
            >
              <BookOpen className="h-5 w-5" />
              Firmar y Generar Libro Vivo
            </button>
          </div>
        )}
      </main>

      {/* Floating audit action */}
      {!allValidated && (
        <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 px-4 w-full md:w-auto flex justify-center">
          <button
            onClick={handleAudit}
            disabled={isScanning}
            className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 glass-strong ${
              isScanning ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105"
            }`}
            style={{ background: "hsla(271, 81%, 56%, 0.85)", backdropFilter: "blur(20px)" }}
          >
            <Play className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Escaneando…" : "Invocar CEO para Auditoría"}
          </button>
        </div>
      )}

      <DataIngestionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        vectorName={modalVector.name}
        vectorCategory={modalVector.category}
      />

      <ExecutionConsole
        visible={isScanning || executionSteps.length > 0}
        steps={executionSteps}
        agentLabel="Agente CEO"
      />

      {/* Pull Request Review Modal */}
      <Dialog open={!!reviewSubmission} onOpenChange={(open) => { if (!open) setReviewSubmission(null); }}>
        <DialogContent className="max-w-4xl glass-strong border-pm/20" style={{ background: "hsla(220, 15%, 8%, 0.95)" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Eye className="h-5 w-5 text-pm-fg" />
              Revisión — {reviewSubmission?.taskName}
            </DialogTitle>
          </DialogHeader>
          {reviewSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Context & Framework */}
                <div className="rounded-xl p-4 glass">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-ceo-fg" />
                    <h3 className="text-sm font-semibold text-foreground">Contexto & Framework</h3>
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-medium bg-ceo/20 text-ceo-fg ml-auto">
                      {reviewSubmission.framework}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line max-h-[300px] overflow-auto scrollbar-thin">
                    {reviewSubmission.reasoning}
                  </div>
                </div>
                {/* Right: Result */}
                <div className="rounded-xl p-4 glass">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-pm-fg" />
                    <h3 className="text-sm font-semibold text-foreground">Resultado del PM</h3>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line max-h-[300px] overflow-auto scrollbar-thin">
                    {reviewSubmission.resultPreview}
                  </div>
                </div>
              </div>
              {/* Feedback */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Feedback (opcional)
                </label>
                <Textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Agregar comentarios o solicitar cambios..."
                  className="glass border-white/10 text-sm min-h-[60px]"
                />
              </div>
              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSubmissions((prev) => prev.map((s) => s.id === reviewSubmission.id ? { ...s, status: "rejected" as const } : s));
                    toast.info(`Cambios solicitados: ${reviewSubmission.taskName}`);
                    setReviewSubmission(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-amber-400 glass-subtle hover:shadow-md transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Pedir Cambios
                </button>
                <button
                  onClick={() => {
                    setSubmissions((prev) => prev.map((s) => s.id === reviewSubmission.id ? { ...s, status: "approved" as const } : s));
                    toast.success(`Aprobado: ${reviewSubmission.taskName}`);
                    setReviewSubmission(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-xl"
                  style={{ background: "hsla(160, 84%, 39%, 0.85)" }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
