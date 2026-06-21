import type { BaseContent } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";

export type GlossaryCategoryFilter =
  | "all"
  | "geo-basics"
  | "ai-search"
  | "structured-data"
  | "knowledge-assets"
  | "ai-interfaces"
  | "content-governance";

export type GlossaryCategory = Exclude<GlossaryCategoryFilter, "all">;

export interface GlossaryReading {
  label: string;
  href: string;
}

export interface GlossaryTerm {
  id: string;
  nameZh: string;
  nameEn: string;
  category: GlossaryCategory;
  definition: string;
  explanation: string;
  whyImportant: string;
  useCases: string[];
  relatedTermIds: string[];
  recommendedReading: GlossaryReading[];
}

export const glossaryMeta = {
  title: "术语表｜YFYK GEO与AI搜索概念解释中心",
  description:
    "YFYK术语表解释GEO、Schema、JSON-LD、FAQ Schema、llms.txt、AI Sitemap、MCP等AI搜索与生成式引擎优化相关概念。",
  path: "/glossary",
};

export const glossaryCategories: Array<{ value: GlossaryCategoryFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "geo-basics", label: "GEO基础" },
  { value: "ai-search", label: "AI搜索" },
  { value: "structured-data", label: "结构化数据" },
  { value: "knowledge-assets", label: "知识资产" },
  { value: "ai-interfaces", label: "AI接口" },
  { value: "content-governance", label: "内容治理" },
];

export const glossaryCategoryLabels: Record<GlossaryCategory, string> = {
  "geo-basics": "GEO基础",
  "ai-search": "AI搜索",
  "structured-data": "结构化数据",
  "knowledge-assets": "知识资产",
  "ai-interfaces": "AI接口",
  "content-governance": "内容治理",
};

export const glossaryHeroTags = [
  "GEO",
  "AI Summary",
  "Schema",
  "JSON-LD",
  "FAQ Schema",
  "llms.txt",
  "AI Sitemap",
  "MCP",
];

