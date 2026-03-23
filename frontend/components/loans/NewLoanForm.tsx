"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { newLoanSchema, type NewLoanFormValues } from "@/lib/validations/loan";
import { MOCK_INVENTORY_ITEMS } from "@/mocks/inventory-items";
import { cn } from "@/lib/utils";

export function NewLoanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetItem = searchParams.get("item") ?? "";

  const inventoryOptions = Object.values(MOCK_INVENTORY_ITEMS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewLoanFormValues>({
    resolver: zodResolver(newLoanSchema),
    defaultValues: {
      borrowerName: "",
      borrowerEmail: "",
      itemId: presetItem && inventoryOptions.some((i) => i.id === presetItem) ? presetItem : "",
      quantity: 1,
      dueDate: "",
      notes: "",
    },
  });

  function onSubmit() {
    // TODO: substituir por POST /api/loans
    router.push("/loans");
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
