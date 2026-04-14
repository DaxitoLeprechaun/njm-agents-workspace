import { ShieldCheck, Briefcase, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export interface ActivityItem {
  id: string;
  agent: "ceo" | "pm" | "system";
  brandName: string;
  action: string;
  timestamp: Date;
}

const mockActivity: ActivityItem[] = [
  { id: "1", agent: "ceo", brandName: "Agencia-Disrupt", action: "Validó 3 vectores estratégicos", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: "2", agent: "pm", brandName: "Agencia-Disrupt", action: "Generó Business Case Q3", timestamp: new Date(Date.now() - 1000 * 60 * 20) },
  { id: "3", agent: "ceo", brandName: "NovaTech", action: "Inició auditoría de vectores", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: "4", agent: "system", brandName: "Apex Growth", action: "Libro Vivo firmado y generado", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "5", agent: "pm", brandName: "Apex Growth", action: "Completó OKRs Q3-Q4", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: "6", agent: "ceo", brandName: "Lumina AI", action: "Rechazó Propuesta de Valor — requiere revisión", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "7", agent: "pm", brandName: "NovaTech", action: "Analizó Porter's Five Forces", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
];

const agentConfig = {
  ceo: { icon: ShieldCheck, label: "Agente CEO", colorClass: "text-ceo-fg", bgClass: "bg-ceo/20" },
  pm: { icon: Briefcase, label: "Agente PM", colorClass: "text-pm-fg", bgClass: "bg-pm/20" },
  system: { icon: BookOpen, label: "Sistema", colorClass: "text-foreground", bgClass: "bg-muted" },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

interface ActivityFeedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityFeedDrawer({ open, onOpenChange }: ActivityFeedDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md glass-strong border-l border-white/30 p-0 flex flex-col">
        <SheetHeader className="border-b border-white/30 px-6 py-4">
          <SheetTitle className="text-foreground">Actividad Reciente</SheetTitle>
          <SheetDescription>Acciones de agentes en todas las marcas</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-2">
          {mockActivity.map((item, i) => {
            const config = agentConfig[item.agent];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="rounded-xl p-3.5 glass-subtle transition-all duration-300 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bgClass}`}>
                    <Icon className={`h-3.5 w-3.5 ${config.colorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${config.colorClass}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.brandName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
