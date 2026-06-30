# Registros Agrícolas — PWA

App móvil (instalable) para captura de **Planificación** y **Ejecución** de campo en operaciones de palma (Corta / Coyol), con cálculos en tiempo real (Real vs Plan) y backend en Google Sheets.

Stack: React + Vite + TypeScript + Tailwind + React Router. Backend: Google Apps Script (Web App) conectado al archivo "Registros agrícolas".

---

## 1. Requisitos previos

- Node.js 18+ instalado
- Cuenta de GitHub
- Cuenta de Vercel (gratis, conectada a GitHub)
- Acceso de edición al archivo "Registros agrícolas" en Google Drive

---

## 2. Configurar el backend (Apps Script)

1. Abre el archivo **Registros agrícolas** en Google Sheets
2. Ve a **Extensiones → Apps Script**
3. Borra cualquier código de ejemplo (`function myFunction() {}`)
4. Copia y pega **todo** el contenido de `apps-script/Code.gs` de este proyecto
5. Guarda (`Ctrl+S` o el ícono de disco)
6. Clic en **Implementar → Nueva implementación**
7. Tipo: **Aplicación web**
8. Configuración:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
9. Clic en **Implementar**
10. Copia la **URL del Web App** que te entrega (termina en `/exec`) — la necesitarás en el paso 4

> Nota: la primera vez te pedirá autorizar permisos. Es normal, es tu propio script accediendo a tu propio Sheet.

### Importante sobre las hojas

El script espera que existan exactamente estas hojas con estos nombres:
- `Planificacion`
- `Ejecucion`
- `Tabla densidad`
- `Usuarios`

Y que la hoja `Usuarios` tenga las columnas: `Email`, `Nombre`, `Rol`, `Activo`, `Fecha Registro`.

---

## 3. Clonar y correr el proyecto localmente

```bash
# Dentro de la carpeta del proyecto
npm install
cp .env.example .env.local
```

Edita `.env.local` y pega la URL del Web App que copiaste en el paso 2:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_ID/exec
```

Corre el proyecto:

```bash
npm run dev
```

Ábrelo en `http://localhost:5173`

---

## 4. Subir a GitHub

1. Ve a [github.com/new](https://github.com/new) y crea un repositorio vacío (ej. `RegistrosAgricolasApp`) — **sin** README, sin .gitignore (ya los trae el proyecto)
2. En tu terminal, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Versión inicial - Registros Agrícolas PWA"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/RegistrosAgricolasApp.git
git push -u origin main
```

---

## 5. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa el repositorio `RegistrosAgricolasApp` desde GitHub
3. Framework Preset: **Vite** (lo detecta automático)
4. En **Environment Variables**, agrega:
   - Key: `VITE_APPS_SCRIPT_URL`
   - Value: la URL de tu Web App (la misma del paso 2)
5. Clic en **Deploy**

Cada vez que hagas `git push` a `main`, Vercel actualiza la app automáticamente.

---

## 6. Instalar en el celular

1. Abre la URL de Vercel desde Chrome en tu Android
2. Menú (⋮) → **Agregar a pantalla de inicio** / **Instalar app**
3. Listo — queda como ícono en el celular, pantalla completa, sin barra de navegador

---

## Estructura del proyecto

```
src/
├── components/
│   ├── ui/              Inputs, selects, campos de solo lectura
│   ├── forms/            Formularios de captura (Planificación, Ejecución)
│   ├── confirmation/      Tarjeta de resultado con cálculos
│   └── layout/            Marco de teléfono, rutas protegidas
├── pages/                 Una página por pantalla (Login, Menu, etc.)
├── lib/
│   ├── api.ts             Llamadas al Apps Script
│   ├── calculations.ts    Fórmulas Real/Plan (replica el Sheet)
│   ├── auth.tsx           Sesión y login por correo
│   └── useTablaDensidad.ts
└── types/                 Interfaces TypeScript

apps-script/
└── Code.gs                Backend a pegar en Apps Script
```

## Próximos pasos sugeridos

- Agregar rol "Sector X" con filtro de vista en `leerRegistros` (actualmente el front no filtra por sector aún, queda preparado en `api.ts`)
- Agregar pantalla de edición de Usuarios (alta/baja) desde la app
- Modo offline con cola de envíos pendientes (service worker ya configurado vía `vite-plugin-pwa`)
