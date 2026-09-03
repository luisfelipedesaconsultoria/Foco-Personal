// Chaves públicas do Firebase — seguras por design (o controle de acesso vive
// nas regras do próprio Firebase, não no sigilo dessas chaves). Vêm de env
// vars do Vite (VITE_FIREBASE_*), configuradas no provedor de deploy.
// Sem elas configuradas, o app inteiro roda em modo demonstração.

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const FIREBASE_CONFIGURED = !!firebaseConfig.apiKey;

export const firebaseApp = FIREBASE_CONFIGURED
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const auth = FIREBASE_CONFIGURED ? getAuth(firebaseApp) : null;
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
export { firebaseConfig };
