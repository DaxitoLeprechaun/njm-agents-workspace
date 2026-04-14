import { useState, useCallback } from "react";
import { FileUp, MessageSquare, Upload, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DataIngestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "doc" | "briefing";
  vectorName: string;
  vectorCategory: string;
}

const briefingQuestions: Record<string, string[]> = {
  Core: [
    "¿Cuál es la promesa única de valor de esta marca?",
    "¿Qué problema fundamental resuelve para sus clientes?",
    "¿Cuál es el propósito más allá del beneficio económico?",
  ],
  Business: [
    "¿Quién es el cliente ideal (ICP) y qué rol ocupa?",
    "¿Cómo se diferencia del competidor más cercano?",
    "¿Cuál es el modelo de monetización principal?",
  ],
  Brand: [
    "¿Qué 3 adjetivos definen la personalidad de la marca?",
    "¿Qué tono usa la marca: formal, casual, técnico, aspiracional?",
    "¿Existe un manual de identidad visual vigente?",
  ],
  Growth: [
    "¿Cuáles son los 3 canales de adquisición principales?",
    "¿Cuál es la North Star Metric actual?",
    "¿Qué métricas se reportan semanalmente?",
  ],
};

interface MockFile {
  name: string;
  size: string;
  type: string;
}

export function DataIngestionModal({
  open,
  onOpenChange,
  mode,
  vectorName,
  vectorCategory,
}: DataIngestionModalProps) {
  const [files, setFiles] = useState<MockFile[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [dragOver, setDragOver] = useState(false);

  const questions = briefingQuestions[vectorCategory] || briefingQuestions.Core;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const mockFiles: MockFile[] = droppedFiles.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type || "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...mockFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const mockFiles: MockFile[] = selected.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type || "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...mockFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (mode === "doc") {
      toast.success(`${files.length} documento(s) enviado(s) al CEO`, {
        description: `Vector: ${vectorName}`,
      });
    } else {
      const answered = Object.values(answers).filter((a) => a.trim().length > 0).length;
      toast.success(`Briefing enviado al CEO (${answered}/${questions.length} respuestas)`, {
        description: `Vector: ${vectorName}`,
      });
    }
    setFiles([]);
    setAnswers({});
    onOpenChange(false);
  };

  const canSubmit = mode === "doc" ? files.length > 0 : Object.values(answers).some((a) => a.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-none sm:max-w-lg max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {mode === "doc" ? (
              <FileUp className="h-5 w-5 text-ceo-fg" />
            ) : (
              <MessageSquare className="h-5 w-5 text-ceo-fg" />
            )}
            {mode === "doc" ? "Subir Documentos" : "Briefing Estratégico"}
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground/80">{vectorName}</span>
            <span className="mx-1.5 text-muted-foreground">·</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{vectorCategory}</span>
          </DialogDescription>
        </DialogHeader>

        {mode === "doc" ? (
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                dragOver
                  ? "border-ceo bg-ceo/5 scale-[1.02]"
                  : "border-border/50 hover:border-ceo/40"
              }`}
            >
              <Upload className={`h-10 w-10 mb-3 transition-colors ${dragOver ? "text-ceo-fg" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium text-foreground">Arrastra archivos aquí</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, Excel, Word, Markdown</p>
              <label className="mt-4 cursor-pointer rounded-xl px-4 py-2 text-xs font-medium text-ceo-fg transition-all glass-subtle hover:shadow-md">
                O selecciona archivos
                <input
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.md,.txt,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl p-3 glass-subtle animate-fade-in"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-ceo-fg" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">{f.size}</p>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="rounded-lg p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{q}</label>
                <Textarea
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  placeholder="Escribe tu respuesta..."
                  className="min-h-[70px] glass-subtle border-none resize-none text-sm"
                />
              </div>
            ))}
          </div>
        )}

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
            className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "hsla(160, 84%, 39%, 0.85)" }}
          >
            Enviar al CEO
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
