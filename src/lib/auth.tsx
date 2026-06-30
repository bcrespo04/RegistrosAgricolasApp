import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../types";
import { loginPorEmail } from "./api";

interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "registros-agricolas:usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUsuario(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setCargando(false);
  }, []);

  async function login(email: string): Promise<boolean> {
    setError(null);
    setCargando(true);
    try {
      const found = await loginPorEmail(email.trim().toLowerCase());
      if (!found || !found.activo) {
        setError("Correo no encontrado o usuario inactivo. Contacta al administrador.");
        setCargando(false);
        return false;
      }
      setUsuario(found);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      setCargando(false);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
      setCargando(false);
      return false;
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

/** Determina si el usuario tiene acceso total (ve todos los sectores) */
export function esAccesoTotal(rol: string | undefined): boolean {
  return rol === "Admin" || rol === "Registrador";
}
