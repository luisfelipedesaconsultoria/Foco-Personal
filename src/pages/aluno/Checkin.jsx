import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnviarCheckin } from "../../hooks/useData";
import { PrimaryButton, OutlineButton } from "../../components/ui";
import { IconClose, IconCheck } from "../../icons";

const STEPS = [
  { field: "adesao", title: "Como está sua adesão à rotina esse mês?" },
  { field: "energia", title: "Como está sua energia e disposição?" },
  { field: "satisfacao", title: "Sua satisfação com o acompanhamento?" },
];

export default function Checkin() {
  const navigate = useNavigate();
  const enviarCheckin = useEnviarCheckin();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ adesao: null, energia: null, satisfacao: null, texto: "" });
  const [sending, setSending] = useState(false);

  const pick = (field, val) => {
    setAnswers((a) => ({ ...a, [field]: val }));
    setTimeout(() => setStep((s) => s + 1), 260);
  };

  const submit = async () => {
    setSending(true);
    try {
      await enviarCheckin(answers);
      setStep(4);
    } finally {
      setSending(false);
    }
  };

  const progress = step === 4 ? 100 : ((step + 1) / 4) * 100;

  return (
    <div className="px-[18px] pt-6 page-enter">
      <div className="h-[3px] bg-line rounded-full overflow-hidden mb-5">
        <div className="h-full bg-green transition-all" style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(49,225,122,0.6)" }} />
      </div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[12px] font-bold text-muted mb-5">
        <IconClose size={16} /> Fechar
      </button>

      {step < 3 && (
        <div className="page-enter">
          <div className="text-[11px] font-extrabold text-green tracking-wide">{step + 1} de 4</div>
          <div className="font-display text-[21px] font-bold mt-2.5 leading-snug">{STEPS[step].title}</div>
          <div className="flex gap-2.5 mt-7">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => pick(STEPS[step].field, n)}
                className={`flex-1 aspect-square rounded-2xl font-num text-[22px] border-[1.5px] transition-all ${
                  answers[STEPS[step].field] === n ? "bg-greenDim border-green text-green scale-105 shadow-glow" : "bg-surface border-line text-ink"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="page-enter">
          <div className="text-[11px] font-extrabold text-green tracking-wide">4 de 4</div>
          <div className="font-display text-[21px] font-bold mt-2.5 leading-snug">Quer contar algo pro seu treinador?</div>
          <textarea
            className="w-full bg-surface border border-line rounded-xl px-3.5 py-3 text-ink text-[13px] outline-none focus:border-green mt-5 resize-none"
            rows={5}
            value={answers.texto}
            onChange={(e) => setAnswers((a) => ({ ...a, texto: e.target.value }))}
            placeholder="Como foi seu mês, o que sentiu, dificuldades..."
          />
          <PrimaryButton onClick={submit} disabled={sending}>
            Enviar check-in
          </PrimaryButton>
        </div>
      )}

      {step === 4 && (
        <div className="page-enter flex flex-col items-center text-center pt-16">
          <div className="w-16 h-16 rounded-full bg-greenDim text-green border-2 border-green flex items-center justify-center shadow-glow mb-6">
            <IconCheck size={26} />
          </div>
          <div className="font-display text-[20px] font-bold">Check-in enviado</div>
          <div className="text-[12.5px] text-muted mt-2 leading-relaxed max-w-[260px]">
            Isso já está refletido na sua Avaliação e vai entrar no próximo relatório.
          </div>
          <OutlineButton onClick={() => navigate("/aluno")} className="mt-7 max-w-[200px]">
            Voltar ao início
          </OutlineButton>
        </div>
      )}
    </div>
  );
}
