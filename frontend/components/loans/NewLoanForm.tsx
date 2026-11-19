"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryListItem } from "@/types/lab-inventory";
import { newLoanSchema, type NewLoanFormValues } from "@/lib/validations/loan";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function NewLoanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetItem = searchParams.get("item") ?? "";
  
  const [inventory, setInventory] = useState<{
    preset: string;
    options: LabInventoryListItem[];
    presetUnavailable: boolean;
  } | null>(null);
  const inventoryLoading = inventory?.preset !== presetItem;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.tag?.name?.toLowerCase() === "laboratorista" || user?.userPermissions?.aprovar_emprestimos;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewLoanFormValues>({
    resolver: zodResolver(newLoanSchema),
    defaultValues: {
      borrowerName: user?.name ?? "",
      borrowerEmail: user?.email ?? "",
      itemId: "",
      quantity: 1,
      dueDate: "",
      notes: "",
    },
  });

  useEffect(() => {
    let current = true;

    async function loadItems() {
      const listed = await api.get<ApiResponse<LabInventoryListItem[]>>("/inventory")
        .catch(() => null);
      if (!current) return;
      const options = listed?.data ?? [];
      let selected = options.find((item) => item.id === presetItem);

      if (presetItem && !selected) {
        const detail = await api.get<ApiResponse<LabInventoryListItem>>(
          `/inventory/${encodeURIComponent(presetItem)}`,
        ).catch(() => null);
        if (!current) return;
        if (detail?.data?.isActive) {
          selected = detail.data;
          options.unshift(selected);
        }
      }

      const selectedId = selected?.isActive && selected.availableQuantity > 0 ? selected.id : "";
      setInventory({ preset: presetItem, options, presetUnavailable: Boolean(presetItem && !selectedId) });
      setValue("itemId", selectedId);
      if (!listed && !selectedId) {
        addToast({ title: "Erro", message: "Falha ao carregar itens de estoque", variant: "error" });
      }
    }

    void loadItems();
    return () => { current = false; };
  }, [addToast, presetItem, setValue]);

  useEffect(() => {
    if (user) {
      setValue("borrowerName", user.name);
      setValue("borrowerEmail", user.email);
    }
  }, [user, setValue]);

  async function onSubmit(data: NewLoanFormValues) {
    if (inventoryLoading) return;
    setIsSubmitting(true);
    try {
      // O formulário de "Novo Empréstimo Manual" envia borrowerName e borrowerEmail,
      // mas a rota atual do backend usa o sessionUser como borrower por padrão.
      // Se a rota POST /loans exigir auth, ela usa o usuário logado.
      // Aqui mapeamos os campos do form para o formato esperado.
      await api.post("/loans", {
        items: [{ inventoryItemId: data.itemId, quantity: data.quantity }],
        notes: data.notes,
        dueDate: new Date(data.dueDate + "T12:00:00Z").toISOString(),
        borrowerEmail: isAdmin ? data.borrowerEmail : undefined,
      });
      addToast({ title: "Sucesso", message: "Empréstimo registrado com sucesso.", variant: "success" });
      router.push("/loans");
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao registrar empréstimo", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-lg flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm"
    >
      <div>
        <label htmlFor="itemId" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Item do laboratório
        </label>
        <Controller
          name="itemId"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="itemId"
              value={inventoryLoading ? "" : field.value}
              disabled={inventoryLoading}
              className={cn(
                "min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm",
                "focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25"
              )}
            >
              <option value="">{inventoryLoading ? "Carregando itens…" : "Selecione…"}</option>
              {!inventoryLoading && inventory?.options.map((item) => (
                <option key={item.id} value={item.id} disabled={item.availableQuantity < 1}>
                  {item.name} ({item.availableQuantity} disp.)
                </option>
              ))}
            </select>
          )}
        />
        {!inventoryLoading && inventory?.presetUnavailable && (
          <p className="mt-1 text-sm text-[var(--color-text-subtle)]" role="status">
            O item selecionado no catálogo está indisponível. Selecione outro item.
          </p>
        )}
        {errors.itemId ? (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.itemId.message}</p>
        ) : null}
      </div>

      <Input
        label="Nome do solicitante"
        placeholder="Nome completo"
        readOnly={!isAdmin}
        className={cn(!isAdmin && "bg-[var(--color-bg-subtle)] opacity-80 cursor-not-allowed")}
        {...register("borrowerName")}
      />
      {errors.borrowerName ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.borrowerName.message}</p>
      ) : null}

      <Input
        label="E-mail"
        type="email"
        placeholder="email@instituicao.br"
        readOnly={!isAdmin}
        className={cn(!isAdmin && "bg-[var(--color-bg-subtle)] opacity-80 cursor-not-allowed")}
        {...register("borrowerEmail")}
      />
      {errors.borrowerEmail ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.borrowerEmail.message}</p>
      ) : null}

      <Input
        label="Quantidade"
        type="number"
        min={1}
        {...register("quantity", { valueAsNumber: true })}
      />
      {errors.quantity ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.quantity.message}</p>
      ) : null}

      <Input label="Devolução prevista" type="date" {...register("dueDate")} />
      {errors.dueDate ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.dueDate.message}</p>
      ) : null}

      <Input label="Observações (opcional)" placeholder="Finalidade do empréstimo" {...register("notes")} />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={inventoryLoading || isSubmitting}>
          {isSubmitting ? "Enviando..." : "Submeter pedido"}
        </Button>
      </div>
    </form>
  );
}
