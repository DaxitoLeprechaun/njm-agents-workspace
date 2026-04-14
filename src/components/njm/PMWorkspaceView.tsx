import { useState } from "react";
import { useParams } from "react-router-dom";
import { Briefcase, FileText, Zap, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getBrand, getArtifactsForBrand } from "@/data/brands";
import { DocumentSheet } from "@/components/njm/DocumentSheet";

const statusConfig: Record<string, { color: string; dot: string }> = {
  Completado: { color: "bg-pm/20 text-pm-fg", dot: "bg-pm" },
  Pendiente: { color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  "En Progreso": { color: "bg-agency/20 text-agency-fg", dot: "bg-agency" },
};

export function PMWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const brand = getBrand(id || "");
  const artifacts = getArtifactsForBrand(id || "");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<typeof artifacts[0] | null>(null);

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  // Locked state if Libro Vivo not complete
  if (!brand.libroVivoComplete) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
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

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
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
          {artifacts.map((a) => {
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
                <TooltipContent side="top" className="glass-strong border-none">
                  <div className="text-xs">
                    <p>
                      <span className="font-medium">Estado:</span> {a.status}
                    </p>
                    {a.framework && (
                      <p>
                        <span className="font-medium">Framework:</span> {a.framework}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button
          className="flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
          style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <Zap className="h-4 w-4" />
          Consultar PM / Ejecutar Táctica
        </button>
      </div>

      {/* Document Sheet */}
      <DocumentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        artifact={activeArtifact}
      />
    </div>
  );
}
