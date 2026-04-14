import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AgencyProfile {
  name: string;
  objectives: string;
  style: string[];
  values: string;
}

interface AgencyContextValue {
  isSetupComplete: boolean;
  profile: AgencyProfile | null;
  completeSetup: (profile: AgencyProfile) => void;
  resetSetup: () => void;
}

const AgencyContext = createContext<AgencyContextValue | null>(null);

const STORAGE_KEY = "njm-agency-setup";
const PROFILE_KEY = "njm-agency-profile";

function loadSetupState(): { complete: boolean; profile: AgencyProfile | null } {
  try {
    const complete = localStorage.getItem(STORAGE_KEY) === "true";
    const raw = localStorage.getItem(PROFILE_KEY);
    const profile = raw ? JSON.parse(raw) : null;
    return { complete, profile };
  } catch {
    return { complete: false, profile: null };
  }
}

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [state] = useState(loadSetupState);
  const [isSetupComplete, setIsSetupComplete] = useState(state.complete);
  const [profile, setProfile] = useState<AgencyProfile | null>(state.profile);

  const completeSetup = useCallback((p: AgencyProfile) => {
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
    setIsSetupComplete(true);
  }, []);

  const resetSetup = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    setIsSetupComplete(false);
  }, []);

  return (
    <AgencyContext.Provider value={{ isSetupComplete, profile, completeSetup, resetSetup }}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const ctx = useContext(AgencyContext);
  if (!ctx) throw new Error("useAgency must be used within AgencyProvider");
  return ctx;
}
