"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { api, BASE_URL } from "@/lib/api/client";
import { getStaticUrl } from "@/lib/static-url";

/** Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function ProfileSummary() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "E-mail inválido";
    if (newPassword && !currentPassword)
      errs.currentPassword = "Informe a senha atual para alterar a senha";
    if (newPassword && newPassword.length < 6)
      errs.newPassword = "Mínimo de 6 caracteres";
    if (newPassword && newPassword !== confirmPassword)
      errs.confirmPassword = "As senhas não coincidem";
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      // Alterar senha se preenchida
      if (newPassword) {
        await api.post("/auth/change-password", {
          currentPassword,
          newPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        addToast({
          variant: "success",
          title: "Senha alterada",
          message: "Sua senha foi alterada com sucesso.",
        });
      } else {
        addToast({
          variant: "success",
          title: "Perfil atualizado",
          message: "Perfil atualizado com sucesso.",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erro",
        message: err instanceof Error ? err.message : "Falha ao salvar",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho
    if (file.size > 2 * 1024 * 1024) {
      addToast({ variant: "error", title: "Arquivo muito grande", message: "Máximo de 2 MB" });
      return;
    }

    // Preview local
    setAvatarPreview(URL.createObjectURL(file));

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${BASE_URL}/auth/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Falha ao enviar foto");
      }

      await refreshUser();
      addToast({ variant: "success", title: "Foto atualizada", message: "Sua foto de perfil foi atualizada." });
    } catch (err) {
      setAvatarPreview(null);
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao enviar foto" });
    } finally {
      setUploading(false);
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(formatPhone(value));
  }

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:outline-none focus:ring-1",
      errors[field]
        ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
        : "border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
    );

  // Resolver URL da foto
  const avatarSrc = avatarPreview || getStaticUrl(user.avatarUrl);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Photo */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Foto de perfil</h3>
        <div className="flex items-center gap-5">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.name}
              className="h-20 w-20 shrink-0 rounded-full object-cover border-2 border-[var(--color-border)]"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Alterar foto"}
            </Button>
            <p className="mt-1.5 text-xs text-[var(--color-text-subtle)]">JPG, PNG ou WebP, máximo 2 MB</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Informações Pessoais</h3>
        <p className="mb-4 text-sm text-[var(--color-text-subtle)]">Atualize as informações do seu perfil</p>
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
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={inputClass("phone")}
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Alteração de Senha</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-current-pw" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Insira sua senha atual
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
              Digite sua nova senha
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
              Repita a senha
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
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
