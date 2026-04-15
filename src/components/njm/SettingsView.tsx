import { useState, useEffect } from "react";
import { Settings, FolderOpen, Building, Trash2, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { brands as allBrands } from "@/data/brands";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("njm-theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function SettingsView() {
  const [exportPath, setExportPath] = useState("/Users/tu-usuario/NJM_OS/Marcas/");
  const [isDark, setIsDark] = useState(getInitialDark);
  const [brandNames, setBrandNames] = useState<Record<string, string>>(() => {
    const names: Record<string, string> = {};
    allBrands.forEach((b) => (names[b.id] = b.name));
    return names;
  });
  const [activeBrands, setActiveBrands] = useState<Set<string>>(
    () => new Set(allBrands.map((b) => b.id))
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("njm-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("njm-theme", "light");
    }
  }, [isDark]);

  // Apply saved theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("njm-theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  const handleDeactivate = (brandId: string) => {
    setActiveBrands((prev) => {
      const next = new Set(prev);
      next.delete(brandId);
      return next;
    });
    toast.success(`${brandNames[brandId]} dada de baja`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto scrollbar-thin animate-fade-in">
      <header className="sticky top-0 z-10 px-8 py-5 glass-subtle mx-4 mt-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl glass">
              <Settings className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Configuración</h1>
              <p className="text-sm text-muted-foreground">Ajustes globales del sistema NJM OS</p>
            </div>
          </div>

          {/* Dark mode toggle in header */}
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch checked={isDark} onCheckedChange={setIsDark} />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          <Tabs defaultValue="paths" className="space-y-6">
            <TabsList className="glass-subtle border-none">
              <TabsTrigger value="paths" className="data-[state=active]:glass data-[state=active]:shadow-md">
                <FolderOpen className="mr-1.5 h-4 w-4" /> Rutas
              </TabsTrigger>
              <TabsTrigger value="brands" className="data-[state=active]:glass data-[state=active]:shadow-md">
                <Building className="mr-1.5 h-4 w-4" /> Marcas
              </TabsTrigger>
            </TabsList>

            {/* Local Paths */}
            <TabsContent value="paths" className="space-y-6">
              <div className="rounded-2xl p-6 glass space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Ruta de Exportación</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Directorio donde Claude Cowork guardará los archivos generados (.md, .docx, .xlsx).
                  </p>
                </div>
                <Input
                  value={exportPath}
                  onChange={(e) => setExportPath(e.target.value)}
                  placeholder="/Users/tu-usuario/NJM_OS/Marcas/"
                  className="font-mono text-sm glass-subtle border-none"
                />
              </div>
            </TabsContent>

            {/* Brand Management */}
            <TabsContent value="brands" className="space-y-4">
              {allBrands.map((b) => {
                const isActive = activeBrands.has(b.id);
                if (!isActive) return null;
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 rounded-2xl p-4 glass"
                  >
                    <div className="flex-1">
                      <Input
                        value={brandNames[b.id] || ""}
                        onChange={(e) =>
                          setBrandNames((prev) => ({ ...prev, [b.id]: e.target.value }))
                        }
                        className="h-8 glass-subtle border-none text-sm font-medium"
                      />
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                        {b.sector} · {b.status}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-destructive glass-subtle">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-strong border-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Dar de baja esta marca?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {brandNames[b.id]} será removida del Hub principal. Esta acción se puede revertir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="glass-subtle border-none">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeactivate(b.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Dar de Baja
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Save button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
