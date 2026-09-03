import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAlunos, usePagamentos, useNotificacoes } from "../../hooks/useData";
import { Card, ProgressRing, PrimaryButton, OutlineButton, SectionLabel, EmptyState } from "../../components/ui";
import { IconMegaphone, IconBell } from "../../icons";

export default function Inicio() {
  const { treinador } = useOutletContext();
  const navigate = useNavigate();
  const { data: alunos } = useAlunos();
  const { data: pendencias } = usePagamentos();
  const { data: notificacoes } = useNotificacoes();

  const total = alunos?.length || 0;
  const ativos = (alunos || []).filter((a) => a.status === "ativo").length;
  const pct = total ? Math.round((ativos / total) * 100) : 0;
  const enviados = (notificacoes || []).filter((n) => !n.tipo?.includes("recebido"));

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold">Painel do treinador</div>
      <div className="text-[11.5px] text-muted mt-0.5">{total} alunos ativos</div>

      <Card featured className="mt-5 flex items-center gap-4">
        <ProgressRing pct={pct} size={100}>
          <span className="font-num text-[24px] text-green leading-none">{pct}%</span>
          <span className="text-[9px] text-muted font-semibold">EM DIA</span>
        </ProgressRing>
        <div>
          <div className="font-bold text-[14px]">Engajamento da base</div>
          <div className="text-[11.5px] text-muted mt-1 leading-relaxed">
            {ativos} de {total} alunos ativos na plataforma.
          </div>
        </div>
      </Card>

      <PrimaryButton onClick={() => navigate("/treinador/notificacao")}>
        <IconMegaphone size={16} color="#04140A" /> Nova notificação
      </PrimaryButton>
      <OutlineButton onClick={() => navigate("/treinador/publicar-relatorio")}>Publicar relatório de período</OutlineButton>

      <div className="grid grid-cols-2 gap-2.5 mt-6">
        <Card className="!p-3.5">
          <div className="font-num text-[26px] text-green">{total}</div>
          <div className="text-[10.5px] text-muted">Alunos ativos</div>
        </Card>
        <Card className="!p-3.5">
          <div className="font-num text-[26px]">{pendencias?.length || 0}</div>
          <div className="text-[10.5px] text-muted">Pagamentos pendentes</div>
        </Card>
      </div>

      <SectionLabel>Últimos envios</SectionLabel>
      {!enviados?.length ? (
        <EmptyState icon={IconBell} title="Nenhum envio ainda" description="Suas notificações e relatórios publicados aparecem aqui." />
      ) : (
        <div className="space-y-2">
          {enviados.slice(0, 6).map((n) => (
            <Card key={n.id} className="!p-3.5">
              <div className="font-bold text-[12.5px]">{n.titulo}</div>
              <div className="text-[11px] text-muted mt-0.5">
                {n.corpo} · {n.audience || "aluno específico"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
