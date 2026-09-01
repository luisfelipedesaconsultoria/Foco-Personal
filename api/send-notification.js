// Vercel Serverless Function — mesma lógica de functions/send-notification.js
// (versão Netlify, mantida para referência/portabilidade), adaptada para
// o formato de function do Vercel. Endpoint real: /api/send-notification
// (o front-end chama /.netlify/functions/send-notification, que o
// vercel.json reescreve para cá — não foi preciso mexer no app.js).
//
// SETUP NECESSÁRIO (uma vez só):
// 1. No Firebase Console: Project Settings > Service Accounts > Generate new private key.
// 2. No painel do Vercel: Project Settings > Environment Variables, crie:
//    FIREBASE_SERVICE_ACCOUNT = (cole o conteúdo do JSON inteiro, em uma linha)

const admin = require('firebase-admin');
const { getSupabaseAdmin, getOrCreateDefaultTreinador } = require('../lib/supabase-admin');

if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

// Resolve o texto de audiência escolhido no composer (app.js `audienceLabel()`)
// para as linhas de `alunos` correspondentes. "especifico" manda o nome do
// aluno direto (e o fluxo de publicar relatório também manda o nome).
async function resolveAudienceAlunos(supabase, treinadorId, audience) {
  let query = supabase.from('alunos').select('id, nome, push_token').eq('treinador_id', treinadorId);
  if (audience === 'Somente presencial') {
    query = query.eq('tipo', 'presencial');
  } else if (audience === 'Somente consultoria online') {
    query = query.eq('tipo', 'consultoria');
  } else if (audience && audience !== 'Todos os alunos') {
    query = query.eq('nome', audience);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!admin.apps.length) {
    res.status(200).json({ warning: 'Firebase ainda não configurado (FIREBASE_SERVICE_ACCOUNT ausente).' });
    return;
  }

  const { title, body, audience, type, tokens } = req.body || {};

  if (!title || !body) {
    res.status(400).json({ error: 'title e body são obrigatórios' });
    return;
  }

  const supabase = getSupabaseAdmin();
  let targetTokens = tokens || [];
  let matchedAlunos = [];
  let treinadorId = null;

  try {
    if (supabase) {
      treinadorId = await getOrCreateDefaultTreinador(supabase);
      if (targetTokens.length === 0 && audience) {
        matchedAlunos = await resolveAudienceAlunos(supabase, treinadorId, audience);
        targetTokens = matchedAlunos.filter((a) => a.push_token).map((a) => a.push_token);
      }

      await supabase.from('notificacoes').insert({
        treinador_id: treinadorId,
        aluno_id: matchedAlunos.length === 1 ? matchedAlunos[0].id : null,
        audience: audience || null,
        titulo: title,
        corpo: body,
        tipo: type || 'aviso',
      });
    }

    if (targetTokens.length === 0) {
      res.status(200).json({ warning: 'Nenhum token de destino (aluno ainda não ativou push, ou Supabase não configurado).' });
      return;
    }

    const response = await admin.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens: targetTokens,
    });
    res.status(200).json({ success: true, sent: response.successCount, failed: response.failureCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
