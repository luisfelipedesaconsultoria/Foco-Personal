function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
function mix(hex, target, amount) {
  const { r, g, b } = hexToRgb(hex);
  const t = hexToRgb(target);
  return rgbToHex(r + (t.r - r) * amount, g + (t.g - g) * amount, b + (t.b - b) * amount);
}
function lighten(hex, amount) {
  return mix(hex, "#ffffff", amount);
}
function darken(hex, amount) {
  return mix(hex, "#000000", amount);
}

// Deriva uma escala tonal completa a partir de uma única cor de marca, pra manter
// o app do aluno consistente independente da cor que o treinador escolher.
export function getBrandScale(brandColor) {
  const brand = brandColor || "#31E17A";
  return {
    brand,
    brandDark: darken(brand, 0.35),
    soft: lighten(brand, 0.55),
    softer: lighten(brand, 0.82),
    highlight: lighten(brand, 0.2),
    border: lighten(brand, 0.7),
  };
}
