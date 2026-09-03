import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { usePeriodos } from "../../hooks/useData";
import { Card, ProgressRing, SectionLabel, Spinner, EmptyState } from "../../components/ui";
import { IconTrend, IconReport } from "../../icons";

const METRICS = [
  { key: "peso", label: "Peso", unit: "kg", lowerBetter: true },
  { key: "cintura", label: "Cintura", unit: "cm", lowerBetter: true },
  { key: "gordura", label: "% Gordura", unit: "%", lowerBetter: true },
  { key: "engajamento", label: "Engajamento", unit: "%", lowerBetter: false },
];

export default function Avaliacao() {
  const { aluno } = useOutletContext();
  const navigate = useNavigate();
  const { data: periodos, loading } = usePeriodos(aluno.id);
  const [idx, setIdx] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={22} color="#31E17A" />
      </div>
    );
  }

  if (!periodos?.length) {
    return (
      <div className="px-[18px] pt-6 page-enter">
        <div className="font-display text-[21px] font-bold mb-4">Avaliação física</div>
        <EmptyState icon={IconTrend} title="Sem avaliações ainda" description="Seu treinador registra sua primeira avaliação em breve." />
      </div>
    );
  }

  const cur = periodos[idx ?? periodos.length - 1];
  const curIdx = idx ?? periodos.length - 1;
  const prev = periodos[curIdx - 1];
  const first = periodos[0];
  const pesoDelta = first && cur ? (cur.peso - first.peso).toFixed(1) : null;

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Avaliação física</div>

      <Card className="flex items-center gap-4">
        <ProgressRing pct={cur.engajamento || 0} size={100}>
          <span className="font-num text-[26px] text-green leading-none">{Math.round(cur.engajamento || 0)}</span>
          <span className="text-[9px] text-muted font-semibold">ÍNDICE</span>
        </ProgressRing>
        <div>
          <div className="font-bold text-[14px]">Evolução geral</div>
          <div className="text-[11.5px] text-muted mt-1 leading-relaxed">
            {pesoDelta ? `${pesoDelta > 0 ? "+" : ""}${pesoDelta}kg desde o início. ` : ""}
            Última medição em {cur.label}.
          </div>
        </div>
      </Card>

      <SectionLabel>Comparar período</SectionLabel>
      <div className="flex gap-2 flex-wrap">
        {periodos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIdx(i)}
            className={`text-[11.5px] font-bold px-3.5 py-2 rounded-full border ${
              i === curIdx ? "bg-greenDim border-green text-green" : "bg-surface border-line text-muted"
            }`}
          >
            {p.label?.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {METRICS.map((m) => {
          const val = cur[m.key];
          let deltaEl = <div className="text-[11px] font-bold mt-1 text-muted">Primeiro registro</div>;
          if (prev) {
            const diff = (val || 0) - (prev[m.key] || 0);
            const better = m.lowerBetter ? diff < 0 : diff > 0;
            const cls = Math.abs(diff) < 0.05 ? "text-muted" : better ? "text-green" : "text-coral";
            const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "=";
            deltaEl = (
              <div className={`text-[11px] font-bold mt-1 ${cls}`}>
                {arrow} {Math.abs(diff).toFixed(1)}
                {m.unit}
              </div>
            );
          }
          return (
            <Card key={m.key} className="!p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wide text-muted">{m.label}</div>
              <div className="font-num text-[22px] mt-1">
                {val ?? "—"}
                {m.unit}
              </div>
              {deltaEl}
            </Card>
          );
        })}
      </div>

      <SectionLabel>Histórico de medições</SectionLabel>
      <div className="space-y-2">
        {periodos
          .slice()
          .reverse()
          .map((p) => (
            <Card key={p.id} className="flex justify-between items-center !p-3.5">
              <div>
                <div className="font-bold text-[12.5px]">{p.label}</div>
                <div className="text-[10.5px] text-muted mt-0.5">
                  {p.peso}kg · {p.cintura}cm · {p.gordura}% gordura
                </div>
              </div>
            </Card>
          ))}
      </div>

      <SectionLabel>Relatórios</SectionLabel>
      <div className="space-y-2 mb-2">
        {periodos
          .slice()
          .reverse()
          .map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/aluno/avaliacao/relatorio/${p.id}`)}
              className="w-full text-left flex items-center gap-3 bg-surface border border-line rounded-2xl px-3.5 py-3"
            >
              <div className="w-9 h-9 rounded-[11px] bg-greenDim text-green flex items-center justify-center flex-shrink-0">
                <IconReport size={16} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[12.5px]">Relatório — {p.label}</div>
                <div className="text-[11px] text-muted">Toque para abrir</div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
