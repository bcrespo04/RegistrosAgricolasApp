import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Planificacion from "./pages/Planificacion";
import Ejecucion from "./pages/Ejecucion";
import TablaDensidad from "./pages/TablaDensidad";
import Usuarios from "./pages/Usuarios";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planificacion"
          element={
            <ProtectedRoute>
              <Planificacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ejecucion"
          element={
            <ProtectedRoute>
              <Ejecucion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tabla-densidad"
          element={
            <ProtectedRoute>
              <TablaDensidad />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute soloAdmin>
              <Usuarios />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
