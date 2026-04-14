import { useState, useCallback } from "react";
import { Building, Briefcase, FileText, Palette, BookOpen, Upload, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MockFile {
  name: string;
  size: string;
}

interface NewBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBrand: (data: { name: string; sector: string; description: string }) => void;
}

function Dropzone({
  label,
  icon: Icon,
  accent,
  acceptHint,
  files,
  onDrop,
  onFileInput,
  onRemove,
}: {
  label: string;
  icon: React.ElementType;
  accent: string;
  acceptHint: string;
  files: MockFile[];
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex-1 min-w-[220px] space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent}`} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); onDrop(e); }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300 ${
          dragOver ? "border-current scale-[1.02] bg-current/5" : "border-border/40 hover:border-current/40"
        } ${accent}`}
      >
        <Upload className={`h-8 w-8 mb-2 ${dragOver ? "" : "text-muted-foreground"}`} />
        <p className="text-xs text-muted-foreground text-center">{acceptHint}</p>
        <label className="mt-3 cursor-pointer rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all glass-subtle hover:shadow-md text-muted-foreground hover:text-foreground">
          Seleccionar
          <input type="file" multiple onChange={onFileInput} className="hidden" />
        </label>
      </div>
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl p-2 glass-subtle animate-fade-in">
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-foreground">{f.name}</span>
              <span className="text-[10px] text-muted-foreground">{f.size}</span>
              <button onClick={() => onRemove(i)} className="p-0.5 text-muted-foreground hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NewBrandModal({ open, onOpenChange, onCreateBrand }: NewBrandModalProps) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [visualFiles, setVisualFiles] = useState<MockFile[]>([]);
  const [stratFiles, setStratFiles] = useState<MockFile[]>([]);

  const toMockFiles = (fileList: FileList | DataTransfer["files"]): MockFile[] =>
    Array.from(fileList).map((f) => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }));

  const handleSubmit = () => {
    onCreateBrand({ name: name.trim(), sector: sector.trim(), description: description.trim() });
    toast.success(`🏢 Marca "${name.trim()}" creada`, {
      description: `${visualFiles.length + stratFiles.length} archivo(s) adjuntados.`,
    });
    setName(""); setSector(""); setDescription("");
    setVisualFiles([]); setStratFiles([]);
    onOpenChange(false);
  };

  const canSubmit = name.trim().length > 0 && sector.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-none sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Plus className="h-5 w-5 text-agency-fg" />
            Registro de Nueva Marca
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos base y sube documentos para iniciar la ingesta agéntica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Section 1: Base data */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Datos Base</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Building className="h-3.5 w-3.5 text-agency-fg" /> Nombre
                </label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. NovaTech"
                  className="w-full rounded-xl py-2.5 px-3 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-agency-fg" /> Giro / Industria
                </label>
                <input
                  type="text" value={sector} onChange={(e) => setSector(e.target.value)}
                  placeholder="Ej. FinTech, E-Commerce"
                  className="w-full rounded-xl py-2.5 px-3 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FileText className="h-3.5 w-3.5 text-agency-fg" /> Descripción
              </label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción del cliente y su contexto..."
                rows={3}
                className="w-full rounded-xl py-2.5 px-3 text-sm glass-subtle border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-agency/40 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Dual dropzones */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Motor de Ingesta</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Dropzone
                label="Ingesta Visual & Brandbook"
                icon={Palette}
                accent="text-ceo-fg"
                acceptHint="Logotipos, paletas, tipografías (PNG, PDF, AI)"
                files={visualFiles}
                onDrop={(e) => setVisualFiles((p) => [...p, ...toMockFiles(e.dataTransfer.files)])}
                onFileInput={(e) => e.target.files && setVisualFiles((p) => [...p, ...toMockFiles(e.target.files!)])}
                onRemove={(i) => setVisualFiles((p) => p.filter((_, idx) => idx !== i))}
              />
              <Dropzone
                label="Ingesta Estratégica & Contexto"
                icon={BookOpen}
                accent="text-pm-fg"
                acceptHint="Manuales, ventas, briefs (PDF, XLSX, DOCX)"
                files={stratFiles}
                onDrop={(e) => setStratFiles((p) => [...p, ...toMockFiles(e.dataTransfer.files)])}
                onFileInput={(e) => e.target.files && setStratFiles((p) => [...p, ...toMockFiles(e.target.files!)])}
                onRemove={(i) => setStratFiles((p) => p.filter((_, idx) => idx !== i))}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-all glass-subtle hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "hsl(var(--agency-accent))" }}
          >
            Crear Marca
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
