import type { FaqItem } from "@/lib/content/types";

export const geoNativeWebsiteMeta = {
  title: "GEO原生建站 | 优服优科",
  description:
    "从零构建 AI 时代的企业官网。让官网成为能被大模型准确理解、抓取与引用的企业数字资产，覆盖 AI 企业官网、品牌官网与外贸独立站。",
  path: "/geo-native-website",
};

export const geoNativeHeroTags = ["AI可读", "结构清晰", "内容可信", "可被引用", "支持GEO"];

export const geoNativeThemeCards = [
  {
    id: "ai-enterprise-site",
    title: "AI企业官网",
    description: "为B2B企业、制造业、科技企业建立能被客户看懂，也能被AI读懂的官网系统。",
  },
  {
    id: "ai-brand-site",
    title: "AI品牌官网",
    description: "统一品牌定位、行业角色和权威背书，让品牌表达更容易被AI理解与引用。",
  },
  {
    id: "ai-global-site",
    title: "AI外贸独立站",
    description: "面向海外客户和AI搜索入口，建设更容易被理解、信任和询盘的外贸官网。",
  },
  {
    id: "delivery-standards",
    title: "建站交付标准",
    description: "每一个GEO原生网站，都按AI可读、可理解、可引用的标准交付。",
  },
];

export type GeoNativeBusinessModule = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  questions?: string[];
  coreItems: string[];
  clients: string[];
  pages: string[];
};

export const geoNativeBusinessModules: GeoNativeBusinessModule[] = [
  {
    id: "ai-enterprise-site",
    eyebrow: "AI ENTERPRISE SITE",
    title: "AI企业官网",
    subtitle: "为企业建立一套能被客户看懂，也能被AI读懂的官网系统。",
    body: "传统企业官网往往只关注视觉展示，但在AI搜索时代，客户可能不会先打开你的网站，而是直接向AI提问：",
    questions: [
      "有哪些可靠的医疗器械供应商？",
      "哪家公司可以做企业AI知识库？",
      "某某行业有哪些专业服务商？",
    ],
    coreItems: [
      "企业定位重构",
      "业务能力结构化",
      "服务页面设计",
      "案例与资质展示",
      "FAQ体系建设",
      "Schema结构化数据",
      "llms.txt配置",
      "AI Sitemap配置",
    ],
    clients: [
      "B2B企业",
      "制造业企业",
      "医疗器械企业",
      "SaaS企业",
      "科技服务公司",
      "产业服务机构",
    ],
    pages: ["首页", "服务页", "案例页", "关于我们", "FAQ中心", "联系我们"],
  },
  {
    id: "ai-brand-site",
    eyebrow: "AI BRAND SITE",
    title: "AI品牌官网",
    subtitle: "让品牌形象、专业价值和行业认知，在AI回答中形成统一表达。",
    body: "AI品牌官网不只是「更好看的网站」，而是帮助企业建立统一、清晰、可信的品牌表达系统。我们会围绕品牌定位、核心能力、行业角色、代表案例和权威背书，建立一套适合人类阅读，也适合AI理解的品牌内容结构。",
    coreItems: [
      "品牌定位表达",
      "品牌故事梳理",
      "行业角色定义",
      "权威背书呈现",
      "专家观点内容",
      "媒体与资质引用",
      "品牌FAQ",
      "Organization Schema",
    ],
    clients: [
      "成长型品牌",
      "科技品牌",
      "高端服务品牌",
      "产业品牌",
      "出海品牌",
      "集团型企业",
    ],
    pages: [
      "品牌首页",
      "品牌故事",
      "核心能力",
      "品牌案例",
      "权威背书",
      "媒体动态",
      "联系咨询",
    ],
  },
  {
    id: "ai-global-site",
    eyebrow: "AI GLOBAL SITE",
    title: "AI外贸独立站",
    subtitle: "面向海外客户和AI搜索场景，构建更容易被理解、信任和询盘的外贸官网。",
    body: "AI外贸独立站不仅要考虑海外客户的浏览体验，还要考虑 ChatGPT、Gemini、Perplexity、Google AI Overview 等 AI 搜索入口如何理解企业。我们会围绕产品目录、应用场景、技术参数、认证资质、出口能力和询盘路径，建立适合海外AI搜索的站点结构。",
    coreItems: [
      "英文/多语言内容架构",
      "产品目录结构",
      "应用场景页面",
      "技术参数页面",
      "认证资质展示",
      "询盘表单设计",
      "Product Schema",
      "FAQ Schema",
      "多语言SEO/GEO配置",
    ],
    clients: [
      "外贸工厂",
      "出口制造商",
      "跨境B2B企业",
      "医疗器械出口企业",
      "工业设备企业",
      "消费品品牌出海",
    ],
    pages: [
      "Homepage",
      "Products",
      "Applications",
      "Solutions",
      "Certifications",
      "FAQ",
      "Contact / Inquiry",
    ],
  },
];

