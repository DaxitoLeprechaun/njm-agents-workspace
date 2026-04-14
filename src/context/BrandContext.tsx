import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { strategicVectors as initialVectors, type StrategicVector } from "@/data/brands";

interface BrandState {
  vectors: Record<string, StrategicVector[]>; // keyed by brandId
  libroVivoStatus: Record<string, boolean>; // keyed by brandId
}

interface BrandContextValue {
  getVectors: (brandId: string) => StrategicVector[];
  toggleVector: (brandId: string, vectorId: string) => void;
  validateAllVectors: (brandId: string) => void;
  isLibroVivoComplete: (brandId: string) => boolean;
  signLibroVivo: (brandId: string) => void;
  isScanning: boolean;
  scanningVectorId: string | null;
  runCEOAudit: (brandId: string, onComplete?: () => void) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrandState>(() => {
    // Initialize vectors grouped by brandId
    const grouped: Record<string, StrategicVector[]> = {};
    for (const v of initialVectors) {
      if (!grouped[v.brandId]) grouped[v.brandId] = [];
      grouped[v.brandId].push({ ...v });
    }
    return {
      vectors: grouped,
      libroVivoStatus: { "1": true, "4": true },
    };
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanningVectorId, setScanningVectorId] = useState<string | null>(null);

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

      pending.forEach((v, i) => {
        setTimeout(() => {
          setScanningVectorId(v.id);
          setTimeout(() => {
            setState((prev) => {
              const updated = (prev.vectors[brandId] || []).map((vec) =>
                vec.id === v.id
                  ? { ...vec, validated: true, summary: vec.summary || "Validado por el Agente CEO durante auditoría automatizada." }
                  : vec
              );
              return { ...prev, vectors: { ...prev.vectors, [brandId]: updated } };
            });
            if (i === pending.length - 1) {
              setTimeout(() => {
                setScanningVectorId(null);
                setIsScanning(false);
                onComplete?.();
              }, 400);
            }
          }, 600);
        }, i * 1000);
      });
    },
    [state.vectors, isScanning]
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
        runCEOAudit,
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
