import { redirect } from "next/navigation";

export default function DiagnosticsPage() {
  redirect("/admin/audit/issues");
}
