import { PageShell } from "@/components/admin/page-shell";
import { NewsClient } from "./news-client";

export default function NewsPage() {
  return (
    <PageShell path="/admin/content/news">
      <NewsClient />
    </PageShell>
  );
}
