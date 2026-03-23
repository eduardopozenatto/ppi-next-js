"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import { formatDate } from "@/lib/utils";
import { MOCK_ADMIN_USERS } from "@/mocks/users";
import { MOCK_TAGS } from "@/mocks/settings";
import type { User } from "@/types/user";

// TODO: substituir por chamada real quando backend estiver pronto

const EMPTY_USER: Omit<User, "id" | "createdAt"> = {
  name: "", email: "", role: "user", matricula: "", tagId: "tag-1", isActive: false,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [formModal, setFormModal] = useState<{ mode: "create" | "edit"; user: Omit<User, "id" | "createdAt"> & { id?: string } } | null>(null);
  const [deleteModal, setDeleteModal] = useState<User | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.matricula ?? "").includes(search);
    const matchTag = filterTag === "all" || u.tagId === filterTag;
    return matchSearch && matchTag;
  });

  function getTagName(tagId?: string) {
    return MOCK_TAGS.find((t) => t.id === tagId)?.name ?? "—";
  }
  function getTagColor(tagId?: string) {
    return MOCK_TAGS.find((t) => t.id === tagId)?.color ?? "#888";
  }

  function toggleStatus(userId: string) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
  }

  function handleSave() {
    if (!formModal) return;
    const errs: Record<string, string> = {};
    if (!formModal.user.name.trim()) errs.name = "Nome é obrigatório";
    if (!formModal.user.email.trim()) errs.email = "E-mail é obrigatório";
    if (!formModal.user.matricula?.trim()) errs.matricula = "Matrícula é obrigatória";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (formModal.mode === "create") {
      const newUser: User = { ...formModal.user, id: `user-${Date.now()}`, createdAt: new Date().toISOString(), isActive: false };
      setUsers((prev) => [...prev, newUser]);
    } else if (formModal.user.id) {
      setUsers((prev) => prev.map((u) => (u.id === formModal.user.id ? { ...u, ...formModal.user } as User : u)));
    }
    setFormModal(null);
    setErrors({});
  }

  function handleDelete() {
    if (!deleteModal) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
    setDeleteModal(null);
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 ${
      errors[field] ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
    }`;

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie as contas com acesso ao LabControl."
        actions={<Button type="button" onClick={() => setFormModal({ mode: "create", user: { ...EMPTY_USER } })}>+ Novo Usuário</Button>}
      />

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input type="search" placeholder="Buscar por nome, e-mail ou matrícula..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          <option value="all">Todos os perfis</option>
          {MOCK_TAGS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
        <table className="w-full min-w-[50rem] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
            <tr>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden md:table-cell">Desde</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--color-bg-subtle)]/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{u.name}</p>
                      <p className="text-xs text-[var(--color-text-subtle)]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-subtle)]">{u.matricula ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: getTagColor(u.tagId) + "20", color: getTagColor(u.tagId) }}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getTagColor(u.tagId) }} />
                    {getTagName(u.tagId)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleStatus(u.id)} aria-label={u.isActive ? "Desativar" : "Ativar"}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${u.isActive ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition ${u.isActive ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <span className="ml-2 text-xs text-[var(--color-text-subtle)]">{u.isActive ? "Ativo" : "Inativo"}</span>
                </td>
                <td className="hidden px-4 py-3 text-[var(--color-text-subtle)] md:table-cell">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => setFormModal({ mode: "edit", user: { ...u } })} className="rounded p-1.5 text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]" title="Editar">✎</button>
                    <button type="button" onClick={() => setDeleteModal(u)} className="rounded p-1.5 text-[var(--color-danger)] hover:bg-red-50" title="Excluir">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {formModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setFormModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{formModal.mode === "create" ? "Novo Usuário" : "Editar Usuário"}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="user-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Nome Completo *</label>
                <input id="user-name" type="text" value={formModal.user.name} onChange={(e) => setFormModal({ ...formModal, user: { ...formModal.user, name: e.target.value } })} className={inputClass("name")} />
                {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="user-email" className="mb-1 block text-sm font-medium text-[var(--color-text)]">E-mail *</label>
                <input id="user-email" type="email" value={formModal.user.email} onChange={(e) => setFormModal({ ...formModal, user: { ...formModal.user, email: e.target.value } })} className={inputClass("email")} />
                {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="user-matricula" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Matrícula *</label>
                <input id="user-matricula" type="text" value={formModal.user.matricula ?? ""} onChange={(e) => setFormModal({ ...formModal, user: { ...formModal.user, matricula: e.target.value } })} className={inputClass("matricula")} />
                {errors.matricula && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.matricula}</p>}
              </div>
              <div>
                <label htmlFor="user-tag" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Perfil *</label>
                <select id="user-tag" value={formModal.user.tagId ?? "tag-1"} onChange={(e) => setFormModal({ ...formModal, user: { ...formModal.user, tagId: e.target.value } })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  {MOCK_TAGS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => { setFormModal(null); setErrors({}); }}>Cancelar</Button>
              <Button type="button" onClick={handleSave}>{formModal.mode === "create" ? "Cadastrar" : "Salvar"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Confirmar Exclusão</h2>
            <p className="mt-2 text-sm text-[var(--color-text-subtle)]">Tem certeza que deseja excluir o usuário &quot;{deleteModal.name}&quot;? Essa ação não pode ser desfeita.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleDelete} className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">Excluir Usuário</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
