// Client Supabase do NAVEGADOR — usado só para abrir canais Realtime (sala
// remota de frequência cardíaca: presence + broadcast, não toca nenhuma
// tabela). Todo o resto (ler/gravar dados) passa pelas rotas /api/*, que usam
// a service_role key no servidor. A chave anon aqui não tem nenhum grant em
// tabela (RLS habilitado sem policy em supabase/migrations/0001_init.sql),
// então mesmo exposta ao navegador ela não abre acesso a dados.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
