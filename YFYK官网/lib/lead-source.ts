import type { ReactNode } from "react";

const PAGE_TITLE_MAP: Record<string, string> = {
  "/": "首页",
  "/contact": "联系我们",
  "/geo-native-website": "GEO原生建站",
  "/ai-friendly-upgrade": "老网站AI友好度升级",
  "/enterprise-knowledge-base": "企业知识库工程",
  "/faq": "常见问题",
  "/cases": "案例中心",
  "/news": "资讯动态",
  "/services": "服务概览",
};

const PAGE_SOURCE_MODULE_MAP: Record<string, string> = {
  "/": "home-cta",
  "/contact": "contact-page-cta",
  "/geo-native-website": "geo-native-website-cta",
  "/ai-friendly-upgrade": "ai-friendly-upgrade-cta",
  "/enterprise-knowledge-base": "enterprise-knowledge-base-cta",
  "/faq": "faq-cta",
  "/cases": "cases-center-cta",
  "/news": "news-list-cta",
};

export type LeadSourceMeta = {
  sourceModule: string;
  sourceButtonText?: string;
};

export function inferSourceModule(pathname: string, explicit?: string): string {
  if (explicit?.trim()) return explicit.trim();
  if (pathname.startsWith("/cases/")) return "case-detail-cta";
  if (pathname.startsWith("/news/")) return "news-detail-cta";
  return PAGE_SOURCE_MODULE_MAP[pathname] ?? "generic-cta";
}

export function resolveSourcePageTitle(pathname: string): string {
  if (typeof document !== "undefined" && document.title.trim()) {
    const title = document.title.trim();
    const separator = title.indexOf("｜");
    if (separator > 0) return title.slice(0, separator).trim();
    const dash = title.indexOf(" - ");
    if (dash > 0) return title.slice(0, dash).trim();
    return title;
  }
  return PAGE_TITLE_MAP[pathname] ?? pathname;
}

export function extractButtonLabel(children: ReactNode): string {
  const parts: string[] = [];

  const walk = (node: ReactNode) => {
    if (node == null || typeof node === "boolean") return;
    if (typeof node === "string" || typeof node === "number") {
      parts.push(String(node));
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object" && "props" in node) {
      walk((node as { props: { children?: ReactNode } }).props.children);
    }
  };

  walk(children);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
