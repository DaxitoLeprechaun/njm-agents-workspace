import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileUp, MessageSquare, Play, BookOpen } from "lucide-react";
import { getBrand } from "@/data/brands";
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

export function CEOWorkspaceView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const brand = getBrand(id || "");
  const { getVectors, toggleVector, isLibroVivoComplete, signLibroVivo, isScanning, scanningVectorId, runCEOAudit } = useBrandContext();
  const vectors = getVectors(id || "");

  const allValidated = vectors.length > 0 && vectors.every((v) => v.validated);

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
    toast.success("Libro Vivo generado — PM desbloqueado", {
      description: `El workspace del PM para ${brand?.name} está ahora disponible.`,
    });
  };

  const handleAudit = () => {
    runCEOAudit(id || "", () => {
      toast.success("Auditoría completada", {
        description: "Todos los vectores han sido validados por el Agente CEO.",
      });
    });
  };

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vectors.map((v, i) => {
            const isBeingScanned = scanningVectorId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => handleToggle(v.id)}
                className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] glass ${
                  isBeingScanned ? "ring-2 ring-ceo animate-pulse" : ""
                } ${
                  v.validated
                    ? "border-pm/20 hover:border-pm/40"
                    : "border-destructive/20 hover:border-destructive/40"
                }`}
                style={{
                  ...(v.validated
                    ? { borderColor: "hsla(160, 84%, 39%, 0.2)" }
                    : { borderColor: "hsla(0, 84%, 60%, 0.2)" }),
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: "both",
                }}
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
            );
          })}
        </div>

        {/* Libro Vivo button */}
        {allValidated && !isLibroVivoComplete(id || "") && (
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

        {allValidated && isLibroVivoComplete(id || "") && (
          <div className="mt-8 flex justify-center animate-fade-in">
            <div className="flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-pm-fg glass-subtle">
              <CheckCircle2 className="h-5 w-5" />
              Libro Vivo Firmado
            </div>
          </div>
        )}
      </main>

      {/* Floating action */}
      <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button
          onClick={handleAudit}
          disabled={isScanning || allValidated}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 glass-strong ${
            isScanning || allValidated
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-2xl hover:scale-105"
          }`}
          style={{ background: "hsla(271, 81%, 56%, 0.85)", backdropFilter: "blur(20px)" }}
        >
          <Play className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "Escaneando…" : "Invocar CEO para Auditoría"}
        </button>
      </div>
    </div>
  );
}
