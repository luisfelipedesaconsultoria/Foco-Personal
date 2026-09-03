import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PrimaryButton, OutlineButton, Logo } from "../components/ui";
import { FIREBASE_CONFIGURED } from "../lib/firebase";

export default function Login() {
  const { sendMagicLink, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      setFeedback("Digite um e-mail válido.");
      return;
    }
    if (!FIREBASE_CONFIGURED) {
      setFeedback("Firebase ainda não configurado — use o modo demonstração por enquanto.");
      return;
    }
    setSending(true);
    setFeedback("");
    try {
      await sendMagicLink(email.trim());
      setFeedback("Link enviado — confira seu e-mail.");
    } catch (err) {
      setFeedback("Erro ao enviar: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const goDemo = (role) => {
    enterDemo(role);
    navigate(role === "treinador" ? "/treinador" : "/aluno", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center px-7 page-enter">
      <div className="w-full">
        <Logo size={30} />
        <div className="font-display text-[30px] font-bold mt-5">Entrar</div>
        <div className="text-[12.5px] text-muted mt-2 leading-relaxed">
          Sem senha. Você recebe um link de acesso no seu e-mail.
        </div>

        <div className="text-[10.5px] font-extrabold tracking-wider uppercase text-muted mt-8 mb-1.5">E-mail</div>
        <input
          className="w-full bg-surface border border-line rounded-xl px-3.5 py-3 text-ink text-[13px] outline-none focus:border-green"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
        />
        <PrimaryButton onClick={handleSend} disabled={sending}>
          Enviar link de acesso
        </PrimaryButton>
        {feedback && <div className="text-[11.5px] text-muted mt-3">{feedback}</div>}

        <div className="flex items-center gap-2.5 my-5 text-muted text-[11px]">
          <span className="flex-1 h-px bg-line" />
          ou
          <span className="flex-1 h-px bg-line" />
        </div>
        <OutlineButton onClick={() => goDemo("aluno")}>Continuar como aluno (demo)</OutlineButton>
        <OutlineButton onClick={() => goDemo("treinador")}>Continuar como treinador (demo)</OutlineButton>
      </div>
    </div>
  );
}
