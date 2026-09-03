import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail, signOut } from "firebase/auth";
import { auth, FIREBASE_CONFIGURED } from "../lib/firebase";
import { apiGet } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // { role, treinador?, aluno? }
  const [loading, setLoading] = useState(true);
  const [demoRole, setDemoRole] = useState(null); // "treinador" | "aluno" | null

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        try {
          setProfile(await apiGet("/api/me"));
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const sendMagicLink = useCallback(async (email) => {
    if (!FIREBASE_CONFIGURED) throw new Error("Firebase ainda não configurado.");
    await sendSignInLinkToEmail(auth, email, { url: window.location.href, handleCodeInApp: true });
    window.localStorage.setItem("loginEmail", email);
  }, []);

  const completeSignIn = useCallback(async () => {
    if (!FIREBASE_CONFIGURED || !isSignInWithEmailLink(auth, window.location.href)) return false;
    let email = window.localStorage.getItem("loginEmail");
    if (!email) email = window.prompt("Confirme seu e-mail para concluir o acesso:");
    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("loginEmail");
    return true;
  }, []);

  const enterDemo = useCallback((role) => setDemoRole(role), []);

  const logout = useCallback(async () => {
    setDemoRole(null);
    if (FIREBASE_CONFIGURED) await signOut(auth);
  }, []);

  const role = demoRole || profile?.role || null;

  return (
    <AuthContext.Provider
      value={{
        loading,
        firebaseUser,
        profile,
        role,
        isDemo: !!demoRole,
        sendMagicLink,
        completeSignIn,
        enterDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
