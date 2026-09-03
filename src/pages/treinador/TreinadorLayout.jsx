import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { demoTreinador } from "../../lib/demoData";
import BottomNav from "../../components/BottomNav";
import { IconFeed, IconPeople, IconHeartbeat, IconWallet, IconAthlete, IconLogout } from "../../icons";

const NAV_ITEMS = [
  { to: "/treinador", icon: IconFeed, label: "Início", end: true },
  { to: "/treinador/comunidade", icon: IconPeople, label: "Comunidade" },
  { to: "/treinador/cardio", icon: IconHeartbeat, label: "Cardio" },
  { to: "/treinador/financeiro", icon: IconWallet, label: "Financeiro" },
  { to: "/treinador/perfil", icon: IconAthlete, label: "Perfil" },
];

export default function TreinadorLayout() {
  const { isDemo, profile, logout } = useAuth();
  const navigate = useNavigate();
  const treinador = isDemo ? demoTreinador : profile?.treinador;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg pb-24 max-w-[420px] mx-auto relative">
      <button onClick={handleLogout} className="absolute top-4 right-4 text-muted z-30 p-1">
        <IconLogout size={18} />
      </button>
      <Outlet context={{ treinador }} />
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}
