import { useState } from "react";
import { Hexagon, Building, Target, Layers, Heart, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useAgency } from "@/context/AgencyContext";
import { toast } from "sonner";

const styleOptions = ["Consultivo", "Operativo", "Híbrido", "Automatizado"] as const;

const steps = [
  { icon: Building, label: "Nombre", field: "name" as const },
  { icon: Target, label: "Objetivos", field: "objectives" as const },
  { icon: Layers, label: "Estilo", field: "style" as const },
  { icon: Heart, label: "Misión", field: "values" as const },
];

export function DayCeroView() {
  const { completeSetup } = useAgency();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [objectives, setObjectives] = useState("");
  const [style, setStyle] = useState<string[]>([]);
  const [values, setValues] = useState("");

  const toggleStyle = (s: string) =>
    setStyle((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return objectives.trim().length > 0;
    if (step === 2) return style.length > 0;
    if (step === 3) return values.trim().length > 0;
    return false;
  };

  const handleComplete = () => {
    completeSetup({ name: name.trim(), objectives: objectives.trim(), style, values: values.trim() });
    toast.success("🚀 Workspace inicializado", {
      description: `Agencia "${name.trim()}" configurada con éxito.`,
    });
  };

  if (!started) {
    return (
      <div className="flex flex-1 items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="rounded-2xl p-5 glass">
            <Hexagon className="h-12 w-12 text-agency-fg" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Ningún espacio de trabajo detectado
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Configura tu agencia para comenzar a operar con agentes de IA estratégicos.
            </p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "hsl(var(--agency-accent))" }}
          >
            <Sparkles className="h-4 w-4" />
            Inicializar Agencia
          </button>
        </div>
      </div>
    );
  }

  const StepIcon = steps[step].icon;

  return (
    <div className="flex flex-1 items-center justify-center animate-fade-in p-4">
      <div className="w-full max-w-lg rounded-2xl p-8 glass">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                  i === step
                    ? "glass text-agency-fg shadow-md scale-110"
                    : i < step
                    ? "bg-agency/20 text-agency-fg"
                    : "glass-subtle text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-6 transition-colors ${i < step ? "bg-agency/40" : "bg-border/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl p-2.5 glass-subtle">
            <StepIcon className="h-5 w-5 text-agency-fg" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Paso {step + 1} de {steps.length}
            </p>
            <h2 className="text-lg font-semibold text-foreground">{steps[step].label}</h2>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[160px] mb-6">
          {step === 0 && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-foreground">Nombre de la Agencia</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. NJM Consulting Group"
                className="w-full rounded-xl py-3 px-4 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40"
              />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-foreground">Objetivos Principales</label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Describe los objetivos estratégicos de tu agencia..."
                rows={5}
                className="w-full rounded-xl py-3 px-4 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40 resize-none"
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium text-foreground">Estilo de Operación</label>
              <p className="text-xs text-muted-foreground">Selecciona uno o más estilos</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {styleOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      style.includes(s)
                        ? "glass text-agency-fg shadow-md"
                        : "glass-subtle text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-foreground">Valores y Misión</label>
              <textarea
                value={values}
                onChange={(e) => setValues(e.target.value)}
                placeholder="Define la misión y los valores que guían a tu agencia..."
                rows={5}
                className="w-full rounded-xl py-3 px-4 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40 resize-none"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all glass-subtle hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "hsl(var(--agency-accent))" }}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canNext()}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "hsl(var(--pm-accent))" }}
            >
              <Sparkles className="h-4 w-4" />
              Completar Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
