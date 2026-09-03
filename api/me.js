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

    if (auth.role === 'treinador') {
      const { data: treinador } = await supabase.from('treinadores').select('*').eq('id', auth.treinadorId).single();
      res.status(200).json({ role: 'treinador', treinador: { id: treinador.id, nome: treinador.nome, marca: treinador.marca } });
      return;
    }

    const { data: aluno } = await supabase.from('alunos').select('*').eq('id', auth.alunoId).single();
    res.status(200).json({
      role: 'aluno',
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        tipo: aluno.tipo,
        status: aluno.status,
        idade: aluno.idade,
        pesoKg: aluno.peso_kg,
        genero: aluno.genero,
        treinadorId: aluno.treinador_id,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
