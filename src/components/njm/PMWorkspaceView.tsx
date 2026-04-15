import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { WorkspaceSkeleton } from "@/components/njm/WorkspaceSkeleton";
import { EmptyState } from "@/components/njm/EmptyState";
import {
  Briefcase, Lock, Search, Table2, FileText, Target as TargetIcon,
  Lightbulb, ChevronDown, Terminal, Settings2, Zap, Eye,
  CheckCircle2, RefreshCw, Plus, Layers, Clock,
} from "lucide-react";
import { getBrand } from "@/data/brands";
import { useBrandContext } from "@/context/BrandContext";
import { ExecutionConsole } from "@/components/njm/ExecutionConsole";
import { toast } from "sonner";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  ACTIVE_EPIC, PM_SUBTASKS, PM_CONSTRAINTS, KANBAN_COLUMNS,
  getProductionContext, isReviewBottleneck,
  type PMSubTask, type PMConstraint, type KanbanColumnId,
} from "@/data/pmManagement";

/* ── Health Ring (reuse CEO pattern) ── */
function HealthRing({ pct, size = 80 }: { pct: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" opacity={0.3} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="hsl(var(--pm))" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-all duration-700"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className="fill-foreground font-semibold" style={{ fontSize: size * 0.22 }}>
        {pct}%
      </text>
    </svg>
  );
}

/* ── Sub-task type icons ── */
const TASK_TYPE_ICON: Record<string, typeof Search> = {
  research: Search,
  analysis: Lightbulb,
  data: Table2,
  document: FileText,
  strategy: TargetIcon,
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-muted-foreground",
};

