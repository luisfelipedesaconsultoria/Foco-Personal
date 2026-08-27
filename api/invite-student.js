// Vercel Serverless Function — mesma lógica de functions/invite-student.js
// (versão Netlify, mantida para referência/portabilidade), adaptada para
// o formato de function do Vercel. Endpoint real: /api/invite-student
// (o front-end chama /.netlify/functions/invite-student, que o
// vercel.json reescreve para cá — não foi preciso mexer no app.js).

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

  const { nome, email } = req.body || {};

  if (!nome || !email) {
    res.status(400).json({ error: 'nome e email são obrigatórios' });
    return;
  }

  try {
    let user;
    try {
      user = await admin.auth().createUser({ email, displayName: nome });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        user = await admin.auth().getUserByEmail(email);
      } else {
        throw err;
      }
    }

    const actionCodeSettings = {
      url: process.env.APP_URL || `https://${req.headers.host}`,
      handleCodeInApp: true,
    };
    const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

    // TODO: gravar o aluno no Supabase (tabela `alunos`), vinculado ao
    // treinador_id e ao user.uid do Firebase, incluindo telefone e tipo.

    res.status(200).json({ success: true, uid: user.uid, link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
