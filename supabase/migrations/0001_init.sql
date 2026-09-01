-- Schema mínimo do Painel (ver brief de produto, §4).
-- Multi-tenant desde já (treinador_id em toda tabela filha), mesmo com um
-- único treinador usando por enquanto — não precisa aparecer na interface.
--
-- Segurança: RLS habilitado em todas as tabelas, SEM policies. Isso bloqueia
-- por padrão qualquer acesso via chave anon/pública. Todo acesso real passa
-- pelas Vercel Functions em /api, que usam a service_role key (que ignora
-- RLS por definição do Supabase) — nunca expomos a service_role key nem uma
-- anon key com policies frouxas para o navegador.

create extension if not exists "pgcrypto";

create table treinadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  marca text,
  created_at timestamptz not null default now()
);

create table alunos (
  id uuid primary key default gen_random_uuid(),
  treinador_id uuid not null references treinadores(id) on delete cascade,
  nome text not null,
  email text not null unique,
  telefone text,
  tipo text not null check (tipo in ('presencial', 'consultoria')),
  status text not null default 'ativo' check (status in ('ativo', 'convite_enviado', 'inativo')),
  firebase_uid text unique,
  push_token text,
  created_at timestamptz not null default now()
);
create index alunos_treinador_id_idx on alunos(treinador_id);

create table periodos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id) on delete cascade,
  label text not null,
  peso numeric,
  cintura numeric,
  gordura numeric,
  engajamento numeric,
  pagamento_status text,
  ratings_json jsonb not null default '{}'::jsonb,
  quote text,
  origem text not null default 'treinador' check (origem in ('treinador', 'aluno')),
  notas_treinador text,
  created_at timestamptz not null default now()
);
create index periodos_aluno_id_idx on periodos(aluno_id);

create table notificacoes (
  id uuid primary key default gen_random_uuid(),
  treinador_id uuid not null references treinadores(id) on delete cascade,
  aluno_id uuid references alunos(id) on delete cascade,
  audience text,
  titulo text not null,
  corpo text not null,
  tipo text not null default 'aviso',
  enviado_em timestamptz not null default now(),
  lido boolean not null default false
);
create index notificacoes_treinador_id_idx on notificacoes(treinador_id);
create index notificacoes_aluno_id_idx on notificacoes(aluno_id);

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id) on delete cascade,
  referencia text not null,
  status text not null check (status in ('pago', 'pendente')),
  data date not null,
  origem_asaas_id text,
  created_at timestamptz not null default now()
);
create index pagamentos_aluno_id_idx on pagamentos(aluno_id);

alter table treinadores enable row level security;
alter table alunos enable row level security;
alter table periodos enable row level security;
alter table notificacoes enable row level security;
alter table pagamentos enable row level security;
