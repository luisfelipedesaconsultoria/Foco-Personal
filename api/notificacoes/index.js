const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../../lib/supabase-admin');
const { verifyRequestAuth } = require('../../lib/auth-server');

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

    let query = supabase.from('notificacoes').select('*').eq('treinador_id', auth.treinadorId).order('enviado_em', { ascending: false });
    if (auth.role === 'aluno') {
      query = query.or(`aluno_id.eq.${auth.alunoId},aluno_id.is.null`);
    }
    const { data, error } = await query;
    if (error) throw error;

    const ids = (data || []).map((n) => n.id);
    let curtidasPorId = {};
    let curtiPorMim = new Set();
    if (ids.length) {
      const { data: curtidas } = await supabase.from('notificacao_curtidas').select('notificacao_id, aluno_id').in('notificacao_id', ids);
      (curtidas || []).forEach((c) => {
        curtidasPorId[c.notificacao_id] = (curtidasPorId[c.notificacao_id] || 0) + 1;
        if (auth.role === 'aluno' && c.aluno_id === auth.alunoId) curtiPorMim.add(c.notificacao_id);
      });
    }

    res.status(200).json({
      notificacoes: (data || []).map((n) => ({
        id: n.id,
        alunoId: n.aluno_id,
        audience: n.audience,
        titulo: n.titulo,
        corpo: n.corpo,
        tipo: n.tipo,
        enviadoEm: n.enviado_em,
        lido: n.lido,
        curtidas: curtidasPorId[n.id] || 0,
        curtiPorMim: curtiPorMim.has(n.id),
      })),
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
