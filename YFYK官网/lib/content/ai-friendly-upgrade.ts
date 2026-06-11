import type { FaqItem } from "@/lib/content/types";

export const aiFriendlyUpgradeMeta = {
  title: "老网站AI友好度升级｜YFYK GEO网站优化服务",
  description:
    "YFYK提供老网站AI友好度升级服务，通过GEO审计、内容结构化、权威背书强化、GEO监测、llms.txt、AI Sitemap和基础MCP接口集成，帮助企业官网适配AI搜索时代。",
  path: "/ai-friendly-upgrade",
};

export const afuHeroTags = [
  "不重做官网",
  "提升AI可读性",
  "补齐结构化数据",
  "强化权威信源",
  "支持GEO监测",
];

export const afuHeroBefore = ["AI难理解", "引用率低", "推荐机会少"];
export const afuHeroAfter = ["AI可理解", "AI可引用", "AI可推荐"];

export const afuCapabilityCards = [
  {
    id: "geo-audit",
    title: "GEO策略与审计",
    description: "诊断现有官网的 AI 可抓取性、语义结构、内容缺口和优化优先级。",
  },
  {
    id: "content-structure",
    title: "内容结构化重塑",
    description: "将旧网站内容重构为大模型更容易读取、理解和引用的知识块。",
  },
  {
    id: "authority",
    title: "权威背书强化",
    description: "把资质、认证、案例、媒体和标准转化为 AI 能识别的可信信号。",
  },
  {
    id: "monitoring",
    title: "GEO监测与报告",
    description: "持续追踪网站在 AI 搜索中的提及、引用和内容覆盖表现。",
  },
  {
    id: "mcp-basic",
    title: "基础MCP接口集成",
    description: "为未来 AI Agent 调用企业公开数据预留标准化接口能力。",
  },
];

export type AfuServiceModule = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string[];
  coreWork: string[];
  outputs: string[];
  layout: "split" | "split-reverse" | "stack";
  note?: string;
};

