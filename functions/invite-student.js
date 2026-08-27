// Netlify Function (roda em servidor, nunca no navegador).
// Endpoint: /.netlify/functions/invite-student
//
// Usa o mesmo setup de functions/send-notification.js (FIREBASE_SERVICE_ACCOUNT
// como variável de ambiente no Netlify, firebase-admin instalado).
//
// Cria o usuário no Firebase Auth e gera o link de acesso (magic link) que o
// treinador copia e envia manualmente (WhatsApp) pro aluno.

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { nome, email, telefone, tipo } = JSON.parse(event.body || '{}');

  if (!nome || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'nome e email são obrigatórios' }) };
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
      url: process.env.APP_URL || 'https://seu-app.netlify.app',
      handleCodeInApp: true,
    };
    const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

    // TODO: gravar o aluno no Supabase (tabela `alunos`), vinculado ao
    // treinador_id e ao user.uid do Firebase, incluindo telefone e tipo.

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, uid: user.uid, link }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
