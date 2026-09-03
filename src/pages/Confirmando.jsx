import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner, Logo } from "../components/ui";

export default function Confirmando() {
  const { completeSignIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const ok = await completeSignIn();
        if (!ok) navigate("/", { replace: true });
      } catch (err) {
        setError("Link inválido ou expirado: " + err.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-7 flex-col gap-4">
      <Logo size={30} />
      {error ? (
        <>
          <div className="text-sm text-coral text-center">{error}</div>
          <button className="text-xs text-muted underline" onClick={() => navigate("/", { replace: true })}>
            Voltar ao login
          </button>
        </>
      ) : (
        <>
          <Spinner size={24} color="#31E17A" />
          <div className="text-[12.5px] text-muted">Confirmando acesso…</div>
        </>
      )}
    </div>
  );
}
