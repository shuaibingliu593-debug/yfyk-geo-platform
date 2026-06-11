export type NewsCategory = "all" | "geo-insight" | "ai-search" | "knowledge-base" | "company";

import type { BaseContent } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";

export interface NewsCategoryOption {
  value: NewsCategory;
  label: string;
}

export interface NewsHeroStackCard {
  categoryLabel: string;
  title: string;
  slug: string;
}

export interface NewsArticle {
  slug: string;
  category: Exclude<NewsCategory, "all">;
  categoryLabel: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  aiSummary: string;
  markdown: string;
}

export const newsMeta = {
  title: "资讯动态｜YFYK GEO与AI搜索行业洞察",
  description:
    "关注 GEO、AI搜索、企业知识库、Schema、MCP 与 AI 可见度建设趋势，获取企业官网 AI 时代的最新洞察与实践经验。",
  path: "/news",
};

export const newsHeroTags = [
  "GEO",
  "AI搜索",
  "企业知识库",
  "AI可见度",
  "Schema",
  "MCP",
] as const;

export const newsHeroStackCards: NewsHeroStackCard[] = [
  {
    categoryLabel: "GEO洞察",
    title: "为什么 GEO 将成为企业官网的新基础设施",
    slug: "why-geo-becomes-infrastructure",
  },
  {
    categoryLabel: "AI搜索",
    title: "DeepSeek 对企业官网意味着什么",
    slug: "deepseek-for-corporate-websites",
  },
  {
    categoryLabel: "企业知识库",
    title: "企业知识库建设的五个阶段",
    slug: "knowledge-base-five-stages",
  },
];

