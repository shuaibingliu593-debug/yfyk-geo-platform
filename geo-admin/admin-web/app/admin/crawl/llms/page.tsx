import { PageShell } from "@/components/admin/page-shell";
import { LlmsClient } from "./llms-client";

export default function LlmsManagementPage() {
  return (
    <PageShell path="/admin/crawl/llms">
      <LlmsClient />
    </PageShell>
  );
}
