import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlunos } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { apiPost } from "../../lib/api";
import { Card, PrimaryButton, OutlineButton } from "../../components/ui";
import { IconChevronLeft } from "../../icons";

const TEMPLATES = {
  motiv: { title: "Segunda de partida", body: "Sua semana começa agora. Mantenha a rotina." },
  pag: { title: "Lembrete de pagamento", body: "Sua mensalidade vence em breve." },
  valid: { title: "Validação semanal", body: "Como foi sua semana? Toque para responder." },
};

const AUDIENCES = ["Todos os alunos", "Somente presencial", "Somente consultoria online", "especifico"];

export default function Notificacao() {
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const { data: alunos } = useAlunos();
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [alunoEspecifico, setAlunoEspecifico] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);

  const applyTemplate = (key) => {
    const t = TEMPLATES[key];
    if (t) {
      setTitle(t.title);
      setBody(t.body);
    }
  };

  const audienceLabel = () => (audience === "especifico" ? alunoEspecifico?.nome || "nenhum aluno selecionado" : audience);

  const requestSend = () => {
    if (!title.trim() || !body.trim()) {
      setFeedback("Preencha título e mensagem.");
      return;
    }
    if (audience === "especifico" && !alunoEspecifico) {
      setFeedback("Escolha um aluno.");
      return;
    }
    setConfirming(true);
  };

  const dispatch = async () => {
    setConfirming(false);
    setSending(true);
    try {
      if (isDemo) {
        setFeedback("Enviado (modo demonstração).");
      } else {
        await apiPost("/api/send-notification", { title, body, audience: audienceLabel() });
        setFeedback("Notificação enviada.");
      }
    } catch (err) {
      setFeedback("Erro: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-[18px] pt-6 pb-6 page-enter relative">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[12px] font-bold text-muted mb-4">
        <IconChevronLeft size={16} /> Voltar
      </button>
      <div className="font-display text-[21px] font-bold mb-5">Nova notificação</div>

      <Field label="Destinatários">
        <select className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="Todos os alunos">Todos os alunos</option>
          <option value="Somente presencial">Somente presencial</option>
          <option value="Somente consultoria online">Somente consultoria online</option>
          <option value="especifico">Aluno específico</option>
        </select>
      </Field>
      {audience === "especifico" && (
        <div className="bg-surface border border-line rounded-xl p-1.5 mb-3.5">
          {(alunos || []).map((a) => (
            <button
              key={a.id}
              onClick={() => setAlunoEspecifico(a)}
              className={`w-full text-left px-2.5 py-2.5 rounded-lg text-[12.5px] flex justify-between ${
                alunoEspecifico?.id === a.id ? "bg-greenDim text-green font-bold" : ""
              }`}
            >
              {a.nome}
              {alunoEspecifico?.id === a.id && <span>✓</span>}
            </button>
          ))}
        </div>
      )}

      <Field label="Modelo">
        <select className={inputCls} onChange={(e) => applyTemplate(e.target.value)} defaultValue="custom">
          <option value="custom">Personalizada</option>
          <option value="motiv">Motivacional de segunda</option>
          <option value="pag">Lembrete de pagamento</option>
          <option value="valid">Validação semanal</option>
        </select>
      </Field>
      <Field label="Título">
        <input className={inputCls} placeholder="Ex: Sua semana começa agora" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Mensagem">
        <textarea className={inputCls} rows={3} placeholder="Texto que aparece no card e no push" value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>

      <Field label="Pré-visualização — como o aluno vê">
        <Card featured className="!p-4">
          <div className="text-[10px] font-extrabold tracking-wide text-green">PRÓXIMO AVISO</div>
          <div className="font-display font-bold text-[17px] mt-1.5">{title || "Título aparece aqui"}</div>
          <div className="text-[12px] text-muted mt-1">{body || "A mensagem aparece aqui conforme você digita."}</div>
        </Card>
      </Field>

      <PrimaryButton onClick={requestSend} disabled={sending}>Enviar agora</PrimaryButton>
      <OutlineButton onClick={() => navigate("/treinador")}>Cancelar</OutlineButton>
      {feedback && <div className="text-[11.5px] text-muted mt-3">{feedback}</div>}

      {confirming && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center">
          <div className="w-full max-w-[420px] bg-surface border border-line border-b-0 rounded-t-[22px] p-6 text-center sheet-enter">
            <div className="font-display font-bold text-[17px]">Confirmar envio</div>
            <div className="text-[12.5px] text-muted mt-2">Isso vai enviar agora para {audienceLabel()}. Confirma?</div>
            <PrimaryButton onClick={dispatch}>Confirmar e enviar</PrimaryButton>
            <OutlineButton onClick={() => setConfirming(false)}>Cancelar</OutlineButton>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full bg-surface border border-line rounded-xl px-3.5 py-3 text-ink text-[13px] outline-none focus:border-green resize-none";

function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <div className="text-[10.5px] font-extrabold tracking-wide uppercase text-muted mb-1.5">{label}</div>
      {children}
    </div>
  );
}
