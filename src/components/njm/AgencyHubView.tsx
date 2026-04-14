import { useState } from "react";
import { Plus, TrendingUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { brands } from "@/data/brands";

const statusColors: Record<string, string> = {
  Activo: "bg-pm/20 text-pm-fg",
  "En Setup": "bg-agency/20 text-agency-fg",
  Pausado: "bg-muted text-muted-foreground",
};

const statusOptions = ["Todos", "Activo", "En Setup", "Pausado"] as const;

export function AgencyHubView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const filtered = brands.filter((b) => {
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.sector.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          NJM OS<br />
          <span className="text-agency-fg">Hub de Agencias</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestión de micro-agencias</p>

        {/* Search + filter */}
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((brand, i) => (
            <button
              key={brand.id}
              onClick={() => navigate(`/brand/${brand.id}`)}
              className="group relative rounded-2xl p-5 text-left transition-all duration-300 glass hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{brand.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{brand.sector}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium glass-subtle ${statusColors[brand.status]}`}>
                  {brand.status}
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Salud del Libro Vivo</span>
                  <span className="font-medium text-foreground">{brand.health}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-agency to-pm transition-all duration-500"
                    style={{ width: `${brand.health}%` }}
                  />
                </div>
              </div>

              <TrendingUp className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/30 transition-colors group-hover:text-agency-fg/60" />
            </button>
          ))}

          {/* Add new brand */}
          <button className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 bg-white/20 p-5 text-muted-foreground transition-all duration-300 hover:bg-white/40 hover:text-agency-fg hover:border-agency/40 hover:shadow-lg">
            <Plus className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Agregar Marca</span>
          </button>
        </div>
      </main>
    </div>
  );
}
