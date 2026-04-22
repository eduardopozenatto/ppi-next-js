"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/settings";
import {
  newInventoryItemSchema,
  type NewInventoryItemFormValues,
} from "@/lib/validations/inventory";

export function NewInventoryItemForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await api.get<ApiResponse<Category[]>>("/categories");
        setCategories(res.data ?? []);
      } catch {
        addToast({ title: "Erro", message: "Falha ao carregar categorias", variant: "error" });
      }
    }
    loadCats();
  }, [addToast]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewInventoryItemFormValues>({
    resolver: zodResolver(newInventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      totalQuantity: 0,
      availableQuantity: 0,
      image: "",
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setValue("image", dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImagePreview(null);
    setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: NewInventoryItemFormValues) {
    setIsSubmitting(true);
    try {
      const cat = categories.find((c) => c.name === data.category);
      if (!cat) throw new Error("Categoria não encontrada.");

      await api.post("/inventory", {
        name: data.name,
        description: data.description || "",
        categoryId: cat.id,
        quantity: data.totalQuantity,
        availableQuantity: data.availableQuantity,
        image: data.image || null,
        isActive: true,
      });

      addToast({ title: "Criado", message: "Item salvo no estoque.", variant: "success" });
      router.push("/inventory");
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao salvar item", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-lg flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm"
    >
      <Input label="Nome do item" {...register("name")} />
      {errors.name ? <p className="-mt-3 text-sm text-[var(--color-danger)]">{errors.name.message}</p> : null}

      {/* Categoria — select com as categorias cadastradas */}
      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Categoria
        </label>
        <select
          id="category"
          {...register("category")}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
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

      {/* Imagem do item */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Imagem do item
        </label>
        <div className="flex flex-col gap-3">
          {imagePreview ? (
            <div className="relative flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src={imagePreview}
                  alt="Preview do item"
                  fill
                  className="object-contain p-1"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-sm text-[var(--color-text-subtle)]">Imagem selecionada</p>
                <button
                  type="button"
                  onClick={removeImage}
                  className="self-start rounded-lg border border-[var(--color-danger)] px-3 py-1.5 text-xs font-semibold text-[var(--color-danger)] transition-colors hover:bg-red-50"
                >
                  Remover imagem
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-8 text-sm text-[var(--color-text-subtle)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <span className="text-2xl">📷</span>
              <span>Clique para selecionar uma imagem</span>
              <span className="text-xs">PNG, JPG ou WEBP — máx. 5 MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Selecionar imagem do item"
          />
        </div>
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
