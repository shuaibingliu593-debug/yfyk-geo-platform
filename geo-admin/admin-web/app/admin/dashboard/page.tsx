import { PageShell } from "@/components/admin/page-shell";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <PageShell path="/admin/dashboard">
      <DashboardClient />
    </PageShell>
  );
}
