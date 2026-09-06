import { getSiteSettings } from "@/actions/settings";
import SettingsClientManager from "@/components/admin/SettingsClientManager";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsClientManager settings={settings} />;
}