export const afuServiceModules: AfuServiceModule[] = [
  {
    id: "geo-audit",
    eyebrow: "GEO AUDIT",
    title: "GEO策略与审计",
    subtitle: "先诊断，再升级，避免盲目改版。",
    body: [
      "传统网站审计关注页面速度、关键词和SEO标题，但 AI 搜索时代更重要的是：AI 能不能抓到核心内容，能不能理解主营业务，能不能识别资质、案例和服务边界。",
      "我们会从 AI 可抓取性、语义结构、内容可信度、结构化数据和引用潜力五个维度，对现有官网进行系统评估，并输出可执行的升级路线。",
    ],
    coreWork: [
      "全站页面清单梳理",
      "核心页面优先级判断",
      "AI可抓取性检查",
      "页面语义结构审计",
      "Schema缺失检测",
      "FAQ与问答内容审计",
      "权威信源缺口分析",
      "GEO评分与问题清单",
    ],
    outputs: [
      "GEO审计报告",
      "页面优先级列表",
      "问题诊断清单",
      "升级路线图",
      "GEO评分基线",
    ],
    layout: "split",
  },
  {
    id: "content-structure",
    eyebrow: "CONTENT STRUCTURE",
    title: "内容结构化重塑",
    subtitle: "让企业内容从「展示文案」变成「AI可理解的知识块」。",
    body: [
      "很多旧网站并不缺内容，缺的是清晰结构。企业介绍、产品说明、服务能力、案例成果、FAQ和资质信息常常散落在不同页面中，AI难以判断哪些是核心事实，哪些只是营销表达。",
      "内容结构化重塑的目标，是将原有内容重新拆解为事实、定义、能力、场景、FAQ和证据，让大模型更准确地理解企业是谁、做什么、适合谁、有什么可信依据。",
    ],
    coreWork: [
      "首页信息层级重构",
      "服务页面语义重写",
      "案例内容结构化",
      "FAQ问答体系补全",
      "AI Summary编写",
      "页面标题层级优化",
      "内部链接与上下文补强",
      "JSON-LD结构化数据配置",
    ],
    outputs: [
      "核心页面优化稿",
      "AI Summary内容包",
      "FAQ内容包",
      "页面结构建议",
      "内容块拆分方案",
    ],
    layout: "split-reverse",
  },
  {
    id: "authority",
    eyebrow: "AUTHORITY",
    title: "权威背书强化",
    subtitle: "让资质、案例、媒体与标准成为 AI 判断可信度的证据链。",
    body: [
      "大模型不会只因为企业自己说「专业」就引用它。它更倾向于识别有明确证据支撑的内容，例如专利资质、高新技术企业、行业认证、客户案例、媒体报道、标准文件和公开可验证链接。",
      "权威背书强化的目标，是把分散在网站中的资质、案例、荣誉、媒体报道和行业证据，整理为 AI 更容易识别的可信信源体系。",
    ],
    coreWork: [
      "企业资质梳理",
      "专利与证书结构化",
      "案例成果脱敏表达",
      "媒体报道与外部链接整理",
      "权威来源标注",
      "证据链页面设计",
      "Organization Schema补强",
      "Citation信息配置",
    ],
    outputs: [
      "权威信源清单",
      "资质结构化内容",
      "案例证据块",
      "外部引用链接",
      "可信度优化建议",
    ],
    layout: "split",
  },
  {
    id: "monitoring",
    eyebrow: "MONITORING",
    title: "GEO监测与报告",
    subtitle: "用数据持续追踪 AI 是否理解、提及和引用你的企业。",
    body: [
      "GEO不是一次性工作。随着网站内容更新、AI模型迭代和行业竞争变化，企业需要持续了解哪些页面更容易被 AI 抓取，哪些内容更容易被引用，品牌是否出现在 AI 推荐结果中，以及哪些问题场景下企业没有出现。",
      "GEO监测与报告帮助企业建立持续优化机制，让网站从一次性改版，变成可持续增长的 AI 内容资产。",
    ],
    coreWork: [
      "GEO评分监测",
      "页面优化前后对比",
      "AI引用样本记录",
      "品牌提及趋势分析",
      "问题场景覆盖分析",
      "低分页面预警",
      "月度优化报告",
    ],
    outputs: [
      "GEO评分报告",
      "页面改进趋势",
      "AI引用样本",
      "问题覆盖分析",
      "下阶段优化建议",
    ],
    layout: "stack",
  },
  {
    id: "mcp-basic",
    eyebrow: "MCP INTEGRATION",
    title: "基础MCP接口集成",
    subtitle: "从被动等待 AI 抓取，升级为向 AI 提供可调用的可信数据入口。",
    body: [
      "传统官网依赖 AI 爬虫被动抓取页面内容，但在企业知识库、产品参数、FAQ和公开资料不断更新的场景下，仅靠页面抓取并不够稳定。",
      "基础MCP接口集成的目标，是将企业允许公开的数据，以标准化接口形式提供给大模型或智能体调用。",
    ],
    coreWork: [
      "公开数据范围定义",
      "只读数据集整理",
      "MCP Endpoint配置",
      "OpenAPI接口配置",
      "llms.txt指引配置",
      "调用权限与安全边界设计",
    ],
    outputs: [
      "MCP接口方案",
      "公开数据集清单",
      "llms.txt接口指引",
      "API文档",
      "安全边界说明",
    ],
    layout: "split",
    note: "基础MCP接口集成可作为第二阶段能力。如果企业暂时不需要实时数据调用，可以先完成GEO基础升级。",
  },
];

export const afuMcpOpenData = [
  "产品参数",
  "服务说明",
  "FAQ",
  "知识库",
  "案例摘要",
  "公开资料",
];

