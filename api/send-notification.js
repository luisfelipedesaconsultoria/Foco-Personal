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

  const { title, body, tokens } = req.body || {};

  if (!title || !body) {
    res.status(400).json({ error: 'title e body são obrigatórios' });
    return;
  }

  // TODO: trocar por consulta real ao banco (Supabase) filtrando por `audience`
  // e retornando os tokens de dispositivo salvos de cada aluno.
  const targetTokens = tokens || [];

  if (targetTokens.length === 0) {
    res.status(200).json({ warning: 'Nenhum token de destino — configure a consulta ao banco.' });
    return;
  }

  try {
    const response = await admin.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens: targetTokens,
    });
    res.status(200).json({ success: true, sent: response.successCount, failed: response.failureCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
