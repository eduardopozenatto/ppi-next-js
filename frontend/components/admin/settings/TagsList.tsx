"use client";

import { useState } from "react";
import { MOCK_TAGS } from "@/mocks/settings";
import { Tag, TagPermissions } from "@/types/settings";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSION_LABELS } from "./CategoriesList";

const DEFAULT_PERMISSIONS: TagPermissions = {
  ver_itens: false, pedir_emprestimos: false, ver_notificacoes: false,
  manipular_estoque: false, gerar_relatorios: false, aprovar_emprestimos: false,
  gerenciar_itens: false, gerenciar_usuarios: false,
  gerenciar_roles: false, gerenciar_categorias: false, gerenciar_permissoes: false,
};

const PRESET_COLORS = [
  "#0f62fe", "#24a148", "#f1c21b", "#da1e28", "#8a3ffc",
  "#ff832b", "#007d79", "#a56eff", "#005d5d", "#e62573",
];

type FormTag = { id?: string; name: string; color: string; description: string; permissions: TagPermissions };

export function TagsList() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState<{ mode: "create" | "edit"; tag: FormTag } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Tag | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hexInput, setHexInput] = useState("");

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  /** Nome da tag do usuário logado */
  const currentUserTagName = user?.tag?.name?.toLowerCase() ?? "";

  function isDuplicateName(name: string, excludeId?: string): boolean {
    return tags.some(
      (t) => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== excludeId
    );
  }

  function openCreate() {
    const initialColor = PRESET_COLORS[0];
    setFormModal({ mode: "create", tag: { name: "", color: initialColor, description: "", permissions: { ...DEFAULT_PERMISSIONS } } });
    setHexInput(initialColor);
    setErrors({});
  }

  function openEdit(tag: Tag) {
    setFormModal({ mode: "edit", tag: { id: tag.id, name: tag.name, color: tag.color, description: tag.description, permissions: { ...tag.permissions } } });
    setHexInput(tag.color);
    setErrors({});
  }

  function handleColorChange(color: string) {
    if (!formModal) return;
    setFormModal({ ...formModal, tag: { ...formModal.tag, color } });
    setHexInput(color);
  }

  function handleHexInputChange(value: string) {
    setHexInput(value);
    // Auto-apply when valid hex
    if (/^#[0-9a-fA-F]{6}$/.test(value) && formModal) {
      setFormModal({ ...formModal, tag: { ...formModal.tag, color: value } });
    }
  }

  function handleSave() {
    if (!formModal) return;
    const errs: Record<string, string> = {};
    if (!formModal.tag.name.trim()) errs.name = "Nome é obrigatório";
    if (!formModal.tag.description.trim()) errs.description = "Descrição é obrigatória";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Verificação de nome duplicado (case-insensitive)
    if (isDuplicateName(formModal.tag.name, formModal.tag.id)) {
      addToast({
        variant: "error",
        title: "Nome duplicado",
        message: "Já existe uma tag com este nome.",
      });
      return;
    }

    // Aviso ao editar a própria tag do laboratorista logado
    if (
      formModal.mode === "edit" &&
      formModal.tag.name.toLowerCase() === currentUserTagName
    ) {
      const confirm = window.confirm(
        "Atenção: você está editando sua própria tag de acesso. As alterações serão aplicadas imediatamente. Deseja continuar?"
      );
      if (!confirm) return;
    }

    if (formModal.mode === "create") {
      const newTag: Tag = { ...formModal.tag, id: `tag-${Date.now()}`, userCount: 0 };
      setTags((prev) => [...prev, newTag]);
      addToast({ variant: "success", title: "Tag criada", message: `"${newTag.name}" foi adicionada com sucesso.` });
    } else if (formModal.tag.id) {
      setTags((prev) => prev.map((t) => (t.id === formModal.tag.id ? { ...t, ...formModal.tag } as Tag : t)));
      addToast({
        variant: "success",
        title: "Tag atualizada",
        message: `As permissões da tag "${formModal.tag.name}" foram atualizadas com sucesso.`,
      });
    }
    setFormModal(null);
    setErrors({});
  }

  function handleDelete() {
    if (!deleteModal) return;

    // Não pode excluir a própria tag
    if (deleteModal.name.toLowerCase() === currentUserTagName) {
      addToast({
        variant: "error",
        title: "Exclusão bloqueada",
        message: "Você não pode excluir sua própria tag de acesso.",
      });
      setDeleteModal(null);
      return;
    }

    setTags((prev) => prev.filter((t) => t.id !== deleteModal.id));
    addToast({ variant: "success", title: "Tag excluída", message: `"${deleteModal.name}" foi removida com sucesso.` });
    setDeleteModal(null);
  }

  function togglePermission(key: keyof TagPermissions) {
    if (!formModal) return;
    setFormModal({
      ...formModal,
      tag: { ...formModal.tag, permissions: { ...formModal.tag.permissions, [key]: !formModal.tag.permissions[key] } },
    });
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 ${
      errors[field] ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Buscar tag por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        <Button onClick={openCreate}>+ Nova tag</Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-[var(--color-text-subtle)]">Nenhuma tag encontrada.</p>
        ) : (
          filtered.map((tag) => (
            <div key={tag.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} aria-hidden="true" />
                  <h3 className="font-semibold text-[var(--color-text)]">{tag.name}</h3>
                  <span className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-subtle)]">
                    {tag.userCount || 0} usuários
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded p-1 text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
                    title="Editar tag"
                    onClick={() => openEdit(tag)}
                  >
                    ✎
                  </button>
                  <button
                    className="rounded p-1 text-[var(--color-danger)] transition-colors hover:bg-red-50"
                    title="Excluir tag"
                    onClick={() => setDeleteModal(tag)}
                  >
                    🗑
                  </button>
                </div>
              </div>

              <div className="p-5">
                <p className="mb-4 text-sm text-[var(--color-text-subtle)]">{tag.description}</p>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Permissões ativas:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(tag.permissions)
                      .filter(([, active]) => active)
                      .map(([key]) => (
                        <span key={key} className="rounded bg-[var(--color-bg-subtle)] px-2 py-1 text-[var(--color-text-subtle)]">
                          {PERMISSION_LABELS[key] || key}
                        </span>
                      ))}
                    {Object.values(tag.permissions).every((v) => !v) && (
                      <span className="text-[var(--color-text-subtle)] italic">Nenhuma permissão ativa</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {formModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setFormModal(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {formModal.mode === "create" ? "Nova tag" : "Editar tag"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
              {formModal.mode === "create" ? "Configure o perfil de acesso e suas permissões." : "Edite as configurações desta tag."}
            </p>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="tag-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Nome *</label>
                <input id="tag-name" type="text" value={formModal.tag.name}
                  onChange={(e) => setFormModal({ ...formModal, tag: { ...formModal.tag, name: e.target.value } })}
                  className={inputClass("name")} />
                {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="tag-desc" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Descrição *</label>
                <input id="tag-desc" type="text" value={formModal.tag.description}
                  onChange={(e) => setFormModal({ ...formModal, tag: { ...formModal.tag, description: e.target.value } })}
                  className={inputClass("description")} />
                {errors.description && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.description}</p>}
              </div>

              {/* Color */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Cor</label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleColorChange(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        formModal.tag.color === c ? "border-[var(--color-text)] scale-110 ring-2 ring-[var(--color-primary)] ring-offset-2" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Selecionar cor ${c}`}
                    />
                  ))}
                </div>
                {/* Hex input */}
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded-full border border-[var(--color-border)]"
                    style={{ backgroundColor: formModal.tag.color }}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="#000000"
                    maxLength={7}
                    className="w-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm font-mono text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    aria-label="Código hexadecimal da cor"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Permissões</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                    <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[var(--color-border)] px-3 py-2 transition-colors hover:bg-[var(--color-bg-subtle)]">
                      <input
                        type="checkbox"
                        checked={formModal.tag.permissions[key as keyof TagPermissions]}
                        onChange={() => togglePermission(key as keyof TagPermissions)}
                        className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-text)]">{label}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-subtle)]">
                  É permitido salvar uma tag sem permissões ativas (ex.: tag de acesso bloqueado temporário).
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setFormModal(null)}>Cancelar</Button>
              <Button type="button" onClick={handleSave}>{formModal.mode === "create" ? "Criar" : "Salvar"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Confirmar Exclusão</h2>
            <p className="mt-2 text-sm text-[var(--color-text-subtle)]">
              Tem certeza que deseja excluir a tag &quot;{deleteModal.name}&quot;?
            </p>
            {(deleteModal.userCount ?? 0) > 0 && (
              <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">
                ⚠ {deleteModal.userCount} usuário(s) utilizam esta tag. Ao excluir, eles ficarão sem tag base. Deseja continuar?
              </p>
            )}
            {deleteModal.name.toLowerCase() === currentUserTagName && (
              <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">
                🛡️ Esta é sua tag de acesso. A exclusão será bloqueada.
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                {(deleteModal.userCount ?? 0) > 0 ? "Excluir mesmo assim" : "Excluir Tag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
