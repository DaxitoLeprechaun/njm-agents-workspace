import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileUp, MessageSquare, Play, BookOpen } from "lucide-react";
import { getVectorsForBrand, getBrand, type StrategicVector } from "@/data/brands";

export function CEOWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const brand = getBrand(id || "");
  const initialVectors = getVectorsForBrand(id || "");
  const [vectors, setVectors] = useState<StrategicVector[]>(initialVectors);

  const allValidated = vectors.length > 0 && vectors.every((v) => v.validated);

  const toggleVector = (vectorId: string) => {
    setVectors((prev) =>
      prev.map((v) =>
        v.id === vectorId ? { ...v, validated: !v.validated } : v
      )
    );
  };

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vectors.map((v) => (
            <div
              key={v.id}
              onClick={() => toggleVector(v.id)}
              className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] glass ${
                v.validated
                  ? "border-pm/20 hover:border-pm/40"
                  : "border-destructive/20 hover:border-destructive/40"
              }`}
              style={
                v.validated
                  ? { borderColor: "hsla(160, 84%, 39%, 0.2)" }
                  : { borderColor: "hsla(0, 84%, 60%, 0.2)" }
              }
            >
              <div className="flex items-start gap-3">
                {v.validated ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pm-fg" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{v.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium glass-subtle ${
                        v.validated
                          ? "bg-pm/20 text-pm-fg"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {v.validated ? "Validado" : "Pendiente"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                    {v.category}
                  </p>
                  {v.validated && v.summary && (
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {v.summary}
                    </p>
                  )}
                </div>
              </div>

              {!v.validated && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground"
                  >
                    <FileUp className="h-3.5 w-3.5" /> Upload Doc
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Briefing
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Libro Vivo button — visible only when all vectors validated */}
        {allValidated && (
          <div className="mt-8 flex justify-center">
            <button className="flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 glass-strong"
              style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
            >
              <BookOpen className="h-5 w-5" />
              Firmar y Generar Libro Vivo
            </button>
          </div>
        )}
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button
          className="flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 glass-strong"
          style={{ background: "hsla(271, 81%, 56%, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <Play className="h-4 w-4" />
          Invocar CEO para Auditoría
        </button>
      </div>
    </div>
  );
}
