"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";

export function SystemSettingsMock() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="max-w-xl space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <span className="text-sm font-medium text-[var(--color-text)]">Modo manutenção</span>
        <input
          type="checkbox"
          checked={maintenance}
          onChange={(e) => setMaintenance(e.target.checked)}
          className="h-5 w-5 rounded border-[var(--color-border)] text-[var(--color-primary)]"
        />
      </label>
      <p className="text-xs text-[var(--color-text-subtle)]">
        Estado apenas local —{" "}
        <code className="rounded bg-[var(--color-bg-subtle)] px-1">TODO: PATCH /api/admin/settings</code>
      </p>
      <Button type="button" variant="secondary" onClick={() => setMaintenance(false)}>
        Repor pré-definições
      </Button>
    </div>
  );
}
