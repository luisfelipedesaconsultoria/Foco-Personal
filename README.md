# Foco Personal

App para personal trainers gerenciarem a relação com alunos: feed social individual, avaliação física + relatórios periódicos, pagamentos, check-in mensal e monitor de frequência cardíaca via Bluetooth. Não é um app de prescrição de treino.

React + Vite + Tailwind, com Supabase (dados) e Firebase (login por link mágico + push notifications). Layout inspirado no Strava, com ícone set próprio (nada de biblioteca genérica).

## Estrutura

```
src/
  App.jsx              rotas (react-router-dom)
  icons/index.jsx       ícone set próprio, um componente por ícone
  hooks/                useAuth (Firebase), useData (fetch + fallback demo),
                        useHeartRateMonitor / useHRSlots (Bluetooth)
  lib/                  bluetoothHeartRate.js (Web Bluetooth GATT), liveHRSession.js
                        (Supabase Realtime), calorieCalc.js, colorUtils.js, api.js
  components/           ui.jsx (design system), HeartRateWidget.jsx, BottomNav.jsx
  pages/aluno/          Feed, Avaliação, Relatório, Check-in, Cardio, Pagamentos, Perfil
  pages/treinador/      Início, Comunidade, Cadastro, Cardio (monitor ao vivo),
                        Financeiro, Notificação, Publicar relatório, Perfil
api/                     Vercel Serverless Functions — toda leitura/escrita de
                        dados passa por aqui (service_role key, nunca exposta
                        ao navegador), com o Firebase ID token do usuário logado
                        verificado em cada chamada (lib/auth-server.js)
lib/                     supabase-admin.js, auth-server.js (server-side)
supabase/migrations/     0001_init.sql, 0002_hr_sessions.sql, 0003_curtidas.sql
```

O app roda em **modo demonstração** sem nenhuma credencial configurada — login mostra "Continuar como aluno/treinador (demo)", com dados de exemplo, sem nenhuma chamada de API.

## Setup para sair do modo demonstração

Nenhuma chave vai em arquivo versionado nem em chat — tudo via variáveis de ambiente do Vercel (Project Settings → Environment Variables).

### 1. Firebase (login + push)
- Criar projeto em https://console.firebase.google.com, ativar **Authentication → Email link** e **Cloud Messaging**.
- Env vars do front-end (Vite): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_VAPID_KEY` (Project Settings → Cloud Messaging → Web Push certificates) — repetir as mesmas chaves em `public/firebase-messaging-sw.js`.
- Gerar a conta de serviço (Project Settings → Service Accounts → Generate new private key) e colar o JSON inteiro (uma linha) em `FIREBASE_SERVICE_ACCOUNT`.
- `TREINADOR_EMAIL` — o e-mail que o treinador usa pra logar; é assim que o backend reconhece "esse sou eu, o treinador" (fase 1 é um treinador só).

### 2. Supabase (dados)
- Criar projeto em https://supabase.com, rodar as 3 migrations em `supabase/migrations/` (nessa ordem) no SQL Editor.
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API) — usadas só no servidor.
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — únicas chaves Supabase que vão pro navegador, usadas só pra abrir canais Realtime da sala remota de frequência cardíaca (RLS sem policy em nenhuma tabela, então a anon key não dá acesso a dado nenhum).

### 3. Asaas
- API key pra status de pagamento real e geração de link de cobrança/Pix — ainda não integrado nesta versão (tabela `pagamentos` existe, falta ligar à API do Asaas).

### 4. LGPD
- Tela de consentimento como gate do primeiro acesso — ainda não implementada (rascunho de termo no brief de produto, precisa de revisão jurídica).

## Frequência cardíaca via Bluetooth

Web Bluetooth API + GATT Heart Rate Service padrão — funciona com qualquer bracelete BLE (COOSPO, Polar, Garmin...), sem SDK de fabricante. Só Chrome/Edge (computador ou Android); no iPhone use o app **Bluefy – Web BLE Browser**.

Dois modos na tela "Cardio" do treinador:
- **Neste aparelho** — conecta vários braceletes direto na tela do treinador, um por aluno (inclusive perfis avulsos, só daquela sessão).
- **Sala remota** — cada aluno conecta o próprio bracelete pelo app dele, sincronizado via Supabase Realtime.

## Deploy

Conectado ao Vercel (build automático a cada push na branch `main`, framework Vite detectado automaticamente).
