import { MOCK_STORAGE_CATEGORIES } from "@/mocks/storage-categories";

export function CategoryList() {
  return (
    <ul className="flex w-full flex-col gap-0.5 py-1">
      {MOCK_STORAGE_CATEGORIES.map((category, index) => (
        <li key={`${category}-${index}`}>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-center text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)]"
          >
            {category}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function CategoryPanel() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
        Categorias
      </p>
      <CategoryList />
    </div>
  );
}
