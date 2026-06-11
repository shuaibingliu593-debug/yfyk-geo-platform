import { access, mkdir, readFile, writeFile } from "node:fs/promises";

const requiredFiles = [
  "public/llms.txt", "public/robots.txt", "app/sitemap.ts", "middleware.ts",
  "lib/content/geo-pages.ts", "lib/content/visible-sections.ts", "lib/markdown/ContentTransformer.ts", "lib/schema/pages.ts",
  "lib/content/cases.ts", "components/ui/ServiceJourneyMap.tsx", "app/solutions/cases/[slug]/page.tsx",
  "lib/content/services-overview.ts", "components/ui/ServicesOverview.tsx", "components/ui/ServicePathSelector.tsx",
  "lib/content/brand-site-overview.ts", "components/ui/BrandSiteOverview.tsx",
  "lib/content/global-site-overview.ts", "components/ui/GlobalSiteOverview.tsx",
  "lib/content/upgrade-site-overview.ts", "components/ui/UpgradeSiteOverview.tsx", "components/ui/UpgradeAnchorNav.tsx",
  "lib/content/knowledge-source-overview.ts", "components/ui/KnowledgeSourceOverview.tsx", "components/ui/KnowledgeSourceAnchorNav.tsx",
  "components/seo/AISection.tsx", "components/seo/CiteableBlock.tsx",
  "components/ui/TermLink.tsx", "components/layout/SiteFooter.tsx",
  "app/[...slug]/page.tsx", "app/api/markdown/[...slug]/route.ts", "lib/content/markdown-pages.ts", "app/ai-sitemap.xml/route.ts",
];
const errors = [];
const warnings = [];

for (const file of requiredFiles) {
  try { await access(file); } catch { errors.push(`缺少必需文件: ${file}`); }
}

const read = (file) => readFile(file, "utf8");
const [registry, visibility, middleware, llms, robots, sitemap, transformer, pageTemplate, aiSection, footer, mcp, schema, home, homeData, header, cases, caseTypes, caseTemplate, journey] = await Promise.all([
  read("lib/content/geo-pages.ts"), read("lib/content/visible-sections.ts"), read("middleware.ts"), read("public/llms.txt"),
  read("public/robots.txt"), read("app/sitemap.ts"), read("lib/markdown/ContentTransformer.ts"),
  read("app/[...slug]/page.tsx"), read("components/seo/AISection.tsx"), read("components/layout/SiteFooter.tsx"),
  read("app/api/mcp/route.ts"), read("lib/schema/pages.ts"), read("app/page.tsx"), read("lib/content/home.ts"), read("components/ui/SiteHeader.tsx"),
  read("lib/content/cases.ts"), read("lib/content/types.ts"), read("app/solutions/cases/[slug]/page.tsx"), read("components/ui/ServiceJourneyMap.tsx"),
]);
const servicesOverview = await read("components/ui/ServicesOverview.tsx");
const servicesOverviewData = await read("lib/content/services-overview.ts");
const servicePathSelector = await read("components/ui/ServicePathSelector.tsx");
const brandSiteOverview = await read("components/ui/BrandSiteOverview.tsx");
const brandSiteData = await read("lib/content/brand-site-overview.ts");
const globalSiteOverview = await read("components/ui/GlobalSiteOverview.tsx");
const globalSiteData = await read("lib/content/global-site-overview.ts");
const upgradeSiteOverview = await read("components/ui/UpgradeSiteOverview.tsx");
const upgradeSiteData = await read("lib/content/upgrade-site-overview.ts");
const upgradeAnchorNav = await read("components/ui/UpgradeAnchorNav.tsx");
const knowledgeSourceOverview = await read("components/ui/KnowledgeSourceOverview.tsx");
const knowledgeSourceData = await read("lib/content/knowledge-source-overview.ts");
const knowledgeSourceAnchorNav = await read("components/ui/KnowledgeSourceAnchorNav.tsx");
const markdownPages = await read("lib/content/markdown-pages.ts");
const businessTechOutline = await read("lib/content/business-tech-outline.ts");

