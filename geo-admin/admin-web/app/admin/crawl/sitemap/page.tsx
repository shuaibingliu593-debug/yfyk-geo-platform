import { PageShell } from "@/components/admin/page-shell";
import { SitemapClient } from "./sitemap-client";

export default function AiSitemapManagementPage() {
  return (
    <PageShell path="/admin/crawl/sitemap">
      <SitemapClient />
    </PageShell>
  );
}
