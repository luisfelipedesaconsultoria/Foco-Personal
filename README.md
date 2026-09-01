# Foco Personal

App para personal trainers gerenciarem alunos: treinos, avaliações, corrida,
frequência cardíaca via Bluetooth (braceletes COOSPO e qualquer monitor BLE
padrão), chat, financeiro e análise de vídeo. Três painéis: admin, personal
(treinador) e aluno.

React + Vite + Tailwind, com Supabase como backend (multi-tenant: cada
personal é um `tenant`).

## Estrutura

```
src/
  pages/admin/       painel do dono da plataforma (tenants, billing, biblioteca)
  pages/personal/    painel do treinador (alunos, treinos, monitor ao vivo, financeiro)
  pages/aluno/       app do aluno (treino do dia, corrida, cardio, progresso)
  lib/                acesso a dados (Supabase), cálculo de calorias/zonas de FC
  hooks/               autenticação, monitor de frequência cardíaca Bluetooth
supabase/migrations/   migrações SQL versionadas
```

## Desenvolvimento

```
pnpm install
pnpm dev
```

## Deploy

Conectado à Vercel (build automático a cada push na branch `main`). O
Supabase (URL + chave pública anon) tem um fallback embutido em
`src/lib/supabase.js` — funciona sem configurar nada, mas
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` no provedor de deploy têm
prioridade se definidas.

## Frequência cardíaca via Bluetooth

Usa a Web Bluetooth API (GATT Heart Rate Service padrão) — não requer SDK
de fabricante, funciona com qualquer bracelete BLE. Só funciona em
Chrome/Edge (computador ou Android); no iPhone, o Safari e demais
navegadores não suportam Web Bluetooth — use o app **Bluefy – Web BLE
Browser** (App Store) para abrir o site com Bluetooth funcionando.

Dois modos, na tela "Monitor ao vivo" do personal:
- **Neste aparelho**: conecta vários braceletes direto na tela do
  personal (presencial), um perfil por aluno — inclusive perfis avulsos,
  só para aquela sessão.
- **Sala remota**: cada aluno conecta o próprio bracelete pelo app dele
  (consultoria online), sincronizado via Supabase Realtime.
