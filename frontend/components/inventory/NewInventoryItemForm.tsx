"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import {
  newInventoryItemSchema,
  type NewInventoryItemFormValues,
} from "@/lib/validations/inventory";

export function NewInventoryItemForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewInventoryItemFormValues>({
    resolver: zodResolver(newInventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      totalQuantity: 0,
      availableQuantity: 0,
    },
  });

  function onSubmit() {
    // TODO: substituir por POST /api/inventory
    router.push("/inventory");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-lg flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm"
    >
      <Input label="Nome do item" {...register("name")} />
      {errors.name ? <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.name.message}</p> : null}

      <Input label="Categoria" placeholder="Ex.: Instrumentação" {...register("category")} />
      {errors.category ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.category.message}</p>
      ) : null}

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Descrição
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25"
          {...register("description")}
        />
      </div>

      <Input
        label="Quantidade total"
        type="number"
        min={0}
        {...register("totalQuantity", { valueAsNumber: true })}
      />
      {errors.totalQuantity ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.totalQuantity.message}</p>
      ) : null}

      <Input
        label="Disponível"
        type="number"
        min={0}
        {...register("availableQuantity", { valueAsNumber: true })}
      />
      {errors.availableQuantity ? (
        <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.availableQuantity.message}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Guardar item
        </Button>
      </div>
    </form>
  );
}
