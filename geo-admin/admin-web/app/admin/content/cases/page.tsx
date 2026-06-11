import { PageShell } from "@/components/admin/page-shell";
import { CasesClient } from "./cases-client";

export default function CasesPage() {
  return (
    <PageShell path="/admin/content/cases">
      <CasesClient />
    </PageShell>
  );
}