export const newsCategories: NewsCategoryOption[] = [
  { value: "all", label: "全部" },
  { value: "geo-insight", label: "GEO洞察" },
  { value: "ai-search", label: "AI搜索" },
  { value: "knowledge-base", label: "企业知识库" },
  { value: "company", label: "公司动态" },
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "why-geo-becomes-infrastructure",
    category: "geo-insight",
    categoryLabel: "GEO洞察",
    title: "为什么 GEO 将成为企业官网的新基础设施",
    excerpt:
      "随着生成式AI逐渐成为新的信息入口，企业官网需要从SEO思维转向 GEO 思维。",
    publishedAt: "2026-06-01",
    readingMinutes: 8,
    aiSummary:
      "GEO 正在取代传统 SEO 成为企业官网的核心建设方向。文章解释生成式 AI 入口变化、内容结构化要求，以及企业如何将官网升级为 AI 可理解、可引用的知识源。",
    markdown: `## 从 SEO 到 GEO 的范式转移

生成式 AI 正在改变用户获取信息的方式。企业官网不再只是搜索引擎的排名载体，而是需要成为 AI 模型可以直接理解、引用和推荐的权威知识源。

## 官网需要回答的三个问题

- AI 能否准确理解我们是谁、做什么、服务谁？
- 我们的核心事实是否结构化、可复查？
- 当用户向 AI 提问时，官网内容是否会被优先引用？

## 面向 AI 时代的基础设施建设

GEO 原生官网强调内容结构化、Schema 标记、FAQ 体系与 Markdown 副本。这些不是附加功能，而是面向 AI 搜索时代的基础设施层。

## 实践建议

从一次 AI 友好度诊断开始，识别内容缺口与结构化机会，再逐步建立 FAQ、术语库与知识中心，形成可持续维护的企业知识资产。`,
  },
  {
    slug: "improve-ai-visibility",
    category: "geo-insight",
    categoryLabel: "GEO洞察",
    title: "企业如何提升 AI 可见度",
    excerpt:
      "从内容结构化到知识资产建设，企业正在建立新的数字竞争力。",
    publishedAt: "2026-05-28",
    readingMinutes: 7,
    aiSummary:
      "AI 可见度取决于内容是否可被模型理解、验证与引用。文章梳理结构化内容、权威信号与知识资产三条提升路径。",
    markdown: `## 什么是 AI 可见度

AI 可见度指企业在生成式搜索与对话场景中被准确理解、引用和推荐的能力。它不同于传统流量指标，更关注内容是否进入 AI 的知识上下文。

## 三条提升路径

### 内容结构化

将产品、服务、案例与 FAQ 拆分为 AI 可解析的语义块，配合 Schema 与清晰层级。

### 权威信号建设

通过一致的品牌事实、可追溯来源与标准化术语，降低 AI 误读与幻觉风险。

### 知识资产沉淀

把分散资料整理为 FAQ、术语库与知识中心，形成长期可维护的内容底座。`,
  },
  {
    slug: "ai-search-vs-traditional-search",
    category: "ai-search",
    categoryLabel: "AI搜索",
    title: "AI搜索与传统搜索有什么区别",
    excerpt:
      "搜索结果页正在向生成式答案转变，企业需要适应新的流量入口。",
    publishedAt: "2026-05-22",
    readingMinutes: 6,
    aiSummary:
      "AI 搜索以生成式答案替代链接列表，强调语义理解与综合引用。企业需从关键词优化转向事实准确性与结构化表达。",
    markdown: `## 入口形态的变化

传统搜索返回链接列表，用户自行点击阅读。AI 搜索直接生成综合答案，并在答案中引用来源。

## 对企业官网的影响

- 页面需要可被 AI 直接抽取关键事实
- 品牌信息需要在多个 AI 平台保持一致
- FAQ 与标准问答成为高价值内容形态

## 应对策略

建立 GEO 内容体系，确保官网事实准确、结构清晰，并通过 Schema 与 Markdown 副本提升可发现性。`,
  },
  {
    slug: "deepseek-for-corporate-websites",
    category: "ai-search",
    categoryLabel: "AI搜索",
    title: "DeepSeek 对企业官网意味着什么",
    excerpt:
      "国产大模型正在改变企业内容被发现和推荐的方式。",
    publishedAt: "2026-05-18",
    readingMinutes: 7,
    aiSummary:
      "DeepSeek 等国产大模型扩大了 AI 搜索覆盖范围。企业官网需要兼顾中英文语义表达与本土化知识结构化。",
    markdown: `## 国产模型的搜索生态

DeepSeek 等模型正在成为国内企业与用户的重要信息入口。官网内容不仅要服务传统 SEO，还要适配 AI 模型的语义理解方式。

## 企业需要关注的变化

- 中文专业内容的结构化表达
- 产品参数、案例与 FAQ 的标准化描述
- 官网作为官方事实源的可引用性

## 建设方向

通过 GEO 原生架构与 AI Summary，让官网在国产 AI 搜索场景中保持准确、一致的品牌呈现。`,
  },
  {
    slug: "knowledge-base-five-stages",
    category: "knowledge-base",
    categoryLabel: "企业知识库",
    title: "企业知识库建设的五个阶段",
    excerpt:
      "从资料整理到知识服务，企业知识资产正在成为新的竞争壁垒。",
    publishedAt: "2026-05-12",
    readingMinutes: 9,
    aiSummary:
      "企业知识库建设经历资料整理、结构化、FAQ 化、术语统一与知识服务五个阶段，逐步形成 AI 可引用的知识资产。",
    markdown: `## 阶段一：资料整理

收集产品手册、案例、白皮书与内部文档，建立统一的内容清单与来源追溯。

## 阶段二：结构化重塑

将非结构化文档拆分为语义块，建立层级、标签与关联关系。

## 阶段三：FAQ 体系化

围绕客户高频问题建立标准问答，成为 AI 最容易引用的内容形式。

## 阶段四：术语统一

建立企业术语库，消除同一概念多种表述带来的 AI 误读风险。

## 阶段五：知识服务输出

通过知识中心、Markdown 副本与 MCP 接口，让知识资产持续服务官网与 AI 场景。`,
  },
  {
    slug: "why-faq-matters-more",
    category: "knowledge-base",
    categoryLabel: "企业知识库",
    title: "FAQ 为什么越来越重要",
    excerpt:
      "标准问答体系正在成为 AI 最容易理解和引用的内容形式之一。",
    publishedAt: "2026-05-08",
    readingMinutes: 5,
    aiSummary:
      "FAQ 以问答结构天然适配 AI 检索与引用。文章说明 FAQ 设计原则及其在 GEO 建设中的核心地位。",
    markdown: `## FAQ 与 AI 的天然契合

问答结构清晰、语义边界明确，是 AI 模型最容易解析和引用的内容形态之一。

## 高质量 FAQ 的设计原则

- 问题来自真实客户场景，而非营销话术
- 答案简洁、可验证，包含必要上下文
- 每个 FAQ 聚焦单一主题，避免混杂多个概念

## 在 GEO 体系中的位置

FAQ 是连接官网内容与 AI 搜索的桥梁，应与 Schema、术语库和知识中心协同维护。`,
  },
  {
    slug: "yfyk-geo-website-solution",
    category: "company",
    categoryLabel: "公司动态",
    title: "YFYK 发布 GEO 官网建设方案",
    excerpt:
      "帮助企业构建面向 AI 搜索时代的官网基础设施。",
    publishedAt: "2026-05-02",
    readingMinutes: 4,
    aiSummary:
      "YFYK 发布 GEO 官网建设方案，覆盖 AI Summary、Schema、FAQ 与 Markdown 交付，帮助企业建立 AI 友好官网。",
    markdown: `## 方案概述

YFYK GEO 官网建设方案面向 AI 搜索时代，帮助企业从内容架构、结构化标记到知识资产交付，建立可持续运营的官方知识源。

## 核心交付

- GEO 原生页面架构与 AI Summary
- Schema 与结构化内容块
- FAQ 体系与 Markdown 副本
- AI 友好度诊断与持续优化建议

## 适用企业

希望提升 AI 可见度、建立官方知识源并获得长期数字资产价值的中大型企业。`,
  },
  {
    slug: "yfyk-knowledge-engineering-launch",
    category: "company",
    categoryLabel: "公司动态",
    title: "YFYK 企业知识库工程正式上线",
    excerpt:
      "通过知识中心、FAQ体系和术语库帮助企业沉淀知识资产。",
    publishedAt: "2026-04-26",
    readingMinutes: 4,
    aiSummary:
      "YFYK 企业知识库工程服务正式上线，提供知识中心、FAQ 体系、术语库与结构化交付，帮助企业沉淀 AI 可引用知识资产。",
    markdown: `## 服务上线

YFYK 企业知识库工程服务正式上线，面向需要将分散专业知识系统化、结构化并持续服务 AI 场景的企业客户。

## 服务内容

- GEO 知识中心建设与维护
- FAQ 知识体系设计与交付
- 企业术语库与概念对齐
- Markdown / JSON-LD 多格式输出

## 下一步

欢迎通过官网预约免费咨询，评估企业知识资产现状与建设路径。`,
  },
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getNewsByCategory(category: NewsCategory): NewsArticle[] {
  if (category === "all") return newsArticles;
  return newsArticles.filter((article) => article.category === category);
}

