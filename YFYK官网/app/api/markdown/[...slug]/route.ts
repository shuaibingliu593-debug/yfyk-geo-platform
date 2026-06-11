import { NextResponse } from "next/server";
import { resolvePageMarkdownContent } from "@/lib/content/markdown-pages";
import { ContentTransformer } from "@/lib/markdown/ContentTransformer";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const path = `/${(await params).slug.join("/")}`;
  const page = resolvePageMarkdownContent(path);
  if (!page) return new NextResponse("Not Found", { status: 404 });
  return new NextResponse(ContentTransformer.toMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Version": page.metadata.version,
      "X-AI-Optimized-Content": "true",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      Vary: "Accept",
    },
  });
}
