const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../../lib/supabase-admin');
const { verifyRequestAuth } = require('../../lib/auth-server');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
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
    if (auth.role !== 'aluno') {
      res.status(403).json({ error: 'Só o aluno pode curtir' });
      return;
    }
    const { notificacaoId } = req.body || {};
    if (!notificacaoId) {
      res.status(400).json({ error: 'notificacaoId é obrigatório' });
      return;
    }

    const { data: existing } = await supabase
      .from('notificacao_curtidas')
      .select('*')
      .eq('notificacao_id', notificacaoId)
      .eq('aluno_id', auth.alunoId)
      .maybeSingle();

    if (existing) {
      await supabase.from('notificacao_curtidas').delete().eq('notificacao_id', notificacaoId).eq('aluno_id', auth.alunoId);
      res.status(200).json({ curtido: false });
    } else {
      await supabase.from('notificacao_curtidas').insert({ notificacao_id: notificacaoId, aluno_id: auth.alunoId });
      res.status(200).json({ curtido: true });
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
