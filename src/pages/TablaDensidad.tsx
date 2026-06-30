import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PhoneFrame } from "../components/layout/PhoneFrame";
import { useTablaDensidad } from "../lib/useTablaDensidad";

export default function TablaDensidad() {
  const navigate = useNavigate();
  const { tabla, cargando, error } = useTablaDensidad();

  return (
    <PhoneFrame>
      <div className="bg-stone-50">
        <div className="bg-amber-600 px-5 pt-5 pb-5 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-amber-100 -ml-1" aria-label="Volver">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-100">
              Referencia
            </span>
            <h1 className="text-white text-xl font-bold leading-tight">Tabla densidad</h1>
          </div>
        </div>

        <div className="px-3 py-4 max-h-[70vh] overflow-y-auto">
          {cargando && (
            <p className="text-center text-stone-400 text-sm py-8">Cargando...</p>
          )}
          {error && (
            <p className="text-center text-red-600 text-sm py-8 px-4">{error}</p>
          )}
          {!cargando && !error && (
            <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
              <div className="grid grid-cols-6 gap-1 bg-stone-100 px-3 py-2 text-[10.5px] font-bold text-stone-500 uppercase tracking-wide">
                <span>Año</span>
                <span>Dens</span>
                <span>HA/J</span>
                <span>TM/C</span>
                <span>S/ha</span>
                <span>S/p</span>
              </div>
              {tabla.map((r, i) => (
                <div
                  key={`${r.anioSiembra}-${r.densidadPlan}`}
                  className={`grid grid-cols-6 gap-1 px-3 py-2.5 text-[13px] font-medium text-stone-800 tabular-nums ${
                    i % 2 ? "bg-stone-50/60" : "bg-white"
                  }`}
                >
                  <span>{r.anioSiembra}</span>
                  <span>{r.densidadPlan}</span>
                  <span>{r.haJ.toFixed(1)}</span>
                  <span>{r.tmC.toFixed(1)}</span>
                  <span>{r.sacosHa.toFixed(1)}</span>
                  <span>{r.sacosP.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-center text-[11px] text-stone-400 mt-3">Solo lectura · no editable</p>
        </div>
      </div>
    </PhoneFrame>
  );
}
