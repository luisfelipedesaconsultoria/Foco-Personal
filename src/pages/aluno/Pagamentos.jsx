import React from "react";
import { usePagamentos } from "../../hooks/useData";
import { Card, Spinner, EmptyState } from "../../components/ui";
import { IconCard } from "../../icons";

export default function Pagamentos() {
  const { data: pagamentos, loading } = usePagamentos();
  const pendente = (pagamentos || []).find((p) => p.status === "pendente");

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Pagamentos</div>

      <div
        className="rounded-2xl p-[18px] relative overflow-hidden border"
        style={
          pendente
            ? { background: "linear-gradient(135deg,#1a0f0a,#0a0c0a)", borderColor: "#FF7A45", boxShadow: "0 0 28px rgba(255,122,69,0.22)" }
            : { background: "linear-gradient(135deg,#0F160F,#0A0C0A)", borderColor: "#31E17A", boxShadow: "0 0 28px rgba(49,225,122,0.28)" }
        }
      >
        <div className="text-[10px] font-extrabold tracking-wide" style={{ color: pendente ? "#FF7A45" : "#31E17A" }}>
          STATUS
        </div>
        <div className="font-display text-[20px] font-bold mt-1">{pendente ? "Pendente" : "Em dia"}</div>
        <div className="text-[11.5px] text-muted mt-1.5">
          {pendente ? `${pendente.referencia} — regularize pra manter acesso completo.` : "Sua mensalidade está em dia."}
        </div>
      </div>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-6 mb-2.5">Histórico</div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={20} color="#31E17A" />
        </div>
      ) : !pagamentos?.length ? (
        <EmptyState icon={IconCard} title="Sem histórico ainda" description="Seus pagamentos aparecem aqui assim que forem registrados." />
      ) : (
        <div className="space-y-2">
          {pagamentos.map((p) => (
            <Card key={p.id} className="!p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[12.5px]">{p.referencia}</div>
                <div className="text-[10.5px] text-muted mt-0.5">{new Date(p.data).toLocaleDateString("pt-BR")}</div>
              </div>
              <span className={`text-[12px] font-extrabold ${p.status === "pago" ? "text-green" : "text-coral"}`}>
                {p.status === "pago" ? "Pago" : "Pendente"}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
