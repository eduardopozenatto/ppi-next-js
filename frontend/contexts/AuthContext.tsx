"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api/client";
import type { LabSessionUser, LabUserPermissions } from "@/types/lab-session";
import type { ApiResponse } from "@/types/api";

type AuthStatus = "loading" | "guest" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: LabSessionUser | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    matricula: string,
    password: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  /** Atualiza as permissões do usuário logado (usado pelo admin ao editar permissões/tags) */
  updateSessionPermissions: (permissions: LabUserPermissions) => void;
  /** Atualiza o tag name do usuário logado */
  updateSessionTag: (tagName: string, tagColorClass: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [currentUser, setCurrentUser] = useState<LabSessionUser | null>(null);

  /* ─── Fetch session on mount ────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get<ApiResponse<LabSessionUser>>("/auth/me");
        if (!cancelled) {
          setCurrentUser(res.data);
          setStatus("authenticated");
        }
      } catch {
        // 401 or network error → not logged in (no toast)
        if (!cancelled) {
          setStatus("guest");
        }
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ─── Login ─────────────────────────────────────── */
  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        await api.post<ApiResponse<{ id: number }>>("/auth/login", {
          email,
          password,
        });
        // Fetch full profile after successful login
        const profile =
          await api.get<ApiResponse<LabSessionUser>>("/auth/me");
        setCurrentUser(profile.data);
        setStatus("authenticated");
        return null; // success
      } catch (err) {
        return err instanceof Error
          ? err.message
          : "Erro ao fazer login. Tente novamente.";
      }
    },
    [],
  );

  /* ─── Register ──────────────────────────────────── */
  const register = useCallback(
    async (
      name: string,
      email: string,
      matricula: string,
      password: string,
    ): Promise<string | null> => {
      try {
        await api.post<ApiResponse<{ id: number }>>("/auth/register", {
          name,
          email,
          matricula,
          password,
        });
        return null; // success — frontend expects null on success
      } catch (err) {
        return err instanceof Error
          ? err.message
          : "Erro ao registrar. Tente novamente.";
      }
    },
    [],
  );

  /* ─── Logout ────────────────────────────────────── */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Best-effort — clear local state regardless
    }
    setStatus("guest");
    setCurrentUser(null);
  }, []);

  /* ─── Session helpers ───────────────────────────── */
  const updateSessionPermissions = useCallback(
    (permissions: LabUserPermissions) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return { ...prev, userPermissions: permissions };
      });
    },
    [],
  );

  const updateSessionTag = useCallback(
    (tagName: string, tagColorClass: string) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return { ...prev, tag: { name: tagName, colorClass: tagColorClass } };
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: status === "authenticated" ? currentUser : null,
      login,
      register,
      logout,
      updateSessionPermissions,
      updateSessionTag,
    }),
    [
      status,
      currentUser,
      login,
      register,
      logout,
      updateSessionPermissions,
      updateSessionTag,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
