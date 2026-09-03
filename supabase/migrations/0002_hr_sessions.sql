-- Sessões de frequência cardíaca (monitor Bluetooth) + campos de perfil do
-- aluno necessários pro cálculo de calorias/zona de FC (idade, peso, gênero).

alter table alunos add column if not exists idade integer;
alter table alunos add column if not exists peso_kg numeric;
alter table alunos add column if not exists genero text check (genero in ('masculino', 'feminino'));

create table hr_sessions (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id) on delete cascade,
  treinador_id uuid not null references treinadores(id) on delete cascade,
  modo text not null default 'individual' check (modo in ('individual', 'turma')),
  room_code text,
  device_name text,
  avg_bpm integer,
  max_bpm integer,
  min_bpm integer,
  calorias integer,
  duracao_seg integer,
  created_at timestamptz not null default now()
);
create index hr_sessions_aluno_id_idx on hr_sessions(aluno_id);
create index hr_sessions_treinador_id_idx on hr_sessions(treinador_id);

alter table hr_sessions enable row level security;
