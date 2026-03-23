import { PageHeader } from "@/components/shared/PageHeader";
import { PermissionsList } from "@/components/admin/settings/PermissionsList";

export default function AdminPermissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissões Individuais"
        description="Gerencie e sobrescreva permissões de usuários específicos."
      />
      <PermissionsList />
    </div>
  );
}
