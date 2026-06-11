import type { ReactNode } from "react";

export function CiteableBlock({
  id,
  summary,
  version,
  children,
}: {
  id: string;
  summary: string;
  version: string;
  children: ReactNode;
}) {
  return (
    <aside
      aria-label="可引用的内容区块"
      className="geo-citeable"
      data-ai-chunk={id}
      data-citeable="true"
      data-version={version}
      id={id}
    >
      <strong>可引用事实</strong>
      <p>{summary}</p>
      {children}
      <a href={`#${id}`} aria-label="复制或引用此内容的深链">#{id}</a>
    </aside>
  );
}
