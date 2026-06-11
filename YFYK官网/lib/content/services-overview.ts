export const servicesOverviewFaqs = [
  {
    question: "GEO 和传统 SEO 有什么区别？",
    answer: "SEO 主要针对百度、谷歌等搜索引擎排名；GEO 针对文心一言、Kimi、ChatGPT 等生成式 AI 的公开信息理解与引用偏好。我们以国内 AI 为核心优化，同时兼容国际模型，让企业事实更容易进入可验证的回答依据。",
  },
  {
    question: "为什么优先做国内 AI？国外 AI 不重要吗？",
    answer: "对于大多数中国企业，客户更常使用中文 AI 助手查询产品和服务。国内 AI 的业务转化路径更直接，国际 AI 仍然重要，因此我们会同步兼容，但实施优先级以国内业务场景为主。",
  },
  {
    question: "你们的服务包含国内 AI 适配吗？需要额外收费吗？",
    answer: "包含。所有服务默认覆盖文心一言、通义千问、Kimi 等主流国内 AI 的公开内容适配，不额外收费。如果您的行业有特殊要求，例如对接政府数据平台，可按需定制。",
  },
];

export const servicesOverviewPlatforms = [
  { label: "重点适配", platforms: ["文心一言", "通义千问", "Kimi", "智谱清言", "豆包", "百度AI摘要"] },
  { label: "兼容支持", platforms: ["ChatGPT", "Perplexity", "Claude"] },
];

export const coreProductServices = [
  {
    id: "ai-enterprise-site",
    title: "AI企业官网",
    description: "适合制造、B2B 服务等综合型企业，内置国内 AI 更易理解的结构化数据与企业资质标记。",
    href: "/geo-native-website#ai-enterprise-site",
    tags: ["GEO原生", "行业Know-how"],
  },
  {
    id: "ai-brand-site",
    title: "AI品牌官网",
    description: "适合消费品牌、高端服务，突出品牌调性，同时满足国内 AI 的内容抓取与事实定位规范。",
    href: "/geo-native-website#ai-brand-site",
    tags: ["品牌溢价", "叙事驱动"],
  },
  {
    id: "ai-global-site",
    title: "AI外贸独立站",
    description: "针对跨境场景，提供多语言 GEO 优化，优先提升国内 AI 对企业的认知，同时兼顾海外 AI。",
    href: "/geo-native-website#ai-global-site",
    tags: ["多语言GEO", "询盘转化"],
  },
];

export const geoNativeDeliveryStandards = [
  "页面矩阵与 SSOT 注册表",
  "HTML / Markdown / JSON-LD 同源交付",
  "构建门禁与 CLA 验收报告",
  "首月 GEO 复查与内容健康度记录",
];

export const upgradeOverviewServices = [
  {
    number: "01",
    type: "诊断类",
    title: "GEO策略与审计",
    description: "出具网站当前的 AI 可见度报告，包含国内 AI 专项检查，找出容易被忽略的关键内容缺口。",
    href: "/ai-friendly-upgrade#geo-audit",
  },
  {
    number: "02",
    type: "改造类",
    title: "内容结构化重塑",
    description: "为现有文章和产品页补充 Schema、中文摘要与公开事实结构优化，让 AI 更易提取核心信息。",
    href: "/ai-friendly-upgrade#content-structure",
  },
  {
    number: "03",
    type: "改造类",
    title: "权威背书强化",
    description: "强化 ICP 备案、企业资质和国内行业认证等公开依据的机器可读性，增强可核验信号。",
    href: "/ai-friendly-upgrade#authority",
  },
  {
    number: "04",
    type: "监测类",
    title: "GEO监测与报告",
    description: "周期记录公开引用样本、内容健康度和可复查信号，同时兼顾国内与国际模型表现。",
    href: "/ai-friendly-upgrade#monitoring",
  },
  {
    number: "05",
    type: "连接类",
    title: "基础MCP接口集成",
    description: "打通 MCP 协议，允许授权 AI 调用公开数据，并为后续国内 API 适配预留扩展能力。",
    href: "/ai-friendly-upgrade#mcp-basic",
    tooltip: "MCP 是 AI 与数据源之间的标准协议。集成后，授权 AI 可实时调用您的产品参数。",
  },
];

