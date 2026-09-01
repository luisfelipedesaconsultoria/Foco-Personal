// Vercel Serverless Function — Endpoint: /api/save-push-token
// Chamado pelo app.js depois que o aluno ativa push (setupPush()) e recebe
// o token do FCM. Verifica o ID token do Firebase Auth do aluno logado
// (nunca confia num aluno_id mandado direto pelo cliente) e salva o token
// de push na linha correspondente em `alunos`.

const admin = require('firebase-admin');
const { getSupabaseAdmin } = require('../lib/supabase-admin');

if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(200).json({ warning: 'Supabase ainda não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes).' });
    return;
  }

  const { idToken, token } = req.body || {};
  if (!idToken || !token) {
    res.status(400).json({ error: 'idToken e token são obrigatórios' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { error } = await supabase.from('alunos').update({ push_token: token }).eq('firebase_uid', decoded.uid);
    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido: ' + err.message });
  }
};
