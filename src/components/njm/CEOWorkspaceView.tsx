import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { WorkspaceSkeleton } from "@/components/njm/WorkspaceSkeleton";
import { EmptyState } from "@/components/njm/EmptyState";
import {
  Inbox, ShieldCheck, CheckCircle2, AlertTriangle, FileUp, MessageSquare,
  Play, BookOpen, Eye, Filter, Info, ChevronDown, Settings2, Zap,
  Terminal, Sparkles, CircleDot, Layers,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

const CATEGORY_DEFINITIONS: Record<string, string> = {
  Core: "Vectores fundamentales que definen la esencia de la marca: propósito, propuesta de valor y diferenciación.",
  Business: "Vectores comerciales: audiencia objetivo, posicionamiento competitivo y modelo de negocio.",
  Brand: "Vectores de identidad: identidad visual, tono de voz y personalidad de marca.",
  Growth: "Vectores de crecimiento: canales de adquisición, KPIs estratégicos y estrategia de escalamiento.",
};

const PM_SKILLS = ["Análisis Competitivo", "Research", "Generación de Contenido", "Roadmapping"];
const AUTONOMY_LABELS = ["Supervisado", "Semi-Autónomo", "Autónomo"];

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

  // Phase 2 state
  const [showConfig, setShowConfig] = useState(false);
  const [pmSkills, setPmSkills] = useState<string[]>(["Análisis Competitivo", "Research"]);
  const [pmAutonomy, setPmAutonomy] = useState(1); // 0=Supervisado, 1=Semi, 2=Autónomo

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
      description: `Skills: ${pmSkills.join(", ")} · Autonomía: ${AUTONOMY_LABELS[pmAutonomy]}`,
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

        {/* ═══════ PHASE 2: Operational ═══════ */}
        {allValidated && (
          <div className="mb-6 animate-fade-in">
            {/* Command bar */}
            <div className="flex items-center justify-between rounded-2xl px-6 py-4 glass-strong mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pm/20">
                  <CheckCircle2 className="h-5 w-5 text-pm-fg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Agente CEO: Operativo (100%)</p>
                  <p className="text-xs text-muted-foreground">Todos los vectores validados · ADN completo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLibroVivoComplete(id || "") && (
                  <button
                    onClick={() => navigate(`/brand/${id}/libro-vivo`)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-foreground glass-subtle hover:shadow-md transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" /> Ver Libro Vivo
                  </button>
                )}
                <button
                  onClick={() => setShowConfig((p) => !p)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Ver Configuración
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showConfig ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Collapsible config */}
            <div className={`transition-all duration-500 overflow-hidden ${showConfig ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="rounded-2xl p-5 glass">
                  <HealthRing pct={100} size={80} />
                  <p className="mt-2 text-xs text-pm-fg font-medium">Sistema operativo</p>
                </div>
                <div className="rounded-2xl p-5 glass col-span-2">
                  <PendingChecklist vectors={vectors} />
                </div>
              </div>
            </div>

            {/* PM Initialization Workspace */}
            <div className="rounded-2xl p-6 glass-strong border border-pm/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-5">
                <Terminal className="h-5 w-5 text-pm-fg" />
                <h2 className="text-base font-semibold text-foreground">Inicializar Agente PM</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    Habilidades del PM
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PM_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                          pmSkills.includes(skill)
                            ? "glass text-pm-fg shadow-md ring-1 ring-pm/30"
                            : "glass-subtle text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Autonomy */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    Nivel de Autonomía
                  </label>
                  <Slider
                    value={[pmAutonomy]}
                    onValueChange={([v]) => setPmAutonomy(v)}
                    min={0} max={2} step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    {AUTONOMY_LABELS.map((l) => <span key={l}>{l}</span>)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleInitPM}
                  disabled={pmSkills.length === 0}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
                >
                  <Sparkles className="h-4 w-4" />
                  Inicializar Agente PM
                </button>
                {!isLibroVivoComplete(id || "") && (
                  <button
                    onClick={handleSignLibroVivo}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-foreground glass-subtle hover:shadow-lg transition-all"
                  >
                    <BookOpen className="h-4 w-4" />
                    Firmar Libro Vivo
                  </button>
                )}
              </div>
            </div>
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
    </div>
  );
}
