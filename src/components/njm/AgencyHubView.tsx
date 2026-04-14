import { useState, useEffect } from "react";
import { Plus, Search, Inbox, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { brands as staticBrands } from "@/data/brands";
import { WorkspaceSkeleton } from "@/components/njm/WorkspaceSkeleton";
import { EmptyState } from "@/components/njm/EmptyState";
import { NewBrandModal } from "@/components/njm/NewBrandModal";
import { brandTriageData, triageBadgeMap, triageCTAMap, type BrandTriageStatus } from "@/data/brandTriage";

const statusOptions = ["Todos", "Activo", "En Setup", "Pausado"] as const;

const ctaColors: Record<string, string> = {
  warning: "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30",
  primary: "bg-agency/20 text-agency-fg hover:bg-agency/30",
  accent: "bg-pm/20 text-pm-fg hover:bg-pm/30",
  default: "glass-subtle text-foreground hover:shadow-md",
};

export function AgencyHubView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [dynamicBrands, setDynamicBrands] = useState(staticBrands);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = dynamicBrands.filter((b) => {
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.sector.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBrand = (data: { name: string; sector: string; description: string }) => {
    const newBrand = {
      id: String(Date.now()),
      name: data.name,
      sector: data.sector,
      status: "En Setup" as const,
      health: 0,
      libroVivoComplete: false,
    };
    setDynamicBrands((prev) => [...prev, newBrand]);
  };

  if (isLoading) {
    return <WorkspaceSkeleton cards={5} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          NJM OS<br />
          <span className="text-agency-fg">Command Center</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Panel de control agéntico — triaje de marcas</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar marca o sector..."
              className="w-full rounded-xl py-2 pl-9 pr-3 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40"
            />
          </div>
          <div className="flex gap-1.5">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  statusFilter === s
                    ? "glass text-agency-fg shadow-md"
                    : "glass-subtle text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={search || statusFilter !== "Todos" ? "Sin resultados" : "Sin marcas aún"}
            description={
              search || statusFilter !== "Todos"
                ? "No se encontraron marcas con los filtros aplicados. Intenta otra búsqueda."
                : "Agrega tu primera marca para comenzar a gestionar su estrategia con agentes de IA."
            }
            actionLabel={search || statusFilter !== "Todos" ? "Limpiar filtros" : "Agregar Marca"}
            onAction={() => {
              if (search || statusFilter !== "Todos") {
                setSearch("");
                setStatusFilter("Todos");
              } else {
                setShowNewBrand(true);
              }
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((brand, i) => {
              const triage: BrandTriageStatus = brandTriageData[brand.id] || "missing_docs";
              const badge = triageBadgeMap[triage];
              const cta = triageCTAMap[triage];
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={brand.id}
                  className="group relative rounded-2xl p-5 text-left transition-all duration-300 glass hover:shadow-xl hover:-translate-y-1"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/brand/${brand.id}`)}>
                      <h3 className="font-semibold text-foreground">{brand.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{brand.sector}</p>
                    </div>
                    {/* Circular readiness */}
                    <div className="relative h-10 w-10 shrink-0">
                      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" opacity={0.3} />
                        <circle
                          cx="18" cy="18" r="15.5" fill="none"
                          stroke={triage === "complete" ? "hsl(var(--pm-accent))" : "hsl(var(--agency-accent))"}
                          strokeWidth="2.5"
                          strokeDasharray={`${brand.health * 0.975} 97.5`}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                        {brand.health}
                      </span>
                    </div>
                  </div>

                  {/* Triage badge */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.className}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (triage === "complete" || triage === "ready_for_research") {
                        navigate(`/brand/${brand.id}`);
                      }
                    }}
                    className={`mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${ctaColors[cta.variant]}`}
                  >
                    {triage === "ready_for_research" && <Sparkles className="h-3.5 w-3.5" />}
                    {cta.label}
                  </button>
                </div>
              );
            })}

            {/* Add new brand */}
            <button
              onClick={() => setShowNewBrand(true)}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/20 p-5 text-muted-foreground transition-all duration-300 hover:bg-white/40 hover:text-agency-fg hover:border-agency/40 hover:shadow-lg"
            >
              <Plus className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Agregar Marca</span>
            </button>
          </div>
        )}
      </main>

      <NewBrandModal
        open={showNewBrand}
        onOpenChange={setShowNewBrand}
        onCreateBrand={handleCreateBrand}
      />
    </div>
  );
}
