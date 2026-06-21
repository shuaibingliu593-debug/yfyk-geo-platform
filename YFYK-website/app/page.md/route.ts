import { NextResponse } from "next/server";
import { homeContent } from "@/lib/content/home";
import { ContentTransformer } from "@/lib/markdown/ContentTransformer";

export async function GET() {
  return new NextResponse(ContentTransformer.toMarkdown(homeContent), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Version": homeContent.metadata.version,
      "X-AI-Optimized-Content": "true",
      "Vary": "Accept",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
