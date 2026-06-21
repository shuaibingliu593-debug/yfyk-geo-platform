import type { BaseContent } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";

export type FaqCategoryFilter =
  | "all"
  | "geo"
  | "website"
  | "knowledge-base"
  | "ai-search"
  | "mcp";

export type FaqCategory = Exclude<FaqCategoryFilter, "all">;

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  keywords?: string[];
}

export const faqMeta = {
  title: "FAQ中心｜YFYK GEO与AI搜索常见问题",
  description:
    "查看 GEO、AI搜索、企业知识库、官网建设与 MCP 等常见问题，了解企业如何提升 AI 可见度与内容价值。",
  path: "/faq",
};

export const faqCategories: Array<{ value: FaqCategoryFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "geo", label: "GEO" },
  { value: "website", label: "官网建设" },
  { value: "knowledge-base", label: "企业知识库" },
  { value: "ai-search", label: "AI搜索" },
  { value: "mcp", label: "MCP" },
];

export const faqCategoryLabels: Record<FaqCategory, string> = {
  geo: "GEO",
  website: "官网建设",
  "knowledge-base": "企业知识库",
  "ai-search": "AI搜索",
  mcp: "MCP",
};

export const faqHeroTags = [
  "GEO",
  "AI搜索",
  "企业知识库",
  "MCP",
  "官网建设",
];

export interface FaqHeroStackCard {
  label: string;
  question: string;
  answer: string;
}

export const faqHeroStackCards: FaqHeroStackCard[] = [
  {
    label: "GEO",
    question: "什么是 GEO？",
    answer: "GEO 是面向生成式 AI 搜索的内容优化方法。",
  },
  {
    label: "企业知识库",
    question: "企业知识库有什么作用？",
    answer: "帮助 AI 理解企业知识并进行引用。",
  },
  {
    label: "MCP",
    question: "MCP一定需要部署吗？",
    answer: "大多数企业第一阶段并不需要。",
  },
];

export const faqContactBenefits = [
  "免费咨询",
  "网站诊断",
  "GEO方案建议",
  "企业知识库规划",
  "FAQ体系建设",
];

export const faqContactActions = [
  { label: "预约咨询", description: "与 GEO 顾问沟通企业现状与建设目标" },
  { label: "方案沟通", description: "获取官网升级或知识库建设路径建议" },
  { label: "获取诊断报告", description: "了解网站 AI 友好度与内容缺口" },
];

/** FAQ 正文由后台 API 动态提供，此处仅保留类型与页面元数据 */
export const faqItems: FaqItem[] = [];

export function filterFaqItems(
  items: FaqItem[],
  category: FaqCategoryFilter,
  query: string,
): FaqItem[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;

    const haystack = [
      item.question,
      item.answer,
      faqCategoryLabels[item.category],
      ...(item.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function getFaqPageContent(): BaseContent {
  return {
    id: "faq",
    metadata: {
      title: faqMeta.title,
      summary: faqMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "faq-hero",
        aiChunk: "faq-hero",
        title: "常见问题 FAQ",
        summary:
          "整理 GEO、AI搜索、企业知识库与官网建设过程中最常见的问题与答案。",
        body: faqHeroTags.join("、"),
      },
      {
        id: "faq-browse",
        aiChunk: "faq-browse",
        title: "按主题浏览",
        summary: "按主题分类浏览 GEO、AI搜索与企业知识库相关标准答案。",
        body:
          "FAQ 内容由后台管理系统维护，并通过公开 API 在 /faq 页面动态展示。请访问官网 FAQ 页面或调用公开接口获取最新问答列表。",
      },
      {
        id: "faq-contact",
        aiChunk: "faq-contact",
        title: "联系与咨询",
        summary: "预约免费咨询，获取 GEO 方案建议、网站诊断与企业知识库规划支持。",
        body: [
          faqContactBenefits.join("、"),
          ...faqContactActions.map((item) => `- ${item.label}：${item.description}`),
        ].join("\n"),
      },
      {
        id: "faq-cta",
        aiChunk: "faq-cta",
        title: "让企业内容成为 AI 的标准答案",
        summary:
          "通过 GEO、FAQ体系与知识资产建设，提升企业在 AI 搜索时代的可见度与影响力。",
        body: "[咨询 GEO 方案](/contact)\n\n[预约免费诊断](/contact)",
      },
    ],
  };
}
