/**
 * 官网统一 API 层：从 geo-admin 后台公开接口拉取已发布内容。
 * 环境变量 NEXT_PUBLIC_API_BASE_URL 指向 api-server（默认开发环境 http://localhost:3001）。
 */

import { parseCaseMetrics } from "@/lib/case-metrics";
import type { CaseCenterItem } from "@/lib/content/cases-center";
import type { CaseDetailMetric, CaseDetailView } from "@/lib/content/case-detail";
import type { CaseLibraryCase, CaseServiceType } from "@/lib/content/case-library";
import type { FaqItem, FaqCategory } from "@/lib/content/faq";
import type { NewsArticle } from "@/lib/content/news";
import type { CaseStudy } from "@/lib/content/types";

/** 浏览器仅用于提交留资；服务端优先使用 Render 内网 API 地址。 */
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

function serverApiBaseUrl(): string {
  const configured = (process.env.API_INTERNAL_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)?.trim() ?? "";
  if (!configured) throw new ApiError("未配置 API_INTERNAL_BASE_URL 或 NEXT_PUBLIC_API_BASE_URL", 0);

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new ApiError("后台 API 地址格式无效", 0);
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new ApiError("后台 API 地址必须使用 HTTP(S)", 0);
  if (process.env.NODE_ENV === "production" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
    throw new ApiError("生产环境后台 API 不能指向 localhost", 0);
  }
  return configured.replace(/\/$/, "");
}

/** 公开 v1 接口统一响应包装 */
interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: { code?: string; message?: string };
}

/** 分页列表结构 */
interface PaginatedPayload<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** 后台 GEO 配置（公开字段） */
interface ApiGeoConfig {
  aiSummary?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
}

/** 后台案例原始字段 */
export interface ApiCase {
  id: string;
  title: string;
  slug: string;
  caseType: string;
  industry?: string | null;
  clientName?: string | null;
  clientDisplayName?: string | null;
  isAnonymized?: boolean;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  metrics?: unknown;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  status: string;
  featured?: boolean;
  sortOrder?: number;
  publishedAt?: string | null;
  geoConfig?: ApiGeoConfig | null;
}

/** 首页推荐接口响应 */
interface HomeRecommendationsPayload {
  cases: ApiCase[];
}

/** 后台资讯原始字段 */
export interface ApiNews {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  source?: string | null;
  author?: string | null;
  excerpt: string;
  content: string;
  publishDate?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  status: string;
  sortOrder?: number;
  geoConfig?: ApiGeoConfig | null;
}

/** 后台 FAQ 原始字段 */
export interface ApiFaq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  relatedServiceType?: string | null;
  status: string;
  sortOrder?: number;
  geoConfig?: ApiGeoConfig | null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** 解析错误信息 */
function parseErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as ApiEnvelope<unknown>;
  if (record.error?.message) return record.error.message;
  if (typeof record.message === "string" && record.message.trim()) return record.message;
  return fallback;
}

/** 底层 fetch，带超时与 JSON 解析 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${serverApiBaseUrl()}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("无法连接后台 API，请确认 api-server 已启动", 0);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(parseErrorMessage(payload, `请求失败 (${response.status})`), response.status);
  }

  return payload as T;
}

/** 拉取全部分页数据（单页最大 100 条） */
async function fetchAllPages<T>(buildPath: (page: number) => string): Promise<T[]> {
  let page = 1;
  const allItems: T[] = [];

  while (true) {
    const envelope = await apiFetch<ApiEnvelope<PaginatedPayload<T>>>(buildPath(page));
    if (!envelope.success || !envelope.data) break;

    allItems.push(...(envelope.data.items ?? []));

    const { totalPages } = envelope.data.pagination;
    if (page >= totalPages) break;
    page += 1;
  }

  return allItems;
}

/** 获取全部已发布案例 */
export async function getCases(): Promise<ApiCase[]> {
  return fetchAllPages<ApiCase>((page) => `/api/v1/cases?page=${page}&pageSize=100`);
}

