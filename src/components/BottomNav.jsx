import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav({ items }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-[rgba(10,12,10,0.92)] backdrop-blur-xl border-t border-line flex px-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 z-40">
      {items.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-1.5 text-[10px] font-bold transition-colors ${
              isActive ? "text-green" : "text-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="flex transition-transform"
                style={isActive ? { transform: "translateY(-2px) scale(1.08)", filter: "drop-shadow(0 0 6px rgba(49,225,122,0.55))" } : undefined}
              >
                <Icon size={20} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
