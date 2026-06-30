import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  soloAdmin?: boolean;
}

export function ProtectedRoute({ children, soloAdmin = false }: ProtectedRouteProps) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && usuario.rol !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
