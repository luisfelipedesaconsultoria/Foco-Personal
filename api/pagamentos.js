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
      // Pendências de todos os alunos do treinador (tela Financeiro).
      const { data: alunos } = await supabase.from('alunos').select('id, nome').eq('treinador_id', auth.treinadorId);
      const alunoIds = (alunos || []).map((a) => a.id);
      const { data: pendentes } = alunoIds.length
        ? await supabase.from('pagamentos').select('*').in('aluno_id', alunoIds).eq('status', 'pendente')
        : { data: [] };
      const nomeMap = Object.fromEntries((alunos || []).map((a) => [a.id, a.nome]));
      res.status(200).json({
        pendencias: (pendentes || []).map((p) => ({ id: p.id, alunoNome: nomeMap[p.aluno_id], referencia: p.referencia, data: p.data })),
      });
      return;
    }

    const { data, error } = await supabase.from('pagamentos').select('*').eq('aluno_id', auth.alunoId).order('data', { ascending: false });
    if (error) throw error;
    res.status(200).json({
      pagamentos: (data || []).map((p) => ({ id: p.id, referencia: p.referencia, status: p.status, data: p.data })),
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
