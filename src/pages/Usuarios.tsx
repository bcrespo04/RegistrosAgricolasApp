import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, UserCircle2 } from "lucide-react";
import { PhoneFrame } from "../components/layout/PhoneFrame";
import type { Usuario } from "../types";

// Nota: requiere agregar la acción "usuarios" en el Apps Script (Code.gs)
// que retorne todas las filas de la hoja Usuarios.
async function obtenerUsuarios(): Promise<Usuario[]> {
  const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
  const url = new URL(API_URL);
  url.searchParams.set("action", "usuarios");
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result as Usuario[];
}

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerUsuarios()
      .then(setUsuarios)
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar usuarios"))
      .finally(() => setCargando(false));
  }, []);

  return (
    <PhoneFrame>
      <div className="bg-stone-50">
        <div className="bg-stone-700 px-5 pt-5 pb-5 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-stone-200 -ml-1" aria-label="Volver">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-stone-300">
              Administración
            </span>
            <h1 className="text-white text-xl font-bold leading-tight">Usuarios</h1>
          </div>
        </div>

        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto space-y-2.5">
          {cargando && <p className="text-center text-stone-400 text-sm py-8">Cargando...</p>}
          {error && <p className="text-center text-red-600 text-sm py-8 px-2">{error}</p>}
          {!cargando &&
            !error &&
            usuarios.map((u) => (
              <div
                key={u.email}
                className="flex items-center gap-3 rounded-2xl bg-white border border-stone-200 px-4 py-3.5"
              >
                <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                  <UserCircle2 className="h-6 w-6 text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900 text-[14px] truncate">{u.nombre}</div>
                  <div className="text-[12px] text-stone-400 truncate">{u.email}</div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    u.activo ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {u.rol}
                </span>
              </div>
            ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
