import { NewInventoryItemForm } from "@/components/inventory/NewInventoryItemForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewInventoryPage() {
  return (
    <div>
      <PageHeader
        title="Novo item no estoque"
        description="Registe material recebido ou atualizado no inventário do laboratório."
      />
      <NewInventoryItemForm />
    </div>
  );
}
