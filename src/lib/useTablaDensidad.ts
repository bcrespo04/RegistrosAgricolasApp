import { useState, useEffect } from "react";
import type { FilaDensidad } from "../types";
import { obtenerTablaDensidad } from "./api";

const CACHE_KEY = "registros-agricolas:tabla-densidad";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface CacheEntry {
  timestamp: number;
  data: FilaDensidad[];
}

function leerCache(): FilaDensidad[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function guardarCache(data: FilaDensidad[]) {
  try {
    const entry: CacheEntry = { timestamp: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage lleno o no disponible — ignorar
  }
}

export function useTablaDensidad() {
  const [tabla, setTabla] = useState<FilaDensidad[]>(() => leerCache() ?? []);
  const [cargando, setCargando] = useState(() => leerCache() === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya hay datos en caché válido, no hacer fetch
    const cached = leerCache();
    if (cached && cached.length > 0) {
      setTabla(cached);
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    obtenerTablaDensidad()
      .then((data) => {
        if (activo) {
          setTabla(data);
          guardarCache(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (activo) {
          const msg = e instanceof Error ? e.message : "Error al cargar Tabla densidad";
          console.error("[useTablaDensidad]", msg);
          setError(msg);
        }
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
