const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../lib/supabase-admin');
const { verifyRequestAuth } = require('../lib/auth-server');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase não configurado' });
    return;
  }

  try {
    const auth = await verifyRequestAuth(req, supabase, getOrCreateDefaultTreinador);
    if (auth.role !== 'treinador') {
      res.status(403).json({ error: 'Só o treinador pode ver o roster' });
      return;
    }

    const { data, error } = await supabase
      .from('alunos')
      .select('id, nome, email, telefone, tipo, status, idade, peso_kg, genero, push_token')
      .eq('treinador_id', auth.treinadorId)
      .order('nome');
    if (error) throw error;

    res.status(200).json({
      alunos: (data || []).map((a) => ({
        id: a.id,
        nome: a.nome,
        email: a.email,
        telefone: a.telefone,
        tipo: a.tipo,
        status: a.status,
        idade: a.idade,
        pesoKg: a.peso_kg,
        genero: a.genero,
        pushAtivo: !!a.push_token,
      })),
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
