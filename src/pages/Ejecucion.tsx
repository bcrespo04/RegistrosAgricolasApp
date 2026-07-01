import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EjecucionForm, EJECUCION_INICIAL } from "../components/forms/EjecucionForm";
import { ResultadoCard } from "../components/confirmation/ResultadoCard";
import { useTablaDensidad } from "../lib/useTablaDensidad";
import { calcularIndicadores } from "../lib/calculations";
import { guardarRegistro } from "../lib/api";
import type { CapturaEjecucion, RegistroPayload } from "../types";

type Paso = "form" | "confirm";

const n = (v: string) => parseFloat(v) || 0;

export default function Ejecucion() {
  const navigate = useNavigate();
  const { tabla } = useTablaDensidad();
  const [paso, setPaso] = useState<Paso>("form");
  const [valores, setValores] = useState<CapturaEjecucion>(EJECUCION_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  const tmRacTotal = n(valores.tmRacEnviadas) + n(valores.tmRacBacadia);

  const calculo = useMemo(
    () =>
      calcularIndicadores({
        anioSiembra: valores.edadSiembra || "0",
        hasRac: n(valores.hasRac),
        hasFs: n(valores.hasFs),
        tmRacTotal,
        tmFs: n(valores.tmFs),
        corterosEmp: n(valores.corterosEmp),
        corterosCont: n(valores.corterosCont),
        coyolerosProp: n(valores.coyolerosProp),
        coyolerosCont: n(valores.coyolerosCont),
        tablaDensidad: tabla,
      }),
    [valores, tabla, tmRacTotal]
  );

  const fechaHoy = new Date().toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  async function handleGuardar() {
    setGuardando(true);
    setErrorGuardar(null);
    const payload: RegistroPayload = {
      tipo: "Ejecucion",
      marcaTemporal: new Date().toISOString(),
      codigoCoord: valores.codigoCoord,
      edadSiembra: valores.edadSiembra,
      sector: valores.sector,
      rpEstimado: n(valores.rpEstimado),
      pesoEstimado: n(valores.pesoEstimado),
      hasRac: n(valores.hasRac),
      hasFs: n(valores.hasFs),
      tmRacEnviadas: n(valores.tmRacEnviadas),
      tmRacBacadia: n(valores.tmRacBacadia),
      tmFs: n(valores.tmFs),
      corterosEmp: n(valores.corterosEmp),
      corterosCont: n(valores.corterosCont),
      coyolerosProp: n(valores.coyolerosProp),
      coyolerosCont: n(valores.coyolerosCont),
      ...calculo,
    };

    try {
      await guardarRegistro(payload);
      setValores(EJECUCION_INICIAL);
      navigate("/");
    } catch (e) {
      setErrorGuardar(e instanceof Error ? e.message : "Error al guardar el registro");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {paso === "form" ? (
        <EjecucionForm
          valores={valores}
          onChange={setValores}
          onBack={() => navigate("/")}
          onNext={() => setPaso("confirm")}
        />
      ) : (
        <>
          <ResultadoCard
            tipo="Ejecucion"
            codigo={valores.codigoCoord}
            sector={valores.sector}
            edadSiembra={valores.edadSiembra}
            fecha={fechaHoy}
            hasRac={n(valores.hasRac)}
            hasFs={n(valores.hasFs)}
            tmRacTotal={tmRacTotal}
            tmFs={n(valores.tmFs)}
            pesoEstimado={n(valores.pesoEstimado)}
            rpEstimado={n(valores.rpEstimado)}
            calculo={calculo}
            guardando={guardando}
            onEditar={() => setPaso("form")}
            onGuardar={handleGuardar}
          />
          {errorGuardar && (
            <p className="px-5 pb-4 -mt-2 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-xl py-2.5 mx-5">
              {errorGuardar}
            </p>
          )}
        </>
      )}
    </div>
  );
}
