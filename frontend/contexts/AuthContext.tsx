"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_USERS_DB } from "@/mocks/session-user";
import type { LabSessionUser } from "@/types/lab-session";

type AuthStatus = "guest" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: LabSessionUser | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("guest");
  const [currentUser, setCurrentUser] = useState<LabSessionUser | null>(null);

  const login = useCallback((email: string, password: string): string | null => {
    const found = MOCK_USERS_DB.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return "E-mail ou senha incorretos. Tente de novo ou clique em Esqueceu a senha?";
    }
    setCurrentUser(found);
    setStatus("authenticated");
    return null;
  }, []);

  const logout = useCallback(() => {
    setStatus("guest");
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: status === "authenticated" ? currentUser : null,
      login,
      logout,
    }),
    [status, currentUser, login, logout]
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
