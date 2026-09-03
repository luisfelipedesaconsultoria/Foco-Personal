import React, { useRef } from "react";
import { useHeartRateMonitor } from "../hooks/useHeartRateMonitor";
import { formatDuration } from "../lib/format";
import { Card, OutlineButton, PrimaryButton, Spinner } from "./ui";
import { IconBluetooth, IconBattery, IconHeartbeat } from "../icons";

export default function HeartRateWidget({ weightKg, age, gender, brandColor = "#31E17A", onTick, onSessionEnd }) {
  const hr = useHeartRateMonitor({ weightKg, age, gender });
  const lastSentRef = useRef(0);

  React.useEffect(() => {
    if (hr.status !== "connected" || !onTick) return;
    const now = Date.now();
    if (now - lastSentRef.current < 900) return;
    lastSentRef.current = now;
    onTick({ bpm: hr.bpm, calories: hr.calories, zone: hr.zone, elapsedSec: hr.elapsedSec, battery: hr.battery });
  }, [hr.bpm, hr.status, hr.calories, hr.elapsedSec, hr.battery, hr.zone, onTick]);

  const handleDisconnect = () => {
    const summary = hr.getSummary();
    hr.disconnect();
    if (summary.durationSec > 0) onSessionEnd?.(summary);
  };

  if (!hr.supported) {
    return (
      <EmptyBluetooth />
    );
  }

  if (hr.status === "connected") {
    return (
      <Card className="!bg-surface2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <IconBluetooth size={16} color="#31E17A" />
            {hr.deviceName}
          </div>
          <div className="flex items-center gap-3">
            {hr.battery != null && (
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <IconBattery size={14} />
                {hr.battery}%
              </span>
            )}
            <button onClick={handleDisconnect} className="text-[11px] font-bold text-coral">
              Desconectar
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="font-num text-[52px] leading-none" style={{ color: hr.zone?.color || "#31E17A" }}>
            {hr.bpm ?? "--"}
          </span>
          <span className="text-xs text-muted mb-1.5">bpm</span>
        </div>
        {hr.zone && (
          <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3" style={{ color: hr.zone.color, background: `${hr.zone.color}22` }}>
            Zona {hr.zone.zone} · {hr.zone.label}
          </span>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface rounded-xl p-3">
            <div className="font-num text-2xl">{hr.calories}</div>
            <div className="text-[10px] text-muted">kcal</div>
          </div>
          <div className="bg-surface rounded-xl p-3">
            <div className="font-num text-2xl">{formatDuration(hr.elapsedSec)}</div>
            <div className="text-[10px] text-muted">duração</div>
          </div>
        </div>
      </Card>
    );
  }

  if (hr.status === "connecting") {
    return (
      <Card className="flex flex-col items-center gap-3 py-8">
        <Spinner size={26} color="#31E17A" />
        <span className="text-sm text-muted">Conectando ao bracelete…</span>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center text-center py-8 gap-3">
      <div className="w-12 h-12 rounded-full bg-greenDim text-green flex items-center justify-center">
        <IconHeartbeat size={22} />
      </div>
      <div>
        <div className="font-bold text-sm mb-1">Conectar bracelete</div>
        <div className="text-xs text-muted">Funciona com qualquer bracelete BLE (COOSPO, Polar, Garmin…)</div>
      </div>
      {hr.error && <div className="text-xs text-coral">{hr.error}</div>}
      <PrimaryButton onClick={hr.connect} className="max-w-[220px]">
        <IconBluetooth size={16} color="#04140A" />
        Conectar
      </PrimaryButton>
    </Card>
  );
}

function EmptyBluetooth() {
  return (
    <Card className="text-center py-8">
      <div className="font-bold text-sm mb-2">Bluetooth indisponível</div>
      <div className="text-xs text-muted leading-relaxed mb-3">
        Este navegador não suporta Web Bluetooth. Use Chrome ou Edge (computador ou Android).
        No iPhone, abra este site pelo app <strong>Bluefy – Web BLE Browser</strong>.
      </div>
      <OutlineButton disabled>Indisponível neste navegador</OutlineButton>
    </Card>
  );
}
