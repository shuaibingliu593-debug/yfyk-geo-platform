import type { FaqItem } from "@/lib/content/types";

export const ekbMeta = {
  title: "企业知识库工程｜YFYK 企业知识中心建设服务",
  description:
    "YFYK帮助企业建设面向AI时代的知识库工程，包括GEO知识中心、FAQ知识体系、企业术语库和AI语义增强，让企业知识被AI理解、引用和持续积累。",
  path: "/enterprise-knowledge-base",
};

export const ekbHeroTags = [
  "知识资产沉淀",
  "AI可理解",
  "AI可引用",
  "统一知识源",
  "支持GEO",
];

export const ekbHeroFlow = {
  scattered: ["产品资料", "FAQ", "案例", "技术文档", "白皮书"],
  structured: ["分类", "标签", "术语", "FAQ", "Schema"],
  aiReady: ["AI理解", "AI引用", "AI推荐"],
};

export const ekbCapabilityCards = [
  {
    id: "geo-knowledge-center",
    title: "GEO知识中心",
    description: "统一管理企业核心知识内容，让分散资料形成可被AI理解的知识源。",
  },
  {
    id: "faq-knowledge-system",
    title: "FAQ知识体系",
    description: "把客户、销售、技术和售后常见问题沉淀为标准答案体系。",
  },
  {
    id: "enterprise-terminology",
    title: "企业术语库",
    description: "统一企业内部和行业表达，减少AI对概念、缩写和专业词的误解。",
  },
  {
    id: "ai-semantic-enhancement",
    title: "AI语义增强",
    description: "通过AI Summary、Schema和结构化数据，让知识更容易被AI理解与引用。",
  },
];

export type EkbServiceModule = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string[];
  coreWork: string[];
  outputs: string[];
  layout: "split" | "split-reverse";
  band?: "white" | "soft";
};

export const ekbServiceModules: EkbServiceModule[] = [
  {
    id: "geo-knowledge-center",
    eyebrow: "GEO KNOWLEDGE CENTER",
    title: "GEO知识中心",
    subtitle: "构建企业统一知识源。",
    body: [
      "很多企业已经拥有大量内容，包括产品资料、解决方案、技术文档、案例、白皮书和培训资料。但这些内容往往分散在不同页面、不同文件和不同人员经验中，导致客户找不到、员工找不到，AI也读不到。",
      "GEO知识中心的目标，是将企业分散知识统一整理、统一结构、统一表达、统一输出，让企业形成单一可信知识源。",
    ],
    coreWork: [
      "知识分类体系",
      "知识标签体系",
      "知识主题体系",
      "内容结构化",
      "知识关联关系",
      "知识更新机制",
      "AI Summary配置",
      "Article Schema配置",
    ],
    outputs: [
      "知识中心",
      "知识目录",
      "知识分类",
      "知识标签",
      "知识地图",
      "结构化知识页面",
    ],
    layout: "split",
    band: "white",
  },
  {
    id: "faq-knowledge-system",
    eyebrow: "FAQ KNOWLEDGE SYSTEM",
    title: "FAQ知识体系",
    subtitle: "把企业最常被问的问题变成标准答案。",
    body: [
      "AI最容易理解的内容形式之一是问答。很多企业不是没有专业能力，而是没有把客户、销售、技术、售后和采购过程中反复出现的问题整理成标准答案。",
      "FAQ知识体系的目标，是将企业经验转化为清晰、稳定、可复用的问答内容，让AI能够在用户提问时准确提取企业的标准回答。",
    ],
    coreWork: [
      "客户FAQ",
      "产品FAQ",
      "技术FAQ",
      "售后FAQ",
      "采购FAQ",
      "行业FAQ",
      "FAQ分类体系",
      "FAQ Schema配置",
    ],
    outputs: [
      "FAQ中心",
      "FAQ Schema",
      "FAQ知识包",
      "问答结构化数据",
      "场景化问题库",
    ],
    layout: "split-reverse",
    band: "soft",
  },
  {
    id: "enterprise-terminology",
    eyebrow: "ENTERPRISE TERMINOLOGY",
    title: "企业术语库",
    subtitle: "建立统一、标准的行业语言体系。",
    body: [
      "企业内部经常存在同一个概念多个说法、多个缩写、多个英文版本的问题。对于AI而言，这会造成概念混乱和语义误解。",
      "例如：GEO、Generative Engine Optimization、生成式引擎优化、AI搜索优化，这些可能指向同一个概念。如果没有统一术语库，AI很难判断不同表达之间的关系。",
      "企业术语库的目标，是帮助企业建立统一的概念定义、缩写映射、英文映射和上下位关系，让AI更准确地理解专业术语和业务语境。",
    ],
    coreWork: [
      "术语标准化",
      "缩写映射",
      "英文映射",
      "概念定义",
      "上下位关系",
      "相关术语关联",
      "DefinedTerm Schema配置",
    ],
    outputs: [
      "术语中心",
      "术语详情页",
      "术语关系图",
      "DefinedTerm Schema",
      "企业标准语言库",
    ],
    layout: "split",
    band: "white",
  },
  {
    id: "ai-semantic-enhancement",
    eyebrow: "AI SEMANTIC ENHANCEMENT",
    title: "AI语义增强",
    subtitle: "让知识更容易被AI理解、引用和推荐。",
    body: [
      "知识被发布出来，不代表AI一定能理解。AI需要清晰的摘要、结构化数据、语义标签和可引用内容块，才能更稳定地识别企业知识的含义和边界。",
      "AI语义增强的目标，是在知识中心、FAQ和术语内容之上，补充AI可读层，让官网知识不仅能被用户阅读，也能被AI准确解析。",
    ],
    coreWork: [
      "AI Summary",
      "JSON-LD",
      "Article Schema",
      "FAQ Schema",
      "DefinedTerm Schema",
      "语义化标题层级",
      "可引用内容块",
      "AI Sitemap配置",
    ],
    outputs: [
      "AI Summary内容包",
      "JSON-LD结构化数据",
      "Schema配置",
      "AI可读内容层",
      "AI Sitemap",
      "llms.txt知识入口",
    ],
    layout: "split-reverse",
    band: "soft",
  },
];

