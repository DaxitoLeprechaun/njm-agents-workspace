import { useParams, Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Briefcase, BookOpen } from "lucide-react";
import { getBrand } from "@/data/brands";
import { useBrandContext } from "@/context/BrandContext";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function BrandOverviewView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const brand = getBrand(id || "");
  const { isLibroVivoComplete } = useBrandContext();
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
