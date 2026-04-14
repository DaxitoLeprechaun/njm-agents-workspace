import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[NJM OS] Error capturado:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-lg font-semibold text-foreground">
              Algo salió mal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Se produjo un error inesperado en este módulo. Puedes intentar recargar o contactar soporte si el problema persiste.
            </p>
            {this.state.error && (
              <pre className="mt-4 rounded-xl p-3 text-xs text-muted-foreground font-mono glass-subtle overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
