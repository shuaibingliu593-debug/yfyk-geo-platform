import { PageShell } from "@/components/admin/page-shell";
import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <PageShell path="/admin/settings">
      <SettingsClient />
    </PageShell>
  );
}