export const glossaryRelatedServices = [
  {
    id: "geo-native",
    title: "GEO原生建站",
    description: "从零建设 AI 友好型企业官网",
    buttonLabel: "了解服务",
    href: "/geo-native-website",
  },
  {
    id: "ai-upgrade",
    title: "老网站AI友好度升级",
    description: "让已有官网适配 AI 搜索时代",
    buttonLabel: "查看方案",
    href: "/ai-friendly-upgrade",
  },
  {
    id: "knowledge-base",
    title: "企业知识库工程",
    description: "把企业知识变成 AI 可理解的长期资产",
    buttonLabel: "查看知识库方案",
    href: "/enterprise-knowledge-base",
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "geo",
    nameZh: "GEO",
    nameEn: "Generative Engine Optimization",
    category: "geo-basics",
    definition: "面向生成式AI搜索场景的内容优化方法。",
    explanation:
      "GEO（Generative Engine Optimization）是面向 ChatGPT、Perplexity、文心一言、通义千问等生成式 AI 引擎的内容优化体系。它关注内容如何被 AI 抓取、理解、摘要、引用与推荐，而不仅是传统搜索引擎排名。",
    whyImportant: "帮助企业官网被 AI 抓取、理解、引用、推荐，在 AI 回答中建立可信品牌存在感。",
    useCases: ["企业官网", "知识库", "FAQ 体系", "内容治理"],
    relatedTermIds: ["seo", "ai-search", "ai-summary", "schema", "llms-txt"],
    recommendedReading: [
      { label: "GEO原生建站", href: "/geo-native-website" },
      { label: "老网站AI友好度升级", href: "/ai-friendly-upgrade" },
    ],
  },
  {
    id: "seo",
    nameZh: "SEO",
    nameEn: "Search Engine Optimization",
    category: "geo-basics",
    definition: "面向传统搜索引擎的排名与可见性优化方法。",
    explanation:
      "SEO 通过关键词、链接、页面结构与内容质量提升网站在 Google、百度等搜索引擎中的排名。GEO 在其基础上延伸，面向 AI 引擎增加结构化数据、语义摘要与机器可读接口。",
    whyImportant: "SEO 仍是基础流量入口；与 GEO 协同可兼顾搜索排名与 AI 引用能力。",
    useCases: ["官网获客", "内容营销", "品牌曝光", "与 GEO 协同建设"],
    relatedTermIds: ["geo", "semantic-search", "schema"],
    recommendedReading: [{ label: "老网站AI友好度升级", href: "/ai-friendly-upgrade" }],
  },
  {
    id: "ai-search",
    nameZh: "AI搜索",
    nameEn: "AI Search",
    category: "ai-search",
    definition: "用户通过 AI 助手或对话式界面获取答案的搜索形态。",
    explanation:
      "AI 搜索以自然语言问答取代传统关键词检索，由大模型综合网页、知识库与实时数据生成答案。企业需要让内容可被 AI 定位、摘要并附带来源引用。",
    whyImportant: "越来越多 B2B 决策者通过 AI 获取行业信息；未被 AI 理解的内容将失去曝光机会。",
    useCases: ["品牌调研", "产品对比", "行业问答", "采购决策支持"],
    relatedTermIds: ["geo", "generative-engine", "citation", "semantic-search"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "generative-engine",
    nameZh: "生成式引擎",
    nameEn: "Generative Engine",
    category: "ai-search",
    definition: "基于大语言模型生成答案的信息检索与推荐系统。",
    explanation:
      "生成式引擎（如 ChatGPT Search、Perplexity、Kimi 等）在检索后由模型组织语言输出答案，而非仅返回链接列表。GEO 即针对此类引擎的内容优化策略。",
    whyImportant: "生成式引擎正在成为企业信息触达的新渠道，需要专门的内容与结构化策略。",
    useCases: ["AI 问答曝光", "行业观点传播", "产品能力说明"],
    relatedTermIds: ["geo", "ai-search", "ai-summary"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "ai-summary",
    nameZh: "AI Summary",
    nameEn: "AI Summary",
    category: "ai-search",
    definition: "为 AI 快速理解页面核心含义而提供的结构化摘要。",
    explanation:
      "AI Summary 通常以独立字段或页面顶部摘要块呈现，用简洁语言概括页面主旨、适用对象与关键结论，降低 AI 解析长文的成本与误差。",
    whyImportant: "帮助 AI 在有限 token 内准确抓住页面要点，提升被引用时的表述准确度。",
    useCases: ["服务页", "方案页", "案例页", "知识库条目"],
    relatedTermIds: ["ai-chunk", "schema", "geo"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "ai-chunk",
    nameZh: "AI Chunk",
    nameEn: "AI Chunk",
    category: "content-governance",
    definition: "按语义边界切分的、可供 AI 独立理解与引用的内容块。",
    explanation:
      "AI Chunk 将长页面拆分为带标识的语义单元（如 hero、能力、FAQ 等），每个块附带摘要与版本信息，便于 AI 精准定位与引用，避免断章取义。",
    whyImportant: "提升 AI 引用精度，支持可复查、可深链的内容治理模式。",
    useCases: ["长文页面", "技术文档", "服务说明", "政策与合规内容"],
    relatedTermIds: ["ai-summary", "schema", "faq-system"],
    recommendedReading: [{ label: "老网站AI友好度升级", href: "/ai-friendly-upgrade" }],
  },
  {
    id: "schema",
    nameZh: "Schema",
    nameEn: "Schema.org",
    category: "structured-data",
    definition: "描述网页实体与关系的结构化词汇表标准。",
    explanation:
      "Schema.org 由 Google、Microsoft 等联合维护，定义 Organization、Article、FAQPage、DefinedTerm 等类型，使页面含义可被机器明确解析。",
    whyImportant: "结构化数据是 AI 与搜索引擎理解企业信息的通用语言，减少歧义与误读。",
    useCases: ["企业官网", "产品页", "FAQ", "术语表"],
    relatedTermIds: ["json-ld", "faq-schema", "defined-term", "organization-schema"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "json-ld",
    nameZh: "JSON-LD",
    nameEn: "JSON-LD",
    category: "structured-data",
    definition: "以 JSON 格式嵌入页面的 Schema 结构化数据表达方式。",
    explanation:
      "JSON-LD 将 Schema 数据以 script 标签注入 HTML，不干扰可见排版，是 Google 推荐的结构化数据格式，也便于 AI 爬虫直接解析。",
    whyImportant: "轻量、可维护、可被机器稳定读取，是 GEO 工程化落地的核心格式。",
    useCases: ["全站 Schema 注入", "FAQ 结构化", "术语表", "组织信息"],
    relatedTermIds: ["schema", "faq-schema", "defined-term"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "faq-schema",
    nameZh: "FAQ Schema",
    nameEn: "FAQ Schema",
    category: "structured-data",
    definition: "以 Schema FAQPage 类型标记问答内容的结构化数据。",
    explanation:
      "FAQ Schema 将问题与标准答案成对标记，使 AI 与搜索引擎能直接提取权威答复，常用于产品 FAQ、服务说明与技术支持页面。",
    whyImportant: "让企业在 AI 问答场景中提供可引用的标准答案，减少信息失真。",
    useCases: ["产品 FAQ", "售前咨询", "技术支持", "合规说明"],
    relatedTermIds: ["faq-system", "schema", "json-ld"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "article-schema",
    nameZh: "Article Schema",
    nameEn: "Article Schema",
    category: "structured-data",
    definition: "标记文章类内容的 Schema 类型，含标题、作者、日期等元数据。",
    explanation:
      "Article Schema 为博客、案例、白皮书等长文提供机器可读的元信息，帮助 AI 判断内容时效性、来源可信度与主题归属。",
    whyImportant: "提升专业内容在 AI 检索中的权重与引用准确性。",
    useCases: ["案例文章", "行业洞察", "产品发布", "技术博客"],
    relatedTermIds: ["schema", "ai-summary", "citation"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "defined-term",
    nameZh: "DefinedTerm",
    nameEn: "DefinedTerm",
    category: "structured-data",
    definition: "Schema 中用于定义术语及其解释的实体类型。",
    explanation:
      "DefinedTerm 与 DefinedTermSet 可构建机器可读的术语表，明确每个词条的中英文名称、定义与所属集合，是术语表页面的标准 Schema 表达。",
    whyImportant: "帮助企业与 AI 使用统一语言描述业务概念，减少沟通歧义。",
    useCases: ["企业术语表", "行业词汇", "产品名词解释", "Glossary 页面"],
    relatedTermIds: ["schema", "json-ld", "enterprise-terminology"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "organization-schema",
    nameZh: "Organization Schema",
    nameEn: "Organization Schema",
    category: "structured-data",
    definition: "描述企业主体信息的 Schema 类型。",
    explanation:
      "Organization Schema 标记公司名称、官网、联系方式、Logo 等基础实体信息，是 AI 识别「这是谁」的权威信号。",
    whyImportant: "建立企业在 AI 知识图谱中的主体锚点，关联产品、服务与内容。",
    useCases: ["官网首页", "关于我们", "联系页", "全站实体关联"],
    relatedTermIds: ["schema", "json-ld", "knowledge-graph"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "llms-txt",
    nameZh: "llms.txt",
    nameEn: "llms.txt",
    category: "ai-interfaces",
    definition: "面向大语言模型的站点说明与导航文件。",
    explanation:
      "llms.txt 类似 robots.txt，但以 Markdown 形式向 AI 说明网站结构、核心页面、更新策略与使用边界，帮助模型高效发现与理解站点。",
    whyImportant: "主动引导 AI 理解站点架构，缩短发现关键内容的路径。",
    useCases: ["企业官网", "文档站", "知识库入口", "API 说明"],
    relatedTermIds: ["ai-sitemap", "robots-txt", "mcp"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
  {
    id: "ai-sitemap",
    nameZh: "AI Sitemap",
    nameEn: "AI Sitemap",
    category: "ai-interfaces",
    definition: "为 AI 爬虫优化的站点地图，标注页面优先级与语义类型。",
    explanation:
      "AI Sitemap 在传统 sitemap 基础上增加页面语义标签、摘要与更新频率，帮助 AI 系统按优先级抓取高价值内容。",
    whyImportant: "确保 AI 优先发现 FAQ、术语、案例等核心知识页面。",
    useCases: ["大型官网", "知识库", "多产品线站点"],
    relatedTermIds: ["llms-txt", "robots-txt", "geo"],
    recommendedReading: [{ label: "老网站AI友好度升级", href: "/ai-friendly-upgrade" }],
  },
  {
    id: "robots-txt",
    nameZh: "robots.txt",
    nameEn: "robots.txt",
    category: "content-governance",
    definition: "声明爬虫抓取范围与规则的根目录文本文件。",
    explanation:
      "robots.txt 控制搜索引擎与 AI 爬虫可访问的路径。在 GEO 语境下，需平衡开放核心知识页与保护敏感接口。",
    whyImportant: "避免 AI 抓取无关或敏感页面，引导爬虫聚焦高价值内容。",
    useCases: ["爬虫策略", "内容开放范围", "与 llms.txt 协同"],
    relatedTermIds: ["llms-txt", "ai-sitemap"],
    recommendedReading: [{ label: "老网站AI友好度升级", href: "/ai-friendly-upgrade" }],
  },
  {
    id: "mcp",
    nameZh: "MCP",
    nameEn: "Model Context Protocol",
    category: "ai-interfaces",
    definition: "连接 AI 模型与企业数据系统的开放协议标准。",
    explanation:
      "MCP（Model Context Protocol）定义 AI 助手如何安全调用企业 API、数据库与工具，实现可审计、可授权的知识访问，而非仅依赖公开网页抓取。",
    whyImportant: "让企业知识从「被动被抓取」升级为「主动可调用」，拓展 AI 服务边界。",
    useCases: ["企业知识库对接", "客服 Agent", "内部 Copilot", "销售助手"],
    relatedTermIds: ["agent", "openapi", "enterprise-knowledge-base"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "openapi",
    nameZh: "OpenAPI",
    nameEn: "OpenAPI Specification",
    category: "ai-interfaces",
    definition: "描述 REST API 接口的机器可读规范格式。",
    explanation:
      "OpenAPI（原 Swagger）以 YAML 或 JSON 定义 API 路径、参数与响应，是 AI Agent 理解与调用企业接口的基础文档标准。",
    whyImportant: "为 AI Agent 提供精确的接口契约，支撑自动化调用与集成。",
    useCases: ["API 文档", "Agent 工具注册", "MCP 服务描述"],
    relatedTermIds: ["mcp", "agent"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "agent",
    nameZh: "Agent",
    nameEn: "AI Agent",
    category: "ai-interfaces",
    definition: "能自主规划步骤并调用工具完成任务的 AI 程序实体。",
    explanation:
      "AI Agent 结合大模型推理与外部工具（搜索、API、数据库），可执行多步任务。企业可通过 MCP 与 OpenAPI 为 Agent 提供安全知识访问能力。",
    whyImportant: "Agent 正在成为 B2B 客户服务与内部效率工具的核心形态。",
    useCases: ["智能客服", "销售助理", "知识检索", "流程自动化"],
    relatedTermIds: ["mcp", "openapi", "enterprise-knowledge-base"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "knowledge-graph",
    nameZh: "Knowledge Graph",
    nameEn: "Knowledge Graph",
    category: "knowledge-assets",
    definition: "以实体与关系表达领域知识的结构化网络。",
    explanation:
      "知识图谱将企业、产品、服务、案例、术语等实体及其关系显式建模，使 AI 能进行关联推理而非孤立理解单页内容。",
    whyImportant: "构建企业知识的「语义骨架」，提升 AI 对业务全貌的理解深度。",
    useCases: ["企业知识库", "产品关联", "行业术语网络", "智能问答"],
    relatedTermIds: ["schema", "enterprise-knowledge-base", "enterprise-terminology"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "enterprise-knowledge-base",
    nameZh: "企业知识库",
    nameEn: "Enterprise Knowledge Base",
    category: "knowledge-assets",
    definition: "集中管理企业事实、文档与问答的可检索知识系统。",
    explanation:
      "企业知识库将分散于 Wiki、PPT、CRM 中的产品资料、技术文档、案例与 FAQ 统一沉淀，输出 AI 可理解、人类可复查的结构化内容。",
    whyImportant: "让官网与知识库成为 AI 回答时的权威信源，而非依赖第三方转述。",
    useCases: ["官网内容源", "销售赋能", "客户自助", "AI 引用源"],
    relatedTermIds: ["faq-system", "enterprise-terminology", "knowledge-graph", "mcp"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "enterprise-terminology",
    nameZh: "企业术语库",
    nameEn: "Enterprise Terminology",
    category: "knowledge-assets",
    definition: "企业专属的术语定义与统一命名体系。",
    explanation:
      "企业术语库收录产品名、技术概念、行业用语的标准定义与关联关系，对内统一沟通，对外帮助 AI 准确理解企业语言。",
    whyImportant: "消除内部与外部对同一概念的不同理解，提升 AI 引用准确度。",
    useCases: ["Glossary 页面", "销售话术", "技术文档", "品牌一致性"],
    relatedTermIds: ["defined-term", "faq-system", "geo"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "faq-system",
    nameZh: "FAQ体系",
    nameEn: "FAQ System",
    category: "knowledge-assets",
    definition: "围绕用户高频问题构建的标准问答知识模块。",
    explanation:
      "FAQ 体系将售前、售后与技术支持中的重复问题整理为标准问答对，配合 FAQ Schema 输出，成为 AI 可直接引用的答案库。",
    whyImportant: "降低 AI 幻觉风险，用企业标准答案替代模型猜测。",
    useCases: ["售前咨询", "产品说明", "技术支持", "合规披露"],
    relatedTermIds: ["faq-schema", "enterprise-knowledge-base", "ai-chunk"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "semantic-search",
    nameZh: "Semantic Search",
    nameEn: "Semantic Search",
    category: "ai-search",
    definition: "基于语义理解而非关键词匹配的检索方式。",
    explanation:
      "语义搜索通过向量嵌入与语义模型理解查询意图，返回含义相近的内容。GEO 与知识库建设需考虑语义层面的内容组织。",
    whyImportant: "AI 搜索本质是语义检索；内容需按语义单元组织以提升召回与匹配质量。",
    useCases: ["站内搜索", "知识库检索", "AI 问答召回", "相似案例推荐"],
    relatedTermIds: ["ai-search", "knowledge-graph", "ai-chunk"],
    recommendedReading: [{ label: "企业知识库工程", href: "/enterprise-knowledge-base" }],
  },
  {
    id: "citation",
    nameZh: "Citation",
    nameEn: "Citation",
    category: "ai-search",
    definition: "AI 回答中附带的来源引用与出处标注。",
    explanation:
      "Citation 是 AI 搜索引擎在生成答案时标注的信息来源链接或引用片段。被频繁引用的页面将获得更高品牌可信度与流量回流。",
    whyImportant: "GEO 的核心目标之一——让企业在 AI 答案中获得带来源的可信引用。",
    useCases: ["品牌曝光", "流量回流", "权威建设", "竞争差异化"],
    relatedTermIds: ["geo", "ai-search", "article-schema"],
    recommendedReading: [{ label: "GEO原生建站", href: "/geo-native-website" }],
  },
];

const termMap = new Map(glossaryTerms.map((term) => [term.id, term]));

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return termMap.get(id);
}

export function getRelatedTermNames(ids: string[]): string[] {
  return ids
    .map((id) => termMap.get(id)?.nameZh)
    .filter((name): name is string => Boolean(name));
}

export function filterGlossaryTerms(
  category: GlossaryCategoryFilter,
  query: string,
): GlossaryTerm[] {
  const normalized = query.trim().toLowerCase();

  return glossaryTerms.filter((term) => {
    const matchesCategory = category === "all" || term.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;

    const haystack = [term.nameZh, term.nameEn, term.definition].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getGlossaryPageContent(): BaseContent {
  return {
    id: "glossary",
    metadata: {
      title: glossaryMeta.title,
      summary: glossaryMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "top",
        aiChunk: "top",
        title: "GEO 与 AI 搜索术语表",
        summary: glossaryMeta.description,
        body: glossaryHeroTags.join("、"),
      },
      {
        id: "terms-list",
        aiChunk: "terms-list",
        title: "术语定义",
        summary: "按 GEO 基础、AI 搜索等主题浏览 YFYK 常用核心概念。",
        body: glossaryTerms
          .map(
            (term) =>
              `### ${term.nameZh} (${term.nameEn}) {#${term.id}}\n${term.definition}\n\n${term.explanation}`,
          )
          .join("\n\n"),
      },
      {
        id: "related-knowledge",
        aiChunk: "related-knowledge",
        title: "继续了解 GEO 知识体系",
        summary: "继续了解 GEO 原生建站、老站升级与企业知识库工程。",
        body: "- [GEO原生建站](/geo-native-website)\n- [老网站AI友好度升级](/ai-friendly-upgrade)\n- [企业知识库工程](/enterprise-knowledge-base)",
      },
      {
        id: "contact-cta",
        aiChunk: "contact-cta",
        title: "联系我们",
        summary: "获取 GEO 方案建议与网站诊断支持。",
        body: "[联系我们](/contact)",
      },
    ],
  };
}
