import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Spinner } from "./components/ui";

import Login from "./pages/Login";
import Confirmando from "./pages/Confirmando";

import AlunoLayout from "./pages/aluno/AlunoLayout";
import Feed from "./pages/aluno/Feed";
import Avaliacao from "./pages/aluno/Avaliacao";
import Relatorio from "./pages/aluno/Relatorio";
import Checkin from "./pages/aluno/Checkin";
import Cardio from "./pages/aluno/Cardio";
import Pagamentos from "./pages/aluno/Pagamentos";
import PerfilAluno from "./pages/aluno/Perfil";

import TreinadorLayout from "./pages/treinador/TreinadorLayout";
import Inicio from "./pages/treinador/Inicio";
import Comunidade from "./pages/treinador/Comunidade";
import ComunidadeNovo from "./pages/treinador/ComunidadeNovo";
import CardioTreinador from "./pages/treinador/Cardio";
import Financeiro from "./pages/treinador/Financeiro";
import Notificacao from "./pages/treinador/Notificacao";
import PublicarRelatorio from "./pages/treinador/PublicarRelatorio";
import PerfilTreinador from "./pages/treinador/Perfil";

function RequireRole({ role, children }) {
  const { role: currentRole, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={24} color="#31E17A" />
      </div>
    );
  }
  if (currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/confirmando" element={<Confirmando />} />

      <Route
        path="/aluno"
        element={
          <RequireRole role="aluno">
            <AlunoLayout />
          </RequireRole>
        }
      >
        <Route index element={<Feed />} />
        <Route path="avaliacao" element={<Avaliacao />} />
        <Route path="avaliacao/relatorio/:periodoId" element={<Relatorio />} />
        <Route path="checkin" element={<Checkin />} />
        <Route path="cardio" element={<Cardio />} />
        <Route path="pagamentos" element={<Pagamentos />} />
        <Route path="perfil" element={<PerfilAluno />} />
      </Route>

      <Route
        path="/treinador"
        element={
          <RequireRole role="treinador">
            <TreinadorLayout />
          </RequireRole>
        }
      >
        <Route index element={<Inicio />} />
        <Route path="comunidade" element={<Comunidade />} />
        <Route path="comunidade/novo" element={<ComunidadeNovo />} />
        <Route path="cardio" element={<CardioTreinador />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="notificacao" element={<Notificacao />} />
        <Route path="publicar-relatorio" element={<PublicarRelatorio />} />
        <Route path="perfil" element={<PerfilTreinador />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
