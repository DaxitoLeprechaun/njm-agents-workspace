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
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl glass bg-ceo/10">
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
              className={`group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] ${
                v.validated
                  ? "glass border-pm/20 hover:border-pm/40"
                  : "glass border-destructive/20 hover:border-destructive/40"
              }`}
              style={v.validated ? { borderColor: 'hsla(160, 84%, 39%, 0.2)' } : { borderColor: 'hsla(0, 84%, 60%, 0.2)' }}
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
                  <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground">
                    <FileUp className="h-3.5 w-3.5" /> Doc
                  </button>
                  <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground">
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
        <button className="flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-ceo glass-strong" style={{ background: 'hsla(271, 81%, 56%, 0.85)', backdropFilter: 'blur(20px)', color: 'white' }}>
          <Play className="h-4 w-4" />
          Invocar Auditoría Automática
        </button>
      </div>
    </div>
  );
}
