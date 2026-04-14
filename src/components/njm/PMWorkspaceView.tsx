import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, FileText, Zap, Lock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getBrand, getArtifactsForBrand } from "@/data/brands";
import { DocumentSheet } from "@/components/njm/DocumentSheet";
import { ExecutionConsole } from "@/components/njm/ExecutionConsole";
import { useBrandContext } from "@/context/BrandContext";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const FRAMEWORK_DEFINITIONS: Record<string, string> = {
  "Ansoff Matrix": "Herramienta estratégica para planificar crecimiento: penetración de mercado, desarrollo de mercado/producto y diversificación.",
  "Lean Canvas": "Modelo de una página para validar hipótesis de negocio: problema, solución, métricas clave y ventaja competitiva.",
  "Porter's Five Forces": "Análisis de las 5 fuerzas competitivas de una industria: rivalidad, poder de proveedores/clientes, amenaza de sustitutos y nuevos entrantes.",
  "OKR Framework": "Objectives & Key Results — metodología para definir objetivos ambiciosos con resultados medibles en ciclos trimestrales.",
  "NOW-NEXT-LATER": "Roadmap priorizado en 3 horizontes: NOW (en ejecución), NEXT (próximo ciclo) y LATER (visión futura).",
  "GTM Playbook": "Go-To-Market Playbook — estrategia de lanzamiento que define segmento, canales, messaging y plan de activación.",
  "Jobs-to-be-Done": "Framework centrado en el 'trabajo' que el cliente necesita realizar, no en demografía o features del producto.",
};

const statusConfig: Record<string, { color: string; dot: string }> = {
  Completado: { color: "bg-pm/20 text-pm-fg", dot: "bg-pm" },
  Pendiente: { color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  "En Progreso": { color: "bg-agency/20 text-agency-fg", dot: "bg-agency" },
};

export function PMWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const brand = getBrand(id || "");
  const artifacts = getArtifactsForBrand(id || "");
  const { isLibroVivoComplete, runPMExecution, isPMRunning, pmExecutionSteps } = useBrandContext();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<typeof artifacts[0] | null>(null);

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  if (!isLibroVivoComplete(id || "")) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Workspace Bloqueado</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            El Agente CEO debe completar y firmar el Libro Vivo antes de acceder al workspace del PM.
          </p>
        </div>
      </div>
    );
  }

  const handleOpenArtifact = (artifact: typeof artifacts[0]) => {
    setActiveArtifact(artifact);
    setSheetOpen(true);
  };

  const handlePMExecute = () => {
    runPMExecution(() => {
      toast.success("Ejecución táctica completada", {
        description: "El Agente PM ha finalizado el análisis y generación de artefactos.",
      });
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
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
              <BreadcrumbPage>Agente PM</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl glass bg-pm/10">
            <Briefcase className="h-5 w-5 text-pm-fg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard de Ejecución — <span className="text-pm-fg">{brand.name}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Artefactos Estratégicos · Agente PM</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((a, i) => {
            const cfg = statusConfig[a.status];
            const clickable = a.status === "Completado";
            return (
              <Tooltip key={a.id}>
                <TooltipTrigger asChild>
                  <button
                    disabled={!clickable}
                    onClick={() => clickable && handleOpenArtifact(a)}
                    className={`group rounded-2xl p-5 text-left transition-all duration-300 glass ${
                      clickable
                        ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                        : "cursor-default opacity-70"
                    }`}
                    style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                  >
                    <div className="flex items-start justify-between">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium glass-subtle ${cfg.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {a.status}
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold text-foreground">{a.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="glass-strong border-none max-w-[260px]">
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-medium">Estado:</span> {a.status}
                    </p>
                    {a.framework && (
                      <>
                        <p>
                          <span className="font-medium">Framework:</span> {a.framework}
                        </p>
                        {FRAMEWORK_DEFINITIONS[a.framework] && (
                          <p className="text-muted-foreground pt-1 border-t border-white/10">
                            {FRAMEWORK_DEFINITIONS[a.framework]}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 px-4 w-full md:w-auto flex justify-center">
        <button
          onClick={handlePMExecute}
          disabled={isPMRunning}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 ${
            isPMRunning ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105"
          }`}
          style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <Zap className={`h-4 w-4 ${isPMRunning ? "animate-pulse" : ""}`} />
          {isPMRunning ? "Ejecutando…" : "Consultar PM / Ejecutar Táctica"}
        </button>
      </div>

      {/* Document Sheet */}
      <DocumentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        artifact={activeArtifact}
      />

      {/* Execution Console */}
      <ExecutionConsole
        visible={isPMRunning || pmExecutionSteps.length > 0}
        steps={pmExecutionSteps}
        agentLabel="Agente PM"
      />
    </div>
  );
}
