import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 glass hover:shadow-lg hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
