# Painel

App para personal trainers gerenciarem a relação com alunos (feed social individual, avaliação física + relatórios periódicos, pagamentos). Ver o brief completo de produto para decisões e arquitetura.

Protótipo atual: HTML/CSS/JS vanilla, sem framework. Roda em qualquer hosting estático. Já deployado neste repositório via Vercel.

## Estrutura

```
index.html
style.css
app.js
manifest.json
firebase-config.js          # chaves públicas do Firebase (placeholder)
firebase-messaging-sw.js    # service worker do push (placeholder)
functions/                  # Netlify Functions (referência original)
  send-notification.js
  invite-student.js
api/                        # Vercel Serverless Functions (usadas no deploy atual)
  send-notification.js      # já ligado ao Supabase (resolve audiência -> push_token)
  invite-student.js         # já ligado ao Supabase (grava aluno na tabela `alunos`)
  save-push-token.js        # salva o token de push do aluno logado (Firebase ID token verificado)
lib/
  supabase-admin.js         # cliente Supabase server-side (service_role key) + bootstrap do treinador único
supabase/
  migrations/0001_init.sql  # schema completo (treinadores, alunos, periodos, notificacoes, pagamentos)
vercel.json                 # reescreve /.netlify/functions/* -> /api/* (app.js não precisou mudar)
```

O app já funciona em **modo demonstração** sem nenhuma credencial configurada: login cai no fallback "Continuar em modo demonstração", envio de notificação e cadastro de aluno mostram feedback de demo, e nada quebra.

## Setup para sair do modo demonstração

Nenhuma chave deve ser colada em chat — todas vão direto nas variáveis de ambiente do provedor de deploy (Vercel: Project Settings → Environment Variables).

1. **Firebase** — criar projeto em https://console.firebase.google.com, ativar Authentication (método Email link) e Cloud Messaging.
   - Preencher `firebase-config.js` com as chaves públicas (Project Settings → General → Web app) e a VAPID key (Project Settings → Cloud Messaging → Web Push certificates). Repetir as mesmas chaves em `firebase-messaging-sw.js`.
   - Gerar a chave de conta de serviço (Project Settings → Service Accounts → Generate new private key) e colar o JSON inteiro (uma linha) na env var `FIREBASE_SERVICE_ACCOUNT` do Vercel — **nunca** em arquivo versionado.

2. **Supabase** — criar projeto em https://supabase.com (free tier), depois:
   - No SQL Editor do projeto, colar e rodar o conteúdo de `supabase/migrations/0001_init.sql` (cria as 5 tabelas do brief §4, todas com RLS habilitado e nenhuma policy — só a service_role key consegue ler/escrever, o navegador nunca recebe uma chave Supabase).
   - Em Project Settings → API, pegar a **Project URL** e a **service_role key** (não a `anon`/`public` — essa não é usada neste projeto).
   - No Vercel: Project Settings → Environment Variables, criar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` com esses valores.
   - `api/invite-student.js` e `api/send-notification.js` já estão ligados a essas tabelas (não são mais TODOs): cadastrar aluno grava em `alunos`; enviar notificação resolve a audiência escolhida (todos / presencial / consultoria / aluno específico) e busca os `push_token` salvos; `api/save-push-token.js` recebe o token do aluno depois que ele ativa push em Perfil.
   - Fase 1 é de um único treinador — a primeira chamada a qualquer uma dessas functions cria automaticamente uma linha em `treinadores` (nome configurável via env var opcional `TREINADOR_NOME`). Quando virar SaaS multi-treinador, troca esse bootstrap por autenticação real do treinador.
   - Ainda falta: migrar os dados mockados de `app.js` (feed, avaliação, relatórios, pagamentos) para consultas reais — por enquanto essas telas continuam com dados de demonstração fixos mesmo depois de configurar o Supabase.

3. **Asaas** — obter API key para status de pagamento real e geração de link de cobrança/Pix.

4. **LGPD** — implementar a tela de consentimento como gate do primeiro acesso (rascunho de termo no brief, §7 — precisa de revisão jurídica antes de valer legalmente).

5. Remover o seletor "MODO DEMONSTRAÇÃO" do topo da tela antes de abrir para alunos reais — existe só para prototipagem.

## Deploy

Já conectado ao Vercel (build automático a cada push na branch principal). Painel do projeto: https://vercel.com — procurar pelo projeto `painel-app`.
