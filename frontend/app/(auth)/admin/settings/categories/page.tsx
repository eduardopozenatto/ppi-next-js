import { PageHeader } from "@/components/shared/PageHeader";
import { CategoriesList } from "@/components/admin/settings/CategoriesList";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorias"
        description="Gerencie as categorias usadas para classificar os itens no estoque."
      />
      <CategoriesList />
    </div>
  );
}
