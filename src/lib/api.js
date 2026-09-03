import { auth } from "./firebase";

async function authHeader() {
  if (!auth?.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.warning || `Erro ${res.status}`);
  }
  return res.json();
}

export async function apiGet(path) {
  const res = await fetch(path, { headers: await authHeader() });
  return handle(res);
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify(body || {}),
  });
  return handle(res);
}
