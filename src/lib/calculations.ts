import type { FilaDensidad, CalculoResultado } from "../types";

/**
 * Busca en la Tabla densidad la fila correspondiente a un año de siembra
 * y una densidad redondeada a la centena más cercana.
 * Replica: BUSCARX(CONCAT(Edad Siembra, REDONDEAR(Densidad, -2)), 'Tabla densidad'!H:H, ...)
 */
function buscarEnTablaDensidad(
  tabla: FilaDensidad[],
  anioSiembra: string,
  densidadRedondeada: number
): FilaDensidad | undefined {
  const match = Number(anioSiembra) * 1000 + densidadRedondeada;
  return tabla.find((f) => f.match === match);
}

function redondearCentena(valor: number): number {
  return Math.round(valor / 100) * 100;
}

interface InputCalculo {
  anioSiembra: string;
  hasRac: number;
  hasFs: number;
  tmRacTotal: number; // enviadas + bacadia (Ejecucion) o el valor único (Planificacion)
  tmFs: number;
  corterosEmp: number;
  corterosCont: number;
  coyolerosProp: number;
  coyolerosCont: number;
  tablaDensidad: FilaDensidad[];
}

/**
 * Calcula todos los indicadores derivados (Real y Plan) en tiempo real,
 * replicando exactamente las fórmulas validadas en el Google Sheet.
 */
export function calcularIndicadores(input: InputCalculo): CalculoResultado {
  const {
    anioSiembra,
    hasRac,
    hasFs,
    tmRacTotal,
    tmFs,
    corterosEmp,
    corterosCont,
    coyolerosProp,
    coyolerosCont,
    tablaDensidad,
  } = input;

  // Densidad Rac = (TM/Rac total * 1000) / Has Rac
  const densidadRac = hasRac === 0 ? 0 : (tmRacTotal * 1000) / hasRac;

  // Densidad Fs = (TM/Fs * 1000) / Has Fs
  const densidadFs = hasFs === 0 ? 0 : (tmFs * 1000) / hasFs;

  const corterosTotal = corterosEmp + corterosCont;
  const coyolerosTotal = coyolerosProp + coyolerosCont;

  // --- Corteros Plan: Has Rac / HA-J (lookup por Densidad Rac redondeada) ---
  const filaRac = buscarEnTablaDensidad(tablaDensidad, anioSiembra, redondearCentena(densidadRac));
  const corterosPlan = filaRac && hasRac > 0 ? hasRac / filaRac.haJ : 0;

  // --- Coyoleros Plan: (TM/Fs*1000/33) / Sacos-p (lookup por Densidad Fs/0.085 redondeada) ---
  const filaFs = buscarEnTablaDensidad(tablaDensidad, anioSiembra, redondearCentena(densidadFs / 0.085));
  const coyolerosPlan = filaFs ? (tmFs * 1000) / 33 / filaFs.sacosP : 0;

  // --- TM/C real y plan ---
  const tmC = corterosTotal === 0 ? 0 : tmRacTotal / corterosTotal;
  const tmCPlan = filaRac ? filaRac.tmC : 0;

  // --- HA/C real y plan ---
  const haC = corterosTotal === 0 ? 0 : hasRac / corterosTotal;
  const haCPlan = filaRac ? filaRac.haJ : 0;

  // --- Sacos/Cy real y plan ---
  const sacosCy = coyolerosTotal === 0 ? 0 : (tmFs * 1000) / 33 / coyolerosTotal;
  const sacosCyPlan = filaFs ? filaFs.sacosP : 0;

  // --- HA/Cy real y plan ---
  const haCy = coyolerosTotal === 0 ? 0 : hasFs / coyolerosTotal;
  const haCyPlan = filaFs ? filaFs.haJ : 0;

  return {
    densidadRac,
    densidadFs,
    corterosTotal,
    corterosPlan,
    coyolerosTotal,
    coyolerosPlan,
    tmC,
    tmCPlan,
    haC,
    haCPlan,
    sacosCy,
    sacosCyPlan,
    haCy,
    haCyPlan,
  };
}

/** Semáforo de cumplimiento: verde >=95%, amarillo 85-95%, rojo <85% */
export type EstadoSemaforo = "verde" | "amarillo" | "rojo" | "neutral";

export function calcularSemaforo(real: number, plan: number): EstadoSemaforo {
  if (!plan || plan === 0) return "neutral";
  const pct = (real / plan) * 100;
  if (pct >= 95) return "verde";
  if (pct >= 85) return "amarillo";
  return "rojo";
}
