import { CatalogSearchBar } from "@/components/inventory/CatalogSearchBar";
import { InventoryCatalogGrid } from "@/components/inventory/InventoryCatalogGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { MOCK_INVENTORY_ITEMS } from "@/mocks/inventory-items";

export default function CatalogPage() {
  return (
    <div>
      <PageHeader
        title="Buscar itens"
        description="Encontre equipamento disponível e solicite empréstimo para o laboratório."
      />
      <CatalogSearchBar />
      <div className="mt-8">
        <InventoryCatalogGrid items={MOCK_INVENTORY_ITEMS} />
      </div>
    </div>
  );
}
