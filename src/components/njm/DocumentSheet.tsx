import { CheckCircle2, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import type { Artifact } from "@/data/brands";

interface DocumentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifact: Artifact | null;
}

const sampleMarkdown = `# Análisis de Matriz Ansoff — Disrupt

## 1. Penetración de Mercado
La estrategia principal para Q3-Q4 se centra en aumentar
la cuota de mercado en el segmento SaaS B2B enterprise,
con un foco especial en:

- **Optimización de conversión**: +15% MRR target
- **Reducción de churn**: De 4.2% a 2.8% mensual
- **Upselling**: Incremento de ACV en 22%

## 2. Desarrollo de Producto
\`\`\`
Nuevas funcionalidades prioritarias:
├── AI-powered analytics dashboard
├── Advanced segmentation engine
├── Real-time collaboration tools
└── Enterprise SSO integration
\`\`\`

## 3. Desarrollo de Mercado
Expansión geográfica hacia LATAM con partnerships
estratégicos en México, Colombia y Chile.

## 4. Diversificación
Exploración de vertical HealthTech como segundo
mercado objetivo para 2025.
`;

export function DocumentSheet({ open, onOpenChange, artifact }: DocumentSheetProps) {
  if (!artifact) return null;

  const handleApprove = () => {
    toast.success("Documento aprobado y guardado", {
      description: `"${artifact.name}" ha sido aprobado exitosamente.`,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[40vw] glass-strong border-l border-white/30 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="border-b border-white/30 px-6 py-4">
          <SheetTitle className="text-foreground">{artifact.name}</SheetTitle>
          <SheetDescription>{artifact.description}</SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 scrollbar-thin">
          {/* Suggestion card */}
          <div
            className="mb-6 rounded-2xl p-4 glass"
            style={{ borderColor: "hsla(160, 84%, 39%, 0.3)" }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pm/20 glass-subtle">
                <CheckCircle2 className="h-4 w-4 text-pm-fg" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-pm-fg">Alineación Validada</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Basado en {artifact.framework || "marco estratégico"}. Este documento ha sido generado
                  y validado por el Agente PM siguiendo los vectores estratégicos aprobados por el Agente CEO.
                </p>
              </div>
              <Sparkles className="h-4 w-4 shrink-0 text-pm-fg/50" />
            </div>
          </div>

          {/* Editor area */}
          <div className="rounded-2xl p-6 glass-subtle">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
              {sampleMarkdown}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/30 px-6 py-4">
          <button className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground">
            Proponer Ajustes
          </button>
          <button
            onClick={handleApprove}
            className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "hsla(160, 84%, 39%, 0.85)", backdropFilter: "blur(20px)" }}
          >
            Aprobar y Guardar
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