export const knowledgeOverviewServices = [
  {
    title: "信源战略规划",
    description: "定义核心知识领域、关键词阶梯及内容边界，优先面向国内 AI 的认知习惯。",
    href: "/enterprise-knowledge-base#geo-knowledge-center",
    why: "先明确哪些知识值得公开，才能让投入持续沉淀为资产。",
  },
  {
    title: "深度知识工程",
    description: "将白皮书、产品文档和 FAQ 等转化为 AI 可深度理解的知识图谱与 QA 对。",
    href: "/enterprise-knowledge-base#enterprise-terminology",
    why: "没有知识工程的网站，AI 只能猜您的意思；完成后，AI 才能更准确地复述观点。",
  },
  {
    title: "高级MCP服务集成",
    description: "在授权和权限控制下支持上下文查询，并为国内企业级 AI 场景预留对接能力。",
    href: "/enterprise-knowledge-base#ai-semantic-enhancement",
    why: "公开内容与授权知识分层后，AI 工具才能在边界内获取更完整的上下文。",
  },
  {
    title: "信源运维与影响力扩张",
    description: "定期更新知识库，监测国内 AI 的公开引用变化，并拓展可核验的行业信源合作。",
    href: "/enterprise-knowledge-base#delivery-standards",
    why: "知识资产需要持续复查，才能避免产品变化后仍被旧口径影响。",
  },
];

const listServices = (items: Array<{ title: string; description: string }>) =>
  items.map((item) => `### ${item.title}\n${item.description}`).join("\n\n");

export const servicesOverviewMarkdownSections = [
  {
    id: "services-overview",
    aiChunk: "services-overview",
    title: "让AI主动找到你、信任你、推荐你",
    summary: "重点适配国内主流 AI，同时兼容国际模型。",
    body: `基于 GEO 标准，重点适配国内主流 AI（${servicesOverviewPlatforms[0].platforms.join("、")}），同时兼容国际 AI 模型（${servicesOverviewPlatforms[1].platforms.join("、")}）。从新站打造到老站升级，一步到位。`,
  },
  { id: "core-products", aiChunk: "core-products", title: "核心产品 —— 从零构建AI友好型官网", summary: "从零构建遵循 GEO 标准的 AI 友好型官网。", body: listServices(coreProductServices) },
  { id: "site-upgrade", aiChunk: "site-upgrade", title: "老网站GEO化升级", summary: "以诊断、改造、监测与连接能力完成老网站 GEO 化升级。", body: listServices(upgradeOverviewServices) },
  { id: "knowledge-source", aiChunk: "knowledge-source", title: "企业知识库信源构建", summary: "将企业专业沉淀建设为可维护、可深链、可查询的可靠信源。", body: listServices(knowledgeOverviewServices) },
  { id: "service-selector", aiChunk: "service-selector", title: "你是哪一种情况？", summary: "根据企业当前阶段快速选择对应服务板块。", body: "- 我是全新品牌，想一步到位\n- 我有老网站，希望低成本见效\n- 我想成为行业AI信源" },
  { id: "frequently-asked-questions", aiChunk: "frequently-asked-questions", title: "常见问题", summary: "回答 GEO、国内 AI 优先级和默认适配范围。", body: servicesOverviewFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n") },
  { id: "contact-cta", aiChunk: "contact-cta", title: "预约免费咨询", summary: "通过联系页沟通项目范围并获取 GEO 服务概览。", body: "[预约免费咨询](/contact)\n\n[获取GEO服务概览](/contact)" },
];