/** 对 API 拉取的资讯列表做分类筛选（供客户端 Tab 使用） */
export function filterNewsByCategory(items: NewsArticle[], category: NewsCategory): NewsArticle[] {
  if (category === "all") return items;
  return items.filter((article) => article.category === category);
}

export function getNewsArticleHeadings(markdown: string): { id: string; title: string }[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.replace(/^##\s+/, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "");
      return { id, title };
    });
}

export function getNewsPageContent(): BaseContent {
  return {
    id: "news",
    metadata: {
      title: newsMeta.title,
      summary: newsMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "news-hero",
        aiChunk: "news-hero",
        title: "资讯动态",
        summary: newsMeta.description,
        body: newsHeroTags.join("、"),
      },
      {
        id: "news-browse",
        aiChunk: "news-browse",
        title: "文章列表",
        summary: "GEO、AI搜索与企业知识库行业洞察。",
        body: newsArticles
          .map(
            (article) =>
              `### ${article.title}\n分类：${article.categoryLabel}\n发布：${article.publishedAt}\n${article.excerpt}\n\n链接：/news/${article.slug}`,
          )
          .join("\n\n"),
      },
    ],
  };
}

export function getNewsArticleContent(article: NewsArticle): BaseContent {
  const dateModified = article.updatedAt ?? `${article.publishedAt}T00:00:00+08:00`;
  return {
    id: `news-${article.slug}`,
    metadata: {
      title: `${article.title}｜资讯动态｜YFYK`,
      summary: article.excerpt,
      dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "ai-summary",
        aiChunk: "ai-summary",
        title: "AI 摘要",
        summary: article.aiSummary,
        body: article.aiSummary,
      },
      {
        id: "article-body",
        aiChunk: "article-body",
        title: article.title,
        summary: article.excerpt,
        body: article.markdown,
      },
    ],
  };
}
