import { PageShell } from "@/components/admin/page-shell";
import { FaqsClient } from "./faqs-client";

export default function FaqsPage() {
  return (
    <PageShell path="/admin/content/faqs">
      <FaqsClient />
    </PageShell>
  );
}
