import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileSummary } from "./ProfileSummary";

export default function ProfileSettingsPage() {
  return (
    <div>
      <PageHeader title="Perfil" description="Atualize seus dados pessoais, foto e senha." />
      <ProfileSummary />
    </div>
  );
}
