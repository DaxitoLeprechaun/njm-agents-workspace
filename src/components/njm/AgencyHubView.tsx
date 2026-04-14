import { Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { brands } from "@/data/brands";

const statusColors: Record<string, string> = {
  Activo: "bg-pm/20 text-pm-fg",
  "En Setup": "bg-agency/20 text-agency-fg",
  Pausado: "bg-muted text-muted-foreground",
};

export function AgencyHubView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          NJM OS — <span className="text-agency-fg">Hub de Agencia</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestiona todas tus marcas desde un solo lugar</p>
      </header>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => navigate(`/brand/${brand.id}/ceo`)}
              className="group relative rounded-2xl p-5 text-left transition-all duration-300 glass hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
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
