import { CheckCircle2, Loader2, Circle } from "lucide-react";

export interface ExecutionStep {
  label: string;
  status: "done" | "active" | "pending";
}

interface ExecutionConsoleProps {
  visible: boolean;
  steps: ExecutionStep[];
  agentLabel: string;
}

export function ExecutionConsole({ visible, steps, agentLabel }: ExecutionConsoleProps) {
  if (!visible || steps.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-16 right-0 z-30 transition-all duration-500"
      style={{
        animation: visible ? "slideUp 0.4s ease-out" : "slideDown 0.3s ease-in",
      }}
    >
      <div
        className="mx-4 mb-4 rounded-2xl border overflow-hidden"
        style={{
          background: "hsla(220, 20%, 8%, 0.92)",
          borderColor: "hsla(0, 0%, 100%, 0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "hsla(0, 0%, 100%, 0.06)" }}>
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-[11px] font-mono text-white/40 uppercase tracking-widest">
            {agentLabel} — Consola de Ejecución
          </span>
        </div>

        {/* Steps log */}
        <div className="px-5 py-4 space-y-2.5 max-h-[200px] overflow-auto scrollbar-thin font-mono text-sm">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-300"
              style={{
                opacity: step.status === "pending" ? 0.35 : 1,
                animationDelay: `${i * 100}ms`,
              }}
            >
              {step.status === "done" && (
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "hsl(160, 84%, 39%)" }} />
              )}
              {step.status === "active" && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" style={{ color: "hsl(45, 93%, 58%)" }} />
              )}
              {step.status === "pending" && (
                <Circle className="h-4 w-4 shrink-0 text-white/20" />
              )}
              <span
                className={`text-[13px] ${
                  step.status === "done"
                    ? "text-white/70"
                    : step.status === "active"
                      ? "text-white/90 font-medium"
                      : "text-white/25"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
