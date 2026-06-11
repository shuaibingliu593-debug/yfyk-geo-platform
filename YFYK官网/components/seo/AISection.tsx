import type { ReactNode } from "react";

export function AISection({
  id,
  summary,
  version,
  children,
}: {
  id: string;
  summary?: string;
  version: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-ai-chunk={id} data-ai-summary={summary} data-version={version}>
      {children}
    </section>
  );
}
