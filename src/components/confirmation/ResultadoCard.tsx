import { ChevronLeft, Check, Pencil } from "lucide-react";
import { ReadField } from "../ui/ReadField";
import { IndicatorPair } from "../ui/IndicatorPair";
import type { CalculoResultado, TipoRegistro } from "../../types";

interface ResultadoCardProps {
  tipo: TipoRegistro;
  codigo: string;
  sector: string;
  edadSiembra: string;
  fecha: string;
  hasRac: number;
  hasFs: number;
  tmRacTotal: number;
  tmFs: number;
  pesoEstimado: number;
  rpEstimado: number;
  calculo: CalculoResultado;
  guardando: boolean;
  onEditar: () => void;
  onGuardar: () => void;
}

const TITULO: Record<TipoRegistro, string> = {
  Planificacion: "Planificación",
  Ejecucion: "Ejecución",
};

export function ResultadoCard({
  tipo,
  codigo,
  sector,
  edadSiembra,
  fecha,
  hasRac,
  hasFs,
  tmRacTotal,
  tmFs,
  pesoEstimado,
  rpEstimado,
  calculo,
  guardando,
  onEditar,
  onGuardar,
}: ResultadoCardProps) {
  return (
    <div className="bg-stone-50">
      {/* Header */}
      <div className="bg-emerald-700 px-5 pt-5 pb-5 flex items-center gap-3">
        <button onClick={onEditar} className="text-emerald-100 -ml-1" aria-label="Volver">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-200">
            Resultado
          </span>
          <h1 className="text-white text-xl font-bold leading-tight">{TITULO[tipo]}</h1>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4 max-h-[64vh] overflow-y-auto">
        {/* Datos generales */}
        <div className="rounded-2xl bg-white border border-stone-200 px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <ReadField label="Código coordinador" value={codigo} />
            <ReadField label="Fecha" value={fecha} />
            <ReadField label="Sector" value={sector} />
            <ReadField label="Edad siembra" value={edadSiembra} />
          </div>
        </div>

        {/* CORTA */}
        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 px-4 py-4 space-y-3">
          <div className="text-emerald-800 text-[17px] font-extrabold uppercase tracking-wide">
            Corta
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ReadField label="HA" value={hasRac.toFixed(2)} />
            <ReadField label="TM" value={tmRacTotal.toFixed(2)} />
            <ReadField label="Peso" value={pesoEstimado.toFixed(2)} />
            <ReadField label="RP" value={rpEstimado.toFixed(2)} />
          </div>
          <ReadField label="Densidad" value={calculo.densidadRac.toFixed(0)} />

          <div className="h-px bg-emerald-200/60 my-1" />

          <div className="space-y-3">
            <IndicatorPair label="Corteros" real={calculo.corterosTotal} plan={calculo.corterosPlan} decimals={0} />
            <IndicatorPair label="TM/C" real={calculo.tmC} plan={calculo.tmCPlan} />
            <IndicatorPair label="HA/C" real={calculo.haC} plan={calculo.haCPlan} />
          </div>
        </div>

        {/* COYOL */}
        <div className="rounded-2xl bg-amber-50/60 border border-amber-100 px-4 py-4 space-y-3">
          <div className="text-amber-700 text-[17px] font-extrabold uppercase tracking-wide">
            Coyol
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ReadField label="HA" value={hasFs.toFixed(2)} />
            <ReadField label="TM/Fs" value={tmFs.toFixed(2)} />
          </div>
          <ReadField label="Densidad" value={calculo.densidadFs.toFixed(0)} />

          <div className="h-px bg-amber-200/60 my-1" />

          <div className="space-y-3">
            <IndicatorPair label="Coyoleras" real={calculo.coyolerosTotal} plan={calculo.coyolerosPlan} decimals={0} />
            <IndicatorPair label="Sacos/Cy" real={calculo.sacosCy} plan={calculo.sacosCyPlan} />
            <IndicatorPair label="HA/Cy" real={calculo.haCy} plan={calculo.haCyPlan} />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-8 pt-4 bg-stone-50 flex gap-3 border-t border-stone-100 mt-2">
        <button
          onClick={onEditar}
          disabled={guardando}
          className="flex-1 rounded-2xl border-2 border-stone-300 py-3.5 text-stone-700 font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" /> Editar
        </button>
        <button
          onClick={onGuardar}
          disabled={guardando}
          className="flex-1 rounded-2xl bg-emerald-700 py-3.5 text-white font-bold text-[15px] shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
