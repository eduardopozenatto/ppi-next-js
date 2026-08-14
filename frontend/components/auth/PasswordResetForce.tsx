"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { FormCard } from "@/components/Body/FormCard";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/hooks/useAuth";

export function PasswordResetForce() {
  const { refreshUser } = useAuth();
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: newPassword,
        newPassword,
      });

      addToast({
        variant: "success",
        title: "Senha atualizada",
        message: "Sua senha foi redefinida com sucesso. Bem-vindo(a)!",
      });

      // Recarrega o usuário para limpar a flag mustChangePassword da sessão
      await refreshUser();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Falha ao redefinir a senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-[var(--color-bg)] via-azure-50 to-azure-100 px-4 py-8 sm:px-6 md:py-12">
      <FormCard className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Primeiro Acesso
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-subtle)]">
              Para a sua segurança, você deve alterar a senha temporária fornecida antes de continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            <Input
              type="password"
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir Senha"}
            </Button>
          </form>
        </div>
      </FormCard>
    </main>
  );
}
