import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { strategicVectors as initialVectors, type StrategicVector, getBrand } from "@/data/brands";
import type { ExecutionStep } from "@/components/njm/ExecutionConsole";
import { toast } from "sonner";

interface BrandState {
  vectors: Record<string, StrategicVector[]>;
  libroVivoStatus: Record<string, boolean>;
}

interface BrandContextValue {
  getVectors: (brandId: string) => StrategicVector[];
  toggleVector: (brandId: string, vectorId: string) => void;
  validateAllVectors: (brandId: string) => void;
  isLibroVivoComplete: (brandId: string) => boolean;
  signLibroVivo: (brandId: string) => void;
  isScanning: boolean;
  scanningVectorId: string | null;
  executionSteps: ExecutionStep[];
  runCEOAudit: (brandId: string, onComplete?: () => void) => void;
  runPMExecution: (onComplete?: () => void) => void;
  isPMRunning: boolean;
  pmExecutionSteps: ExecutionStep[];
}

const BrandContext = createContext<BrandContextValue | null>(null);

const pmStepLabels = [
  "Leyendo Libro Vivo...",
  "Evaluando Framework Ansoff...",
  "Analizando Porter's Five Forces...",
  "Calculando métricas de crecimiento...",
  "Redactando Business Case...",
  "Generando OKRs tácticos...",
];

export function BrandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrandState>(() => {
    const grouped: Record<string, StrategicVector[]> = {};
    for (const v of initialVectors) {
      if (!grouped[v.brandId]) grouped[v.brandId] = [];
      grouped[v.brandId].push({ ...v });
    }
    return { vectors: grouped, libroVivoStatus: { "1": true, "4": true } };
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanningVectorId, setScanningVectorId] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);

  const [isPMRunning, setIsPMRunning] = useState(false);
  const [pmExecutionSteps, setPMExecutionSteps] = useState<ExecutionStep[]>([]);

  const getVectors = useCallback(
    (brandId: string) => state.vectors[brandId] || [],
    [state.vectors]
  );

  const toggleVector = useCallback((brandId: string, vectorId: string) => {
    setState((prev) => {
      const vectors = (prev.vectors[brandId] || []).map((v) =>
        v.id === vectorId ? { ...v, validated: !v.validated } : v
      );
      return { ...prev, vectors: { ...prev.vectors, [brandId]: vectors } };
    });
  }, []);

  const validateAllVectors = useCallback((brandId: string) => {
    setState((prev) => {
      const vectors = (prev.vectors[brandId] || []).map((v) => ({
        ...v,
        validated: true,
        summary: v.summary || "Validado por el Agente CEO durante auditoría automatizada.",
      }));
      return { ...prev, vectors: { ...prev.vectors, [brandId]: vectors } };
    });
  }, []);

  const isLibroVivoComplete = useCallback(
    (brandId: string) => state.libroVivoStatus[brandId] || false,
    [state.libroVivoStatus]
  );

  const signLibroVivo = useCallback((brandId: string) => {
    setState((prev) => ({
      ...prev,
      libroVivoStatus: { ...prev.libroVivoStatus, [brandId]: true },
    }));
  }, []);

  const runCEOAudit = useCallback(
    (brandId: string, onComplete?: () => void) => {
      const vectors = state.vectors[brandId] || [];
      const pending = vectors.filter((v) => !v.validated);
      if (pending.length === 0 || isScanning) return;

      setIsScanning(true);

      // Build initial steps
      const steps: ExecutionStep[] = pending.map((v) => ({
        label: `Analizando ${v.name} [${v.category}]...`,
        status: "pending",
      }));
      setExecutionSteps(steps);

      pending.forEach((v, i) => {
        setTimeout(() => {
          setScanningVectorId(v.id);
          setExecutionSteps((prev) =>
            prev.map((s, si) => (si === i ? { ...s, status: "active" } : s))
          );
          setTimeout(() => {
            setState((prev) => {
              const updated = (prev.vectors[brandId] || []).map((vec) =>
                vec.id === v.id
                  ? { ...vec, validated: true, summary: vec.summary || "Validado por el Agente CEO durante auditoría automatizada." }
                  : vec
              );
              return { ...prev, vectors: { ...prev.vectors, [brandId]: updated } };
            });
            setExecutionSteps((prev) =>
              prev.map((s, si) => (si === i ? { ...s, status: "done" } : s))
            );
            if (i === pending.length - 1) {
              setTimeout(() => {
                setScanningVectorId(null);
                setIsScanning(false);
                setTimeout(() => setExecutionSteps([]), 2000);
                onComplete?.();
              }, 400);
            }
          }, 600);
        }, i * 1000);
      });
    },
    [state.vectors, isScanning]
  );

  const runPMExecution = useCallback(
    (onComplete?: () => void) => {
      if (isPMRunning) return;
      setIsPMRunning(true);

      const steps: ExecutionStep[] = pmStepLabels.map((label) => ({
        label,
        status: "pending",
      }));
      setPMExecutionSteps(steps);

      pmStepLabels.forEach((_, i) => {
        setTimeout(() => {
          setPMExecutionSteps((prev) =>
            prev.map((s, si) =>
              si === i ? { ...s, status: "active" } : si < i ? { ...s, status: "done" } : s
            )
          );
          if (i === pmStepLabels.length - 1) {
            setTimeout(() => {
              setPMExecutionSteps((prev) => prev.map((s) => ({ ...s, status: "done" })));
              setTimeout(() => {
                setIsPMRunning(false);
                setTimeout(() => setPMExecutionSteps([]), 2000);
                onComplete?.();
              }, 600);
            }, 800);
          }
        }, i * 1200);
      });
    },
    [isPMRunning]
  );

  return (
    <BrandContext.Provider
      value={{
        getVectors,
        toggleVector,
        validateAllVectors,
        isLibroVivoComplete,
        signLibroVivo,
        isScanning,
        scanningVectorId,
        executionSteps,
        runCEOAudit,
        runPMExecution,
        isPMRunning,
        pmExecutionSteps,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandContext() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrandContext must be used within BrandProvider");
  return ctx;
}
