-- Curtidas (kudos) no feed — quem curtiu o quê, pra permitir alternar
-- curtir/descurtir sem contar duas vezes.

create table notificacao_curtidas (
  notificacao_id uuid not null references notificacoes(id) on delete cascade,
  aluno_id uuid not null references alunos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (notificacao_id, aluno_id)
);

alter table notificacao_curtidas enable row level security;
