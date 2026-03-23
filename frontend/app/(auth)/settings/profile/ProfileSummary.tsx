"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button/Button";

// TODO: substituir por chamada real quando backend estiver pronto

export function ProfileSummary() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "E-mail inválido";
    if (newPassword && !currentPassword)
      errs.currentPassword = "Informe a senha atual para alterar a senha";
    if (newPassword && newPassword.length < 8)
      errs.newPassword = "Mínimo de 8 caracteres";
    if (newPassword && newPassword !== confirmPassword)
      errs.confirmPassword = "As senhas não coincidem";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // TODO: POST /api/auth/profile
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:outline-none focus:ring-1",
      errors[field]
        ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
        : "border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
    );

  return (
    <div className="max-w-2xl space-y-6">
      {/* Photo */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Foto de perfil</h3>
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <Button type="button" variant="secondary" onClick={() => alert("TODO: Upload de foto")}>
              Alterar foto
            </Button>
            <p className="mt-1.5 text-xs text-[var(--color-text-subtle)]">JPG ou PNG, máximo 2 MB</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Dados pessoais</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Nome completo *
            </label>
            <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass("name")} />
            {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              E-mail *
            </label>
            <input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass("email")} />
            {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="profile-phone" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Telefone
            </label>
            <input
              id="profile-phone"
              type="tel"
              placeholder="(54) 99123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass("phone")}
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Alterar senha</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-current-pw" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Senha atual
            </label>
            <div className="relative">
              <input
                id="profile-current-pw"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass("currentPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.currentPassword}</p>}
          </div>

          <div>
            <label htmlFor="profile-new-pw" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Nova senha
            </label>
            <input
              id="profile-new-pw"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass("newPassword")}
            />
            {errors.newPassword && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="profile-confirm-pw" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Repetir nova senha
            </label>
            <input
              id="profile-confirm-pw"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass("confirmPassword")}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <Button type="button" onClick={handleSave}>
          💾 Salvar alterações
        </Button>
        {saved && (
          <span className="text-sm font-medium text-[var(--color-success)]">Perfil atualizado com sucesso!</span>
        )}
      </div>
    </div>
  );
}
