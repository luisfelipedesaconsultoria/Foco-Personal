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
  send-notification.js
  invite-student.js
vercel.json                 # reescreve /.netlify/functions/* -> /api/* (app.js não precisou mudar)
```

O app já funciona em **modo demonstração** sem nenhuma credencial configurada: login cai no fallback "Continuar em modo demonstração", envio de notificação e cadastro de aluno mostram feedback de demo, e nada quebra.

## Setup para sair do modo demonstração

Nenhuma chave deve ser colada em chat — todas vão direto nas variáveis de ambiente do provedor de deploy (Vercel: Project Settings → Environment Variables).

1. **Firebase** — criar projeto em https://console.firebase.google.com, ativar Authentication (método Email link) e Cloud Messaging.
   - Preencher `firebase-config.js` com as chaves públicas (Project Settings → General → Web app) e a VAPID key (Project Settings → Cloud Messaging → Web Push certificates). Repetir as mesmas chaves em `firebase-messaging-sw.js`.
   - Gerar a chave de conta de serviço (Project Settings → Service Accounts → Generate new private key) e colar o JSON inteiro (uma linha) na env var `FIREBASE_SERVICE_ACCOUNT` do Vercel — **nunca** em arquivo versionado.

2. **Supabase** — criar projeto em https://supabase.com e aplicar o schema mínimo (ver brief, §4): `treinadores`, `alunos`, `periodos`, `notificacoes`, `pagamentos`, todos amarrados a `treinador_id` (schema multi-tenant desde já, mesmo com um único treinador usando por enquanto). Ligar `api/send-notification.js` e `api/invite-student.js` à consulta real (hoje são TODOs).

3. **Asaas** — obter API key para status de pagamento real e geração de link de cobrança/Pix.

4. **LGPD** — implementar a tela de consentimento como gate do primeiro acesso (rascunho de termo no brief, §7 — precisa de revisão jurídica antes de valer legalmente).

5. Remover o seletor "MODO DEMONSTRAÇÃO" do topo da tela antes de abrir para alunos reais — existe só para prototipagem.

## Deploy

Já conectado ao Vercel (build automático a cada push na branch principal). Painel do projeto: https://vercel.com — procurar pelo projeto `painel-app`.
