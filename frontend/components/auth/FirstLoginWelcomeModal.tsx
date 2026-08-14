"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { FormCard } from "@/components/Body/FormCard";
import { api, BASE_URL } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/hooks/useAuth";

export function FirstLoginWelcomeModal() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl ? `${process.env.NEXT_PUBLIC_API_URL || "https://labcontrol-backend.onrender.com"}/${user.avatarUrl}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("O tamanho máximo da imagem é de 2 MB.");
        return;
      }
      setError("");
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor, informe seu nome completo.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Por favor, informe um endereço de e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      // 1. Se um arquivo de foto de perfil foi selecionado, faz o upload do avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const res = await fetch(`${BASE_URL}/auth/avatar`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Falha ao enviar a foto de perfil.");
        }
      }

      // 2. Atualiza os dados de contato e desativa mustCompleteProfile
      await api.post("/auth/complete-profile", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      addToast({
        variant: "success",
        title: "Perfil Confirmado!",
        message: "Seus dados foram salvos com sucesso. Seja bem-vindo(a) ao LabControl!",
      });

      // 3. Atualiza a sessão para limpar o modal
      await refreshUser();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Falha ao salvar as informações do perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <FormCard className="my-8 w-full max-w-lg shadow-2xl transition-all">
        <div className="flex w-full flex-col gap-6">
          <div className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-2xl text-[var(--color-primary)]">
              👋
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Boas-vindas ao LabControl!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">
              Sua conta foi criada automaticamente via login institucional (SIGAA/LDAP). Confirme ou atualize suas informações abaixo para facilitar o contato sobre empréstimos e retiradas no laboratório.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            {/* Foto de Perfil */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-bg-subtle)] text-2xl font-bold text-[var(--color-primary)] shadow-sm">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span>{name.trim().charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <label className="cursor-pointer rounded-lg bg-[var(--color-bg-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-border)]">
                {avatarFile ? "Alterar foto selecionada" : "Adicionar foto de perfil"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>

            <Input
              type="text"
              label="Nome Completo"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="email"
              label="E-mail de Contato"
              placeholder="seu.email@aluno.iffarroupilha.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="tel"
              label="Telefone / WhatsApp (Opcional)"
              placeholder="(55) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />

            <Button type="submit" className="mt-2 w-full py-3" disabled={loading}>
              {loading ? "Salvando perfil..." : "Concluir e Acessar o LabControl"}
            </Button>
          </form>
        </div>
      </FormCard>
    </div>
  );
}
