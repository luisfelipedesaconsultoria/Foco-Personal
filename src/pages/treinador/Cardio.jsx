import React, { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useHRSlots } from "../../hooks/useHRSlots";
import { useAlunos } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { apiPost } from "../../lib/api";
import { generateRoomCode, joinHRRoom, leaveHRRoom } from "../../lib/liveHRSession";
import { getHRZone, estimateMaxHR } from "../../lib/calorieCalc";
import { formatDuration } from "../../lib/format";
import { Card, Avatar, PrimaryButton, OutlineButton, Spinner } from "../../components/ui";
import { IconBluetooth, IconPeople, IconCopy, IconClose } from "../../icons";

export default function Cardio() {
  const { treinador } = useOutletContext();
  const [mode, setMode] = useState("direct");

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Monitor ao vivo</div>
      <div className="flex gap-2 mb-5">
        <TabButton active={mode === "direct"} onClick={() => setMode("direct")}>Braceletes neste aparelho</TabButton>
        <TabButton active={mode === "remote"} onClick={() => setMode("remote")}>Sala remota</TabButton>
      </div>
      {mode === "direct" ? <DirectMode /> : <RemoteMode treinadorId={treinador?.id} />}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-[11.5px] font-bold px-3 py-2.5 rounded-xl border ${
        active ? "bg-greenDim border-green text-green" : "bg-surface border-line text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function DirectMode() {
  const { supported, slots, addSlot, removeSlot, connectSlot, disconnectSlot } = useHRSlots();
  const { data: alunos } = useAlunos();
  const { isDemo } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const handleDisconnect = async (slot) => {
    const summary = disconnectSlot(slot.id);
    if (summary && slot.profile?.alunoId && summary.durationSec > 0 && !isDemo) {
      await apiPost("/api/hr-sessions", {
        alunoId: slot.profile.alunoId,
        modo: "individual",
        deviceName: summary.deviceName,
        avgBpm: summary.avgBpm,
        maxBpm: summary.maxBpm,
        minBpm: summary.minBpm,
        calorias: summary.calories,
        duracaoSeg: summary.durationSec,
      }).catch(() => {});
    }
  };

  if (!supported) {
    return (
      <Card className="text-center !p-6">
        <div className="font-bold text-sm mb-2">Bluetooth indisponível</div>
        <div className="text-xs text-muted leading-relaxed">
          Use Chrome ou Edge (computador ou Android). No iPhone, abra pelo app <strong>Bluefy – Web BLE Browser</strong>.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2.5">
      {slots.map((slot) => (
        <SlotCard key={slot.id} slot={slot} onConnect={() => connectSlot(slot.id)} onDisconnect={() => handleDisconnect(slot)} onRemove={() => removeSlot(slot.id)} />
      ))}

      {showForm ? (
        <AddSlotForm
          alunos={alunos}
          existingIds={slots.map((s) => s.profile?.alunoId).filter(Boolean)}
          onAdd={(data) => {
            addSlot(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <OutlineButton onClick={() => setShowForm(true)}>+ Adicionar bracelete</OutlineButton>
      )}
    </div>
  );
}

function SlotCard({ slot, onConnect, onDisconnect, onRemove }) {
  const color = slot.zone?.color || "#31E17A";
  return (
    <Card className="!p-3.5" style={slot.status === "connected" ? { borderTopColor: color, borderTopWidth: 3 } : undefined}>
      <div className="flex items-center gap-3">
        <Avatar initials={slot.initials} color={color} />
        <div className="flex-1">
          <div className="font-bold text-[13px]">{slot.label}</div>
          {slot.status === "connected" ? (
            <div className="text-[11px] text-muted mt-0.5">
              {slot.bpm} bpm · {slot.calories} kcal · {formatDuration(slot.elapsedSec)}
            </div>
          ) : slot.status === "connecting" ? (
            <div className="text-[11px] text-muted mt-0.5">Conectando…</div>
          ) : (
            <div className="text-[11px] text-muted mt-0.5">{slot.error || "Desconectado"}</div>
          )}
        </div>
        {slot.status === "connected" ? (
          <button onClick={onDisconnect} className="text-[11px] font-bold text-coral">Desconectar</button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={onConnect} className="bg-green text-[#04140A] font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1">
              <IconBluetooth size={12} color="#04140A" /> Conectar
            </button>
            <button onClick={onRemove} className="text-muted">
              <IconClose size={14} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

function AddSlotForm({ alunos, existingIds, onAdd, onCancel }) {
  const [tab, setTab] = useState("aluno");
  const [alunoId, setAlunoId] = useState("");
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("masculino");

  const disponiveis = (alunos || []).filter((a) => !existingIds.includes(a.id));

  const confirm = () => {
    if (tab === "aluno") {
      const a = disponiveis.find((x) => x.id === alunoId);
      if (!a) return;
      onAdd({ label: a.nome, initials: a.nome.slice(0, 2).toUpperCase(), profile: { alunoId: a.id, age: a.idade, weightKg: a.pesoKg, gender: a.genero } });
    } else {
      if (!nome.trim()) return;
      onAdd({ label: nome, initials: nome.slice(0, 2).toUpperCase(), profile: { age: 30, weightKg: 70, gender: genero } });
    }
  };

  return (
    <Card className="!p-3.5">
      <div className="flex gap-2 mb-3">
        <TabButton active={tab === "aluno"} onClick={() => setTab("aluno")}>Aluno cadastrado</TabButton>
        <TabButton active={tab === "avulso"} onClick={() => setTab("avulso")}>Perfil só desta sessão</TabButton>
      </div>
      {tab === "aluno" ? (
        <select className={inputCls} value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
          <option value="">Selecione o aluno</option>
          {disponiveis.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
      ) : (
        <div className="space-y-2.5">
          <input className={inputCls} placeholder="Nome (só pra essa sessão)" value={nome} onChange={(e) => setNome(e.target.value)} />
          <select className={inputCls} value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <OutlineButton onClick={onCancel} className="mt-0">Cancelar</OutlineButton>
        <PrimaryButton onClick={confirm} className="mt-0">Adicionar</PrimaryButton>
      </div>
    </Card>
  );
}

function RemoteMode({ treinadorId }) {
  const { profile, isDemo } = useAuth();
  const [room, setRoom] = useState(null);
  const [presence, setPresence] = useState({});
  const [live, setLive] = useState({});
  const channelRef = useRef(null);

  const startRoom = () => {
    const code = generateRoomCode();
    const trainerId = "trainer-" + (profile?.treinador?.id || treinadorId || "demo");
    try {
      const channel = joinHRRoom({
        treinadorId: treinadorId || "demo-treinador",
        code,
        participant: { id: trainerId },
        onSync: (state) => {
          const map = {};
          Object.entries(state).forEach(([id, entries]) => {
            if (!id.startsWith("trainer-")) map[id] = entries[0];
          });
          setPresence(map);
        },
        onHRUpdate: (payload) => setLive((prev) => ({ ...prev, [payload.participantId]: payload })),
      });
      channelRef.current = channel;
      setRoom({ code });
    } catch (err) {
      alert(err.message);
    }
  };

  const endRoom = () => {
    leaveHRRoom(channelRef.current);
    channelRef.current = null;
    setRoom(null);
    setPresence({});
    setLive({});
  };

  if (isDemo) {
    return (
      <Card className="text-center !p-6">
        <div className="text-[12px] text-muted">Sala remota indisponível em modo demonstração — faça login de verdade.</div>
      </Card>
    );
  }

  if (!room) {
    return (
      <Card className="text-center !p-6 flex flex-col items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-greenDim text-green flex items-center justify-center">
          <IconPeople size={20} />
        </div>
        <div className="text-[12.5px] text-muted">Cada aluno conecta o próprio bracelete no aparelho dele.</div>
        <PrimaryButton onClick={startRoom} className="max-w-[220px]">Iniciar sala</PrimaryButton>
      </Card>
    );
  }

  const participantIds = Object.keys(presence);

  return (
    <div>
      <Card className="!p-3.5 flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold text-muted uppercase">Código da sala</div>
          <div className="font-num text-[26px] text-green flex items-center gap-2">
            {room.code}
            <button onClick={() => navigator.clipboard?.writeText(room.code)}>
              <IconCopy size={16} color="#31E17A" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-muted">{participantIds.length} conectado(s)</div>
          <button onClick={endRoom} className="text-[11px] font-bold text-coral mt-1">Encerrar sala</button>
        </div>
      </Card>

      {!participantIds.length ? (
        <Card className="text-center !p-5 text-[12px] text-muted">Aguardando alunos entrarem com o código…</Card>
      ) : (
        <div className="space-y-2.5">
          {participantIds.map((id) => (
            <RemoteParticipantCard key={id} participant={presence[id]} live={live[id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function RemoteParticipantCard({ participant, live }) {
  const stale = !live || Date.now() - live.at > 15000;
  const zone = !stale ? getHRZone(live?.bpm, estimateMaxHR(30)) : null;
  return (
    <Card className="!p-3.5 flex items-center gap-3">
      <Avatar initials={participant.initials || participant.name?.slice(0, 2).toUpperCase()} color={zone?.color} />
      <div className="flex-1">
        <div className="font-bold text-[13px]">{participant.name}</div>
        {stale ? (
          <div className="text-[11px] text-muted mt-0.5">aguardando dados...</div>
        ) : (
          <div className="text-[11px] text-muted mt-0.5">
            {live.bpm} bpm · {live.calories ?? 0} kcal · {formatDuration(live.elapsedSec)}
          </div>
        )}
      </div>
    </Card>
  );
}

const inputCls = "w-full bg-surface2 border border-line rounded-xl px-3.5 py-2.5 text-ink text-[13px] outline-none focus:border-green";
