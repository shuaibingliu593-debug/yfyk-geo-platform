import type { ContentSection, GeoPageContent } from "@/lib/content/types";
import { brandSiteMarkdownSections } from "@/lib/content/brand-site-overview";
import { globalSiteMarkdownSections } from "@/lib/content/global-site-overview";
import { knowledgeSourceMarkdownSections } from "@/lib/content/knowledge-source-overview";
import { upgradeMarkdownSections } from "@/lib/content/upgrade-site-overview";

const commercialMachineOnlySections = new Set([
  "professional-knowledge",
  "defined-terms",
  "public-references",
  "china-compliance",
]);

export function getVisibleSections(page: GeoPageContent): ContentSection[] {
  if (page.path === "/services") {
    return [
      { id: "top", aiChunk: "top", title: "让AI主动找到你、信任你、推荐你", summary: "重点适配国内主流 AI，同时兼容国际模型。", body: "" },
      { id: "core-products", aiChunk: "core-products", title: "核心产品 · 为GEO而生的新一代官网", summary: "从零构建遵循 GEO 标准的 AI 友好型官网。", body: "" },
      { id: "site-upgrade", aiChunk: "site-upgrade", title: "老网站GEO化升级", summary: "以诊断、改造、监测与连接能力完成老网站 GEO 化升级。", body: "" },
      { id: "knowledge-source", aiChunk: "knowledge-source", title: "企业知识库信源构建", summary: "将企业专业沉淀建设为可维护、可深链、可查询的权威信源。", body: "" },
      { id: "service-selector", aiChunk: "service-selector", title: "你是哪一种情况？", summary: "根据企业当前阶段快速选择对应服务板块。", body: "" },
      { id: "frequently-asked-questions", aiChunk: "frequently-asked-questions", title: "常见问题", summary: "回答 GEO、国内 AI 优先级和默认适配范围。", body: "" },
      { id: "contact-cta", aiChunk: "contact-cta", title: "预约免费咨询", summary: "通过联系页沟通项目范围并获取 GEO 服务概览。", body: "" },
    ];
  }
  if (page.path === "/services/products/ai-brand-site") return brandSiteMarkdownSections;
  if (page.path === "/services/products/ai-global-site") return globalSiteMarkdownSections;
  if (page.path === "/services/upgrade") return upgradeMarkdownSections;
  if (page.path === "/services/knowledge-source") return knowledgeSourceMarkdownSections;
  if (page.path.startsWith("/services/")) {
    const hiddenServiceSections = new Set(["industry-pain-points", "capabilities", "delivery-process", "deliverables"]);
    const journeySection = {
      id: "service-journey",
      aiChunk: "service-journey",
      title: "从问题识别到落地验收",
      summary: "每一类问题都对应明确的实施动作、落地阶段和验收交付物。",
      body: "",
    };
    return [...page.sections.filter((section) => !hiddenServiceSections.has(section.id) && !commercialMachineOnlySections.has(section.id)), journeySection];
  }
  if (page.templateKind === "editorial") return page.sections;
  return page.sections.filter((section) => !commercialMachineOnlySections.has(section.id));
}

export function getMachineOnlySectionIds(page: GeoPageContent): string[] {
  const visibleIds = new Set(getVisibleSections(page).map((section) => section.id));
  return page.sections.filter((section) => !visibleIds.has(section.id)).map((section) => section.id);
}
