import { ShieldCheck, CheckCircle2, AlertTriangle, FileUp, MessageSquare, Play } from "lucide-react";

interface Vector {
  id: string;
  name: string;
  validated: boolean;
}

const vectors: Vector[] = [
  { id: "1", name: "Propósito de Marca", validated: true },
  { id: "2", name: "Audiencia Objetivo", validated: true },
  { id: "3", name: "Propuesta de Valor", validated: false },
  { id: "4", name: "Posicionamiento", validated: true },
  { id: "5", name: "Identidad Visual", validated: false },
  { id: "6", name: "Tono y Voz", validated: true },
  { id: "7", name: "Estrategia de Canales", validated: false },
  { id: "8", name: "KPIs Estratégicos", validated: true },
];

export function CEOWorkspaceView() {
  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
      <header className="sticky top-0 z-10 border-b border-border bg-surface-0/80 px-8 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ceo/10">
            <ShieldCheck className="h-5 w-5 text-ceo-fg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard del CEO</h1>
            <p className="text-sm text-muted-foreground">Vectores Estratégicos — Disrupt</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vectors.map((v) => (
            <div
              key={v.id}
              className={`group rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                v.validated
                  ? "border-pm/30 bg-card hover:border-pm/50 hover:shadow-pm/5"
                  : "border-destructive/30 bg-card hover:border-destructive/50 hover:shadow-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {v.validated ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pm-fg" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{v.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {v.validated ? "Validado por CEO Agent" : "Requiere atención"}
                  </p>
                </div>
              </div>

              {!v.validated && (
                <div className="mt-4 flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-md bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground">
                    <FileUp className="h-3.5 w-3.5" /> Doc
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Briefing
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button className="flex items-center gap-2 rounded-full bg-ceo px-6 py-3 font-medium text-foreground shadow-xl shadow-ceo/20 transition-all duration-200 hover:shadow-2xl hover:shadow-ceo/30 hover:scale-105">
          <Play className="h-4 w-4" />
          Invocar Auditoría Automática
        </button>
      </div>
    </div>
  );
}
