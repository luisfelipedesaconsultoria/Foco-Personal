import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useNotificacoes, useCurtir } from "../../hooks/useData";
import { Card, EmptyState, Spinner } from "../../components/ui";
import { IconCheckin, IconBell, IconFlame } from "../../icons";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora";
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function Feed() {
  const { aluno } = useOutletContext();
  const navigate = useNavigate();
  const { data: notificacoes, loading, refetch } = useNotificacoes();
  const curtir = useCurtir();

  const handleCurtir = async (id) => {
    await curtir(id);
    refetch();
  };

  return (
    <div className="px-[18px] pt-6 page-enter">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-display text-[22px] font-bold">Olá, {aluno.nome?.split(" ")[0]}</div>
          <div className="text-[11.5px] text-muted mt-0.5 capitalize">{aluno.tipo}</div>
        </div>
      </div>

      <Card featured className="mt-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-greenDim text-green flex items-center justify-center flex-shrink-0">
          <IconCheckin size={18} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-[13px]">Check-in do mês</div>
          <div className="text-[11px] text-muted mt-0.5">2 minutos. Ajuda a construir seu relatório.</div>
        </div>
        <button
          onClick={() => navigate("/aluno/checkin")}
          className="bg-green text-[#04140A] font-extrabold text-[11.5px] px-3.5 py-2 rounded-full flex-shrink-0"
        >
          Responder
        </button>
      </Card>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-7 mb-2.5">Feed</div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size={22} color="#31E17A" />
        </div>
      ) : !notificacoes?.length ? (
        <EmptyState icon={IconBell} title="Nada por aqui ainda" description="Avisos e conquistas do seu treinador aparecem nesta linha do tempo." />
      ) : (
        <div className="space-y-3 pb-4">
          {notificacoes.map((n) => (
            <Card key={n.id}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wide uppercase text-green">
                  {n.tipo === "conquista" ? "Conquista" : n.tipo === "checkin" ? "Check-in" : "Aviso"}
                </span>
                <span className="text-[10px] text-muted">{timeAgo(n.enviadoEm)}</span>
              </div>
              <div className="font-display font-bold text-[15px] mt-1.5">{n.titulo}</div>
              <div className="text-[12.5px] text-muted mt-1 leading-relaxed">{n.corpo}</div>
              <button
                onClick={() => handleCurtir(n.id)}
                className={`flex items-center gap-1.5 mt-3 text-[12px] font-semibold ${n.curtiPorMim ? "text-green" : "text-muted"}`}
              >
                <IconFlame size={16} color={n.curtiPorMim ? "#31E17A" : "currentColor"} />
                {n.curtidas || 0}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
