// Service worker que recebe o push mesmo com o app fechado/em segundo plano.
// Precisa ficar na RAIZ do domínio publicado (não dentro de /app ou /static).

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Repetir aqui as mesmas chaves públicas do firebase-config.js
// (o service worker roda isolado e não enxerga o app.js).
firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || payload.data || {};
  self.registration.showNotification(title || "Novo aviso", {
    body: body || "",
    icon: "/icon-192.png",
    badge: "/icon-72.png",
  });
});
