const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../lib/supabase-admin');
const { verifyRequestAuth } = require('../lib/auth-server');

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
      res.status(403).json({ error: 'Só o aluno faz check-in' });
      return;
    }

    const { adesao, energia, satisfacao, texto } = req.body || {};
    const ratings = { adesao: adesao || 3, energia: energia || 3, satisfacao: satisfacao || 3 };

    const { data: ultimo } = await supabase
      .from('periodos')
      .select('id')
      .eq('aluno_id', auth.alunoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ultimo) {
      await supabase.from('periodos').update({ ratings_json: ratings, quote: texto || null }).eq('id', ultimo.id);
    } else {
      await supabase.from('periodos').insert({
        aluno_id: auth.alunoId,
        label: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        ratings_json: ratings,
        quote: texto || null,
        origem: 'aluno',
      });
    }

    const { data: aluno } = await supabase.from('alunos').select('nome').eq('id', auth.alunoId).single();
    await supabase.from('notificacoes').insert({
      treinador_id: auth.treinadorId,
      aluno_id: auth.alunoId,
      titulo: 'Check-in recebido',
      corpo: `${aluno?.nome || 'Aluno'} respondeu o check-in mensal.`,
      tipo: 'checkin_recebido',
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
