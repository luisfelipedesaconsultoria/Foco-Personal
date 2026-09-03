import React from "react";

// Base wrapper — todo ícone do app nasce daqui: traço único, geométrico, bold.
// Nenhum ícone deste arquivo vem de biblioteca externa (lucide/feather/heroicons) —
// são desenhos originais, propositalmente simples e consistentes entre si.
function Base({ size = 22, color = "currentColor", strokeWidth = 1.8, className, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

// Feed — linha do tempo com um pulso (ECG) atravessando, em vez de uma casinha genérica.
export function IconFeed(props) {
  return (
    <Base {...props}>
      <path d="M2 12h4l2 6 3-14 2.5 10 1.5-4h7" />
    </Base>
  );
}

// Avaliação — barras crescentes com seta de tendência.
export function IconTrend(props) {
  return (
    <Base {...props}>
      <path d="M3 20V13" />
      <path d="M9 20V9" />
      <path d="M15 20v-5" />
      <path d="M21 20V6" />
      <path d="M16 4l5 0 0 5" />
      <path d="M21 4l-6.5 6.5-3-3L4 15" />
    </Base>
  );
}

// Relatório — anel com um segmento em destaque (gráfico de progresso).
export function IconReport(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 7.2 12.9" />
    </Base>
  );
}

// Check-in — quadrado arredondado com um tique, tipo "ping" rápido.
export function IconCheckin(props) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <path d="M8.5 12.5l2.3 2.3L16 9.5" />
    </Base>
  );
}

// Cardio — coração com traço de batimento.
export function IconHeartbeat(props) {
  return (
    <Base {...props}>
      <path d="M12 20.5S3 14.8 3 8.9C3 5.6 5.5 3.3 8.4 3.3c1.6 0 3.1.8 3.6 2 .5-1.2 2-2 3.6-2C18.5 3.3 21 5.6 21 8.9c0 5.9-9 11.6-9 11.6z" />
      <path d="M6.5 11h2.3l1.4-2.6 1.8 5 1.3-2.4h3" />
    </Base>
  );
}

// Bluetooth — símbolo padrão da tecnologia (pictograma universal, não é logotipo de app).
export function IconBluetooth(props) {
  return (
    <Base {...props}>
      <path d="M7 7l10 10-5 4V3l5 4L7 17" />
    </Base>
  );
}

// Pagamentos — cartão com tarja e chip.
export function IconCard(props) {
  return (
    <Base {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19" />
      <rect x="5.5" y="13" width="4" height="2.4" rx="0.6" />
    </Base>
  );
}

// Perfil — atleta: cabeça + ombros angulares (silhueta em movimento).
export function IconAthlete(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="6.2" r="3.2" />
      <path d="M5 20c0-4.5 3.5-7 7-7s7 2.5 7 7" />
    </Base>
  );
}

// Comunidade — duas pessoas (chevron sobre oval).
export function IconPeople(props) {
  return (
    <Base {...props}>
      <circle cx="8.5" cy="8" r="2.6" />
      <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5" />
      <circle cx="17" cy="9.2" r="2.1" />
      <path d="M14.8 12.2c2.6.1 4.7 1.9 4.7 4.8" />
    </Base>
  );
}

// Financeiro — carteira com moeda.
export function IconWallet(props) {
  return (
    <Base {...props}>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11a2 2 0 0 1 2 2v1" />
      <rect x="3.5" y="7.5" width="17" height="11.5" rx="2.5" />
      <circle cx="16" cy="13.2" r="1.6" />
    </Base>
  );
}

// Notificação — sino.
export function IconBell(props) {
  return (
    <Base {...props}>
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2v1h16v-1z" />
      <path d="M10 21a2 2 0 004 0" />
    </Base>
  );
}

// Cadastro — pessoa + mais.
export function IconUserPlus(props) {
  return (
    <Base {...props}>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6" />
      <path d="M18 8v6M15 11h6" />
    </Base>
  );
}

// Publicar — megafone angular.
export function IconMegaphone(props) {
  return (
    <Base {...props}>
      <path d="M3 10v4a1 1 0 001 1h2l1 5h2l-1-5h1l9 4V6l-9 4H4a1 1 0 00-1 1z" />
      <path d="M19 9.5a3.5 3.5 0 010 5" />
    </Base>
  );
}

// Curtir — chama, marca própria no lugar do "kudos" do Strava.
export function IconFlame(props) {
  return (
    <Base {...props}>
      <path d="M12 21.5s-6.5-3.8-6.5-9.2c0-3 1.9-4.8 2.9-6.6.6 1.6 1.5 2.4 2.5 2.9-.2-2.4.6-4.6 3-6.1-.4 2.6.6 4.1 2.3 5.8 1.6 1.6 2.3 3.1 2.3 5C18.5 17.5 12 21.5 12 21.5z" />
    </Base>
  );
}

export function IconPlay(props) {
  return (
    <Base {...props}>
      <path d="M6 4.5v15l13-7.5z" strokeLinejoin="round" fill={props.filled ? "currentColor" : "none"} />
    </Base>
  );
}

export function IconPause(props) {
  return (
    <Base {...props}>
      <path d="M7 4.5h3.2v15H7zM13.8 4.5H17v15h-3.2z" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconChevronLeft(props) {
  return (
    <Base {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Base>
  );
}

export function IconChevronRight(props) {
  return (
    <Base {...props}>
      <path d="M9 5l7 7-7 7" />
    </Base>
  );
}

export function IconClose(props) {
  return (
    <Base {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </Base>
  );
}

export function IconSend(props) {
  return (
    <Base {...props}>
      <path d="M4 12.5c5.5-1.6 11-4 16-8-4 5-6.4 10.5-8 16-1-3.5-2.2-5.6-4.5-6.8-2.3-.8-2.7-.9-3.5-1.2z" strokeLinejoin="round" />
    </Base>
  );
}

export function IconCopy(props) {
  return (
    <Base {...props}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.2" />
      <path d="M15.5 8.5V6a1.5 1.5 0 00-1.5-1.5H5A1.5 1.5 0 003.5 6v10A1.5 1.5 0 005 17.5h2.5" />
    </Base>
  );
}

export function IconCheck(props) {
  return (
    <Base {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Base>
  );
}

export function IconBattery(props) {
  return (
    <Base {...props}>
      <rect x="2.5" y="8" width="16" height="8" rx="2" />
      <path d="M21 10.5v3" />
      <path d="M5 10.5v3" fill="currentColor" stroke="currentColor" strokeWidth="3.5" />
    </Base>
  );
}

// Configurações — dial com marcações radiais (em vez da engrenagem clássica).
export function IconSettings(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3.4" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="3.2"
          x2="12"
          y2="5.4"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </Base>
  );
}

export function IconLogout(props) {
  return (
    <Base {...props}>
      <path d="M9 4H5.5A1.5 1.5 0 004 5.5v13A1.5 1.5 0 005.5 20H9" />
      <path d="M13 12h8M18 8l3 4-3 4" />
    </Base>
  );
}

export function IconLoader(props) {
  return (
    <Base {...props} className={`spin ${props.className || ""}`}>
      <path d="M12 3.5a8.5 8.5 0 108.5 8.5" />
    </Base>
  );
}
