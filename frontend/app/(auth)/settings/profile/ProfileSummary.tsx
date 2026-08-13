"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { CollapsibleNotice } from "@/components/shared/CollapsibleNotice";
import { api, BASE_URL } from "@/lib/api/client";
import { getStaticUrl } from "@/lib/static-url";

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
  const [phone, setPhone] = useState(user?.phone ?? "");
  
  // Modais de verificação por código de 6 dígitos
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");

  // Alteração de senha para contas locais
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [savingName, setSavingName] = useState(false);
  const [requestingEmail, setRequestingEmail] = useState(false);
  const [confirmingEmail, setConfirmingEmail] = useState(false);
  const [requestingPhone, setRequestingPhone] = useState(false);
  const [confirmingPhone, setConfirmingPhone] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return null;

  // Uma conta é considerada institucional se possuir matrícula ou e-mail institucional
  const isInstitutional = Boolean(user.matricula || user.email?.includes("@iffarroupilha.edu.br"));

  /* ─── Salvar Nome Completo ─────────────────────────── */
  async function handleSaveName() {
    if (!name.trim() || name.trim().length < 2) {
      addToast({ variant: "error", title: "Nome inválido", message: "Informe um nome válido com no mínimo 2 caracteres." });
      return;
    }

    setSavingName(true);
    try {
      await api.patch("/auth/me", { name: name.trim() });
      await refreshUser();
      addToast({ variant: "success", title: "Nome atualizado", message: "Seu nome foi alterado com sucesso." });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao salvar nome" });
    } finally {
      setSavingName(false);
    }
  }

  /* ─── Solicitar Troca de E-mail ───────────────────── */
  async function handleRequestEmailChange() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({ variant: "error", title: "E-mail inválido", message: "Informe um endereço de e-mail válido." });
      return;
    }

    if (email.trim() === user?.email) {
      addToast({ variant: "info", title: "Sem alterações", message: "O e-mail informado é o mesmo e-mail atual." });
      return;
    }

    setRequestingEmail(true);
    try {
      const res: any = await api.post("/auth/request-email-change", { newEmail: email.trim() });
      setPendingEmail(email.trim());
      setEmailCode("");
      setEmailModalOpen(true);
      
      const devCodeMessage = res?.devCode ? ` [Código DEV: ${res.devCode}]` : "";
      addToast({
        variant: "info",
        title: "Código enviado",
        message: `Código de verificação de 6 dígitos enviado para ${email.trim()}.${devCodeMessage}`,
      });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao enviar código" });
    } finally {
      setRequestingEmail(false);
    }
  }

  /* ─── Confirmar Troca de E-mail com Código ───────── */
  async function handleConfirmEmailChange() {
    if (emailCode.trim().length !== 6) {
      addToast({ variant: "error", title: "Código inválido", message: "Informe o código de 6 dígitos enviado ao seu e-mail." });
      return;
    }

    setConfirmingEmail(true);
    try {
      await api.post("/auth/confirm-email-change", { newEmail: pendingEmail, code: emailCode.trim() });
      await refreshUser();
      setEmailModalOpen(false);
      addToast({ variant: "success", title: "E-mail verificado", message: "Seu e-mail foi alterado e verificado com sucesso." });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Código de verificação inválido ou expirado" });
    } finally {
      setConfirmingEmail(false);
    }
  }

  /* ─── Solicitar Troca de Telefone ─────────────────── */
  async function handleRequestPhoneChange() {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
      addToast({ variant: "error", title: "Telefone inválido", message: "Informe um número de telefone com DDD válido." });
      return;
    }

    if (phone.trim() === user?.phone) {
      addToast({ variant: "info", title: "Sem alterações", message: "O número de telefone informado é o mesmo número atual." });
      return;
    }

    setRequestingPhone(true);
    try {
      const res: any = await api.post("/auth/request-phone-change", { newPhone: phone.trim() });
      setPendingPhone(phone.trim());
      setPhoneCode("");
      setPhoneModalOpen(true);

      const devCodeMessage = res?.devCode ? ` [Código SMS DEV: ${res.devCode}]` : "";
      addToast({
        variant: "info",
        title: "Código SMS enviado",
        message: `Código de verificação enviado para o número ${phone.trim()}.${devCodeMessage}`,
      });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao enviar SMS" });
    } finally {
      setRequestingPhone(false);
    }
  }

  /* ─── Confirmar Troca de Telefone com Código ─────── */
  async function handleConfirmPhoneChange() {
    if (phoneCode.trim().length !== 6) {
      addToast({ variant: "error", title: "Código inválido", message: "Informe o código SMS de 6 dígitos." });
      return;
    }

    setConfirmingPhone(true);
    try {
      await api.post("/auth/confirm-phone-change", { newPhone: pendingPhone, code: phoneCode.trim() });
      await refreshUser();
      setPhoneModalOpen(false);
      addToast({ variant: "success", title: "Telefone verificado", message: "Seu número de telefone foi verificado e salvo." });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Código SMS inválido ou expirado" });
    } finally {
      setConfirmingPhone(false);
    }
  }

  /* ─── Upload de Avatar ────────────────────────────── */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast({ variant: "error", title: "Arquivo muito grande", message: "O tamanho máximo é 2 MB." });
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
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
      addToast({ variant: "success", title: "Foto atualizada", message: "Foto de perfil atualizada com sucesso." });
    } catch (err) {
      setAvatarPreview(null);
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao enviar foto" });
    } finally {
      setUploadingAvatar(false);
    }
  }

  /* ─── Alteração de Senha para Contas Locais ───────── */
  async function handleChangeLocalPassword() {
    if (!currentPassword) {
      addToast({ variant: "error", title: "Campo obrigatório", message: "Informe a senha atual." });
      return;
    }
    if (newPassword.length < 6) {
      addToast({ variant: "error", title: "Senha fraca", message: "A nova senha deve ter no mínimo 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ variant: "error", title: "Senhas não coincidem", message: "A confirmação de senha não coincide." });
      return;
    }

    setChangingPassword(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast({ variant: "success", title: "Senha alterada", message: "Sua senha local foi alterada com sucesso." });
    } catch (err) {
      addToast({ variant: "error", title: "Erro", message: err instanceof Error ? err.message : "Falha ao alterar senha" });
    } finally {
      setChangingPassword(false);
    }
  }

  const avatarSrc = avatarPreview || getStaticUrl(user.avatarUrl);

  return (
    <div className="w-full space-y-6">
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
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? "Enviando..." : "Alterar foto"}
            </Button>
            <p className="mt-1.5 text-xs text-[var(--color-text-subtle)]">JPG, PNG ou WebP, máximo 2 MB</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-semibold text-[var(--color-text)]">Informações Pessoais</h3>
          <p className="mt-0.5 text-sm text-[var(--color-text-subtle)]">Atualize seu nome completo e contatos</p>
        </div>

        {/* Nome */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Nome completo *
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button type="button" onClick={handleSaveName} disabled={savingName} className="sm:w-auto">
            {savingName ? "Salvando..." : "Salvar Nome"}
          </Button>
        </div>

        {/* E-mail */}
        <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="profile-email" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              E-mail * <span className="text-xs font-normal text-[var(--color-text-subtle)]">(Requer código de verificação)</span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button type="button" variant="secondary" onClick={handleRequestEmailChange} disabled={requestingEmail} className="sm:w-auto">
            {requestingEmail ? "Enviando código..." : "Validar Novo E-mail"}
          </Button>
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="profile-phone" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Telefone <span className="text-xs font-normal text-[var(--color-text-subtle)]">(Requer código SMS)</span>
            </label>
            <input
              id="profile-phone"
              type="tel"
              placeholder="(54) 99123-4567"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button type="button" variant="secondary" onClick={handleRequestPhoneChange} disabled={requestingPhone} className="sm:w-auto">
            {requestingPhone ? "Enviando SMS..." : "Validar Telefone"}
          </Button>
        </div>
      </div>

      {/* Password Management */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[var(--color-text)]">Segurança e Senha</h3>

        {isInstitutional ? (
          <CollapsibleNotice title="Autenticação Institucional Ativa (SIGAA / LDAP)">
            <p>
              Sua conta utiliza as credenciais do portal do IFFarroupilha. Qualquer alteração de senha deve ser realizada diretamente no portal da instituição e será sincronizada automaticamente no seu próximo login no LabControl.
            </p>
          </CollapsibleNotice>
        ) : (
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
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
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
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label htmlFor="profile-confirm-pw" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Repita a nova senha
              </label>
              <input
                id="profile-confirm-pw"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <Button type="button" onClick={handleChangeLocalPassword} disabled={changingPassword}>
              {changingPassword ? "Alterando..." : "Alterar Senha Local"}
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de E-mail */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={() => setEmailModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl animate-slide-up" onClick={(e) => e.stopPropagation()} role="dialog">
            <h3 className="text-lg font-bold text-[var(--color-text)]">Confirmar Alteração de E-mail</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-subtle)]">
              Digite o código de 6 dígitos que enviamos para <strong className="text-[var(--color-text)]">{pendingEmail}</strong>:
            </p>
            <div className="mt-4">
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-2xl font-bold tracking-widest rounded-xl border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setEmailModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirmEmailChange} disabled={confirmingEmail}>
                {confirmingEmail ? "Verificando..." : "Confirmar E-mail"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Telefone (SMS) */}
      {phoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={() => setPhoneModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl animate-slide-up" onClick={(e) => e.stopPropagation()} role="dialog">
            <h3 className="text-lg font-bold text-[var(--color-text)]">Confirmar Número de Telefone</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-subtle)]">
              Digite o código SMS de 6 dígitos enviado para <strong className="text-[var(--color-text)]">{pendingPhone}</strong>:
            </p>
            <div className="mt-4">
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-2xl font-bold tracking-widest rounded-xl border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setPhoneModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirmPhoneChange} disabled={confirmingPhone}>
                {confirmingPhone ? "Verificando..." : "Confirmar Telefone"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
