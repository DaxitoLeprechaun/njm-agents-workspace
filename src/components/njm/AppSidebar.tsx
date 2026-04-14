import { Building, ShieldCheck, Briefcase, Settings, Hexagon, BookOpen, LogOut, Menu, X, Bell } from "lucide-react";
import { ActivityFeedDrawer } from "@/components/njm/ActivityFeedDrawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useBrandContext } from "@/context/BrandContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";

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
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

  const currentPath = location.pathname;
  const libroAvailable = id ? isLibroVivoComplete(id) : false;

  const isActive = (check: string) => {
    if (check === "/") return currentPath === "/";
    if (check === "libro-vivo") return currentPath.includes("/libro-vivo");
    if (check === "settings") return currentPath === "/settings";
    return currentPath.includes(`/${check}`);
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("njm-auth");
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  // Mobile hamburger trigger
  if (isMobile && !mobileOpen) {
    return (
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-xl p-2.5 glass-strong shadow-lg"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`flex h-screen w-16 flex-col items-center py-4 glass-subtle rounded-r-2xl transition-transform duration-300 ${
          isMobile ? "fixed left-0 top-0 z-50" : ""
        }`}
      >
        {/* Logo + close on mobile */}
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl glass relative">
          {isMobile ? (
            <button onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5 text-foreground" />
            </button>
          ) : (
            <Hexagon className="h-6 w-6 text-primary" />
          )}
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
              onClick={() => handleNav(item.path)}
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
                  if (!disabled) handleNav(`/brand/${id}/${item.pathSuffix}`);
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
                onClick={() => handleNav(`/brand/${id}/libro-vivo`)}
              />
            </>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-1">
          {/* Notification bell */}
          <div className="relative">
            <SidebarButton
              icon={Bell}
              label="Actividad Reciente"
              active={feedOpen}
              colorClass="border-agency text-agency"
              onClick={() => setFeedOpen(true)}
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white">
              7
            </span>
          </div>
          <div className="my-1 h-px w-6 bg-border/30" />
          <SidebarButton
            icon={Settings}
            label="Configuración"
            active={isActive("settings")}
            colorClass="border-border text-foreground"
            onClick={() => handleNav("/settings")}
          />
          <SidebarButton
            icon={LogOut}
            label="Cerrar Sesión"
            active={false}
            colorClass="border-border text-destructive"
            onClick={handleLogout}
          />
        </div>
      </aside>

      <ActivityFeedDrawer open={feedOpen} onOpenChange={setFeedOpen} />
    </>
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
              className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-current transition-all duration-300"
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
