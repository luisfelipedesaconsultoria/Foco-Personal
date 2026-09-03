import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp, FIREBASE_CONFIGURED, VAPID_KEY, auth } from "../../lib/firebase";
import { apiPost } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Card, PrimaryButton, Avatar } from "../../components/ui";
import { IconBell, IconCheck } from "../../icons";

export default function Perfil() {
  const { aluno } = useOutletContext();
  const { isDemo } = useAuth();
  const [status, setStatus] = useState("Ainda não ativadas");
  const [busy, setBusy] = useState(false);

  const ativarPush = async () => {
    if (isDemo) {
      setStatus("Modo demonstração — ative de verdade fazendo login com seu e-mail.");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("Este navegador não suporta push.");
      return;
    }
    if (!FIREBASE_CONFIGURED) {
      setStatus("Config Firebase pendente.");
      return;
    }
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("Permissão negada");
        return;
      }
      const messaging = getMessaging(firebaseApp);
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
      const idToken = await auth.currentUser.getIdToken();
      await apiPost("/api/save-push-token", { idToken, token });
      setStatus("Ativadas");
    } catch (err) {
      setStatus("Erro ao ativar: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Perfil</div>

      <Card className="flex items-center gap-3">
        <Avatar initials={aluno.nome?.slice(0, 2).toUpperCase()} size={44} />
        <div>
          <div className="font-bold text-[14px]">{aluno.nome}</div>
          <div className="text-[11.5px] text-muted capitalize">{aluno.tipo}</div>
        </div>
      </Card>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-6 mb-2.5">Notificações</div>
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[11px] bg-greenDim text-green flex items-center justify-center">
            {status === "Ativadas" ? <IconCheck size={16} /> : <IconBell size={16} />}
          </div>
          <div>
            <div className="font-bold text-[12.5px]">Notificações push</div>
            <div className="text-[11px] text-muted">{status}</div>
          </div>
        </div>
        {status !== "Ativadas" && (
          <button onClick={ativarPush} disabled={busy} className="bg-green text-[#04140A] font-extrabold text-[11px] px-3.5 py-2 rounded-full">
            Ativar
          </button>
        )}
      </Card>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-6 mb-2.5">Privacidade</div>
      <Card className="text-[11.5px] text-muted leading-relaxed">
        Seus dados de saúde e imagens de progresso são usados só pelo seu treinador, pra acompanhar seu programa. Você pode pedir acesso, correção ou exclusão a qualquer momento.
      </Card>
    </div>
  );
}