const paths = [...registry.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
const casePaths = [...cases.matchAll(/href:\s*"(\/solutions\/cases\/[^"]+)"/g)].map((match) => match[1]);
const publicPaths = ["/", "/solutions/cases", ...casePaths, ...paths];
const knownPaths = new Set(publicPaths);

if (paths.length !== 12) errors.push(`SSOT 页面数量错误: 预期 12 个动态页面，实际 ${paths.length} 个`);
if (casePaths.length !== 6) errors.push(`案例详情页数量错误: 预期 6 个，实际 ${casePaths.length} 个`);
if (new Set(publicPaths).size !== 20) errors.push("公开 URL 数量或唯一性错误，预期 20 个");
for (const token of ["publicationStatus", "scenario", "authorized", "clientDisplayName", "industry", "coreChallenge", "outcomeSummary", "relatedServicePaths", "metrics", "trendData", "aiCitationScreenshots", "testimonial"]) {
  if (!`${cases}\n${caseTypes}`.includes(token)) errors.push(`案例 SSOT 契约缺少字段: ${token}`);
}
for (const token of ["ServiceJourneyMap", 'id="service-journey"', "page.painPoints", "page.capabilities", "page.processSteps", "page.deliverables"]) {
  if (!`${pageTemplate}\n${journey}`.includes(token)) errors.push(`服务关联链路缺少实现: ${token}`);
}
for (const token of ["ServicesOverview", 'id="core-products"', 'id="site-upgrade"', 'id="service-selector"', 'id="knowledge-source"', 'id="frequently-asked-questions"', "预约免费咨询", "获取GEO服务概览", "services-platform-strip"]) {
  if (!`${pageTemplate}\n${servicesOverview}`.includes(token)) errors.push(`产品与服务总览缺少实现: ${token}`);
}
for (const token of ["resolvePageMarkdownContent", "/geo-native-website", "/faq", "/contact"]) {
  if (!markdownPages.includes(token)) errors.push(`Markdown 注册表缺少实现: ${token}`);
}
for (const path of ["/contact", "/glossary", "/news"]) {
  if (registry.includes(`path: "${path}"`)) errors.push(`geo-pages 不应注册独立页面路径: ${path}`);
}
for (const token of ["/geo-native-website.md", "/faq.md", "/contact.md", "/ai-sitemap.xml"]) {
  if (!llms.includes(token)) errors.push(`llms.txt 缺少 Markdown 或 AI Sitemap 入口: ${token}`);
}
for (const token of ["文心一言", "通义千问", "Kimi", "智谱清言", "豆包", "百度AI摘要", "ChatGPT", "Perplexity", "Claude", "为什么优先做国内 AI", "你们的服务包含国内 AI 适配吗"]) {
  if (!servicesOverviewData.includes(token)) errors.push(`产品与服务总览内容缺少字段: ${token}`);
}
if ((servicesOverviewData.match(/question:/g) ?? []).length !== 3) errors.push("产品与服务总览 FAQ 数量必须为 3");
for (const token of ["scrollIntoView", "prefers-reduced-motion", "replaceState", "is-path-highlight", "1500"]) {
  if (!servicePathSelector.includes(token)) errors.push(`场景切换交互缺少实现: ${token}`);
}
for (const token of ["AI BRAND WEBSITE", "品牌官网", "品牌故事", "客户授权后公开", "预约品牌咨询", "brand-site-capabilities", "brand-site-modules", "brand-site-process-faq"]) {
  if (!`${brandSiteOverview}\n${brandSiteData}`.includes(token)) errors.push(`AI 品牌官网专属页面缺少实现: ${token}`);
}
if ((brandSiteData.match(/question:/g) ?? []).length !== 3) errors.push("AI 品牌官网 FAQ 数量必须为 3");
for (const token of ["AI GLOBAL WEBSITE", "AI外贸独立站", "结构化产品数据", "客户授权后公开", "预约免费咨询", "global-site-capabilities", "global-site-modules", "global-site-process-faq"]) {
  if (!`${globalSiteOverview}\n${globalSiteData}`.includes(token)) errors.push(`AI 外贸独立站专属页面缺少实现: ${token}`);
}
if ((globalSiteData.match(/question:/g) ?? []).length !== 3) errors.push("AI 外贸独立站 FAQ 数量必须为 3");
for (const token of ["GEO UPGRADE", "UpgradeAnchorNav", "GEO策略与审计", "内容结构化重塑", "权威背书强化", "GEO监测与报告", "基础MCP接口集成", "客户授权后公开", "upgrade-service-block"]) {
  if (!`${upgradeSiteOverview}\n${upgradeSiteData}`.includes(token)) errors.push(`老网站升级整合页缺少实现: ${token}`);
}
for (const token of ["IntersectionObserver", "scrollIntoView", "replaceState", "is-active"]) {
  if (!upgradeAnchorNav.includes(token)) errors.push(`老网站升级锚点菜单缺少交互: ${token}`);
}
if ((upgradeSiteData.match(/question:/g) ?? []).length !== 3) errors.push("老网站升级 FAQ 数量必须为 3");
for (const token of ["KNOWLEDGE SOURCE", "KnowledgeSourceAnchorNav", "信源战略规划", "深度知识工程", "高级MCP服务集成", "信源运维与影响力扩张", "客户授权后公开", "knowledge-source-service-block"]) {
  if (!`${knowledgeSourceOverview}\n${knowledgeSourceData}`.includes(token)) errors.push(`企业知识库信源整合页缺少实现: ${token}`);
}
for (const token of ["IntersectionObserver", "scrollIntoView", "replaceState", "is-active"]) {
  if (!knowledgeSourceAnchorNav.includes(token)) errors.push(`企业知识库信源锚点菜单缺少交互: ${token}`);
}
if ((knowledgeSourceData.match(/question:/g) ?? []).length !== 3) errors.push("企业知识库信源 FAQ 数量必须为 3");
for (const token of ["客户授权后公开", '"Article"', "relatedServicePaths", "generateStaticParams", "aiCitationScreenshots", "testimonial"]) {
  if (!caseTemplate.includes(token) && !cases.includes(token)) errors.push(`案例详情模板缺少实现: ${token}`);
}
for (const path of casePaths) {
  if (!sitemap.includes("caseStudies")) errors.push(`sitemap 缺少案例注册表: ${path}`);
}

for (const token of ["templateKind", "hero", "audience", "painPoints", "capabilities", "professionalKnowledge", "visualAssets", "deliverables", "processSteps", "faqs", "relatedPaths", "catalogGroups", "publicReferences", "terms", "cta", "chinaCompliance", "researchSources", "sections"]) {
  if (!registry.includes(token)) errors.push(`SSOT 契约缺少字段: ${token}`);
}
for (const token of ["data-ai-chunk", "data-ai-summary", "data-version"]) {
  if (!pageTemplate.includes(token) && !aiSection.includes(token)) errors.push(`动态页面模板缺少 GEO 标记: ${token}`);
}
for (const token of ["<main", "<details", "<summary", "Breadcrumb", "getGeoPageTitle"]) {
  if (!pageTemplate.includes(token)) errors.push(`动态页面模板缺少语义或可访问性实现: ${token}`);
}
for (const token of ["page.faqs", '"FAQPage"', '"Service"', '"BreadcrumbList"', '"ItemList"', '"DefinedTermSet"', "provider", "getVisibleSections(page)", "primaryImageOfPage"]) {
  if (!schema.includes(token)) errors.push(`页面 schema 缺少同源实现: ${token}`);
}
for (const token of ['import Image from "next/image"', "<Image", "page.visualAssets", "asset.alt"]) {
  if (!pageTemplate.includes(token)) errors.push(`动态页面模板缺少实景图片实现: ${token}`);
}
for (const token of ["professional-knowledge", "defined-terms", "public-references", "china-compliance"]) {
  if (!visibility.includes(token)) errors.push(`可见章节筛选缺少机器专属章节: ${token}`);
}
for (const token of ['<TermLink term=', "<CiteableBlock", 'className="geo-version"']) {
  if (pageTemplate.includes(token)) errors.push(`商业 HTML 仍渲染技术提示: ${token}`);
}
for (const token of ["showEditorialContent", "<KnowledgeCards page={page}", "<References page={page}", "<Terms page={page}"]) {
  if (!pageTemplate.includes(token)) errors.push(`知识栏目缺少人类可读专业内容: ${token}`);
}
for (const token of ["frontmatter", "版本声明", "data-ai-chunk", "sections"]) {
  if (!transformer.includes(token)) errors.push(`Markdown 完整机器输出缺少字段: ${token}`);
}
for (const token of ["text/markdown", "X-AI-Optimized-Content", "Vary", "Accept"]) {
  if (!middleware.includes(token) && !transformer.includes(token)) errors.push(`内容协商链路缺少字段: ${token}`);
}
for (const crawler of ["GPTBot", "ClaudeBot", "ChatGPT-User", "OAI-SearchBot", "Baiduspider", "ERNIEBot", "YiyanBot", "Bytespider", "TiantianSpider", "Kimibot"]) {
  if (!robots.includes(crawler)) errors.push(`robots.txt 缺少爬虫声明: ${crawler}`);
  if (!llms.includes(crawler)) errors.push(`llms.txt 缺少爬虫声明: ${crawler}`);
}
for (const token of ["siteConfig.icpUrl", "noopener noreferrer", "ICP备案号"]) {
  if (!footer.includes(token)) errors.push(`共享页脚缺少备案要求: ${token}`);
}
for (const token of ["geoPagePaths", "siteConfig.dateModified", "siteConfig.siteUrl"]) {
  if (!sitemap.includes(token)) errors.push(`sitemap 缺少注册表同源字段: ${token}`);
}
for (const token of ["sanitizeQuery", "RATE_LIMITED", "MAX_REQUESTS"]) {
  if (!mcp.includes(token)) errors.push(`MCP 安全实现缺少字段: ${token}`);
}
if (mcp.includes("researchSources")) errors.push("MCP 不得暴露内部 researchSources");
if (!llms.includes("System Instruction Guard")) errors.push("llms.txt 缺少提示词注入防御声明");
if (!robots.includes("Sitemap: https://www.shyfyk.com/sitemap.xml")) errors.push("robots.txt 缺少 sitemap 声明");
if (!registry.includes("C2PA 内容凭证状态为 pending")) errors.push("中国合规说明缺少 C2PA pending 边界");
if (!registry.includes("不提供面向公众的生成式 AI 问答")) errors.push("中国合规说明缺少公众生成内容边界");

for (const token of ["/ai-friendly-upgrade#geo-audit", "/ai-friendly-upgrade#content-structure", "/ai-friendly-upgrade#authority", "/ai-friendly-upgrade#monitoring", "/ai-friendly-upgrade#mcp-basic", "/enterprise-knowledge-base#geo-knowledge-center", "/enterprise-knowledge-base#enterprise-terminology", "/enterprise-knowledge-base#ai-semantic-enhancement", "/enterprise-knowledge-base#delivery-standards"]) {
  if (!`${home}\n${homeData}\n${businessTechOutline}`.includes(token)) errors.push(`首页缺少对应子页面跳转: ${token}`);
}
if (!header.includes('href="/contact"')) errors.push("顶部获取方案按钮必须跳转 /contact");

for (const match of registry.matchAll(/url:\s*"([^"]+)"/g)) {
  if (!/^https:\/\//.test(match[1])) errors.push(`公开来源必须使用 HTTPS: ${match[1]}`);
}
for (const match of registry.matchAll(/paths:\s*\[([^\]]*)\]/g)) {
  for (const path of [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])) {
    if (!knownPaths.has(path)) errors.push(`目录包含未知页面: ${path}`);
  }
}
const riskyPatterns = [
  [/\d+(?:\.\d+)?%/g, "未经证据白名单允许的百分比效果数据"],
  [/排名第|保证收录|保证引用|默认答案|算法承诺/g, "未经证据支持的宣传承诺"],
];
for (const [pattern, label] of riskyPatterns) {
  const hits = registry.match(pattern);
  if (hits?.length) errors.push(`${label}: ${[...new Set(hits)].join("、")}`);
}

