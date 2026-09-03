import React, { useCallback, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HeartRateWidget from "../../components/HeartRateWidget";
import { Card, SectionLabel, Spinner } from "../../components/ui";
import { useHRSessions } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { apiPost } from "../../lib/api";
import { joinHRRoom, leaveHRRoom, broadcastHR } from "../../lib/liveHRSession";
import { formatDuration } from "../../lib/format";
import { IconPeople } from "../../icons";

export default function Cardio() {
  const { aluno } = useOutletContext();
  const { isDemo } = useAuth();
  const { data: sessoes, loading, refetch } = useHRSessions(aluno.id);
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const channelRef = useRef(null);

  const handleTick = useCallback(
    (data) => {
      if (channelRef.current) broadcastHR(channelRef.current, aluno.id, data);
    },
    [aluno.id]
  );

  const handleSessionEnd = useCallback(
    async (summary) => {
      if (!isDemo) {
        await apiPost("/api/hr-sessions", {
          modo: room ? "turma" : "individual",
          roomCode: room?.code,
          deviceName: summary.deviceName,
          avgBpm: summary.avgBpm,
          maxBpm: summary.maxBpm,
          minBpm: summary.minBpm,
          calorias: summary.calories,
          duracaoSeg: summary.durationSec,
        }).catch(() => {});
      }
      refetch();
    },
    [isDemo, room, refetch]
  );

  const handleJoinRoom = () => {
    if (!roomCode.trim() || !aluno.treinadorId) return;
    try {
      const channel = joinHRRoom({
        treinadorId: aluno.treinadorId,
        code: roomCode.trim().toUpperCase(),
        participant: { id: aluno.id, name: aluno.nome, initials: aluno.nome?.slice(0, 2).toUpperCase() },
      });
      channelRef.current = channel;
      setRoom({ code: roomCode.trim().toUpperCase() });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveRoom = () => {
    leaveHRRoom(channelRef.current);
    channelRef.current = null;
    setRoom(null);
  };

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Frequência cardíaca</div>

      <HeartRateWidget weightKg={aluno.pesoKg} age={aluno.idade} gender={aluno.genero} onTick={handleTick} onSessionEnd={handleSessionEnd} />

      <SectionLabel>Modo turma / aula em grupo</SectionLabel>
      <Card className="!p-3.5">
        {room ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <IconPeople size={16} color="#31E17A" />
              Sala {room.code}
            </div>
            <button onClick={handleLeaveRoom} className="text-[11px] font-bold text-coral">
              Sair
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="flex-1 bg-surface2 border border-line rounded-xl px-3 py-2.5 text-ink text-[13px] outline-none focus:border-green uppercase"
              placeholder="Código da sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              maxLength={4}
            />
            <button onClick={handleJoinRoom} className="bg-green text-[#04140A] font-extrabold text-[12px] px-4 rounded-xl">
              Entrar
            </button>
          </div>
        )}
      </Card>

      <SectionLabel>Últimas sessões</SectionLabel>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={20} color="#31E17A" />
        </div>
      ) : !sessoes?.length ? (
        <Card className="!p-3.5 text-[12px] text-muted text-center">Nenhuma sessão registrada ainda.</Card>
      ) : (
        <div className="space-y-2">
          {sessoes.map((s) => (
            <Card key={s.id} className="!p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-[12.5px]">{new Date(s.createdAt).toLocaleDateString("pt-BR")}</div>
                <div className="text-[10.5px] text-muted mt-0.5 capitalize">{s.modo === "turma" ? "Aula em grupo" : "Individual"}</div>
              </div>
              <div className="text-right text-[11px] text-muted">
                <div className="font-num text-[15px] text-ink">{s.avgBpm ?? "—"} bpm</div>
                {s.calorias ?? 0} kcal · {formatDuration(s.duracaoSeg)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
