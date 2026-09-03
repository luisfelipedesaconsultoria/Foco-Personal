const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../lib/supabase-admin');
const { verifyRequestAuth } = require('../lib/auth-server');

function mapPeriodo(p) {
  return {
    id: p.id,
    alunoId: p.aluno_id,
    label: p.label,
    peso: p.peso,
    cintura: p.cintura,
    gordura: p.gordura,
    engajamento: p.engajamento,
    pagamentoStatus: p.pagamento_status,
    ratings: p.ratings_json || {},
    quote: p.quote,
    origem: p.origem,
    notasTreinador: p.notas_treinador,
    createdAt: p.created_at,
  };
}

async function assertAlunoDoTreinador(supabase, treinadorId, alunoId) {
  const { data } = await supabase.from('alunos').select('id').eq('id', alunoId).eq('treinador_id', treinadorId).maybeSingle();
  if (!data) {
    const err = new Error('Aluno não encontrado');
    err.status = 404;
    throw err;
  }
}

module.exports = async (req, res) => {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase não configurado' });
    return;
  }

  try {
    const auth = await verifyRequestAuth(req, supabase, getOrCreateDefaultTreinador);

    if (req.method === 'GET') {
      let alunoId = auth.role === 'aluno' ? auth.alunoId : req.query.alunoId;
      if (!alunoId) {
        res.status(400).json({ error: 'alunoId é obrigatório' });
        return;
      }
      if (auth.role === 'treinador') await assertAlunoDoTreinador(supabase, auth.treinadorId, alunoId);

      const { data, error } = await supabase.from('periodos').select('*').eq('aluno_id', alunoId).order('created_at', { ascending: true });
      if (error) throw error;
      res.status(200).json({ periodos: (data || []).map(mapPeriodo) });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const isAluno = auth.role === 'aluno';
      const alunoId = isAluno ? auth.alunoId : body.alunoId;
      if (!alunoId) {
        res.status(400).json({ error: 'alunoId é obrigatório' });
        return;
      }
      if (!isAluno) await assertAlunoDoTreinador(supabase, auth.treinadorId, alunoId);

      const row = isAluno
        ? { aluno_id: alunoId, label: body.label || 'Registro avulso', peso: body.peso, origem: 'aluno' }
        : {
            aluno_id: alunoId,
            label: body.label,
            peso: body.peso,
            cintura: body.cintura,
            gordura: body.gordura,
            engajamento: body.engajamento,
            pagamento_status: body.pagamentoStatus,
            quote: body.quote,
            notas_treinador: body.notasTreinador,
            origem: 'treinador',
          };

      const { data, error } = await supabase.from('periodos').insert(row).select('*').single();
      if (error) throw error;
      res.status(200).json({ periodo: mapPeriodo(data) });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
