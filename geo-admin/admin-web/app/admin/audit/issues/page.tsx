import { PageShell } from "@/components/admin/page-shell";
import { AuditIssuesClient } from "./audit-issues-client";

export default function AuditIssuesPage() {
  return (
    <PageShell path="/admin/audit/issues">
      <AuditIssuesClient />
    </PageShell>
  );
}
