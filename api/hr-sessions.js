const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../lib/supabase-admin');
const { verifyRequestAuth } = require('../lib/auth-server');

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
      const { data, error } = await supabase
        .from('hr_sessions')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      res.status(200).json({
        sessoes: (data || []).map((s) => ({
          id: s.id,
          modo: s.modo,
          roomCode: s.room_code,
          deviceName: s.device_name,
          avgBpm: s.avg_bpm,
          maxBpm: s.max_bpm,
          minBpm: s.min_bpm,
          calorias: s.calorias,
          duracaoSeg: s.duracao_seg,
          createdAt: s.created_at,
        })),
      });
      return;
    }

    if (req.method === 'POST') {
      const isAluno = auth.role === 'aluno';
      const body = req.body || {};
      const alunoId = isAluno ? auth.alunoId : body.alunoId;
      if (!alunoId) {
        res.status(400).json({ error: 'alunoId é obrigatório' });
        return;
      }
      const { error } = await supabase.from('hr_sessions').insert({
        aluno_id: alunoId,
        treinador_id: auth.treinadorId,
        modo: body.modo || 'individual',
        room_code: body.roomCode || null,
        device_name: body.deviceName || null,
        avg_bpm: body.avgBpm ?? null,
        max_bpm: body.maxBpm ?? null,
        min_bpm: body.minBpm ?? null,
        calorias: body.calorias ?? null,
        duracao_seg: body.duracaoSeg ?? null,
      });
      if (error) throw error;
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
