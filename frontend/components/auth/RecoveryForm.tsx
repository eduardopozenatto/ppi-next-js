"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { FormCard } from "@/components/Body/FormCard";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";

type Step = "email" | "code" | "newPassword";

export function RecoveryForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Informe seu e-mail");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post<ApiResponse<{ devCode?: string }>>("/auth/forgot-password", { email });
      setStep("code");
      addToast({ variant: "success", title: "Código enviado", message: "Verifique sua caixa de entrada." });
      
      if (res.data?.devCode) {
        addToast({ variant: "info", title: "Ambiente de Teste", message: "Seu código é: " + res.data.devCode });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar código");
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // Only digits
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Single digit
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newCode.every((d) => d !== "") && index === 5) {
      setStep("newPassword");
    }
  }

  function handleCodeKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        code: code.join(""),
        newPassword,
      });
      addToast({ variant: "success", title: "Senha redefinida", message: "Faça login com sua nova senha." });
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao redefinir senha";
      setError(msg);
      if (msg.includes("expirado") || msg.includes("inválido")) {
        // Voltar para step de email
        setTimeout(() => {
          setStep("email");
          setCode(["", "", "", "", "", ""]);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard className="max-w-md">
      <h2 className="text-center text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
        Recuperação de senha
      </h2>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {(["email", "code", "newPassword"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step === s
                  ? "bg-[var(--color-primary)] text-white"
                  : i < ["email", "code", "newPassword"].indexOf(step)
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                    : "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)]"
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="h-0.5 w-6 bg-[var(--color-border)]" />}
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-[var(--color-danger)]">{error}</p>
      )}

      {/* Step 1: Email */}
      {step === "email" && (
        <form className="flex w-full flex-col gap-5" onSubmit={handleSendCode}>
          <p className="text-center text-sm text-[var(--color-text-subtle)]">
            Informe o e-mail da sua conta para receber um código de verificação.
          </p>
          <Input
            type="email"
            placeholder="seu@email.com"
            label="E-mail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar código"}
          </Button>
          <Link
            href="/login"
            className="text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Voltar ao login
          </Link>
        </form>
      )}

      {/* Step 2: Code */}
      {step === "code" && (
        <div className="flex w-full flex-col gap-5">
          <p className="text-center text-sm text-[var(--color-text-subtle)]">
            Um código de 6 dígitos foi enviado para <strong>{email}</strong>
          </p>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { codeRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                className="h-12 w-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-center text-lg font-bold text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] sm:h-14 sm:w-12"
              />
            ))}
          </div>
          <p className="text-center text-xs text-[var(--color-text-subtle)]">
            O código expira em 15 minutos.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                try {
                  await api.post("/auth/forgot-password", { email });
                  addToast({ variant: "info", title: "Reenviado", message: "Novo código enviado para seu e-mail." });
                  setCode(["", "", "", "", "", ""]);
                  codeRefs.current[0]?.focus();
                } catch {
                  addToast({ variant: "error", title: "Erro", message: "Falha ao reenviar código" });
                }
              }}
            >
              Reenviar código
            </Button>
            <Button type="button" variant="primary" onClick={() => setStep("newPassword")} disabled={code.some((d) => !d)}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: New Password */}
      {step === "newPassword" && (
        <form className="flex w-full flex-col gap-5" onSubmit={handleResetPassword}>
          <p className="text-center text-sm text-[var(--color-text-subtle)]">
            Defina sua nova senha.
          </p>
          <Input
            type="password"
            placeholder="Nova senha"
            label="Nova senha"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirme a senha"
            label="Confirmar senha"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </form>
      )}
    </FormCard>
  );
}
