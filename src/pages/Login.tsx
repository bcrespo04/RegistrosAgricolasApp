import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { usuario, login, error, cargando } = useAuth();
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnviando(true);
    await login(email);
    setEnviando(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <div className="bg-emerald-700 px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
          <Sprout className="h-7 w-7 text-white" />
        </div>
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-200">
          Operaciones de campo
        </span>
        <h1 className="text-white text-2xl font-bold mt-1">Registros Agrícolas</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-8 flex flex-col gap-4 max-w-md mx-auto w-full">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-stone-600 tracking-wide">
            Correo registrado
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@correo.com"
            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3.5 text-[16px] font-medium text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
          />
        </label>

        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || cargando}
          className="mt-2 w-full rounded-2xl bg-emerald-700 py-4 text-white font-bold text-[16px] shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition disabled:opacity-60"
        >
          {enviando ? "Verificando..." : "Ingresar"}
        </button>

        <p className="text-[12px] text-stone-400 text-center mt-2">
          Acceso solo para correos registrados por el administrador.
        </p>
      </form>
    </div>
  );
}
