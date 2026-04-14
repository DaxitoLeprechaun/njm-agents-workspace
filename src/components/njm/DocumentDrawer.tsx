import { X, CheckCircle2, Sparkles } from "lucide-react";

interface DocumentDrawerProps {
  open: boolean;
  onClose: () => void;
  document: { id: string; name: string; description: string } | null;
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

export function DocumentDrawer({ open, onClose, document: doc }: DocumentDrawerProps) {
  if (!open || !doc) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col glass-strong shadow-2xl animate-slide-in-right rounded-l-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/30 px-6 py-4">
          <div>
            <h2 className="font-semibold text-foreground">{doc.name}</h2>
            <p className="text-xs text-muted-foreground">{doc.description}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground transition-all duration-200 glass-subtle hover:shadow-md hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 scrollbar-thin">
          {/* Suggestion card */}
          <div className="mb-6 rounded-2xl p-4 glass" style={{ borderColor: 'hsla(160, 84%, 39%, 0.3)' }}>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pm/20 glass-subtle">
                <CheckCircle2 className="h-4 w-4 text-pm-fg" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-pm-fg">Alineación Validada</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Basado en Matriz de Ansoff. Este documento ha sido generado y validado por el Agente PM
                  siguiendo los vectores estratégicos aprobados por el Agente CEO.
                </p>
              </div>
              <Sparkles className="h-4 w-4 shrink-0 text-pm-fg/50" />
            </div>
          </div>

          {/* Editor */}
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
          <button className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg" style={{ background: 'hsla(160, 84%, 39%, 0.85)', backdropFilter: 'blur(20px)', color: 'white' }}>
            Aprobar y Guardar
          </button>
        </div>
      </div>
    </>
  );
}
