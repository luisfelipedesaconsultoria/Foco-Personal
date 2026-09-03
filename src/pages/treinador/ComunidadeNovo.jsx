import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { PrimaryButton, OutlineButton, Card } from "../../components/ui";
import { IconChevronLeft, IconCopy } from "../../icons";

export default function ComunidadeNovo() {
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", tipo: "Consultoria online" });
  const [link, setLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async () => {
    if (!form.nome.trim() || !form.email.trim()) {
      setFeedback("Preencha nome e e-mail.");
      return;
    }
    setSending(true);
    setFeedback("");
    try {
      if (isDemo) {
        setLink(`https://foco-personal.vercel.app/?convite=${btoa(form.email)}`);
        setFeedback("Link de demonstração gerado.");
      } else {
        const res = await apiPost("/api/invite-student", form);
        setLink(res.link);
        setFeedback("Aluno cadastrado. Envie o link acima pra ele.");
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
      <div className="font-display text-[21px] font-bold mb-5">Cadastrar aluno</div>

      <Field label="Nome completo"><input className={inputCls} placeholder="Nome do aluno" value={form.nome} onChange={set("nome")} /></Field>
      <Field label="E-mail"><input type="email" className={inputCls} placeholder="email@exemplo.com" value={form.email} onChange={set("email")} /></Field>
      <Field label="Telefone"><input className={inputCls} placeholder="(00) 00000-0000" value={form.telefone} onChange={set("telefone")} /></Field>
      <Field label="Tipo de atendimento">
        <select className={inputCls} value={form.tipo} onChange={set("tipo")}>
          <option>Consultoria online</option>
          <option>Presencial</option>
        </select>
      </Field>

      <PrimaryButton onClick={submit} disabled={sending}>Gerar link de acesso</PrimaryButton>

      {link && (
        <Card className="mt-4">
          <div className="text-[10.5px] font-extrabold tracking-wide uppercase text-muted mb-2">Link gerado — envie você mesmo pro aluno</div>
          <div className="bg-surface2 border border-green rounded-xl p-3 font-mono text-[10.5px] text-greenSoft break-all">{link}</div>
          <OutlineButton onClick={() => { navigator.clipboard?.writeText(link); setFeedback("Link copiado."); }}>
            <IconCopy size={14} /> Copiar link
          </OutlineButton>
        </Card>
      )}
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