export function PMWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const brand = getBrand(id || "");
  const { isLibroVivoComplete, runPMExecution, isPMRunning, pmExecutionSteps } = useBrandContext();

  const [isLoading, setIsLoading] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);
  const [constraints, setConstraints] = useState<PMConstraint[]>(PM_CONSTRAINTS);
  const [subtasks, setSubtasks] = useState<PMSubTask[]>(PM_SUBTASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>("st-3");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <WorkspaceSkeleton cards={6} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />;
  if (!brand) return <div className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Marca no encontrada</p></div>;
  if (!isLibroVivoComplete(id || "")) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState icon={Lock} title="Workspace Bloqueado" description="El Agente PM está esperando la firma del Libro Vivo para empezar a operar. Dirígete al workspace del CEO para completar la validación." />
      </div>
    );
  }

  const selectedContext = selectedTaskId ? getProductionContext(selectedTaskId) : null;
  const selectedTask = subtasks.find((t) => t.id === selectedTaskId);

  const toggleConstraint = (cId: string) => {
    setConstraints((prev) => prev.map((c) => c.id === cId ? { ...c, active: !c.active } : c));
  };

  const handleRegenerate = () => {
    toast.info("Re-generando desglose…", { description: "El motor de desglose está recalculando sub-tareas." });
  };

  const handleAddSubtask = () => {
    const newTask: PMSubTask = {
      id: `st-${Date.now()}`,
      epicId: ACTIVE_EPIC.id,
      title: "Nueva sub-tarea",
      type: "document",
      status: "backlog",
      priority: "medium",
    };
    setSubtasks((prev) => [...prev, newTask]);
    toast.success("Sub-tarea agregada al backlog");
  };

  const handleExecute = () => {
    runPMExecution(() => {
      toast.success("Ejecución táctica completada", {
        description: "El Agente PM ha finalizado el análisis y generación de artefactos.",
      });
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/" className="text-muted-foreground hover:text-foreground">Hub</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/brand/${id}/ceo`} className="text-muted-foreground hover:text-foreground">{brand.name}</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Agente PM</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl glass bg-pm/10">
            <Briefcase className="h-5 w-5 text-pm-fg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Modo Ejecución — <span className="text-pm-fg">{brand.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Dashboard Táctico · Agente PM</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 pb-24 space-y-6">

        {/* ═══ NÚCLEO 1: Contexto Operativo ═══ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-pm-fg" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 1 — Contexto Operativo</h2>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between rounded-2xl px-6 py-4 glass-strong">
            <div className="flex items-center gap-4">
              <HealthRing pct={100} size={56} />
              <div>
                <p className="text-sm font-semibold text-foreground">Agente PM: Operativo</p>
                <p className="text-xs text-muted-foreground">Épica activa asignada por el CEO</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowConsole((p) => !p)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all glass-subtle hover:shadow-md ${showConsole ? "text-pm-fg" : "text-muted-foreground hover:text-foreground"}`}>
                <Terminal className="h-3.5 w-3.5" /> Terminal
              </button>
              <button onClick={() => setShowConstraints((p) => !p)} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all">
                <Settings2 className="h-3.5 w-3.5" /> Constraints
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showConstraints ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Epic card */}
          <div className="mt-4 rounded-2xl px-6 py-4 glass border-l-2 border-pm/40">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-pm-fg" />
              <span className="text-[10px] uppercase tracking-widest text-pm-fg font-semibold">Épica Activa</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">{ACTIVE_EPIC.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ACTIVE_EPIC.description}</p>
          </div>

          {/* Constraints panel */}
          <div className={`transition-all duration-500 overflow-hidden ${showConstraints ? "max-h-[200px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-wrap gap-2 rounded-2xl px-6 py-4 glass">
              {constraints.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleConstraint(c.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    c.active
                      ? "bg-pm/20 text-pm-fg ring-1 ring-pm/30"
                      : "glass-subtle text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Console */}
          <div className={`transition-all duration-500 overflow-hidden ${showConsole ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="rounded-2xl border overflow-hidden" style={{ background: "hsla(220, 20%, 8%, 0.92)", borderColor: "hsla(0, 0%, 100%, 0.08)" }}>
              <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-pm/80" />
                </div>
                <span className="ml-2 text-[11px] font-mono text-white/40 uppercase tracking-widest">Terminal PM — Log</span>
              </div>
              <div className="px-5 py-4 space-y-2 max-h-[200px] overflow-auto scrollbar-thin font-mono text-[13px]">
                <div className="flex items-start gap-3">
                  <span className="text-white/20 text-[10px] shrink-0 mt-0.5">14:32</span>
                  <span className="shrink-0 text-[11px] font-bold text-pm-fg">[PM]</span>
                  <span className="text-white/70">Épica recibida del CEO: "Estrategia de Lanzamiento LATAM"</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/20 text-[10px] shrink-0 mt-0.5">14:33</span>
                  <span className="shrink-0 text-[11px] font-bold text-pm-fg">[PM]</span>
                  <span className="text-white/70">Desglose generado: 8 sub-tareas identificadas</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/20 text-[10px] shrink-0 mt-0.5">14:45</span>
                  <span className="shrink-0 text-[11px] font-bold text-pm-fg">[PM]</span>
                  <span className="text-white/70">Sub-tarea st-1 completada → movida a "Done"</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white/20 text-[10px] shrink-0 mt-0.5">15:10</span>
                  <span className="shrink-0 text-[11px] font-bold text-pm-fg">[PM]</span>
                  <span className="text-white/70">GTM Playbook enviado a revisión del CEO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ NÚCLEOS 2 & 3 ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── NÚCLEO 2: Motor de Desglose ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-pm-fg" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 2 — Motor de Desglose</h2>
              <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium glass-subtle text-muted-foreground">{subtasks.length}</span>
            </div>
            <div className="rounded-2xl p-5 glass-strong space-y-1">
              {subtasks.map((task, i) => {
                const Icon = TASK_TYPE_ICON[task.type] || FileText;
                const isDone = task.status === "done";
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 group ${
                      selectedTaskId === task.id ? "glass bg-pm/5 ring-1 ring-pm/20" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="relative flex items-center">
                      <div className={`h-2 w-0.5 absolute -left-3 top-0 bottom-0 ${i > 0 ? "bg-white/[0.06]" : ""}`} />
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${
                        isDone ? "bg-pm/20" : "bg-white/[0.04]"
                      }`}>
                        {isDone
                          ? <CheckCircle2 className="h-3 w-3 text-pm-fg" />
                          : <Icon className="h-3 w-3 text-muted-foreground" />
                        }
                      </div>
                    </div>
                    <span className={`text-sm flex-1 truncate ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.title}
                    </span>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                    <span className="text-[10px] text-muted-foreground/60 uppercase">{task.status === "review" ? "Rev." : task.status === "executing" ? "Exec." : task.status === "done" ? "✓" : ""}</span>
                  </button>
                );
              })}
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                <button onClick={handleRegenerate} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all">
                  <RefreshCw className="h-3 w-3" /> Re-generar
                </button>
                <button onClick={handleAddSubtask} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground glass-subtle hover:text-foreground hover:shadow-md transition-all">
                  <Plus className="h-3 w-3" /> Agregar
                </button>
              </div>
            </div>
          </section>

          {/* ── NÚCLEO 3: Tablero Táctico (Mini Kanban) ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TargetIcon className="h-4 w-4 text-pm-fg" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 3 — Tablero Táctico</h2>
            </div>
            <div className="rounded-2xl p-5 glass-strong space-y-4">
              {KANBAN_COLUMNS.map((col) => {
                const colTasks = subtasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{col.label}</span>
                      <span className="text-[10px] text-muted-foreground/50">({colTasks.length})</span>
                    </div>
                    {colTasks.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground/30 pl-4 italic">Sin tareas</p>
                    ) : (
                      <div className="space-y-1 pl-4">
                        {colTasks.map((task) => {
                          const Icon = TASK_TYPE_ICON[task.type] || FileText;
                          const bottleneck = isReviewBottleneck(task);
                          return (
                            <button
                              key={task.id}
                              onClick={() => setSelectedTaskId(task.id)}
                              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-200 ${
                                selectedTaskId === task.id ? "glass ring-1 ring-pm/20" : "hover:bg-white/[0.03]"
                              } ${bottleneck ? "ring-1 ring-amber-500/40 animate-pulse" : ""}`}
                            >
                              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-xs text-foreground flex-1 truncate">{task.title}</span>
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                              {bottleneck && <Clock className="h-3 w-3 text-amber-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ═══ NÚCLEO 4: Terminal de Producción (Split View) ═══ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-pm-fg" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Núcleo 4 — Terminal de Producción</h2>
            {selectedTask && (
              <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium bg-pm/15 text-pm-fg">{selectedTask.title}</span>
            )}
          </div>

          {!selectedContext ? (
            <div className="rounded-2xl p-12 glass-strong flex flex-col items-center justify-center">
              <Eye className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Selecciona una tarea del tablero para ver su producción</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border" style={{ borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
              {/* Left: Context (40%) */}
              <div className="lg:col-span-2 p-5" style={{ background: "hsla(220, 20%, 8%, 0.92)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Contexto / Fuentes</span>
                </div>
                <div className="space-y-2 mb-5">
                  {selectedContext.sources.map((src, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] text-white/20 mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="text-xs text-white/50 font-mono">{src}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4" style={{ borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
                  <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap leading-relaxed">{selectedContext.contextSnippet}</pre>
                </div>
              </div>

              {/* Right: Output (60%) */}
              <div className="lg:col-span-3 p-5 border-l" style={{ background: "hsla(220, 18%, 10%, 0.88)", borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Output Generado</span>
                  {selectedTask && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-medium ${
                      selectedTask.status === "done" ? "bg-pm/20 text-pm-fg"
                        : selectedTask.status === "review" ? "bg-amber-500/20 text-amber-400"
                        : "bg-agency/20 text-agency-fg"
                    }`}>{selectedTask.status}</span>
                  )}
                </div>
                <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap leading-relaxed">{selectedContext.generatedOutput}</pre>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 px-4 w-full md:w-auto flex justify-center">
        <button
          onClick={handleExecute}
          disabled={isPMRunning}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 ${
            isPMRunning ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105"
          }`}
          style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <Zap className={`h-4 w-4 ${isPMRunning ? "animate-pulse" : ""}`} />
          {isPMRunning ? "Ejecutando…" : "Ejecutar Tarea Seleccionada"}
        </button>
      </div>

      {/* Execution Console */}
      <ExecutionConsole
        visible={isPMRunning || pmExecutionSteps.length > 0}
        steps={pmExecutionSteps}
        agentLabel="Agente PM"
      />
    </div>
  );
}
