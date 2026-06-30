export type Rol =
  | "Admin"
  | "Registrador"
  | "Sector 1" | "Sector 2" | "Sector 3" | "Sector 4"
  | "Sector 5" | "Sector 6" | "Sector 7" | "Sector 8"
  | "Sector 9" | "Sector 10" | "Sector 11" | "Sector 12";

export interface Usuario {
  email: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
}

export type TipoRegistro = "Planificacion" | "Ejecucion";

export const SECTORES = Array.from({ length: 12 }, (_, i) => `Sector ${i + 1}`);
export const EDADES_SIEMBRA = ["2016", "2017", "2018", "2019", "2021", "2022", "2023"];

// Datos crudos que el usuario digita en el formulario
export interface CapturaBase {
  codigoCoord: string;
  edadSiembra: string;
  sector: string;
  rpEstimado: string;
  pesoEstimado: string;
  hasRac: string;
  hasFs: string;
  tmFs: string;
  corterosEmp: string;
  corterosCont: string;
  coyolerosProp: string;
  coyolerosCont: string;
}

// Planificación: un solo campo TM/Rac
export interface CapturaPlanificacion extends CapturaBase {
  tmRac: string;
}

// Ejecución: TM/Rac dividido en enviadas + bacadía
export interface CapturaEjecucion extends CapturaBase {
  tmRacEnviadas: string;
  tmRacBacadia: string;
}

// Fila de la Tabla densidad (hoja de referencia)
export interface FilaDensidad {
  anioSiembra: number;
  densidadPlan: number;
  densidadFs: number;
  haJ: number;
  tmC: number;
  sacosHa: number;
  sacosP: number;
  match: number;
}

// Resultado de los cálculos derivados (Virtual Columns equivalentes)
export interface CalculoResultado {
  densidadRac: number;
  densidadFs: number;
  corterosTotal: number;
  corterosPlan: number;
  coyolerosTotal: number;
  coyolerosPlan: number;
  tmC: number;
  tmCPlan: number;
  haC: number;
  haCPlan: number;
  sacosCy: number;
  sacosCyPlan: number;
  haCy: number;
  haCyPlan: number;
}

// Payload final que se envía al Apps Script para guardar
export interface RegistroPayload extends CalculoResultado {
  tipo: TipoRegistro;
  marcaTemporal: string;
  codigoCoord: string;
  edadSiembra: string;
  sector: string;
  rpEstimado: number;
  pesoEstimado: number;
  hasRac: number;
  hasFs: number;
  tmRac?: number;
  tmRacEnviadas?: number;
  tmRacBacadia?: number;
  tmFs: number;
  corterosEmp: number;
  corterosCont: number;
  coyolerosProp: number;
  coyolerosCont: number;
}