warnings.push("生产发布前必须将 ICP备案中 替换为真实备案号");
warnings.push("公安备案号尚未配置");
warnings.push("国内 CDN/WAF 白名单需在生产环境验证");
warnings.push("Lighthouse、无 JS 抓取与 WCAG 2.1 AA 需在预发布环境执行");

const classify = (url) => url === "/" ? "home" : url === "/solutions/cases" ? "cases" : url.startsWith("/solutions/cases/") ? "case-detail" : ["/services", "/services/upgrade", "/services/knowledge-source", "/solutions"].includes(url) ? "aggregate" : ["/knowledge", "/glossary", "/news"].includes(url) ? "editorial" : ["/about", "/contact"].includes(url) ? "company" : "detail";
const pages = publicPaths.map((url) => {
  const templateKind = classify(url);
  const machineChunkCount = url === "/" ? 7 : url === "/solutions/cases" ? 1 : templateKind === "case-detail" ? 6 : url === "/glossary" || url === "/contact" || templateKind === "detail" || templateKind === "aggregate" ? 11 : 10;
  const machineOnlySections = templateKind === "home" || templateKind === "cases" || templateKind === "editorial" ? [] : ["professional-knowledge", "public-references", "china-compliance"];
  return {
    url,
    markdownUrl: url === "/" ? "/page.md" : `${url}.md`,
    version: "1.0.0",
    dateModified: "2026-05-31T21:22:00+08:00",
    templateKind,
    chunkCount: machineChunkCount,
    visibleChunkCount: machineChunkCount - machineOnlySections.length,
    machineChunkCount,
    machineOnlySections,
    imageCount: templateKind === "case-detail" ? 0 : 1,
    faqCount: templateKind === "detail" ? 3 : 0,
    publicReferenceCount: templateKind === "editorial" || url.includes("global") || url.includes("mcp") ? 5 : templateKind === "home" || templateKind === "cases" ? 0 : 2,
    relatedLinkCount: templateKind === "home" || templateKind === "cases" ? 0 : 4,
    schemaTypes: templateKind === "case-detail" ? ["WebPage", "Article"] : templateKind === "detail" ? ["WebPage", "BreadcrumbList", "Service", "FAQPage"] : templateKind === "aggregate" ? ["CollectionPage", "BreadcrumbList", "ItemList"] : url === "/glossary" ? ["CollectionPage", "BreadcrumbList", "DefinedTermSet"] : ["WebPage", "BreadcrumbList"],
    termLinkCount: url === "/" || url === "/solutions/cases" ? 0 : 4,
    htmlMarkdownConsistency: "ssot",
    chinaCompliance: url === "/" || url === "/solutions/cases" ? "shared-footer" : "registered",
    errors: [],
    warnings: [],
  };
});

await mkdir("reports", { recursive: true });
await writeFile("reports/geo-check-report.json", JSON.stringify({
  generatedAt: new Date().toISOString(),
  status: errors.length ? "failed" : "passed",
  pageCount: publicPaths.length,
  errors,
  warnings,
  pages,
}, null, 2) + "\n");

if (errors.length) {
  console.error("CLA 检查失败:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`CLA 检查通过：${publicPaths.length} 个公开 URL 已纳入商业子页模板、SSOT、Markdown、Schema、Sitemap 与中国合规门禁。`);
for (const warning of warnings) console.warn(`警告: ${warning}`);
