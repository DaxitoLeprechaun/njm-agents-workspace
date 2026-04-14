import { useParams, Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Briefcase, BookOpen, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { getBrand } from "@/data/brands";
import { useBrandContext } from "@/context/BrandContext";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function BrandOverviewView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const brand = getBrand(id || "");
  const { getVectors, isLibroVivoComplete } = useBrandContext();
  const vectors = getVectors(id || "");
  const validated = vectors.filter((v) => v.validated).length;
  const total = vectors.length;
  const pct = total > 0 ? Math.round((validated / total) * 100) : 0;
  const libroSigned = isLibroVivoComplete(id || "");

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  const workspaces = [
    { label: "Agente CEO", desc: "Guardián del ADN · Vectores Estratégicos", icon: ShieldCheck, color: "ceo", path: `/brand/${id}/ceo` },
    { label: "Agente PM", desc: "Operativo · Entregables y Frameworks", icon: Briefcase, color: "pm", path: `/brand/${id}/pm` },
    ...(libroSigned
      ? [{ label: "Libro Vivo", desc: "Fuente de verdad estratégica", icon: BookOpen, color: "pm" as const, path: `/brand/${id}/libro-vivo` }]
      : []),
  ];

  // SVG ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (brand.health / 100) * circumference;

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
              <BreadcrumbPage>{brand.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{brand.name}</h1>
        <p className="text-sm text-muted-foreground">{brand.sector} · {brand.status}</p>
      </header>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Health + Vectors stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Health ring */}
            <div className="flex flex-col items-center rounded-2xl p-6 glass">
              <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="hsla(0,0%,100%,0.1)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r={radius} fill="none"
                  stroke="hsl(var(--pm))" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="mt-3 text-2xl font-bold text-foreground">{brand.health}%</span>
              <span className="text-xs text-muted-foreground">Salud del Libro Vivo</span>
            </div>

            {/* Vector progress */}
            <div className="flex flex-col justify-center rounded-2xl p-6 glass">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-pm-fg" />
                <span className="text-sm font-medium text-foreground">{validated} / {total} Vectores Validados</span>
              </div>
              <div className="h-2 rounded-full bg-surface-3/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ceo to-pm transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {vectors.map((v) => (
                  <span
                    key={v.id}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      v.validated ? "bg-pm/20 text-pm-fg" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col justify-center rounded-2xl p-6 glass">
              <div className="flex items-center gap-2 mb-3">
                {libroSigned ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-pm-fg" />
                    <span className="text-sm font-medium text-pm-fg">Libro Vivo Firmado</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Libro Vivo Pendiente</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{brand.sector}</span>
              </div>
            </div>
          </div>

          {/* Workspace cards */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Workspaces</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((ws, i) => (
                <button
                  key={ws.path}
                  onClick={() => navigate(ws.path)}
                  className="group rounded-2xl p-5 text-left transition-all duration-300 glass hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl glass-subtle bg-${ws.color}/10 mb-3`}>
                    <ws.icon className={`h-5 w-5 text-${ws.color}-fg`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{ws.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{ws.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
