import { supabase } from "./supabase";

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function roomChannelName(treinadorId, code) {
  return `hr-room-${treinadorId}-${code}`;
}

export function joinHRRoom({ treinadorId, code, participant, onSync, onHRUpdate, onSubscribed }) {
  if (!supabase) throw new Error("Sala remota indisponível — Supabase Realtime não configurado.");
  const channel = supabase.channel(roomChannelName(treinadorId, code), {
    config: { presence: { key: participant.id } },
  });

  channel.on("presence", { event: "sync" }, () => onSync?.(channel.presenceState()));
  channel.on("broadcast", { event: "hr" }, ({ payload }) => onHRUpdate?.(payload));

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.track({ ...participant, joinedAt: Date.now() });
      onSubscribed?.();
    }
  });

  return channel;
}

export function broadcastHR(channel, participantId, data) {
  if (!channel) return;
  channel.send({ type: "broadcast", event: "hr", payload: { participantId, ...data, at: Date.now() } });
}

export function leaveHRRoom(channel) {
  if (!channel) return;
  channel.untrack();
  supabase?.removeChannel(channel);
}
