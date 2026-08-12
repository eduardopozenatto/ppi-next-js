"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { api, BASE_URL } from "@/lib/api/client";
import { getStaticUrl } from "@/lib/static-url";
import { useToast } from "@/components/shared/Toast";
import { Button } from "@/components/Button/Button";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryListItem } from "@/types/lab-inventory";
import type { Category } from "@/types/settings";

type EditableItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  availableQuantity: number;
  categoryId: string;
  image: string;
  isActive: boolean;
};

export function InventoryManagementTable() {
  const [rows, setRows] = useState<LabInventoryListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<EditableItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<LabInventoryListItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  async function fetchItems() {
    try {
      const [invRes, catRes] = await Promise.all([
        api.get<ApiResponse<LabInventoryListItem[]>>("/inventory?limit=100&includeInactive=true"),
        api.get<ApiResponse<Category[]>>("/categories"),
      ]);
      setRows(invRes.data ?? []);
      setCategories(catRes.data ?? []);
    } catch (err) {
      addToast({ title: "Erro", message: "Falha ao carregar estoque", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchItems(); }, []);

  function openEditModal(item: LabInventoryListItem) {
    const cat = categories.find((c) => c.name === item.category);
    setEditModal({
      id: item.id,
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      availableQuantity: item.availableQuantity,
      categoryId: cat?.id ?? "",
      image: item.image,
      isActive: item.isActive,
    });
    setImageFile(null);
    setImagePreview(getStaticUrl(item.image));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast({ variant: "error", title: "Arquivo grande", message: "Máximo 5 MB" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSaveEdit() {
    if (!editModal) return;
    setSaving(true);
    try {
      // 1. Update the item fields
      await api.put(`/inventory/${editModal.id}`, {
        name: editModal.name,
        description: editModal.description,
        quantity: editModal.quantity,
        availableQuantity: editModal.availableQuantity,
        categoryId: editModal.categoryId || undefined,
        isActive: editModal.isActive,
      });

      // 2. Upload image if one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const resp = await fetch(`${BASE_URL}/inventory/${editModal.id}/image`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.message || "Falha ao enviar imagem");
        }
      }

      addToast({ title: "Atualizado", message: "Item atualizado com sucesso", variant: "success" });
      setEditModal(null);
      setImageFile(null);
      setImagePreview(null);
      await fetchItems();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao atualizar", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleItemStatus(item: LabInventoryListItem) {
    try {
      await api.put(`/inventory/${item.id}`, { isActive: !item.isActive });
      addToast({ title: "Atualizado", message: "Status do item alterado", variant: "success" });
      await fetchItems();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao alterar status", variant: "error" });
    }
  }

  async function handleDelete() {
    if (!deleteModal) return;
    try {
      await api.del(`/inventory/${deleteModal.id}`);
      addToast({ title: "Excluído", message: "Item excluído com sucesso", variant: "success" });
      setDeleteModal(null);
      await fetchItems();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao excluir", variant: "error" });
    }
  }

  const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]";

  return (
    <>
      <div className={cn("overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm")}>
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="hidden px-4 py-3 sm:table-cell">Total</th>
              <th className="px-4 py-3">Disponível</th>
              <th className="px-4 py-3">Emprestados</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-end">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {loading ? (
               <tr><td colSpan={6} className="px-4 py-4 text-center text-[var(--color-text-subtle)]">Carregando...</td></tr>
            ) : rows.length === 0 ? (
               <tr><td colSpan={6} className="px-4 py-4 text-center text-[var(--color-text-subtle)]">Nenhum item encontrado.</td></tr>
            ) : rows.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--color-bg-subtle)]/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={getStaticUrl(item.image) ?? ""}
                        alt={item.name}
                        className="h-8 w-8 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--color-bg-subtle)] text-xs">📦</div>
                    )}
                    <span className="font-medium text-[var(--color-text)]">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-subtle)]">{item.category}</td>
                <td className="hidden px-4 py-3 sm:table-cell">{item.quantity}</td>
                <td className="px-4 py-3">{item.availableQuantity}</td>
                <td className="px-4 py-3">{item.loanedQuantity}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleItemStatus(item)}
                    aria-label={item.isActive ? "Desativar" : "Ativar"}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      item.isActive ? "bg-[var(--color-primary)]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition ${
                        item.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="ml-2 text-xs text-[var(--color-text-subtle)]">
                    {item.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/inventory/${item.id}`}
                      className="rounded p-1.5 text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
                      title="Ver"
                    >👁</Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="rounded p-1.5 text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
                      title="Editar"
                    >✎</button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal(item)}
                      className="rounded p-1.5 text-[var(--color-danger)] hover:bg-red-50"
                      title="Excluir"
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setEditModal(null); setImageFile(null); setImagePreview(null); }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Editar Item</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Nome *</label>
                <input type="text" value={editModal.name} onChange={(e) => setEditModal({ ...editModal, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Descrição</label>
                <textarea rows={3} value={editModal.description} onChange={(e) => setEditModal({ ...editModal, description: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Categoria</label>
                <select value={editModal.categoryId} onChange={(e) => setEditModal({ ...editModal, categoryId: e.target.value })} className={inputClass}>
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Quantidade Total</label>
                  <input type="number" min={0} value={editModal.quantity} onChange={(e) => setEditModal({ ...editModal, quantity: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Disponível</label>
                  <input type="number" min={0} value={editModal.availableQuantity} onChange={(e) => setEditModal({ ...editModal, availableQuantity: Number(e.target.value) })} className={inputClass} />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Imagem</label>
                {imagePreview ? (
                  <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="self-start text-sm font-semibold text-[var(--color-primary)] hover:underline">
                        Trocar imagem
                      </button>
                      {imageFile && (
                        <button type="button" onClick={() => { setImagePreview(getStaticUrl(editModal.image)); setImageFile(null); }} className="self-start text-sm font-semibold text-[var(--color-danger)] hover:underline">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-6 text-sm text-[var(--color-text-subtle)] transition-colors hover:border-[var(--color-primary)]"
                  >
                    <span className="text-2xl">📷</span>
                    <span>Clique para selecionar</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--color-text)]">Ativo</label>
                <button
                  type="button"
                  onClick={() => setEditModal({ ...editModal, isActive: !editModal.isActive })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${editModal.isActive ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition ${editModal.isActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => { setEditModal(null); setImageFile(null); setImagePreview(null); }}>Cancelar</Button>
              <Button type="button" onClick={handleSaveEdit} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Excluir Item</h2>
            <p className="mt-2 text-sm text-[var(--color-text-subtle)]">
              Tem certeza que deseja excluir permanentemente &quot;{deleteModal.name}&quot;? Esta ação removerá o item fisicamente do banco de dados e só é possível se não houver empréstimos vinculados a ele.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleDelete} className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
