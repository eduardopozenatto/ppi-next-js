"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryListItem } from "@/types/lab-inventory";
import { newLoanSchema, type NewLoanFormValues } from "@/lib/validations/loan";
import { cn } from "@/lib/utils";

export function NewLoanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetItem = searchParams.get("item") ?? "";
  
  const [inventoryOptions, setInventoryOptions] = useState<LabInventoryListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await api.get<ApiResponse<LabInventoryListItem[]>>("/inventory");
        setInventoryOptions(res.data ?? []);
      } catch {
        addToast({ title: "Erro", message: "Falha ao carregar itens de estoque", variant: "error" });
      }
    }
    loadItems();
  }, [addToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewLoanFormValues>({
    resolver: zodResolver(newLoanSchema),
    defaultValues: {
      borrowerName: "",
      borrowerEmail: "",
      itemId: presetItem,
      quantity: 1,
      dueDate: "",
      notes: "",
    },
  });

  async function onSubmit(data: NewLoanFormValues) {
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
        <select
          id="itemId"
          className={cn(
            "min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm",
            "focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25"
          )}
          {...register("itemId")}
        >
          <option value="">Selecione…</option>
          {inventoryOptions.map((item) => (
            <option key={item.id} value={item.id} disabled={item.availableQuantity < 1}>
              {item.name} ({item.availableQuantity} disp.)
            </option>
          ))}
        </select>
        {errors.itemId ? (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.itemId.message}</p>
        ) : null}
      </div>

      <Input label="Nome do solicitante" placeholder="Nome completo" {...register("borrowerName")} />
      {errors.borrowerName ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.borrowerName.message}</p>
      ) : null}

      <Input label="E-mail" type="email" placeholder="email@instituicao.br" {...register("borrowerEmail")} />
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
        <Button type="submit" variant="primary">
          Submeter pedido
        </Button>
      </div>
    </form>
  );
}
