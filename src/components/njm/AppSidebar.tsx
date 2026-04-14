import { Building, ShieldCheck, Briefcase, Settings, Hexagon, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useBrandContext } from "@/context/BrandContext";

const navItems = [
  { path: "/", icon: Building, label: "Hub de Agencias", color: "agency" },
] as const;

const agentItems = [
  { pathSuffix: "ceo", icon: ShieldCheck, label: "Agente CEO (Guardián)", color: "ceo" },
  { pathSuffix: "pm", icon: Briefcase, label: "Agente PM (Operativo)", color: "pm" },
] as const;

const colorMap: Record<string, string> = {
  agency: "border-agency text-agency",
  ceo: "border-ceo text-ceo",
  pm: "border-pm text-pm",
  libro: "border-pm text-pm",
};

export function AppSidebar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { isLibroVivoComplete } = useBrandContext();

  const currentPath = location.pathname;
  const libroAvailable = id ? isLibroVivoComplete(id) : false;

  const isActive = (check: string) => {
    if (check === "/") return currentPath === "/";
    if (check === "libro-vivo") return currentPath.includes("/libro-vivo");
    if (check === "settings") return currentPath === "/settings";
    return currentPath.includes(`/${check}`);
  };

  return (
    <aside className="flex h-screen w-16 flex-col items-center py-4 glass-subtle rounded-r-2xl">
      {/* Logo */}
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl glass">
        <Hexagon className="h-6 w-6 text-primary" />
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <SidebarButton
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={isActive(item.path)}
            colorClass={colorMap[item.color]}
            onClick={() => navigate(item.path)}
          />
        ))}

        <div className="my-3 h-px w-8 bg-border/50" />

        {agentItems.map((item) => {
          const disabled = !id;
          const active = isActive(item.pathSuffix);
          return (
            <SidebarButton
              key={item.pathSuffix}
              icon={item.icon}
              label={disabled ? `${item.label} (selecciona marca)` : item.label}
              active={active}
              colorClass={colorMap[item.color]}
              disabled={disabled}
              onClick={() => {
                if (!disabled) navigate(`/brand/${id}/${item.pathSuffix}`);
              }}
            />
          );
        })}

        {/* Libro Vivo - only when signed */}
        {libroAvailable && id && (
          <>
            <div className="my-2 h-px w-6 bg-border/30" />
            <SidebarButton
              icon={BookOpen}
              label="Libro Vivo"
              active={isActive("libro-vivo")}
              colorClass={colorMap.libro}
              onClick={() => navigate(`/brand/${id}/libro-vivo`)}
            />
          </>
        )}
      </nav>

      {/* Settings */}
      <SidebarButton
        icon={Settings}
        label="Configuración"
        active={isActive("settings")}
        colorClass="border-border text-foreground"
        onClick={() => navigate("/settings")}
      />
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  colorClass,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  colorClass: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`relative rounded-xl p-2.5 transition-all duration-300 ${
            disabled
              ? "text-muted-foreground/30 cursor-not-allowed"
              : active
                ? `${colorClass} glass shadow-lg`
                : "text-muted-foreground hover:text-foreground glass-subtle hover:shadow-md"
          }`}
        >
          {active && !disabled && (
            <span
              className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-current"
              style={{ left: "-8px" }}
            />
          )}
          <Icon className="h-5 w-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="glass-strong border-none">{label}</TooltipContent>
    </Tooltip>
  );
}
