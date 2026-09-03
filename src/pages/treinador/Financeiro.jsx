import React from "react";
import { usePagamentos } from "../../hooks/useData";
import { Card, Spinner, EmptyState } from "../../components/ui";
import { IconWallet } from "../../icons";

export default function Financeiro() {
  const { data: pendencias, loading } = usePagamentos();

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Financeiro</div>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mb-2.5">Pendências</div>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size={22} color="#31E17A" />
        </div>
      ) : !pendencias?.length ? (
        <EmptyState icon={IconWallet} title="Nenhuma pendência" description="Todos os alunos estão com a mensalidade em dia." />
      ) : (
        <div className="space-y-2">
          {pendencias.map((p) => (
            <Card key={p.id} className="!p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[12.5px]">{p.alunoNome}</div>
                <div className="text-[10.5px] text-muted mt-0.5">{p.referencia}</div>
              </div>
              <span className="text-[12px] font-extrabold text-coral">Pendente</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
