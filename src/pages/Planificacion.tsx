import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "../components/layout/PhoneFrame";
import { PlanificacionForm, PLANIFICACION_INICIAL } from "../components/forms/PlanificacionForm";
import { ResultadoCard } from "../components/confirmation/ResultadoCard";
import { useTablaDensidad } from "../lib/useTablaDensidad";
import { calcularIndicadores } from "../lib/calculations";
import { guardarRegistro } from "../lib/api";
import type { CapturaPlanificacion, RegistroPayload } from "../types";

type Paso = "form" | "confirm";

const n = (v: string) => parseFloat(v) || 0;

export default function Planificacion() {
  const navigate = useNavigate();
  const { tabla } = useTablaDensidad();
  const [paso, setPaso] = useState<Paso>("form");
  const [valores, setValores] = useState<CapturaPlanificacion>(PLANIFICACION_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  const calculo = useMemo(
    () =>
      calcularIndicadores({
        anioSiembra: valores.edadSiembra || "0",
        hasRac: n(valores.hasRac),
        hasFs: n(valores.hasFs),
        tmRacTotal: n(valores.tmRac),
        tmFs: n(valores.tmFs),
        corterosEmp: n(valores.corterosEmp),
        corterosCont: n(valores.corterosCont),
        coyolerosProp: n(valores.coyolerosProp),
        coyolerosCont: n(valores.coyolerosCont),
        tablaDensidad: tabla,
      }),
    [valores, tabla]
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
      tipo: "Planificacion",
      marcaTemporal: new Date().toISOString(),
      codigoCoord: valores.codigoCoord,
      edadSiembra: valores.edadSiembra,
      sector: valores.sector,
      rpEstimado: n(valores.rpEstimado),
      pesoEstimado: n(valores.pesoEstimado),
      hasRac: n(valores.hasRac),
      hasFs: n(valores.hasFs),
      tmRac: n(valores.tmRac),
      tmFs: n(valores.tmFs),
      corterosEmp: n(valores.corterosEmp),
      corterosCont: n(valores.corterosCont),
      coyolerosProp: n(valores.coyolerosProp),
      coyolerosCont: n(valores.coyolerosCont),
      ...calculo,
    };

    try {
      await guardarRegistro(payload);
      setValores(PLANIFICACION_INICIAL);
      navigate("/");
    } catch (e) {
      setErrorGuardar(e instanceof Error ? e.message : "Error al guardar el registro");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <PhoneFrame>
      {paso === "form" ? (
        <PlanificacionForm
          valores={valores}
          onChange={setValores}
          onBack={() => navigate("/")}
          onNext={() => setPaso("confirm")}
        />
      ) : (
        <>
          <ResultadoCard
            tipo="Planificacion"
            codigo={valores.codigoCoord}
            sector={valores.sector}
            edadSiembra={valores.edadSiembra}
            fecha={fechaHoy}
            hasRac={n(valores.hasRac)}
            hasFs={n(valores.hasFs)}
            tmRacTotal={n(valores.tmRac)}
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
    </PhoneFrame>
  );
}
