import { PageShell } from "@/components/admin/page-shell";
import { LeadsClient } from "./leads-client";

export default function LeadsPage() {
  return (
    <PageShell path="/admin/leads">
      <LeadsClient />
    </PageShell>
  );
}
