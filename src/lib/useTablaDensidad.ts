import { useState, useEffect } from "react";
import type { FilaDensidad } from "../types";
import { obtenerTablaDensidad } from "./api";

export function useTablaDensidad() {
  const [tabla, setTabla] = useState<FilaDensidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerTablaDensidad()
      .then((data) => {
        if (activo) setTabla(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "Error al cargar Tabla densidad");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { tabla, cargando, error };
}
