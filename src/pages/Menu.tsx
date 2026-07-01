import { useNavigate } from "react-router-dom";
import { Sprout, ClipboardList, ClipboardCheck, LayoutGrid, Users, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Menu() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  if (!usuario) return null;

  const items = [
    { label: "Planificación", desc: "Registrar plan del día", icon: ClipboardList, color: "bg-sky-50 text-sky-700", onClick: () => navigate("/planificacion"), disabled: false },
    { label: "Ejecución", desc: "Registrar labor realizada", icon: ClipboardCheck, color: "bg-emerald-50 text-emerald-700", onClick: () => navigate("/ejecucion"), disabled: false },
    { label: "Tabla densidad", desc: "Consultar valores de referencia", icon: LayoutGrid, color: "bg-amber-50 text-amber-700", onClick: () => navigate("/tabla-densidad"), disabled: false },
    { label: "Usuarios", desc: usuario.rol === "Admin" ? "Gestionar accesos" : "Solo administrador", icon: Users, color: "bg-stone-100 text-stone-500", onClick: () => navigate("/usuarios"), disabled: usuario.rol !== "Admin" },
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="bg-emerald-700 px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 text-emerald-100">
          <Sprout className="h-4 w-4" />
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">Registros Agrícolas</span>
        </div>
        <h1 className="text-white text-2xl font-bold mt-1.5">Hola, {usuario.nombre}</h1>
        <p className="text-emerald-200 text-[13px] mt-0.5">{usuario.rol}</p>
      </div>

      <div className="px-5 -mt-4 pb-8 space-y-3 max-w-md mx-auto">
        {items.map((item) => (
          <button key={item.label} onClick={item.onClick} disabled={item.disabled}
            className={`w-full flex items-center gap-3.5 rounded-2xl bg-white border border-stone-200 px-4 py-4 shadow-sm text-left transition active:scale-[0.98] ${item.disabled ? "opacity-40" : ""}`}>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-stone-900 text-[15px]">{item.label}</div>
              <div className="text-[12.5px] text-stone-400">{item.desc}</div>
            </div>
            {!item.disabled && <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />}
          </button>
        ))}
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-stone-400 text-[13px] font-medium pt-3">
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