/** 按 slug 获取单个已发布案例 */
export async function getCaseBySlug(slug: string): Promise<ApiCase | null> {
  try {
    const envelope = await apiFetch<ApiEnvelope<ApiCase>>(`/api/v1/cases/${encodeURIComponent(slug)}`);
    if (!envelope.success || !envelope.data || envelope.data.status !== "PUBLISHED") {
      return null;
    }
    return envelope.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** 获取全部已发布资讯 */
export async function getNews(): Promise<ApiNews[]> {
  return fetchAllPages<ApiNews>((page) => `/api/v1/news?page=${page}&pageSize=100`);
}

/** 按 slug 获取单篇已发布资讯 */
export async function getNewsBySlug(slug: string): Promise<ApiNews | null> {
  try {
    const envelope = await apiFetch<ApiEnvelope<ApiNews>>(`/api/v1/news/${encodeURIComponent(slug)}`);
    if (!envelope.success || !envelope.data || envelope.data.status !== "PUBLISHED") {
      return null;
    }
    return envelope.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** 获取首页推荐案例（featured + PUBLISHED，最多 5 条） */
export async function getHomeRecommendedCases(): Promise<ApiCase[]> {
  const envelope = await apiFetch<ApiEnvelope<HomeRecommendationsPayload>>("/api/v1/home/recommendations");
  if (!envelope.success || !envelope.data) return [];
  return envelope.data.cases ?? [];
}

/** 获取全部已发布 FAQ */
export async function getFaqs(): Promise<ApiFaq[]> {
  return fetchAllPages<ApiFaq>((page) => `/api/v1/faqs?page=${page}&pageSize=100`);
}

/* ---------- 后台字段 → 官网 UI 类型映射 ---------- */

const CASE_TYPE_LABEL: Record<string, string> = {
  GEO_NATIVE: "GEO原生建站",
  AI_UPGRADE: "网站AI改造",
  KNOWLEDGE_BASE: "企业知识库",
  BENCHMARK: "标杆案例",
};

const CASE_TYPE_CATEGORY: Record<string, "geo-native" | "ai-upgrade" | "knowledge-base"> = {
  GEO_NATIVE: "geo-native",
  AI_UPGRADE: "ai-upgrade",
  KNOWLEDGE_BASE: "knowledge-base",
  BENCHMARK: "geo-native",
};

const CASE_TYPE_SERVICE: Record<string, CaseServiceType> = {
  GEO_NATIVE: "GEO原生建站",
  AI_UPGRADE: "网站AI改造",
  KNOWLEDGE_BASE: "知识库信源构建",
  BENCHMARK: "GEO原生建站",
};

/** 从 metrics JSON 提取案例列表展示指标（最多 3 条，无录入则返回空数组） */
function buildCaseMetrics(metrics: unknown): CaseCenterItem["metrics"] {
  return parseCaseMetrics(metrics).slice(0, 3);
}

/** 后台案例 → 案例中心列表卡片 */
export function mapCaseToCenterItem(item: ApiCase, index: number): CaseCenterItem {
  const category = CASE_TYPE_CATEGORY[item.caseType] ?? "geo-native";
  const placeholder =
    (item.industry ?? item.clientDisplayName ?? item.title).replace(/\s/g, "").slice(0, 2) || "案例";

  return {
    slug: item.slug,
    category,
    coverImage: item.coverImage ?? undefined,
    logoPlaceholder: placeholder,
    statusLabel: "案例展示",
    industry: item.industry ?? "—",
    caseType: CASE_TYPE_LABEL[item.caseType] ?? item.caseType,
    title: item.title,
    description: item.excerpt,
    metrics: buildCaseMetrics(item.metrics),
    tone: (index % 6) + 1,
  };
}

/** 批量映射案例列表 */
export function mapCasesToCenterItems(cases: ApiCase[]): CaseCenterItem[] {
  return cases.map(mapCaseToCenterItem);
}

/** 从 metrics JSON 提取首页案例卡片指标（最多 3 条） */
function buildHomeCaseMetrics(metrics: unknown): CaseStudy["metrics"] {
  return parseCaseMetrics(metrics).slice(0, 3);
}

/** 后台案例 → 首页 CaseGallery 卡片 */
export function mapApiCaseToHomeCase(item: ApiCase): CaseStudy {
  const clientDisplayName = item.isAnonymized
    ? (item.clientDisplayName ?? "匿名客户")
    : (item.clientDisplayName ?? item.clientName ?? "客户");

  return {
    id: item.slug,
    slug: item.slug,
    publicationStatus: "authorized",
    clientDisplayName,
    coverImage: item.coverImage ?? undefined,
    industry: item.industry ?? "—",
    category: CASE_TYPE_LABEL[item.caseType] ?? item.caseType,
    title: item.title,
    description: item.excerpt,
    href: `/cases/${item.slug}`,
    coreChallenge: item.challenge ?? item.excerpt,
    outcomeSummary: item.results ?? item.excerpt,
    background: item.content,
    relatedServicePaths: [],
    highlights: [],
    metrics: buildHomeCaseMetrics(item.metrics),
  };
}

/** 批量映射首页推荐案例 */
export function mapApiCasesToHomeCases(cases: ApiCase[]): CaseStudy[] {
  return cases.map(mapApiCaseToHomeCase);
}

/** 后台 metrics → 案例详情指标（支持数组 [{label,value,unit}] 与旧版键值对象） */
function mapApiCaseMetrics(metrics: unknown): CaseDetailMetric[] {
  return parseCaseMetrics(metrics);
}

/** 后台案例 → 案例详情页视图 */
export function mapApiCaseToDetail(item: ApiCase): CaseDetailView {
  const displayName = item.isAnonymized
    ? (item.clientDisplayName ?? "匿名客户")
    : (item.clientDisplayName ?? item.clientName ?? "客户");

  return {
    slug: item.slug,
    title: item.title,
    category: CASE_TYPE_LABEL[item.caseType] ?? item.caseType,
    caseType: item.caseType,
    industry: item.industry ?? "—",
    customerName: item.clientName ?? displayName,
    displayName,
    coverImage: item.coverImage ?? undefined,
    summary: item.excerpt,
    challenge: item.challenge?.trim() || undefined,
    solution: item.solution?.trim() || undefined,
    result: item.results?.trim() || undefined,
    metrics: mapApiCaseMetrics(item.metrics),
    content: item.content,
  };
}

/** 同分类案例推荐（最多 3 条） */
export function mapRelatedCasesByCategory(
  current: ApiCase,
  allCases: ApiCase[],
  limit = 3,
): CaseCenterItem[] {
  return allCases
    .filter((item) => item.slug !== current.slug && item.caseType === current.caseType)
    .slice(0, limit)
    .map((item, index) => mapCaseToCenterItem(item, index));
}

type ParsedCaseSections = {
  background: string;
  challenges: string;
  solution: string;
  implementation: string;
  results: string;
  lessons: string;
};

/** 从 content 字段解析 ## 标题分段 */
function parseCaseContentSections(content: string): Partial<ParsedCaseSections> {
  const sections: Partial<ParsedCaseSections> = {};
  const keyMap: Record<string, keyof ParsedCaseSections> = {
    项目背景: "background",
    面临挑战: "challenges",
    解决方案: "solution",
    实施过程: "implementation",
    项目成果: "results",
    经验总结: "lessons",
  };

  const blocks = content.split(/^##\s+/m).filter(Boolean);
  for (const block of blocks) {
    const newline = block.indexOf("\n");
    if (newline === -1) continue;
    const heading = block.slice(0, newline).trim();
    const body = block.slice(newline + 1).trim();
    const key = keyMap[heading];
    if (key && body) sections[key] = body;
  }

  return sections;
}

/** 将挑战文本拆为列表项 */
function splitChallengeItems(text: string): string[] {
  return text
    .split(/[。\n；;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4);
}

/** 将解决方案文本拆为多条方案卡片 */
function splitSolutionItems(text: string): Array<{ title: string; description: string }> {
  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [{ title: "解决方案", description: text }];
  }

  return lines.map((line, index) => ({
    title: `方案要点 ${index + 1}`,
    description: line,
  }));
}

/** 从实施过程文本解析时间线 */
function parseImplementationTimeline(text: string): Array<{ week: string; action: string }> {
  const items: Array<{ week: string; action: string }> = [];
  for (const line of text.split(/\n+/).filter(Boolean)) {
    const match = line.match(/^第\s*(\d+(?:\s*[-–]\s*\d+)?)\s*周[：:]\s*(.+)$/);
    if (match) {
      items.push({ week: match[1].replace(/\s+/g, ""), action: match[2].trim() });
    }
  }

  if (items.length > 0) return items;

  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((line, index) => ({ week: String((index + 1) * 2), action: line }));
}

/** 后台案例 → 案例详情页结构 */
export function mapCaseToLibraryCase(item: ApiCase, allCases: ApiCase[] = []): CaseLibraryCase {
  const metricEntries = item.metrics ? Object.entries(item.metrics) : [];
  const clientName = item.isAnonymized
    ? (item.clientDisplayName ?? "匿名客户")
    : (item.clientName ?? item.clientDisplayName ?? "客户");

  const sections = parseCaseContentSections(item.content ?? "");
  const backgroundText = sections.background ?? item.challenge ?? item.excerpt;
  const challengeText = sections.challenges ?? item.challenge ?? item.excerpt;
  const solutionText = sections.solution ?? item.solution ?? "";
  const implementationText = sections.implementation ?? "";
  const resultsText = sections.results ?? item.results ?? item.excerpt;
  const lessonsText = sections.lessons ?? "";

  const challenges = splitChallengeItems(challengeText);
  const solutions = solutionText ? splitSolutionItems(solutionText) : [];
  if (lessonsText) {
    solutions.push({ title: "经验总结", description: lessonsText });
  }

  const timeline = implementationText ? parseImplementationTimeline(implementationText) : [];

  const results = metricEntries.map(([metric, value]) => ({
    metric,
    before: "—",
    after: String(value),
    change: "—",
  }));

  const relatedCases = allCases
    .filter((c) => c.slug !== item.slug)
    .slice(0, 3)
    .map((c) => c.slug);

  return {
    title: item.title,
    slug: item.slug,
    serviceType: CASE_TYPE_SERVICE[item.caseType] ?? "GEO原生建站",
    subService: CASE_TYPE_LABEL[item.caseType] ?? item.caseType,
    industry: item.industry ?? "—",
    isFeatured: Boolean(item.featured),
    clientName,
    shortTitle: item.title,
    resultSummary: resultsText,
    resultHighlight: metricEntries[0] ? String(metricEntries[0][1]) : item.excerpt.slice(0, 24),
    listTags: [CASE_TYPE_LABEL[item.caseType] ?? item.caseType, item.industry].filter(Boolean) as string[],
    backgroundChallenge: backgroundText,
    challenges: challenges.length > 0 ? challenges : [challengeText],
    solutions: solutions.length > 0 ? solutions : (item.solution ? [{ title: "解决方案", description: item.solution }] : []),
    timeline,
    results: results.length > 0 ? results : [{ metric: "项目成果", before: "—", after: resultsText, change: "—" }],
    testimonial: {
      quote: lessonsText || resultsText,
      author: clientName,
      position: item.industry ?? "",
    },
    relatedCases,
  };
}

/** 映射相关案例卡片（详情页推荐区） */
export function mapRelatedLibraryCases(item: ApiCase, allCases: ApiCase[]): CaseLibraryCase[] {
  return allCases
    .filter((c) => c.slug !== item.slug)
    .slice(0, 3)
    .map((c) => mapCaseToLibraryCase(c, allCases));
}

/** 后台 category 文本 → 官网资讯分类 slug */
function mapNewsCategory(category?: string | null): "geo-insight" | "ai-search" | "knowledge-base" | "company" {
  const text = (category ?? "").toLowerCase();
  if (text.includes("ai") || text.includes("搜索")) return "ai-search";
  if (text.includes("知识库")) return "knowledge-base";
  if (text.includes("公司") || text.includes("动态")) return "company";
  return "geo-insight";
}

const NEWS_CATEGORY_LABEL: Record<"geo-insight" | "ai-search" | "knowledge-base" | "company", string> = {
  "geo-insight": "GEO洞察",
  "ai-search": "AI搜索",
  "knowledge-base": "企业知识库",
  company: "公司动态",
};

/** 估算阅读时长（分钟） */
function estimateReadingMinutes(text: string): number {
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / 400));
}

/** 格式化日期为 YYYY-MM-DD */
function formatDate(value?: string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

/** 后台资讯 → 官网资讯结构 */
export function mapNewsToArticle(item: ApiNews): NewsArticle {
  const category = mapNewsCategory(item.category);
  const body = item.content?.trim() ? item.content : item.excerpt;

  return {
    slug: item.slug,
    category,
    categoryLabel: item.category ?? NEWS_CATEGORY_LABEL[category],
    title: item.title,
    excerpt: item.excerpt,
    publishedAt: formatDate(item.publishDate ?? item.publishedAt),
    updatedAt: item.updatedAt ? formatDate(item.updatedAt) : undefined,
    readingMinutes: estimateReadingMinutes(body),
    aiSummary: item.geoConfig?.aiSummary ?? item.excerpt,
    markdown: body,
  };
}

/** 批量映射资讯 */
export function mapNewsToArticles(items: ApiNews[]): NewsArticle[] {
  return items.map(mapNewsToArticle);
}

/** 后台 FAQ category → 官网 FAQ 分类（优先精确匹配种子分类名） */
function mapFaqCategory(item: ApiFaq): FaqCategory {
  const category = (item.category ?? "").trim();
  const exactMap: Record<string, FaqCategory> = {
    GEO: "geo",
    geo: "geo",
    官网建设: "website",
    企业知识库: "knowledge-base",
    "AI搜索": "ai-search",
    MCP: "mcp",
    mcp: "mcp",
  };
  if (category && exactMap[category]) {
    return exactMap[category];
  }

  const text = `${category} ${item.relatedServiceType ?? ""}`.toLowerCase();
  if (text.includes("mcp")) return "mcp";
  if (text.includes("知识库") || text.includes("knowledge")) return "knowledge-base";
  if (text.includes("ai搜索") || (text.includes("ai") && text.includes("搜索"))) return "ai-search";
  if (text.includes("官网") || text.includes("website")) return "website";
  if (text.includes("geo")) return "geo";
  return "geo";
}

/** 后台 FAQ → 官网 FAQ 结构 */
export function mapFaqToItem(item: ApiFaq): FaqItem {
  return {
    id: item.id,
    category: mapFaqCategory(item),
    question: item.question,
    answer: item.answer,
  };
}

/** 批量映射 FAQ */
export function mapFaqsToItems(items: ApiFaq[]): FaqItem[] {
  return items.map(mapFaqToItem);
}

/** 官网留言提交参数 */
export interface SubmitLeadPayload {
  name: string;
  companyName?: string;
  contact: string;
  demandType: string;
  message?: string;
  sourcePage: string;
  sourcePageTitle?: string;
  sourceModule: string;
  sourceButtonText?: string;
}

/** 提交官网咨询留言（公开接口，无需登录） */
export async function submitLead(payload: SubmitLeadPayload): Promise<{ success: boolean; message: string }> {
  if (!apiBaseUrl) {
    throw new ApiError("未配置 NEXT_PUBLIC_API_BASE_URL", 0);
  }

  const url = `${apiBaseUrl.replace(/\/$/, "")}/api/v1/leads`;
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError("无法连接后台 API，请确认 api-server 已启动", 0);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const envelope = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(parseErrorMessage(envelope, `提交失败 (${response.status})`), response.status);
  }

  const message =
    envelope && typeof envelope === "object" && typeof (envelope as ApiEnvelope<unknown>).message === "string"
      ? (envelope as ApiEnvelope<unknown>).message!
      : "已收到您的咨询，我们会尽快与您联系。";

  return { success: true, message };
}