export const ekbDeliverySteps = [
  {
    number: "01",
    title: "知识结构标准",
    description: "建立清晰的分类、标签、主题和知识层级。",
  },
  {
    number: "02",
    title: "内容标准",
    description: "每个知识条目具备摘要、正文、FAQ、引用和更新时间。",
  },
  {
    number: "03",
    title: "术语标准",
    description: "统一术语定义、英文映射、缩写说明和相关概念关系。",
  },
  {
    number: "04",
    title: "GEO标准",
    description: "配置AI Summary、Article Schema、FAQ Schema、DefinedTerm Schema和AI Sitemap。",
  },
  {
    number: "05",
    title: "AI可读标准",
    description: "配置llms.txt、Markdown副本、可引用内容块和AI友好站点入口。",
  },
  {
    number: "06",
    title: "运维标准",
    description: "建立知识更新、内容审核、版本管理和持续优化机制。",
  },
];

export const ekbFinalDeliverables = [
  "知识中心",
  "FAQ中心",
  "术语库",
  "知识分类体系",
  "知识标签体系",
  "AI Summary内容包",
  "Schema配置",
  "llms.txt",
  "AI Sitemap",
  "维护说明书",
];

export const ekbFaqs: FaqItem[] = [
  {
    question: "企业知识库和普通文章栏目有什么区别？",
    answer:
      "普通文章栏目主要用于发布内容。企业知识库强调知识分类、术语统一、FAQ结构、Schema配置和AI可读性建设。它不仅服务用户阅读，也服务AI理解和引用。",
  },
  {
    question: "企业知识库一定需要大量文章吗？",
    answer:
      "不一定。第一阶段可以从核心业务、产品资料、FAQ和术语开始建设。关键不是数量，而是结构是否清晰、表达是否统一、内容是否可被AI理解和引用。",
  },
  {
    question: "术语库有什么价值？",
    answer:
      "术语库可以统一企业内部和外部表达，帮助客户、员工和AI理解同一个概念的不同说法、缩写和英文表达，减少误解，提高内容一致性。",
  },
  {
    question: "是否支持未来接入MCP？",
    answer:
      "支持。企业知识库工程阶段可以预留AI接口扩展能力，包括llms.txt、AI Sitemap和后续MCP扩展。但第一阶段不需要把MCP作为核心交付。",
  },
];

export const ekbMarkdownSections = [
  {
    id: "hero",
    aiChunk: "hero",
    title: "让企业知识成为 AI 的可信答案来源",
    summary: ekbServiceModules[0].subtitle,
    body: ekbMeta.description,
  },
  {
    id: "capability-overview",
    aiChunk: "capability-overview",
    title: "企业知识如何升级为 AI 可用资产",
    summary: "从知识中心、FAQ体系、术语库到AI语义增强，构建企业长期积累的知识基础设施。",
    body: ekbCapabilityCards.map((item) => `### ${item.title}\n${item.description}`).join("\n\n"),
  },
  ...ekbServiceModules.map((module) => ({
    id: module.id,
    aiChunk: module.id,
    title: module.title,
    summary: module.subtitle,
    body: `${module.body.join("\n\n")}\n\n核心建设内容：${module.coreWork.join("、")}。`,
  })),
  {
    id: "delivery-standards",
    aiChunk: "delivery-standards",
    title: "知识库交付标准",
    summary: "每一套企业知识库都按可沉淀、可检索、可引用的标准交付。",
    body: ekbDeliverySteps.map((step) => `${step.number} ${step.title}：${step.description}`).join("\n"),
  },
  {
    id: "frequently-asked-questions",
    aiChunk: "frequently-asked-questions",
    title: "常见问题",
    summary: "围绕企业知识库建设路径、术语价值和MCP扩展说明。",
    body: ekbFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n"),
  },
];
