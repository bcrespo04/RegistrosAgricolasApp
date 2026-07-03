/**
 * REGISTROS AGRÍCOLAS — Backend Apps Script
 * ------------------------------------------------------------
 * Este script se pega directamente en el editor de Apps Script
 * del archivo "Registros agrícolas" (Extensiones > Apps Script).
 *
 * Hojas esperadas (deben existir tal cual):
 *   - "Planificacion"
 *   - "Ejecucion"
 *   - "Tabla densidad"
 *   - "Usuarios"
 *
 * Después de pegar este código:
 *   1. Guardar (Ctrl+S)
 *   2. Implementar > Nueva implementación
 *   3. Tipo: Aplicación web
 *   4. Ejecutar como: Yo (tu cuenta)
 *   5. Quién tiene acceso: Cualquier usuario
 *   6. Copiar la URL del Web App y pegarla en VITE_APPS_SCRIPT_URL
 * ------------------------------------------------------------
 */

const SHEET_PLANIFICACION = "Planificacion";
const SHEET_EJECUCION = "Ejecucion";
const SHEET_TABLA_DENSIDAD = "Tabla densidad";
const SHEET_USUARIOS = "Usuarios";

// ---------- Punto de entrada GET ----------
function doGet(e) {
  try {
    const action = e.parameter.action;

    switch (action) {
      case "login":
        return jsonResponse({ result: loginPorEmail(e.parameter.email) });
      case "tablaDensidad":
        return jsonResponse({ result: leerTablaDensidad() });
      case "usuarios":
        return jsonResponse({ result: leerUsuarios() });
      case "registros":
        return jsonResponse({ result: leerRegistros(e.parameter.tipo, e.parameter.sector) });
      default:
        return jsonResponse({ error: "Acción GET no reconocida: " + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ---------- Punto de entrada POST ----------
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    switch (action) {
      case "guardarRegistro":
        return jsonResponse({ result: guardarRegistro(body.payload) });
      default:
        return jsonResponse({ error: "Acción POST no reconocida: " + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ---------- LOGIN ----------
function loginPorEmail(email) {
  if (!email) return null;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_USUARIOS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idxEmail = headers.indexOf("Email");
  const idxNombre = headers.indexOf("Nombre");
  const idxRol = headers.indexOf("Rol");
  const idxActivo = headers.indexOf("Activo");

  const emailLower = String(email).trim().toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[idxEmail]).trim().toLowerCase() === emailLower) {
      return {
        email: row[idxEmail],
        nombre: row[idxNombre],
        rol: row[idxRol],
        activo: row[idxActivo] === true || row[idxActivo] === "TRUE",
      };
    }
  }
  return null;
}

// ---------- USUARIOS (listado completo, solo Admin desde el front) ----------
function leerUsuarios() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_USUARIOS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idxEmail = headers.indexOf("Email");
  const idxNombre = headers.indexOf("Nombre");
  const idxRol = headers.indexOf("Rol");
  const idxActivo = headers.indexOf("Activo");

  const resultado = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[idxEmail]) continue;
    resultado.push({
      email: row[idxEmail],
      nombre: row[idxNombre],
      rol: row[idxRol],
      activo: row[idxActivo] === true || row[idxActivo] === "TRUE",
    });
  }
  return resultado;
}

// ---------- TABLA DENSIDAD ----------
function leerTablaDensidad() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_TABLA_DENSIDAD);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idx = {
    anio: headers.indexOf("Año de siembra"),
    densPlan: headers.indexOf("Densidad Plan"),
    densFs: headers.indexOf("Densidad FS"),
    haJ: headers.indexOf("HA / J"),
    tmC: headers.indexOf("TM / C"),
    sacosHa: headers.indexOf("Sacos / ha"),
    sacosP: headers.indexOf("Sacos / p"),
    match: headers.indexOf("MACTH"),
  };

  const resultado = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[idx.anio]) continue;
    resultado.push({
      anioSiembra: Number(row[idx.anio]),
      densidadPlan: Number(row[idx.densPlan]),
      densidadFs: Number(row[idx.densFs]),
      haJ: Number(row[idx.haJ]),
      tmC: Number(row[idx.tmC]),
      sacosHa: Number(row[idx.sacosHa]),
      sacosP: Number(row[idx.sacosP]),
      match: Number(row[idx.match]),
    });
  }
  return resultado;
}

// ---------- LEER REGISTROS (Planificacion / Ejecucion) ----------
function leerRegistros(tipo, sector) {
  const nombreHoja = tipo === "Ejecucion" ? SHEET_EJECUCION : SHEET_PLANIFICACION;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const filas = data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  });

  if (sector) {
    return filas.filter((f) => f["Sector"] === sector);
  }
  return filas;
}

// ---------- GUARDAR REGISTRO ----------
function guardarRegistro(payload) {
  const nombreHoja = payload.tipo === "Ejecucion" ? SHEET_EJECUCION : SHEET_PLANIFICACION;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  sheet.insertRowAfter(1);
  const targetRow = 2;
  sheet.getRange(targetRow, 1, 1, sheet.getLastColumn()).clearFormat();

  // Campos manuales + calculados virtuales (se envían todos como valores)
  const campos = {
    "Marca temporal": new Date(payload.marcaTemporal || Date.now()),
    "Codigo Coord": payload.codigoCoord,
    "Edad Siembra": payload.edadSiembra,
    "Sector": payload.sector,
    "Rp estimado": payload.rpEstimado,
    "Peso estimado": payload.pesoEstimado,
    "Has Rac": payload.hasRac,
    "Has Fs": payload.hasFs,
    "TM /Fs": payload.tmFs,
    "Corteros emp": payload.corterosEmp,
    "Corteros cont": payload.corterosCont,
    "Coyoleros prop": payload.coyolerosProp,
    // Calculados virtuales
    "Densidad Rac": payload.densidadRac,
    "Densidad fs": payload.densidadFs,
    "Corteros total": payload.corterosTotal,
    "Corteros Plan": payload.corterosPlan,
    "Coyoleros total": payload.coyolerosTotal,
    "Coyoleros Plan": payload.coyolerosPlan,
    "TM / C": payload.tmC,
    "TM/C plan": payload.tmCPlan,
    "HA / C": payload.haC,
    "HA/C plan": payload.haCPlan,
    "Sacos / Cy": payload.sacosCy,
    "Sacos/Cy plan": payload.sacosCyPlan,
    "HA / Cy": payload.haCy,
    "HA/Cy plan": payload.haCyPlan,
    "FE": new Date(),
  };

  if (payload.tipo === "Ejecucion") {
    campos["TM /Rac enviadas"] = payload.tmRacEnviadas;
    campos["TM /Rac bacadia"] = payload.tmRacBacadia;
    campos["Coyoleros cont"] = payload.coyolerosCont;
  } else {
    campos["TM /Rac"] = payload.tmRac;
    campos["Coyoleros Cont"] = payload.coyolerosCont;
    campos["Fecha real de labor"] = payload.fechaLaborDate ? new Date(payload.fechaLaborDate) : "";
  }

  const rowValues = headers.map((h) => (h in campos ? campos[h] : ""));
  sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);

  return { ok: true };
}
