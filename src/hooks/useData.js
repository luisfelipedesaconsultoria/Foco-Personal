import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { apiGet, apiPost } from "../lib/api";
import { demoAlunos, demoPeriodos, demoNotificacoes, demoPagamentos, demoHRSessions } from "../lib/demoData";

function useResource(demoValue, fetcher, deps) {
  const { isDemo } = useAuth();
  const [data, setData] = useState(isDemo ? demoValue : null);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (isDemo) {
      setData(demoValue);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

export function useAlunos() {
  const r = useResource(demoAlunos, async () => (await apiGet("/api/alunos")).alunos, []);
  return r;
}

export function usePeriodos(alunoId) {
  return useResource(
    demoPeriodos,
    async () => (await apiGet(`/api/periodos${alunoId ? `?alunoId=${alunoId}` : ""}`)).periodos,
    [alunoId]
  );
}

export function useNotificacoes() {
  return useResource(demoNotificacoes, async () => (await apiGet("/api/notificacoes")).notificacoes, []);
}

export function usePagamentos() {
  const { isDemo, role } = useAuth();
  return useResource(
    role === "treinador" ? [] : demoPagamentos,
    async () => {
      const res = await apiGet("/api/pagamentos");
      return role === "treinador" ? res.pendencias : res.pagamentos;
    },
    [role]
  );
}

export function useHRSessions(alunoId) {
  return useResource(
    demoHRSessions,
    async () => (await apiGet(`/api/hr-sessions${alunoId ? `?alunoId=${alunoId}` : ""}`)).sessoes,
    [alunoId]
  );
}

export function useCurtir() {
  const { isDemo } = useAuth();
  return useCallback(
    async (notificacaoId) => {
      if (isDemo) return { curtido: true };
      return apiPost("/api/notificacoes/curtir", { notificacaoId });
    },
    [isDemo]
  );
}

export function useEnviarCheckin() {
  const { isDemo } = useAuth();
  return useCallback(
    async (payload) => {
      if (isDemo) return { success: true };
      return apiPost("/api/checkin", payload);
    },
    [isDemo]
  );
}