export const geoNativeDeliverySteps = [
  {
    number: "01",
    title: "信息架构标准",
    description: "清晰定义首页、服务页、案例页、知识页、FAQ页的层级关系。",
  },
  {
    number: "02",
    title: "内容结构标准",
    description: "每个核心页面具备标题、摘要、正文、FAQ、证据链和CTA。",
  },
  {
    number: "03",
    title: "GEO语义标准",
    description: "配置AI Summary、Schema、AI Facts、llms.txt、AI Sitemap。",
  },
  {
    number: "04",
    title: "技术性能标准",
    description: "支持SSR/SSG、移动端适配、页面速度优化、基础安全配置。",
  },
  {
    number: "05",
    title: "AI抓取标准",
    description: "确保核心内容不是纯JS动态加载，AI爬虫可直接读取页面主要内容。",
  },
  {
    number: "06",
    title: "交付文档标准",
    description: "交付页面清单、字段说明、GEO配置说明、后续维护建议。",
  },
];

export const geoNativeFinalDeliverables = [
  "官网前端页面",
  "后台GEO配置",
  "llms.txt",
  "AI Sitemap",
  "Schema JSON-LD",
  "页面SEO基础配置",
  "GEO评分报告",
  "上线检查清单",
];

export const geoNativeFaqs: FaqItem[] = [
  {
    question: "什么是GEO原生建站？",
    answer:
      "GEO原生建站是指从网站架构、内容结构、Schema、llms.txt、AI Sitemap和页面语义层开始，为生成式AI搜索和大模型理解机制设计的网站建设方式。",
  },
  {
    question: "它和传统官网有什么区别？",
    answer:
      "传统官网主要面向用户浏览和搜索引擎收录，GEO原生官网同时面向用户、搜索引擎和大模型，重点解决AI能否抓取、理解、信任并引用企业内容的问题。",
  },
  {
    question: "适合哪些企业？",
    answer:
      "适合B2B企业、制造业企业、科技服务企业、医疗器械企业、外贸企业、SaaS企业和正在进行AI搜索优化的品牌。",
  },
  {
    question: "是否一定要重做官网？",
    answer:
      "不一定。如果原官网结构较好，可以做AI友好度升级；如果原官网结构混乱、内容老旧或技术栈不适合AI抓取，建议做GEO原生建站。",
  },
];

export const geoNativeMarkdownSections = [
  {
    id: "hero",
    aiChunk: "hero",
    title: "从零构建 AI 时代的企业官网",
    summary:
      "让官网成为能被豆包、DeepSeek、Kimi、通义、ChatGPT 等大模型准确理解、抓取与引用的企业数字资产。",
    body: "GEO原生建站覆盖 AI 企业官网、AI 品牌官网、AI 外贸独立站三大业务类型，并按 AI 可读、可理解、可引用标准交付。",
  },
  {
    id: "theme-overview",
    aiChunk: "theme-overview",
    title: "四大主题总览",
    summary: "AI企业官网、AI品牌官网、AI外贸独立站与建站交付标准。",
    body: geoNativeThemeCards.map((item) => `### ${item.title}\n${item.description}`).join("\n\n"),
  },
  ...geoNativeBusinessModules.map((module) => ({
    id: module.id,
    aiChunk: module.id,
    title: module.title,
    summary: module.subtitle,
    body: `${module.body}\n\n核心建设内容：${module.coreItems.join("、")}。`,
  })),
  {
    id: "delivery-standards",
    aiChunk: "delivery-standards",
    title: "建站交付标准",
    summary: "每一个 GEO 原生网站，都按 AI 可读、可理解、可引用的标准交付。",
    body: geoNativeDeliverySteps.map((step) => `${step.number} ${step.title}：${step.description}`).join("\n"),
  },
  {
    id: "frequently-asked-questions",
    aiChunk: "frequently-asked-questions",
    title: "常见问题",
    summary: "围绕 GEO 原生建站定义、适用场景与实施路径说明。",
    body: geoNativeFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n"),
  },
];
