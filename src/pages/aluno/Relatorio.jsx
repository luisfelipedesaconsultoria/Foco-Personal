import React from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { usePeriodos } from "../../hooks/useData";
import { Card, SectionLabel, Spinner } from "../../components/ui";
import { IconChevronLeft } from "../../icons";

export default function Relatorio() {
  const { aluno } = useOutletContext();
  const { periodoId } = useParams();
  const navigate = useNavigate();
  const { data: periodos, loading } = usePeriodos(aluno.id);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={22} color="#31E17A" />
      </div>
    );
  }

  const idx = (periodos || []).findIndex((p) => p.id === periodoId);
  const p = periodos?.[idx];
  const prev = periodos?.[idx - 1];
  if (!p) {
    return (
      <div className="px-[18px] pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[12px] font-bold text-muted mb-4">
          <IconChevronLeft size={16} /> Voltar
        </button>
        <div className="text-sm text-muted">Relatório não encontrado.</div>
      </div>
    );
  }

  const deltaPeso = prev ? (p.peso - prev.peso).toFixed(1) : null;
  const maxPeso = Math.max(...periodos.map((pp) => pp.peso || 0), 1);

  return (
    <div className="px-[18px] pt-6 pb-6 page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[12px] font-bold text-muted mb-4">
        <IconChevronLeft size={16} /> Voltar
      </button>
      <div className="font-display text-[20px] font-bold mb-4">Relatório — {p.label}</div>

      <div className="flex gap-2 flex-wrap mb-4">
        {periodos.map((pp) => (
          <button
            key={pp.id}
            onClick={() => navigate(`/aluno/avaliacao/relatorio/${pp.id}`)}
            className={`text-[11.5px] font-bold px-3.5 py-2 rounded-full border ${
              pp.id === p.id ? "bg-greenDim border-green text-green" : "bg-surface border-line text-muted"
            }`}
          >
            {pp.label?.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Card className="!p-3.5">
          <div className="font-num text-[22px]">{deltaPeso !== null ? `${deltaPeso > 0 ? "+" : ""}${deltaPeso}kg` : `${p.peso}kg`}</div>
          <div className="text-[10px] text-muted">{deltaPeso !== null ? "Variação no período" : "Peso registrado"}</div>
        </Card>
        <Card className="!p-3.5">
          <div className="font-num text-[22px]">{p.engajamento ?? "—"}%</div>
          <div className="text-[10px] text-muted">Engajamento com avisos</div>
        </Card>
        <Card className="!p-3.5">
          <div className="font-num text-[22px] capitalize">{p.pagamentoStatus || "—"}</div>
          <div className="text-[10px] text-muted">Status pagamento</div>
        </Card>
        <Card className="!p-3.5">
          <div className="font-num text-[22px]">{p.gordura ?? "—"}%</div>
          <div className="text-[10px] text-muted">Percentual de gordura</div>
        </Card>
      </div>

      <SectionLabel>Evolução no período</SectionLabel>
      <Card className="!p-4">
        <div className="flex items-end gap-2.5 h-36">
          {periodos.map((pp) => (
            <div key={pp.id} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[10px] text-muted">{pp.peso}kg</div>
              <div
                className="w-full rounded-t-md"
                style={{ height: `${((pp.peso || 0) / maxPeso) * 100}px`, background: pp.id === p.id ? "#31E17A" : "#232739" }}
              />
              <div className="text-[10px] text-muted">{pp.label?.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </Card>

      <SectionLabel>Feedback enviado</SectionLabel>
      <Card className="!p-3.5 space-y-2.5">
        {Object.entries({ adesao: "Adesão à rotina", energia: "Energia/disposição", satisfacao: "Satisfação" }).map(([k, label]) => {
          const v = p.ratings?.[k] || 0;
          return (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[12.5px]">{label}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ background: i < v ? "#31E17A" : "#232739" }} />
                ))}
              </div>
            </div>
          );
        })}
      </Card>
      {p.quote && (
        <Card className="!p-3.5 !border-l-4 !border-l-green mt-2.5 rounded-l-none">
          <div className="text-[12.5px] italic text-ink/85 leading-relaxed">"{p.quote}"</div>
          <div className="text-[10.5px] text-muted mt-2">Enviado durante {p.label}</div>
        </Card>
      )}

      <SectionLabel>Observações do treinador</SectionLabel>
      <Card className="!p-3.5 text-[12.5px] text-ink/85 leading-relaxed">
        {p.notasTreinador || "Sem observações registradas neste período."}
      </Card>
    </div>
  );
}
