import React from "react";
import { IconLoader } from "../icons";

export function Logo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2 font-display font-bold text-ink" style={{ fontSize: size * 0.5 }}>
      <span className="inline-block rounded-full bg-green shadow-glow" style={{ width: size * 0.32, height: size * 0.32 }} />
      Foco
    </div>
  );
}

export function ProgressRing({ pct = 0, size = 104, stroke = 9, color = "#31E17A", track = "#181C17", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.16,.9,.3,1)", filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function SectionLabel({ children }) {
  return <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-6 mb-2.5">{children}</div>;
}

export function Badge({ children, color = "#31E17A", bg = "rgba(49,225,122,0.14)" }) {
  return (
    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full" style={{ color, background: bg }}>
      {children}
    </span>
  );
}

export function Card({ children, dark = true, featured = false, className = "", ...rest }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${featured ? "border-green shadow-glow" : "border-line"} ${className}`}
      style={{ background: dark ? "#0C0F0C" : "#fff" }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`w-full mt-2 bg-green text-[#04140A] font-extrabold text-[13px] py-3.5 rounded-2xl shadow-glow active:scale-[0.97] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`w-full mt-2 bg-transparent border-[1.5px] border-line text-ink font-bold text-[13px] py-3 rounded-2xl active:scale-[0.97] transition-transform flex items-center justify-center gap-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="bg-surface border border-dashed border-line rounded-2xl p-7 text-center">
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-greenDim text-green flex items-center justify-center mx-auto mb-3">
          <Icon size={20} />
        </div>
      )}
      <div className="font-bold text-sm mb-1.5">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{description}</div>
    </div>
  );
}

export function Avatar({ initials, size = 36, color = "#31E17A" }) {
  return (
    <div
      className="rounded-full border flex items-center justify-center font-extrabold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `${color}22`, borderColor: color, color }}
    >
      {initials}
    </div>
  );
}

export function Spinner({ size = 20, color = "currentColor" }) {
  return <IconLoader size={size} color={color} />;
}
