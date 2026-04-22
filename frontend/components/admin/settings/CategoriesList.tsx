"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { Category } from "@/types/settings";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";

export const PERMISSION_LABELS: Record<string, string> = {
  ver_itens: "Visualizar itens",
  pedir_emprestimos: "Solicitar empréstimos",
  ver_notificacoes: "Ver notificações",
  manipular_estoque: "Manipular estoque",
  gerar_relatorios: "Gerar relatórios",
  aprovar_emprestimos: "Aprovar empréstimos",
  gerenciar_itens: "Gerenciar itens",
  gerenciar_usuarios: "Gerenciar usuários",
  gerenciar_roles: "Gerenciar tags",
  gerenciar_categorias: "Gerenciar categorias",
  gerenciar_permissoes: "Gerenciar permissões",
};

export { PERMISSION_LABELS as PERMISSION_LABELS_MAP };

export function CategoriesList() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState<{ mode: "create" | "edit"; category: { id?: string; name: string } } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);
  const [error, setError] = useState("");

  async function fetchCategories() {
    try {
      const res = await api.get<ApiResponse<Category[]>>("/categories");
      setCategories(res.data ?? []);
    } catch {
      addToast({ title: "Erro", message: "Falha ao carregar categorias", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCategories(); }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  function isDuplicateName(name: string, excludeId?: string): boolean {
    return categories.some(
      (cat) =>
        cat.name.toLowerCase() === name.trim().toLowerCase() &&
        cat.id !== excludeId
    );
  }

  async function handleSave() {
    if (!formModal) return;
    const trimmedName = formModal.category.name.trim();

    if (!trimmedName) {
      setError("Nome é obrigatório");
      return;
    }

    if (isDuplicateName(trimmedName, formModal.category.id)) {
      addToast({ variant: "error", title: "Categoria duplicada", message: "Já existe uma categoria com este nome." });
      return;
    }

    try {
      if (formModal.mode === "create") {
        await api.post("/categories", { name: trimmedName });
        addToast({ variant: "success", title: "Categoria criada", message: `Categoria "${trimmedName}" criada com sucesso.` });
      } else if (formModal.category.id) {
        await api.put(`/categories/${formModal.category.id}`, { name: trimmedName });
        addToast({ variant: "success", title: "Categoria atualizada", message: `"${trimmedName}" atualizada com sucesso.` });
      }
      setFormModal(null);
      setError("");
      await fetchCategories();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao salvar", variant: "error" });
    }
  }

  async function handleDelete() {
    if (!deleteModal) return;

    if (deleteModal.linkedItemsCount && deleteModal.linkedItemsCount > 0) {
      addToast({
        variant: "error",
        title: "Exclusão bloqueada",
        message: `Não é possível excluir "${deleteModal.name}" pois existem ${deleteModal.linkedItemsCount} item(ns) vinculado(s).`,
      });
      setDeleteModal(null);
      return;
    }

    try {
      await api.del(`/categories/${deleteModal.id}`);
      addToast({ variant: "success", title: "Categoria excluída", message: `"${deleteModal.name}" foi removida com sucesso.` });
      setDeleteModal(null);
      await fetchCategories();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao excluir", variant: "error" });
    }
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
        {loading ? (
          <p className="col-span-full py-8 text-center text-sm text-[var(--color-text-subtle)]">Carregando...</p>
        ) : filteredCategories.length === 0 ? (
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
                    Criada em {category.createdAt ? new Date(category.createdAt).toLocaleDateString("pt-BR") : "—"}
                    {category.linkedItemsCount !== undefined && category.linkedItemsCount > 0 && (
                      <> · {category.linkedItemsCount} item(ns)</>
                    )}
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
              {formModal.mode === "create" ? "Nova categoria" : "Editar categoria"}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
              {formModal.mode === "create" ? "Crie uma nova categoria de itens." : "Edite uma categoria de itens existente."}
            </p>
            <div className="mt-4">
              <label htmlFor="cat-name" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Nome da categoria *</label>
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
              <Button type="button" onClick={handleSave}>{formModal.mode === "create" ? "Salvar" : "Salvar"}</Button>
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
              Tem certeza que deseja excluir &quot;{deleteModal.name}&quot;? Essa ação não pode ser desfeita.
            </p>
            {deleteModal.linkedItemsCount !== undefined && deleteModal.linkedItemsCount > 0 && (
              <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">
                ⚠ Esta categoria possui {deleteModal.linkedItemsCount} item(ns) vinculado(s). A exclusão será bloqueada.
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleDelete} className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
