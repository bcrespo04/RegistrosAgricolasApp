import { ChevronLeft } from "lucide-react";
import { NumField } from "../ui/NumField";
import { SelectField } from "../ui/SelectField";
import { SECTORES, EDADES_SIEMBRA, type CapturaPlanificacion } from "../../types";

interface PlanificacionFormProps {
  valores: CapturaPlanificacion;
  onChange: (valores: CapturaPlanificacion) => void;
  onBack: () => void;
  onNext: () => void;
  tablaLista?: boolean;
  errorTabla?: string | null;
}

export function PlanificacionForm({ valores, onChange, onBack, onNext, tablaLista = true, errorTabla }: PlanificacionFormProps) {
  const set = <K extends keyof CapturaPlanificacion>(key: K) => (v: string) =>
    onChange({ ...valores, [key]: v });

  const camposRequeridos: (keyof CapturaPlanificacion)[] = [
    "codigoCoord", "edadSiembra", "sector",
    "rpEstimado", "pesoEstimado",
    "hasRac", "tmRac",
    "corterosEmp", "corterosCont",
    "hasFs", "tmFs",
    "coyolerosProp", "coyolerosCont",
  ];

  const hayVacios = camposRequeridos.some((k) => valores[k] === "");

  function handleNext() {
    if (hayVacios) {
      alert("Por favor completa todos los campos antes de continuar. Si el valor es cero, escribe 0.");
      return;
    }
    onNext();
  }

  return (
    <div className="bg-stone-50">
      <div className="bg-emerald-700 px-5 pt-5 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-emerald-100 -ml-1" aria-label="Volver">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-200">
            Nuevo registro
          </span>
        </div>
        <h1 className="text-white text-2xl font-bold mt-1.5">Planificación</h1>
      </div>

      <div className="px-5 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Código coordinador" value={valores.codigoCoord} onChange={set("codigoCoord")} />
          <SelectField
            label="Edad siembra"
            value={valores.edadSiembra}
            onChange={set("edadSiembra")}
            options={EDADES_SIEMBRA}
            placeholder="Año"
          />
        </div>

        <SelectField
          label="Sector"
          value={valores.sector}
          onChange={set("sector")}
          options={SECTORES}
          placeholder="Seleccionar sector"
        />

        <div className="grid grid-cols-2 gap-3">
          <NumField label="Rp estimado" value={valores.rpEstimado} onChange={set("rpEstimado")} decimals={2} />
          <NumField label="Peso estimado" value={valores.pesoEstimado} onChange={set("pesoEstimado")} decimals={2} suffix="kg" />
        </div>

        <div className="h-px bg-stone-200" />
        <div className="text-emerald-800 text-[17px] font-extrabold uppercase tracking-wide">Corta</div>

        <div className="grid grid-cols-2 gap-3">
          <NumField label="Has Rac" value={valores.hasRac} onChange={set("hasRac")} decimals={2} />
          <NumField label="TM/Rac" value={valores.tmRac} onChange={set("tmRac")} decimals={2} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-stone-600 tracking-wide">Fecha real de labor</span>
          <input
            type="date"
            value={valores.fechaLaborDate}
            onChange={(e) => set("fechaLaborDate")(e.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-[16px] font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <NumField label="Corteros emp." value={valores.corterosEmp} onChange={set("corterosEmp")} />
          <NumField label="Corteros cont." value={valores.corterosCont} onChange={set("corterosCont")} />
        </div>

        <div className="h-px bg-stone-200" />
        <div className="text-amber-700 text-[17px] font-extrabold uppercase tracking-wide">Coyol</div>

        <div className="grid grid-cols-2 gap-3">
          <NumField label="Has Fs" value={valores.hasFs} onChange={set("hasFs")} decimals={2} />
          <NumField label="TM/Fs" value={valores.tmFs} onChange={set("tmFs")} decimals={2} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumField label="Coyoleros prop." value={valores.coyolerosProp} onChange={set("coyolerosProp")} />
          <NumField label="Coyoleros cont." value={valores.coyolerosCont} onChange={set("coyolerosCont")} />
        </div>
      </div>

      <div className="px-5 pb-6 pt-2 bg-stone-50 space-y-2">
        {!tablaLista && !errorTabla && (
          <p className="text-[12px] text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
            Cargando tabla de referencia... los valores plan se calcularán al terminar.
          </p>
        )}
        {errorTabla && (
          <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center">
            Error cargando tabla: {errorTabla}
          </p>
        )}
        <button
          onClick={handleNext}
          className="w-full rounded-2xl bg-emerald-700 py-3.5 text-white font-bold text-[15px] shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition"
        >
          Calcular y revisar
        </button>
      </div>
    </div>
  );
}

export const PLANIFICACION_INICIAL: CapturaPlanificacion = {
  codigoCoord: "",
  edadSiembra: "",
  sector: "",
  rpEstimado: "",
  pesoEstimado: "",
  hasRac: "",
  hasFs: "",
  tmRac: "",
  tmFs: "",
  corterosEmp: "",
  corterosCont: "",
  coyolerosProp: "",
  coyolerosCont: "",
  fechaLaborDate: "",
};
