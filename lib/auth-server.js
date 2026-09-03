// Verifica o Firebase ID token de toda requisição autenticada às rotas /api.
// Resolve se quem está chamando é o treinador (bootstrap de um único
// treinador, fase 1) ou um aluno (via alunos.firebase_uid).

const admin = require('firebase-admin');

if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

async function verifyRequestAuth(req, supabase, getOrCreateDefaultTreinador) {
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) {
    const err = new Error('Não autenticado');
    err.status = 401;
    throw err;
  }
  if (!admin.apps.length) {
    const err = new Error('Firebase não configurado no servidor');
    err.status = 500;
    throw err;
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  const treinadorId = await getOrCreateDefaultTreinador(supabase);

  // Fase 1: um único treinador, identificado pelo e-mail de login dele
  // (env var TREINADOR_EMAIL) — não há ainda um papel "treinador" no Firebase.
  const treinadorEmail = process.env.TREINADOR_EMAIL;
  if (treinadorEmail && decoded.email && decoded.email.toLowerCase() === treinadorEmail.toLowerCase()) {
    return { role: 'treinador', treinadorId, uid: decoded.uid };
  }

  const { data: aluno } = await supabase.from('alunos').select('id, treinador_id').eq('firebase_uid', decoded.uid).maybeSingle();
  if (aluno) {
    return { role: 'aluno', treinadorId: aluno.treinador_id, alunoId: aluno.id, uid: decoded.uid };
  }

  const err = new Error('Usuário não encontrado — peça pro seu treinador te cadastrar.');
  err.status = 403;
  throw err;
}

module.exports = { verifyRequestAuth };