export const afuDeliverySteps = [
  {
    number: "01",
    title: "诊断标准",
    description: "完成核心页面、内容结构、Schema、FAQ、llms.txt和AI Sitemap的基础检查。",
  },
  {
    number: "02",
    title: "内容标准",
    description: "为核心页面补充AI Summary、FAQ、语义标题层级和结构化内容块。",
  },
  {
    number: "03",
    title: "技术标准",
    description: "补充JSON-LD、Schema、Meta、Canonical、llms.txt和AI Sitemap。",
  },
  {
    number: "04",
    title: "信任标准",
    description: "梳理资质、认证、案例、媒体、标准和外部引用，形成可信证据链。",
  },
  {
    number: "05",
    title: "监测标准",
    description: "建立GEO评分、问题清单、优化建议和阶段性报告机制。",
  },
  {
    number: "06",
    title: "文档标准",
    description: "交付升级说明、页面清单、配置说明和后续维护建议。",
  },
];

export const afuFinalDeliverables = [
  "GEO审计报告",
  "核心页面优化建议",
  "AI Summary内容包",
  "FAQ内容包",
  "Schema JSON-LD",
  "llms.txt",
  "AI Sitemap",
  "权威信源清单",
  "GEO评分报告",
  "上线检查清单",
];

export const afuFaqs: FaqItem[] = [
  {
    question: "老网站AI友好度升级一定要重做官网吗？",
    answer:
      "不一定。如果原网站技术结构和页面质量较好，可以在不推翻原网站的基础上补充AI Summary、Schema、FAQ、llms.txt、AI Sitemap和内容结构化优化。如果原网站内容混乱、技术老旧或无法支持服务端渲染，则建议逐步重构。",
  },
  {
    question: "GEO升级和传统SEO优化有什么区别？",
    answer:
      "SEO更关注搜索引擎排名、关键词和外链；GEO更关注大模型能否抓取、理解、信任并引用企业内容。GEO需要处理AI摘要、结构化数据、事实块、FAQ、权威证据链和AI抓取入口。",
  },
  {
    question: "升级后多久能看到效果？",
    answer:
      "GEO效果取决于网站规模、内容质量、AI抓取频率和行业竞争情况。短期可以看到GEO评分和结构化覆盖率提升，中长期需要通过AI引用样本、品牌提及和搜索场景覆盖情况持续观察。",
  },
  {
    question: "MCP接口是否第一阶段必须做？",
    answer:
      "不一定。对于大多数企业官网，第一阶段优先完成GEO审计、内容结构化、Schema、llms.txt和AI Sitemap即可。MCP接口更适合产品数据、知识库或FAQ频繁更新的企业，通常可以作为第二阶段能力建设。",
  },
];

export const afuMarkdownSections = [
  {
    id: "hero",
    aiChunk: "hero",
    title: "让已有官网适配 AI 搜索时代",
    summary: afuServiceModules[0].subtitle,
    body: aiFriendlyUpgradeMeta.description,
  },
  {
    id: "capability-overview",
    aiChunk: "capability-overview",
    title: "老网站如何完成 AI 友好度升级",
    summary: "从诊断、内容、信任、监测到接口能力，系统性提升旧网站在 AI 搜索中的可见度。",
    body: afuCapabilityCards.map((item) => `### ${item.title}\n${item.description}`).join("\n\n"),
  },
  ...afuServiceModules.map((module) => ({
    id: module.id,
    aiChunk: module.id,
    title: module.title,
    summary: module.subtitle,
    body: `${module.body.join("\n\n")}\n\n核心工作：${module.coreWork.join("、")}。`,
  })),
  {
    id: "delivery-standards",
    aiChunk: "delivery-standards",
    title: "升级交付标准",
    summary: "每一次老网站 AI 友好度升级，都按可检测、可交付、可持续优化的标准完成。",
    body: afuDeliverySteps.map((step) => `${step.number} ${step.title}：${step.description}`).join("\n"),
  },
  {
    id: "frequently-asked-questions",
    aiChunk: "frequently-asked-questions",
    title: "常见问题",
    summary: "围绕升级路径、GEO与SEO差异、效果观测和MCP阶段说明。",
    body: afuFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n"),
  },
];
