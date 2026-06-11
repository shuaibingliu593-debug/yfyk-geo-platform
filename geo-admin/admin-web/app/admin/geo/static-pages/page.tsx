import { PageShell } from "@/components/admin/page-shell";
import { StaticPagesClient } from "./static-pages-client";

export default function StaticPagesPage() {
  return (
    <PageShell path="/admin/geo/static-pages">
      <StaticPagesClient />
    </PageShell>
  );
}
