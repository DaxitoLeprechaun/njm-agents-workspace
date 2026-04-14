import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hexagon, LogIn, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock auth — replace with Supabase Auth later
    setTimeout(() => {
      localStorage.setItem("njm-auth", "true");
      toast.success("Sesión iniciada correctamente");
      navigate("/");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface-1 to-surface-2" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl glass">
            <Hexagon className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">NJM OS</h1>
            <p className="mt-1 text-sm text-muted-foreground">Plataforma de Agentes Autónomos</p>
          </div>
        </div>

        {/* Login card */}
        <form onSubmit={handleLogin} className="rounded-2xl p-6 glass space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@agencia.com"
              required
              className="glass-subtle border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-10 glass-subtle border-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-primary-foreground bg-primary shadow-lg transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Iniciando sesión…" : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 Agencia Disrupt · NJM OS v1.0
        </p>
      </div>
    </div>
  );
}
