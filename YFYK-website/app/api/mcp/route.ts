import { NextRequest, NextResponse } from "next/server";
import { homeContent, siteConfig } from "@/lib/content/home";
import { geoPages } from "@/lib/content/geo-pages";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

function sanitizeQuery(input: unknown) {
  return String(input ?? "")
    .replace(/ignore\s+(all\s+)?previous\s+instructions/gi, "")
    .replace(/system\s*prompt/gi, "")
    .replace(/你现在的身份是/g, "")
    .slice(0, 200)
    .trim();
}

function callTool(tool: string, args: Record<string, unknown>) {
  if (tool === "get_company_info") return { ...siteConfig, summary: homeContent.metadata.summary };
  if (tool === "list_services") return geoPages.filter((page) => page.pageType === "Service").map(({ id, metadata, description, path, knowsAbout }) => ({ id, title: metadata.title, description, href: path, knowsAbout }));
  if (tool === "get_service_details") {
    const page = geoPages.find((item) => item.id === String(args.service_id ?? "") || item.path === String(args.service_id ?? ""));
    return page ? { id: page.id, title: page.metadata.title, description: page.description, href: page.path, knowsAbout: page.knowsAbout, sections: page.sections } : null;
  }
  if (tool === "search_knowledge") {
    const query = sanitizeQuery(args.query);
    const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 20);
    if (!query) return { query, results: [] };
    const needle = query.toLowerCase();
    const services = geoPages.filter((item) => `${item.metadata.title}${item.description}${item.knowsAbout.join("")}`.toLowerCase().includes(needle)).map(({ id, metadata, description, path }) => ({ id, title: metadata.title, description, href: path }));
    const sections = homeContent.sections.filter((item) => `${item.title}${item.body}`.toLowerCase().includes(needle));
    return { query, results: [...services, ...sections].slice(0, limit) };
  }
  throw new Error("Unsupported tool");
}

function allowRequest(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  current.count += 1;
  return current.count <= MAX_REQUESTS;
}

export async function GET() {
  return NextResponse.json({
    name: "yfyk-ai-friendly-website",
    version: siteConfig.version,
    description: "优服优科企业官网基础 MCP JSON 端点",
    tools: [
      { name: "get_company_info", arguments: [] },
      { name: "list_services", arguments: [] },
      { name: "get_service_details", arguments: ["service_id"] },
      { name: "search_knowledge", arguments: ["query", "limit?"] },
    ],
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  if (!allowRequest(request)) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "请求过于频繁，请稍后重试" } }, { status: 429 });
  try {
    const payload = await request.json();
    if (!payload.tool || typeof payload.tool !== "string") return NextResponse.json({ error: "必须提供有效的 tool 参数" }, { status: 400 });
    const data = callTool(payload.tool, payload.arguments ?? {});
    console.info(JSON.stringify({ event: "mcp_call", tool: payload.tool, success: true, durationMs: Date.now() - startedAt }));
    return NextResponse.json({ success: true, tool: payload.tool, data, version: siteConfig.version });
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求处理失败";
    console.warn(JSON.stringify({ event: "mcp_call", success: false, durationMs: Date.now() - startedAt, message }));
    return NextResponse.json({ error: { code: message === "Unsupported tool" ? "TOOL_NOT_FOUND" : "BAD_REQUEST", message } }, { status: message === "Unsupported tool" ? 404 : 400 });
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
