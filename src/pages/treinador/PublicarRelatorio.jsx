import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlunos, usePeriodos } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { apiPost } from "../../lib/api";
import { Card, PrimaryButton } from "../../components/ui";
import { IconChevronLeft, IconMegaphone } from "../../icons";

export default function PublicarRelatorio() {
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const { data: alunos } = useAlunos();
  const [alunoId, setAlunoId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const aluno = (alunos || []).find((a) => a.id === alunoId);
  const { data: periodos } = usePeriodos(alunoId);
  const [periodoId, setPeriodoId] = useState("");
  const periodo = (periodos || []).find((p) => p.id === periodoId) || periodos?.[periodos.length - 1];

  const publicar = async () => {
    if (!aluno || !periodo) {
      setFeedback("Escolha o aluno e o período.");
      return;
    }
    setSending(true);
    try {
      const title = "Seu relatório está disponível";
      const body = `O relatório de ${periodo.label} já pode ser visto no app.`;
      if (isDemo) {
        setFeedback(`Publicado (demo) para ${aluno.nome}.`);
      } else {
        await apiPost("/api/send-notification", { title, body, audience: aluno.nome, type: "relatorio" });
        setFeedback(`Publicado e notificação enviada para ${aluno.nome}.`);
      }
    } catch (err) {
      setFeedback("Erro: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-[18px] pt-6 pb-6 page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[12px] font-bold text-muted mb-4">
        <IconChevronLeft size={16} /> Voltar
      </button>
      <div className="font-display text-[21px] font-bold mb-5">Publicar relatório</div>

      <Field label="Aluno">
        <select className={inputCls} value={alunoId} onChange={(e) => { setAlunoId(e.target.value); setPeriodoId(""); }}>
          <option value="">Selecione</option>
          {(alunos || []).map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
      </Field>

      <Field label="Período">
        <select className={inputCls} value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} disabled={!alunoId}>
          {(periodos || []).map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </Field>

      <Card featured className="mt-4 !p-4">
        <div className="text-[10px] font-extrabold tracking-wide text-green">PUSH AUTOMÁTICO</div>
        <div className="font-display font-bold text-[16px] mt-1.5">Seu relatório está disponível</div>
        <div className="text-[12px] text-muted mt-1">O relatório de {periodo?.label || "—"} já pode ser visto no app. Toque para abrir.</div>
      </Card>

      <PrimaryButton onClick={publicar} disabled={sending}>
        <IconMegaphone size={16} color="#04140A" /> Publicar e notificar
      </PrimaryButton>
      {feedback && <div className="text-[11.5px] text-muted mt-3">{feedback}</div>}
    </div>
  );
}

const inputCls = "w-full bg-surface border border-line rounded-xl px-3.5 py-3 text-ink text-[13px] outline-none focus:border-green";

function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <div className="text-[10.5px] font-extrabold tracking-wide uppercase text-muted mb-1.5">{label}</div>
      {children}
    </div>
  );
}
