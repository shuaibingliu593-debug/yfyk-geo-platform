import { PageShell } from "@/components/admin/page-shell";
import { AuditPagesClient } from "./audit-pages-client";

export default function AuditPagesPage() {
  return (
    <PageShell path="/admin/audit/pages">
      <AuditPagesClient />
    </PageShell>
  );
}
