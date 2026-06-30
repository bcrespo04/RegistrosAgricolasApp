import type { Usuario, FilaDensidad, RegistroPayload } from "../types";

/**
 * URL del Web App desplegado desde Apps Script (Extensiones > Apps Script > Desplegar).
 * Se configura como variable de entorno en Vercel: VITE_APPS_SCRIPT_URL
 */
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_APPS_SCRIPT_URL no está configurada. Define esta variable en .env.local o en Vercel."
  );
}

async function apiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Error al consultar ${action}: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result as T;
}

async function apiPost<T>(action: string, payload: unknown): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight CORS en Apps Script
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) throw new Error(`Error al enviar ${action}: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result as T;
}

/** Valida el correo contra la hoja Usuarios y retorna el usuario con su rol */
export async function loginPorEmail(email: string): Promise<Usuario | null> {
  return apiGet<Usuario | null>("login", { email });
}

/** Trae todas las filas de la Tabla densidad para los cálculos en tiempo real */
export async function obtenerTablaDensidad(): Promise<FilaDensidad[]> {
  return apiGet<FilaDensidad[]>("tablaDensidad");
}

/** Guarda un registro nuevo en la hoja Planificacion o Ejecucion */
export async function guardarRegistro(payload: RegistroPayload): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>("guardarRegistro", payload);
}

/** Lista los registros existentes, filtrados por sector si aplica (para vistas futuras) */
export async function obtenerRegistros(
  tipo: "Planificacion" | "Ejecucion",
  sector?: string
): Promise<RegistroPayload[]> {
  return apiGet<RegistroPayload[]>("registros", { tipo, ...(sector ? { sector } : {}) });
}
