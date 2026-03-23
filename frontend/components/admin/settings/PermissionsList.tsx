"use client";

import { useState } from "react";
import { MOCK_ADMIN_USERS } from "@/mocks/users";
import { MOCK_TAGS, MOCK_PERMISSION_OVERRIDES } from "@/mocks/settings";
import { TagPermissions, UserPermissionOverride } from "@/types/settings";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { PERMISSION_LABELS } from "./CategoriesList";

export function PermissionsList() {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [overrides, setOverrides] = useState<UserPermissionOverride[]>(MOCK_PERMISSION_OVERRIDES);
  const [editModal, setEditModal] = useState<{
    userId: string;
    userName: string;
    tagId: string;
    overrides: Partial<TagPermissions>;
  } | null>(null);

  const filteredUsers = MOCK_ADMIN_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function getOverrideCount(userId: string) {
    const ov = overrides.find((o) => o.userId === userId);
    return ov ? Object.keys(ov.customOverrides).length : 0;
  }

  function openEditModal(userId: string, userName: string) {
    const user = MOCK_ADMIN_USERS.find((u) => u.id === userId);
    const tagId = user?.tagId || "tag-1";
    const existing = overrides.find((o) => o.userId === userId);
    setEditModal({
      userId,
      userName,
      tagId,
      overrides: existing ? { ...existing.customOverrides } : {},
    });
  }

  function getTagPermission(tagId: string, key: keyof TagPermissions): boolean {
    const tag = MOCK_TAGS.find((t) => t.id === tagId);
    return tag ? tag.permissions[key] : false;
  }

  function toggleOverride(key: keyof TagPermissions) {
    if (!editModal) return;
    const current = editModal.overrides;
    const tagDefault = getTagPermission(editModal.tagId, key);

    if (key in current) {
      // Remove override → revert to tag default
      const { [key]: _, ...rest } = current;
      setEditModal({ ...editModal, overrides: rest });
    } else {
      // Add override → toggle from tag default
      setEditModal({ ...editModal, overrides: { ...current, [key]: !tagDefault } });
    }
  }

  function handleSave() {
    if (!editModal) return;
    const hasOverrides = Object.keys(editModal.overrides).length > 0;

    setOverrides((prev) => {
      const withoutCurrent = prev.filter((o) => o.userId !== editModal.userId);
      if (hasOverrides) {
        return [...withoutCurrent, { userId: editModal.userId, tagId: editModal.tagId, customOverrides: editModal.overrides }];
      }
      return withoutCurrent;
    });

    addToast({
      variant: "success",
      title: "Permissões atualizadas",
      message: `As permissões de "${editModal.userName}" foram salvas.`,
    });
    setEditModal(null);
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
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text)]">
            <thead className="bg-[var(--color-bg-subtle)] font-medium text-[var(--color-text-subtle)]">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Tag Atual</th>
                <th className="px-6 py-4 text-center">Customizado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-[var(--color-text-subtle)]">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const tagId = user.tagId || "tag-1";
                  const tag = MOCK_TAGS.find((t) => t.id === tagId);
                  const overrideCount = getOverrideCount(user.id);

                  return (
                    <tr key={user.id} className="transition-colors hover:bg-[var(--color-bg-subtle)]/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-[var(--color-text-subtle)]">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: (tag?.color || "#888") + "20",
                            color: tag?.color || "#888",
                          }}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag?.color || "#888" }} />
                          {tag?.name || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {overrideCount > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                            {overrideCount} override{overrideCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400">
                            Padrão da tag
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => openEditModal(user.id, user.name)}
                        >
                          Permissões
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

      {/* Permission Override Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditModal(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Permissões de {editModal.userName}</h2>
            <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
              Customize as permissões individuais. Itens sem override herdam da tag.
            </p>

            <div className="mt-5 space-y-2">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                const permKey = key as keyof TagPermissions;
                const tagDefault = getTagPermission(editModal.tagId, permKey);
                const hasOverride = permKey in editModal.overrides;
                const effectiveValue = hasOverride ? editModal.overrides[permKey]! : tagDefault;

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
                          Override
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {!hasOverride && (
                        <span className="text-xs text-[var(--color-text-subtle)]">
                          {tagDefault ? "✅ Herdado" : "❌ Herdado"}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleOverride(permKey)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          effectiveValue ? "bg-[var(--color-primary)]" : "bg-gray-300"
                        }`}
                        aria-label={`Alternar ${label}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition ${
                            effectiveValue ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
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
      )}
    </div>
  );
}
