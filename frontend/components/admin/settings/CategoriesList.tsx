"use client";

import { useState } from "react";
import { MOCK_CATEGORIES } from "@/mocks/settings";
import { Category } from "@/types/settings";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";

const PERMISSION_LABELS: Record<string, string> = {
  viewItems: "Ver itens",
  requestLoans: "Solicitar empréstimos",
  viewNotifications: "Ver notificações",
  viewInventory: "Ver estoque",
  generateReports: "Gerar relatórios",
  approveLoans: "Aprovar empréstimos",
  manageItems: "Gerenciar itens",
  deleteItems: "Excluir itens",
  manageUsers: "Gerenciar usuários",
  manageTags: "Gerenciar tags",
  manageCategories: "Gerenciar categorias",
  managePermissions: "Gerenciar permissões",
};

export { PERMISSION_LABELS };

export function CategoriesList() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState<{ mode: "create" | "edit"; category: { id?: string; name: string } } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);
  const [error, setError] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave() {
    if (!formModal) return;
    if (!formModal.category.name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (formModal.mode === "create") {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formModal.category.name.trim(),
        createdAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCat]);
      addToast({ variant: "success", title: "Categoria criada", message: `"${newCat.name}" foi adicionada com sucesso.` });
    } else if (formModal.category.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === formModal.category.id ? { ...c, name: formModal.category.name.trim() } : c))
      );
      addToast({ variant: "success", title: "Categoria editada", message: `"${formModal.category.name}" foi atualizada.` });
    }
    setFormModal(null);
    setError("");
  }

  function handleDelete() {
    if (!deleteModal) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
    addToast({ variant: "success", title: "Categoria excluída", message: `"${deleteModal.name}" foi removida.` });
    setDeleteModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex flex-1 max-w-sm flex-col">
          <span className="sr-only">Buscar categoria por nome</span>
          <input
            type="search"
            placeholder="Buscar categoria por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </label>
        <Button onClick={() => { setFormModal({ mode: "create", category: { name: "" } }); setError(""); }}>+ Nova categoria</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-[var(--color-text-subtle)]">
            Nenhuma categoria encontrada.
          </p>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 transition-all hover:border-[var(--color-primary)] hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-subtle)] text-lg">
                  📁
                </span>
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--color-text)]">{category.name}</span>
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    Criada em {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <button
                  className="rounded p-1.5 text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
                  title="Editar"
                  onClick={() => { setFormModal({ mode: "edit", category: { id: category.id, name: category.name } }); setError(""); }}
                >
                  ✎
                </button>
                <button
                  className="rounded p-1.5 text-[var(--color-danger)] hover:bg-red-50"
                  title="Excluir"
                  onClick={() => setDeleteModal(category)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {formModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setFormModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {formModal.mode === "create" ? "Nova Categoria" : "Editar Categoria"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
              {formModal.mode === "create" ? "Adicione uma nova categoria de itens." : "Altere o nome da categoria."}
            </p>
            <div className="mt-4">
              <label htmlFor="cat-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Nome *</label>
              <input
                id="cat-name"
                type="text"
                autoFocus
                value={formModal.category.name}
                onChange={(e) => setFormModal({ ...formModal, category: { ...formModal.category, name: e.target.value } })}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 ${
                  error ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => { setFormModal(null); setError(""); }}>Cancelar</Button>
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
              Tem certeza que deseja excluir a categoria &quot;{deleteModal.name}&quot;? Essa ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleDelete} className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Excluir Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
