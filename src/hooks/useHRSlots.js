import { useCallback, useEffect, useRef, useState } from "react";
import { HeartRateMonitor, isBluetoothSupported } from "../lib/bluetoothHeartRate";
import { estimateMaxHR, getHRZone, caloriesPerMinute, kJtoKcal } from "../lib/calorieCalc";

// Igual ao useHeartRateMonitor, mas gerencia várias conexões BLE simultâneas
// (o treinador conectando um bracelete por aluno numa aula presencial).
export function useHRSlots() {
  const supported = isBluetoothSupported();
  const [slots, setSlots] = useState([]);
  const monitorsRef = useRef({}); // id -> { monitor, samples, startedAt, lastSampleAt, caloriesAcc, baseEnergy, interval }

  const updateSlot = useCallback((id, patch) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addSlot = useCallback((slotData) => {
    const id = "slot_" + Date.now() + Math.random().toString(36).slice(2, 6);
    setSlots((prev) => [
      ...prev,
      { id, status: "idle", bpm: null, calories: 0, elapsedSec: 0, battery: null, deviceName: null, zone: null, avg: null, max: null, min: null, error: null, ...slotData },
    ]);
    return id;
  }, []);

  const removeSlot = useCallback((id) => {
    const m = monitorsRef.current[id];
    if (m) {
      m.monitor.disconnect();
      clearInterval(m.interval);
      delete monitorsRef.current[id];
    }
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const connectSlot = useCallback(
    async (id) => {
      updateSlot(id, { status: "connecting", error: null });
      try {
        const monitor = new HeartRateMonitor();
        const state = { monitor, samples: [], startedAt: Date.now(), lastSampleAt: Date.now(), caloriesAcc: 0, baseEnergy: null, interval: null };
        monitorsRef.current[id] = state;

        monitor.addEventListener("heartrate", (e) => {
          const { heartRate, energyExpended } = e.detail;
          const now = Date.now();
          state.samples.push(heartRate);

          if (energyExpended != null) {
            if (state.baseEnergy == null) state.baseEnergy = energyExpended;
            state.caloriesAcc = kJtoKcal(energyExpended - state.baseEnergy);
          } else {
            const minutesSinceLast = (now - state.lastSampleAt) / 60000;
            const slot = slots.find((s) => s.id === id);
            state.caloriesAcc += caloriesPerMinute({ bpm: heartRate, weightKg: slot?.profile?.weightKg, age: slot?.profile?.age, gender: slot?.profile?.gender }) * minutesSinceLast;
          }
          state.lastSampleAt = now;

          const maxHR = estimateMaxHR(slots.find((s) => s.id === id)?.profile?.age);
          updateSlot(id, {
            bpm: heartRate,
            calories: Math.round(state.caloriesAcc),
            avg: Math.round(state.samples.reduce((a, b) => a + b, 0) / state.samples.length),
            max: Math.max(...state.samples),
            min: Math.min(...state.samples),
            zone: getHRZone(heartRate, maxHR),
          });
        });
        monitor.addEventListener("battery", (e) => updateSlot(id, { battery: e.detail.level }));
        monitor.addEventListener("disconnected", () => {
          clearInterval(state.interval);
          updateSlot(id, { status: "idle" });
        });

        const { name } = await monitor.connect();
        updateSlot(id, { status: "connected", deviceName: name });

        state.interval = setInterval(() => {
          updateSlot(id, { elapsedSec: Math.round((Date.now() - state.startedAt) / 1000) });
        }, 1000);
      } catch (err) {
        if (err.name === "NotFoundError") {
          updateSlot(id, { status: "idle" });
        } else {
          updateSlot(id, { status: "error", error: err.message });
        }
      }
    },
    [slots, updateSlot]
  );

  const disconnectSlot = useCallback((id) => {
    const state = monitorsRef.current[id];
    const slot = slots.find((s) => s.id === id);
    const summary = slot
      ? { durationSec: slot.elapsedSec, calories: slot.calories, avgBpm: slot.avg, maxBpm: slot.max, minBpm: slot.min, deviceName: slot.deviceName }
      : null;
    if (state) {
      state.monitor.disconnect();
      clearInterval(state.interval);
      delete monitorsRef.current[id];
    }
    updateSlot(id, { status: "idle", bpm: null });
    return summary;
  }, [slots, updateSlot]);

  useEffect(
    () => () => {
      Object.values(monitorsRef.current).forEach((m) => {
        m.monitor.disconnect();
        clearInterval(m.interval);
      });
    },
    []
  );

  return { supported, slots, addSlot, removeSlot, connectSlot, disconnectSlot };
}
