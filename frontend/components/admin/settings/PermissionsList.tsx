"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, TagPermissions, UserPermissionOverride } from "@/types/settings";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/hooks/useAuth";
import { PERMISSION_LABELS } from "./CategoriesList";
import type { User } from "@/types/user";
import { api } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

type UserWithOverrides = User & { permissionOverrides?: UserPermissionOverride[] };

export function PermissionsList() {
  const { addToast } = useToast();
  const { user: sessionUser, updateSessionPermissions } = useAuth();
  
  const [users, setUsers] = useState<UserWithOverrides[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterCustom, setFilterCustom] = useState<"all" | "custom" | "default">("all");
  
  const [editModal, setEditModal] = useState<{
    userId: string;
    userName: string;
    tagId: string;
    overrides: Partial<TagPermissions>;
    originalOverrides: Partial<TagPermissions>;
  } | null>(null);
  const [tagDropdownOpen, setTagDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTagDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchData() {
    try {
      const [usersRes, tagsRes] = await Promise.all([
        // Assuming limit=100 for now to display all, could be paginated
        api.get<PaginatedResponse<UserWithOverrides>>("/users?limit=100"),
        api.get<ApiResponse<Tag[]>>("/tags"),
      ]);
      setUsers(usersRes.data ?? []);
      setTags(tagsRes.data ?? []);
    } catch {
      addToast({ title: "Erro", message: "Falha ao carregar dados", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  const currentUserId = sessionUser?.id?.toString() ?? "";

  function getOverrideCount(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user || !user.permissionOverrides) return 0;
    // user.permissionOverrides should match the current tag
    const ov = user.permissionOverrides.find((o) => o.tagId === user.tagId);
    return ov ? Object.keys(ov.customOverrides).length : 0;
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || u.tagId === filterTag;
    const overrideCount = getOverrideCount(u.id);
    const matchCustom =
      filterCustom === "all" ||
      (filterCustom === "custom" && overrideCount > 0) ||
      (filterCustom === "default" && overrideCount === 0);
    return matchSearch && matchTag && matchCustom;
  });

  function getTagPermission(tagId: string, key: keyof TagPermissions): boolean {
    const tag = tags.find((t) => t.id === tagId);
    return tag ? tag.permissions[key] : false;
  }

  function computeEffectivePermissions(tagId: string, userOverrides: Partial<TagPermissions>): TagPermissions {
    const tag = tags.find((t) => t.id === tagId);
    const base: TagPermissions = tag
      ? { ...tag.permissions }
      : {
          ver_itens: false, pedir_emprestimos: false, ver_notificacoes: false,
          manipular_estoque: false, gerar_relatorios: false, aprovar_emprestimos: false,
          gerenciar_itens: false, gerenciar_usuarios: false, gerenciar_roles: false,
          gerenciar_categorias: false, gerenciar_permissoes: false,
        };
    for (const [key, value] of Object.entries(userOverrides)) {
      if (value !== undefined) {
        base[key as keyof TagPermissions] = value;
      }
    }
    return base;
  }

  function isCurrentSessionUser(userItem: User): boolean {
    return sessionUser?.email?.toLowerCase() === userItem.email.toLowerCase();
  }

  function openEditModal(userId: string, userName: string) {
    const userItem = users.find((u) => u.id === userId);
    if (!userItem) return;
    const tagId = userItem.tagId || (tags[0]?.id ?? "");
    const ov = userItem.permissionOverrides?.find((o) => o.tagId === tagId);
    const currentOverrides = ov ? { ...(ov.customOverrides as Partial<TagPermissions>) } : {};
    
    setEditModal({
      userId,
      userName,
      tagId,
      overrides: { ...currentOverrides },
      originalOverrides: { ...currentOverrides },
    });
  }

  function toggleOverride(key: keyof TagPermissions) {
    if (!editModal) return;

    const userItem = users.find((u) => u.id === editModal.userId);
    if (key === "gerenciar_permissoes" && userItem && isCurrentSessionUser(userItem)) {
      return;
    }

    const current = editModal.overrides;
    const tagDefault = getTagPermission(editModal.tagId, key);

    if (key in current) {
      const { [key]: _, ...rest } = current;
      setEditModal({ ...editModal, overrides: rest });
    } else {
      setEditModal({ ...editModal, overrides: { ...current, [key]: !tagDefault } });
    }
  }

  async function handleSave() {
    if (!editModal) return;

    const originalKeys = Object.keys(editModal.originalOverrides).sort().join(",");
    const newKeys = Object.keys(editModal.overrides).sort().join(",");
    const originalValues = JSON.stringify(editModal.originalOverrides);
    const newValues = JSON.stringify(editModal.overrides);

    if (originalKeys === newKeys && originalValues === newValues) {
      setEditModal(null);
      return;
    }

    try {
      await api.put(`/users/${editModal.userId}/permissions/${editModal.tagId}`, {
        customOverrides: editModal.overrides
      });

      const userItem = users.find((u) => u.id === editModal.userId);
      if (userItem && isCurrentSessionUser(userItem)) {
        const effective = computeEffectivePermissions(editModal.tagId, editModal.overrides);
        updateSessionPermissions(effective);
      }

      addToast({ variant: "success", title: "Permissões atualizadas", message: `As permissões de "${editModal.userName}" foram salvas.` });
      setEditModal(null);
      await fetchData();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao salvar permissões", variant: "error" });
    }
  }

  async function handleChangeTag(userId: string, newTagId: string) {
    const userItem = users.find((u) => u.id === userId);
    if (!userItem) return;

    try {
      await api.put(`/users/${userId}`, { tagId: newTagId });
      
      const userOverrides = userItem.permissionOverrides?.find((o) => o.tagId === newTagId)?.customOverrides ?? {};
      const newTag = tags.find((t) => t.id === newTagId);
      
      if (isCurrentSessionUser(userItem)) {
        const effective = computeEffectivePermissions(newTagId, userOverrides);
        updateSessionPermissions(effective);
      }
      
      addToast({ variant: "success", title: "Tag alterada", message: `Tag alterada para ${newTag?.name || "nova tag"}.` });
      setTagDropdownOpen(null);
      await fetchData();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao alterar tag", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex flex-1 max-w-sm flex-col">
          <span className="sr-only">Buscar por nome ou e-mail</span>
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </label>
        <div className="flex gap-2">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            aria-label="Filtrar por tag"
          >
            <option value="all">Todas as tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            value={filterCustom}
            onChange={(e) => setFilterCustom(e.target.value as "all" | "custom" | "default")}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos</option>
            <option value="custom">Customizado</option>
            <option value="default">Padrão</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text)]">
            <thead className="bg-[var(--color-bg-subtle)] font-medium text-[var(--color-text-subtle)]">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4 text-center">Customizado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-[var(--color-text-subtle)]">Carregando...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-[var(--color-text-subtle)]">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => {
                  const tagId = userItem.tagId || "";
                  const tag = tags.find((t) => t.id === tagId);
                  const overrideCount = getOverrideCount(userItem.id);
                  const isCustomized = overrideCount > 0;

                  return (
                    <tr key={userItem.id} className="transition-colors hover:bg-[var(--color-bg-subtle)]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                            {userItem.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{userItem.name}</div>
                            <div className="text-[var(--color-text-subtle)]">{userItem.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="relative" ref={tagDropdownOpen === userItem.id ? dropdownRef : undefined}>
                          <button
                            type="button"
                            onClick={() => setTagDropdownOpen(tagDropdownOpen === userItem.id ? null : userItem.id)}
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: (tag?.color || "#888") + "20",
                              color: tag?.color || "#888",
                            }}
                            aria-label={`Alterar tag de ${userItem.name}`}
                          >
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag?.color || "#888" }} />
                            {tag?.name || "—"}
                            <span className="text-[10px]">{tagDropdownOpen === userItem.id ? "▲" : "▼"}</span>
                          </button>

                          {tagDropdownOpen === userItem.id && (
                            <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-lg">
                              {tags.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => handleChangeTag(userItem.id, t.id)}
                                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-bg-subtle)] ${
                                    t.id === tagId ? "font-semibold" : ""
                                  }`}
                                >
                                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                                  {t.name}
                                  {t.id === tagId && <span className="ml-auto text-[var(--color-primary)]">✓</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isCustomized ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400">
                            Não
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => openEditModal(userItem.id, userItem.name)}
                        >
                          🛡️ Permissões
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (() => {
        const currentTag = tags.find((t) => t.id === editModal.tagId);
        const userItem = users.find((u) => u.id === editModal.userId);
        const isEditingSelf = userItem ? isCurrentSessionUser(userItem) : false;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditModal(null)}>
            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Permissões de {editModal.userName}</h2>
              <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
                Personalize as permissões desse usuário. Permissões personalizadas sobrescrevem as permissões da tag.
              </p>

              {currentTag && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-subtle)]">Tag atual:</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: (currentTag.color) + "20",
                      color: currentTag.color,
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentTag.color }} />
                    {currentTag.name}
                  </span>
                </div>
              )}

              <div className="mt-5 space-y-2">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                  const permKey = key as keyof TagPermissions;
                  const tagDefault = getTagPermission(editModal.tagId, permKey);
                  const hasOverride = permKey in editModal.overrides;
                  const effectiveValue = hasOverride ? editModal.overrides[permKey]! : tagDefault;
                  const isSelfProtected = isEditingSelf && permKey === "gerenciar_permissoes";

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                        hasOverride
                          ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20"
                          : "border-[var(--color-border)] bg-[var(--color-bg)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${hasOverride ? "text-blue-700 dark:text-blue-300" : "text-[var(--color-text)]"}`}>
                          {label}
                        </span>
                        {hasOverride && (
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                            Customizado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {!hasOverride && (
                          <span className="text-xs text-[var(--color-text-subtle)]">
                            {tagDefault ? "✅ Herdado" : "❌ Herdado"}
                          </span>
                        )}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => !isSelfProtected && toggleOverride(permKey)}
                            disabled={isSelfProtected}
                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                              effectiveValue ? "bg-[var(--color-primary)]" : "bg-gray-300"
                            } ${isSelfProtected ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            aria-label={`Alternar ${label}`}
                            title={isSelfProtected ? "Você não pode remover sua própria permissão de gestão" : undefined}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition ${
                                effectiveValue ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditModal({ ...editModal, overrides: {} })}
                  className="text-sm text-[var(--color-text-subtle)] underline hover:text-[var(--color-text)]"
                >
                  Resetar todos os overrides
                </button>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Button>
                  <Button type="button" onClick={handleSave}>Salvar</Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
