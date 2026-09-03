// Fórmula de Tanaka para FC máxima estimada por idade.
export function estimateMaxHR(age) {
  const a = Number(age) || 30;
  return Math.round(208 - 0.7 * a);
}

export const HR_ZONES = [
  { zone: 1, label: "Recuperação", min: 0, max: 60, color: "#7C8578" },
  { zone: 2, label: "Leve", min: 60, max: 70, color: "#31E17A" },
  { zone: 3, label: "Moderada", min: 70, max: 80, color: "#8FF0B8" },
  { zone: 4, label: "Intensa", min: 80, max: 90, color: "#FF7A45" },
  { zone: 5, label: "Máxima", min: 90, max: 999, color: "#FF3B3B" },
];

export function getHRZone(bpm, maxHR) {
  if (!bpm || !maxHR) return HR_ZONES[0];
  const pct = (bpm / maxHR) * 100;
  return HR_ZONES.slice().reverse().find((z) => pct >= z.min) || HR_ZONES[0];
}

// Keytel et al. (2005) — estimativa de gasto calórico por minuto a partir do BPM.
export function caloriesPerMinute({ bpm, weightKg, age, gender }) {
  const w = Number(weightKg) || 70;
  const a = Number(age) || 30;
  const hr = Number(bpm) || 0;
  if (!hr) return 0;
  let kcalPerMin;
  if (gender === "feminino") {
    kcalPerMin = -20.4022 + 0.4472 * hr - 0.1263 * w + 0.074 * a;
  } else {
    kcalPerMin = -55.0969 + 0.6309 * hr + 0.1988 * w + 0.2017 * a;
  }
  return Math.max(0, kcalPerMin / 4.184);
}

export function kJtoKcal(kj) {
  return (Number(kj) || 0) * 0.239006;
}
