import { useParams, Link } from "react-router-dom";
import { BookOpen, CheckCircle2, ShieldCheck, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { getBrand, type StrategicVector } from "@/data/brands";
import { useBrandContext } from "@/context/BrandContext";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const categoryOrder = ["Core", "Business", "Brand", "Growth", "Audiencia"];
const categoryLabels: Record<string, { title: string; description: string }> = {
  Core: { title: "Núcleo Estratégico", description: "La esencia y razón de ser de la marca" },
  Business: { title: "Modelo de Negocio", description: "Posicionamiento, audiencia y diferenciación competitiva" },
  Brand: { title: "Identidad de Marca", description: "Personalidad, tono, y expresión visual" },
  Growth: { title: "Motor de Crecimiento", description: "Canales, métricas y estrategia de adquisición" },
  Audiencia: { title: "Audiencia", description: "Segmentos, ICPs y perfiles de usuario" },
};

const pmMatrix = [
  { param: "Framework Principal", value: "Ansoff Matrix + Lean Canvas" },
  { param: "Horizonte de Planificación", value: "12 meses (revisión trimestral)" },
  { param: "Nivel de Autonomía", value: "Semi-autónomo (requiere aprobación en decisiones >$10K)" },
  { param: "Fuentes de Datos", value: "CRM, Analytics, Financial Reports" },
  { param: "Formato de Salida", value: "Business Case + OKRs + Roadmap" },
];

export function LibroVivoViewer() {
  const { id } = useParams<{ id: string }>();
  const brand = getBrand(id || "");
  const { getVectors, isLibroVivoComplete } = useBrandContext();
  const vectors = getVectors(id || "");
  const signed = isLibroVivoComplete(id || "");

  if (!brand) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Marca no encontrada</p>
      </div>
    );
  }

  if (!signed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 animate-fade-in">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Libro Vivo No Disponible</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            El Agente CEO debe validar todos los vectores y firmar el Libro Vivo.
          </p>
          <Link
            to={`/brand/${id}/ceo`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-ceo-fg hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Ir al Workspace del CEO
          </Link>
        </div>
      </div>
    );
  }

  // Group vectors by category
  const grouped: Record<string, StrategicVector[]> = {};
  for (const v of vectors) {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  }

  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

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
              <BreadcrumbPage>Libro Vivo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl glass" style={{ background: "hsla(160, 84%, 39%, 0.1)" }}>
              <BookOpen className="h-5 w-5 text-pm-fg" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Libro Vivo — <span className="text-pm-fg">{brand.name}</span>
              </h1>
              <p className="text-sm text-muted-foreground">Fuente de verdad estratégica</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const lines: string[] = [`# Libro Vivo — ${brand.name}\n`];
                sortedCategories.forEach((cat) => {
                  const info = categoryLabels[cat];
                  lines.push(`## ${info?.title || cat}\n${info?.description || ""}\n`);
                  grouped[cat].forEach((v) => {
                    lines.push(`### ${v.name}\n${v.summary || "Validado."}\n`);
                  });
                });
                lines.push(`## Matriz Cognitiva del PM\n`);
                pmMatrix.forEach((r) => lines.push(`- **${r.param}**: ${r.value}`));
                const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Libro_Vivo_${brand.name.replace(/\s+/g, "_")}.md`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Libro Vivo exportado");
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all glass-subtle hover:shadow-md text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Exportar .md
            </button>
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5 glass-subtle">
              <ShieldCheck className="h-4 w-4 text-ceo-fg" />
              <span className="text-xs font-medium text-foreground">Firmado por CEO</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Sections */}
        <div className="mx-auto max-w-3xl space-y-8">
          {sortedCategories.map((category, ci) => {
            const info = categoryLabels[category] || { title: category, description: "" };
            return (
              <section
                key={category}
                className="animate-fade-in"
                style={{ animationDelay: `${ci * 120}ms`, animationFillMode: "both" }}
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">{info.title}</h2>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
                <div className="space-y-3">
                  {grouped[category].map((v) => (
                    <div key={v.id} className="rounded-2xl p-5 glass">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pm-fg" />
                        <div>
                          <h3 className="font-medium text-foreground">{v.name}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {v.summary || "Definición validada por el Agente CEO."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* PM Cognitive Matrix */}
          <section
            className="animate-fade-in"
            style={{ animationDelay: `${sortedCategories.length * 120}ms`, animationFillMode: "both" }}
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Matriz Cognitiva del PM</h2>
              <p className="text-sm text-muted-foreground">Parámetros de operación definidos por el CEO para el Agente PM</p>
            </div>
            <div className="rounded-2xl overflow-hidden glass">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "hsla(0, 0%, 100%, 0.1)" }}>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Parámetro</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Configuración</th>
                  </tr>
                </thead>
                <tbody>
                  {pmMatrix.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "hsla(0, 0%, 100%, 0.05)" }}
                    >
                      <td className="px-5 py-3 font-medium text-foreground">{row.param}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Signature footer */}
          <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-border/30" />
            <span className="font-mono text-xs">
              Generado {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <div className="h-px flex-1 bg-border/30" />
          </div>
        </div>
      </main>
    </div>
  );
}
