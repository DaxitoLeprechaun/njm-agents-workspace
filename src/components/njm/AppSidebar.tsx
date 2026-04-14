import { Building, ShieldCheck, Briefcase, Settings, Hexagon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type View = "agency" | "ceo" | "pm";

interface AppSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: "agency" as View, icon: Building, label: "Agency Hub", color: "agency" },
] as const;

const agentItems = [
  { id: "ceo" as View, icon: ShieldCheck, label: "Agente CEO (Guardián)", color: "ceo" },
  { id: "pm" as View, icon: Briefcase, label: "Agente PM (Operativo)", color: "pm" },
] as const;

const colorMap: Record<string, string> = {
  agency: "border-agency text-agency",
  ceo: "border-ceo text-ceo",
  pm: "border-pm text-pm",
};

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
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
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            colorClass={colorMap[item.color]}
            onClick={() => onViewChange(item.id)}
          />
        ))}

        <div className="my-3 h-px w-8 bg-border/50" />

        {agentItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            colorClass={colorMap[item.color]}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground glass-subtle hover:shadow-lg">
            <Settings className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Configuración</TooltipContent>
      </Tooltip>
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  colorClass,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  colorClass: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative rounded-xl p-2.5 transition-all duration-300 ${
            active
              ? `${colorClass} glass shadow-lg`
              : "text-muted-foreground hover:text-foreground glass-subtle hover:shadow-md"
          }`}
        >
          {active && (
            <span
              className={`absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r ${colorMap[active ? colorClass.split(" ")[0].replace("border-", "") : ""]?.split(" ")[0] ?? colorClass.split(" ")[0]} bg-current`}
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
