import { PageShell } from "@/components/admin/page-shell";
import { SchemaClient } from "./schema-client";

export default function GeoSchemaPage() {
  return (
    <PageShell path="/admin/geo/schema">
      <SchemaClient />
    </PageShell>
  );
}
