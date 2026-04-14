import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, ShieldCheck, Briefcase, BookOpen, Settings, LogOut } from "lucide-react";
import { brands } from "@/data/brands";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("njm-auth");
    toast.success("Sesión cerrada");
    navigate("/login");
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar marca, workspace o acción..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading="Marcas">
          {brands.map((b) => (
            <CommandItem key={b.id} onSelect={() => go(`/brand/${b.id}`)}>
              <Building className="mr-2 h-4 w-4 text-agency-fg" />
              {b.name}
              <span className="ml-auto text-xs text-muted-foreground">{b.sector}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Workspaces (última marca)">
          <CommandItem onSelect={() => go("/")}>
            <Building className="mr-2 h-4 w-4" /> Hub de Agencias
          </CommandItem>
          <CommandItem onSelect={() => go("/brand/1/ceo")}>
            <ShieldCheck className="mr-2 h-4 w-4 text-ceo-fg" /> Agente CEO
          </CommandItem>
          <CommandItem onSelect={() => go("/brand/1/pm")}>
            <Briefcase className="mr-2 h-4 w-4 text-pm-fg" /> Agente PM
          </CommandItem>
          <CommandItem onSelect={() => go("/brand/1/libro-vivo")}>
            <BookOpen className="mr-2 h-4 w-4 text-pm-fg" /> Libro Vivo
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem onSelect={() => go("/settings")}>
            <Settings className="mr-2 h-4 w-4" /> Configuración
          </CommandItem>
          <CommandItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 text-destructive" /> Cerrar Sesión
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
