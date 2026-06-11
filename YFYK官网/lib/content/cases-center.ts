export type CaseCategoryFilter = "all" | "geo-native" | "ai-upgrade" | "knowledge-base";

import type { BaseContent } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";

export interface CaseCenterMetric {
  label: string;
  value: string;
}

export interface CaseCenterItem {
  slug: string;
  category: Exclude<CaseCategoryFilter, "all">;
  coverImage?: string;
  logoPlaceholder: string;
  statusLabel: string;
  industry: string;
  caseType: string;
  title: string;
  description: string;
  metrics: CaseCenterMetric[];
  tone: number;
}

export interface CaseCenterCategory {
  value: CaseCategoryFilter;
  label: string;
}

export interface CaseCenterHeroStat {
  value: string;
  label: string;
  countTo: number;
  suffix: string;
}

export const casesCenterMeta = {
  title: "案例中心｜YFYK GEO项目实践与客户案例",
  description:
    "查看YFYK在GEO原生建站、老网站AI友好度升级和企业知识库工程中的项目实践案例，了解企业如何提升AI可见度、内容结构化能力和知识资产价值。",
  path: "/cases",
};

export const casesCenterHeroStats: CaseCenterHeroStat[] = [
  { value: "50+", label: "项目实践", countTo: 50, suffix: "+" },
  { value: "10+", label: "行业覆盖", countTo: 10, suffix: "+" },
  { value: "95%", label: "项目交付率", countTo: 95, suffix: "%" },
  { value: "100%", label: "定制化实施", countTo: 100, suffix: "%" },
];

export const casesCenterCategories: CaseCenterCategory[] = [
  { value: "all", label: "全部案例" },
  { value: "geo-native", label: "GEO原生建站" },
  { value: "ai-upgrade", label: "网站AI改造" },
  { value: "knowledge-base", label: "企业知识库" },
];

export const casesCenterItems: CaseCenterItem[] = [
  {
    slug: "medical-device-ai-website",
    category: "geo-native",
    logoPlaceholder: "医疗",
    statusLabel: "案例展示",
    industry: "医疗器械",
    caseType: "GEO原生建站",
    title: "某医疗设备企业 AI官网建设项目",
    description:
      "通过 GEO原生架构、AI Summary、FAQ体系与Schema部署，帮助企业构建更容易被AI理解和引用的官网体系。",
    metrics: [
      { label: "AI可读性", value: "92" },
      { label: "Schema覆盖", value: "100%" },
      { label: "交付周期", value: "6周" },
    ],
    tone: 1,
  },
  {
    slug: "industrial-equipment-geo-rebuild",
    category: "geo-native",
    logoPlaceholder: "工业",
    statusLabel: "案例展示",
    industry: "工业制造",
    caseType: "GEO原生建站",
    title: "某工业设备品牌 GEO官网重构项目",
    description:
      "围绕产品参数、应用场景和解决方案内容，重构官网信息架构，提升AI对产品能力的理解效率。",
    metrics: [
      { label: "内容结构化", value: "95%" },
      { label: "FAQ覆盖", value: "80+" },
      { label: "核心页面", value: "18个" },
    ],
    tone: 2,
  },
  {
    slug: "b2b-service-ai-upgrade",
    category: "ai-upgrade",
    logoPlaceholder: "企服",
    statusLabel: "案例展示",
    industry: "企业服务",
    caseType: "网站AI改造",
    title: "某B2B服务企业官网 AI友好度升级",
    description:
      "在不重做官网的前提下，补充AI摘要、JSON-LD、llms.txt和AI Sitemap，提升旧网站的AI可抓取性。",
    metrics: [
      { label: "GEO评分", value: "+36" },
      { label: "结构化页面", value: "24个" },
      { label: "上线周期", value: "4周" },
    ],
    tone: 3,
  },
  {
    slug: "foreign-trade-ai-visibility",
    category: "ai-upgrade",
    logoPlaceholder: "外贸",
    statusLabel: "案例展示",
    industry: "外贸企业",
    caseType: "网站AI改造",
    title: "某外贸独立站 AI可见度升级项目",
    description:
      "针对英文内容、产品目录和认证信息进行语义优化，增强海外AI搜索场景下的企业可见度。",
    metrics: [
      { label: "多语言页面", value: "12个" },
      { label: "产品Schema", value: "60+" },
      { label: "FAQ补全", value: "45条" },
    ],
    tone: 4,
  },
  {
    slug: "saas-knowledge-center",
    category: "knowledge-base",
    logoPlaceholder: "SaaS",
    statusLabel: "案例展示",
    industry: "SaaS企业",
    caseType: "企业知识库",
    title: "某SaaS企业知识中心建设项目",
    description:
      "将分散的产品文档、FAQ、术语和客户问题整理为官网知识中心，形成可持续运营的知识资产体系。",
    metrics: [
      { label: "知识分类", value: "8类" },
      { label: "FAQ沉淀", value: "120条" },
      { label: "术语库", value: "60项" },
    ],
    tone: 5,
  },
  {
    slug: "medtech-terminology-faq",
    category: "knowledge-base",
    logoPlaceholder: "医科",
    statusLabel: "案例展示",
    industry: "医疗科技",
    caseType: "企业知识库",
    title: "某医疗科技企业术语与FAQ体系项目",
    description:
      "围绕专业术语、产品应用和常见问题，建设术语库与FAQ体系，降低AI和客户对专业内容的理解成本。",
    metrics: [
      { label: "术语标准化", value: "80项" },
      { label: "FAQ Schema", value: "100%" },
      { label: "内容覆盖", value: "90%" },
    ],
    tone: 6,
  },
];

export function getCasesByCategory(category: CaseCategoryFilter): CaseCenterItem[] {
  if (category === "all") return casesCenterItems;
  return casesCenterItems.filter((item) => item.category === category);
}

/** 对 API 拉取的案例列表做分类筛选（供客户端 Tab 使用） */
export function filterCasesByCategory(
  items: CaseCenterItem[],
  category: CaseCategoryFilter,
): CaseCenterItem[] {
  if (category === "all") return items;
  return items.filter((item) => item.category === category);
}

export function getCaseCenterItem(slug: string) {
  return casesCenterItems.find((item) => item.slug === slug);
}

export function getCasesCenterPageContent(): BaseContent {
  return {
    id: "cases-center",
    metadata: {
      title: casesCenterMeta.title,
      summary: casesCenterMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "cases-hero",
        aiChunk: "cases-hero",
        title: "案例中心",
        summary: casesCenterMeta.description,
        body: casesCenterHeroStats.map((item) => `${item.value} ${item.label}`).join("\n"),
      },
      {
        id: "cases-browse",
        aiChunk: "cases-browse",
        title: "项目实践案例",
        summary: "按 GEO原生建站、网站AI改造与企业知识库浏览案例。",
        body: casesCenterItems
          .map(
            (item) =>
              `### ${item.title}\n行业：${item.industry}\n类型：${item.caseType}\n${item.description}`,
          )
          .join("\n\n"),
      },
      {
        id: "cases-cta",
        aiChunk: "cases-cta",
        title: "查看更多案例",
        summary: "了解企业如何提升 AI 可见度与知识资产价值。",
        body: "[查看更多案例](/cases/showcase)",
      },
    ],
  };
}
