import { NextRequest, NextResponse } from "next/server";

const aiCrawlerPattern =
  /GPTBot|ClaudeBot|PerplexityBot|ChatGPT-User|OAI-SearchBot|Google-Extended|Baiduspider|ERNIEBot|YiyanBot|Bytespider|TiantianSpider|AliSpider|Kimibot|MoonshotBot/i;

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const pathname = request.nextUrl.pathname;
  const wantsMarkdown = accept.includes("text/markdown") || aiCrawlerPattern.test(userAgent);
  if (pathname.endsWith(".md") && pathname !== "/page.md") {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${pathname.slice(0, -3)}`;
    return NextResponse.rewrite(url, { headers: { "X-AI-Optimized-Content": "true", Vary: "Accept" } });
  }
  if (wantsMarkdown && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/page.md";
    const response = NextResponse.rewrite(url);
    response.headers.set("X-AI-Optimized-Content", "true");
    response.headers.set("Vary", "Accept");
    return response;
  }
  if (wantsMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("X-AI-Optimized-Content", "true");
    response.headers.set("Vary", "Accept");
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  return response;
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|llms.txt|page.md|sitemap.xml|ai-sitemap.xml).*)"] };
