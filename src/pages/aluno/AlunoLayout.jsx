import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePagamentos } from "../../hooks/useData";
import { demoAluno } from "../../lib/demoData";
import BottomNav from "../../components/BottomNav";
import { Spinner } from "../../components/ui";
import { IconFeed, IconTrend, IconHeartbeat, IconCard, IconAthlete, IconLogout } from "../../icons";

const NAV_ITEMS = [
  { to: "/aluno", icon: IconFeed, label: "Feed", end: true },
  { to: "/aluno/avaliacao", icon: IconTrend, label: "Avaliação" },
  { to: "/aluno/cardio", icon: IconHeartbeat, label: "Cardio" },
  { to: "/aluno/pagamentos", icon: IconCard, label: "Pagamentos" },
  { to: "/aluno/perfil", icon: IconAthlete, label: "Perfil" },
];

export default function AlunoLayout() {
  const { isDemo, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { data: pagamentos, loading } = usePagamentos();

  const aluno = isDemo ? demoAluno : profile?.aluno;
  const isBlocked = !isDemo && (pagamentos || []).some((p) => p.status === "pendente");

  if (!aluno) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={24} color="#31E17A" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg pb-24 max-w-[420px] mx-auto relative">
      <button onClick={handleLogout} className="absolute top-4 right-4 text-muted z-30 p-1">
        <IconLogout size={18} />
      </button>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size={24} color="#31E17A" />
        </div>
      ) : (
        <Outlet context={{ aluno, isBlocked }} />
      )}
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}
