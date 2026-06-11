import Link from "next/link";

const terms: Record<string, string> = {
  GEO: "geo",
  SSOT: "ssot",
  "JSON-LD": "json-ld",
  MCP: "mcp",
  canonical: "canonical",
  sitemap: "sitemap",
  ICP备案: "icp-record",
  数据跨境: "cross-border-data",
};

export function TermLink({ term }: { term: keyof typeof terms }) {
  return <Link className="term-link" href={`/glossary#${terms[term]}`}>{term}</Link>;
}
