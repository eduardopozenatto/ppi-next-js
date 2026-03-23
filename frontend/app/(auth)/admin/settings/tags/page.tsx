import { PageHeader } from "@/components/shared/PageHeader";
import { TagsList } from "@/components/admin/settings/TagsList";

export default function AdminTagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags de Acesso"
        description="Gerencie as tags e permissões padrão para cada perfil."
      />
      <TagsList />
    </div>
  );
}
