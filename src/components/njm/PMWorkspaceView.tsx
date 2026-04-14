import { Briefcase, FileText, Zap } from "lucide-react";

interface Artifact {
  id: string;
  name: string;
  description: string;
  status: "Completado" | "Pendiente" | "En Progreso";
}

const artifacts: Artifact[] = [
  { id: "1", name: "Análisis Ansoff", description: "Matriz de crecimiento estratégico", status: "Completado" },
  { id: "2", name: "Business Case Q3", description: "Justificación de inversión trimestral", status: "Completado" },
  { id: "3", name: "Roadmap Producto", description: "Plan de desarrollo 12 meses", status: "En Progreso" },
  { id: "4", name: "Análisis Competitivo", description: "Benchmark del sector SaaS", status: "Completado" },
  { id: "5", name: "Plan de Go-To-Market", description: "Estrategia de lanzamiento", status: "Pendiente" },
  { id: "6", name: "OKRs Q3-Q4", description: "Objetivos y resultados clave", status: "En Progreso" },
];

const statusConfig: Record<string, { color: string; dot: string }> = {
  Completado: { color: "bg-pm/20 text-pm-fg", dot: "bg-pm" },
  Pendiente: { color: "bg-muted/50 text-muted-foreground", dot: "bg-muted-foreground" },
  "En Progreso": { color: "bg-agency/20 text-agency-fg", dot: "bg-agency" },
};

interface PMWorkspaceViewProps {
  onOpenDocument: (artifact: { id: string; name: string; description: string }) => void;
}

export function PMWorkspaceView({ onOpenDocument }: PMWorkspaceViewProps) {
  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl glass bg-pm/10">
            <Briefcase className="h-5 w-5 text-pm-fg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard de Ejecución (PM)</h1>
            <p className="text-sm text-muted-foreground">Artefactos Estratégicos — Disrupt</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((a) => {
            const cfg = statusConfig[a.status];
            const clickable = a.status === "Completado";
            return (
              <button
                key={a.id}
                disabled={!clickable}
                onClick={() => clickable && onOpenDocument({ id: a.id, name: a.name, description: a.description })}
                className={`group rounded-2xl p-5 text-left transition-all duration-300 glass ${
                  clickable
                    ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                    : "cursor-default opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium glass-subtle ${cfg.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {a.status}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{a.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
              </button>
            );
          })}
        </div>
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button className="flex items-center gap-2 rounded-full px-6 py-3 font-medium shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105" style={{ background: 'hsla(160, 84%, 39%, 0.85)', backdropFilter: 'blur(20px)', color: 'white' }}>
          <Zap className="h-4 w-4" />
          Consultar Estrategia / Ejecutar Tarea
        </button>
      </div>
    </div>
  );
}
