// Netlify Function (roda em servidor, nunca no navegador).
// Endpoint: /.netlify/functions/send-notification
//
// SETUP NECESSÁRIO (uma vez só):
// 1. No Firebase Console: Project Settings > Service Accounts > Generate new private key.
//    Isso baixa um JSON — NÃO comite esse arquivo no git.
// 2. No painel do Netlify: Site settings > Environment variables, crie:
//    FIREBASE_SERVICE_ACCOUNT = (cole o conteúdo do JSON inteiro, em uma linha)
// 3. `npm install firebase-admin` na raiz do projeto antes do deploy.
//
// Este arquivo já fica pronto pra funcionar assim que os dois passos acima
// forem feitos — não precisa reescrever nada aqui.

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

  const { title, body, audience, scheduledFor, tokens } = JSON.parse(event.body || '{}');

  if (!title || !body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'title e body são obrigatórios' }) };
  }

  // TODO: trocar por consulta real ao banco (Supabase) filtrando por `audience`
  // e retornando os tokens de dispositivo salvos de cada aluno.
  // Por enquanto, aceita uma lista de tokens já resolvida (para testes manuais).
  const targetTokens = tokens || [];

  if (targetTokens.length === 0) {
    return { statusCode: 200, body: JSON.stringify({ warning: 'Nenhum token de destino — configure a consulta ao banco.' }) };
  }

  const message = {
    notification: { title, body },
    tokens: targetTokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sent: response.successCount, failed: response.failureCount }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
