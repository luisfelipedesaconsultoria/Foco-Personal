// Cliente Supabase server-side, usado só dentro de api/*.js (nunca no navegador).
// Usa a service_role key — ignora RLS por definição, então é isso que dá às
// nossas funções serverless acesso real às tabelas (o navegador não recebe
// nenhuma chave Supabase).

const { createClient } = require('@supabase/supabase-js');

let client = null;

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

// Fase 1: ferramenta interna de um único treinador (ver brief, §2). Em vez de
// pedir pra escolher/criar um treinador manualmente, garante que existe
// exatamente um registro e devolve o id dele. Quando isso virar SaaS
// multi-treinador, troca por autenticação real do treinador.
async function getOrCreateDefaultTreinador(supabase) {
  const { data: existing } = await supabase.from('treinadores').select('id').limit(1).maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('treinadores')
    .insert({ nome: process.env.TREINADOR_NOME || 'Treinador', marca: process.env.TREINADOR_MARCA || null })
    .select('id')
    .single();
  if (error) throw error;
  return created.id;
}

module.exports = { getSupabaseAdmin, getOrCreateDefaultTreinador };
