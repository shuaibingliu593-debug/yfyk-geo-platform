import type { BaseContent, NavItem, ProcessStep, ServiceCard } from "./types";
import { caseStudies } from "./cases";
import { businessTechOutlineBody } from "./business-tech-outline";
import { geoServiceFlowBody } from "./geo-service-flow";
import { siteMenus } from "./navigation";

export { caseStudies } from "./cases";

export const siteConfig = {
  brand: "优服优科",
  logoSrc: "/images/yfyk-logo.png",
  logoSrcLight: "/images/yfyk-logo-light.png",
  logoAlt: "YFYK 优服优科",
  logoWidth: 400,
  logoHeight: 125,
  legalName: "上海优服优科模型科技有限公司",
  siteUrl: "https://www.shyfyk.com",
  version: "1.0.0",
  dateModified: "2026-05-31T21:22:00+08:00",
  icpRecord: "ICP备案中",
  icpUrl: "https://beian.miit.gov.cn",
  publicSecurityRecord: "",
  publicSecurityUrl: "https://www.beian.gov.cn/",
  contentCredential: {
    standard: "C2PA",
    status: "pending",
    note: "待接入官方签名证书后发布可验证内容凭证",
  },
  hotline: "021-61432118",
  mobile: "18512131234",
  email: "zhangxiaolong@shyfyk.com",
  addresses: [
    "上海总部：上海市嘉定区博乐路70号D栋4楼",
    "武汉办公点：武汉市汉阳区恒大滨江中心3楼",
  ],
} as const;

export const navigation: NavItem[] = [
  { label: "首页", href: "/" },
  ...siteMenus.map((menu) => ({
    label: menu.label,
    href: menu.href,
    menuDescription: menu.menuDescription,
    ...(menu.groups
      ? {
          groups: menu.groups.map((group) => ({
            title: group.title,
            href: group.href,
            links: group.links,
          })),
        }
      : menu.links?.length
        ? { groups: [{ title: menu.label, links: menu.links }] }
        : {}),
  })),
];

export const products: ServiceCard[] = [
  {
    id: "ai-enterprise-site",
    title: "AI企业官网",
    description: "以结构化内容、语义标签和权威信源为底座，让企业信息更容易被 AI 准确识别、引用与推荐。",
    href: "/geo-native-website#ai-enterprise-site",
    tags: ["AI原生架构", "企业信源"],
    features: ["同源多格式交付", "JSON-LD语义增强", "AI爬虫友好"],
  },
  {
    id: "ai-brand-site",
    title: "AI品牌官网",
    description: "围绕品牌事实、产品价值和可信背书构建清晰知识图谱，强化品牌在生成式搜索中的官方身份。",
    href: "/geo-native-website#ai-brand-site",
    tags: ["品牌资产", "知识图谱"],
    features: ["品牌事实治理", "权威关联标记", "多端响应式呈现"],
  },
  {
    id: "ai-global-site",
    title: "AI外贸独立站",
    description: "面向全球市场建立多语言 AI 友好内容基础设施，让海外客户与 AI Agent 快速理解企业能力。",
    href: "/geo-native-website#ai-global-site",
    tags: ["全球化", "多语言"],
    features: ["跨语言语义关联", "国际化内容架构", "海外信任建设"],
  },
];

export const geoPracticeStats = [
  { value: "100+", countTo: 100, suffix: "+", label: "企业服务经验" },
  { value: "20+", countTo: 20, suffix: "+", label: "覆盖行业" },
  { value: "50万+", countTo: 50, suffix: "万+", label: "知识资产节点" },
  { value: "100万+", countTo: 100, suffix: "万+", label: "Schema实体部署" },
] as const;

export const upgradeServices = [
  ["01", "GEO策略与审计", "评估网站在 AI 搜索场景中的可见度、引用准确度与内容缺口。", "/ai-friendly-upgrade#geo-audit"],
  ["02", "内容结构化重塑", "将核心业务事实重组为清晰、可引用、便于 Agent 提取的知识块。", "/ai-friendly-upgrade#content-structure"],
  ["03", "权威背书强化", "建立品牌实体、服务能力与行业语义之间的可信关联。", "/ai-friendly-upgrade#authority"],
  ["04", "GEO监测与报告", "持续跟踪内容健康度、信源覆盖与生成式搜索表现。", "/ai-friendly-upgrade#monitoring"],
  ["05", "基础MCP接口集成", "为 AI Agent 提供结构化的企业信息与服务查询入口。", "/ai-friendly-upgrade#mcp-basic"],
] as const;

export const knowledgeServices = [
  ["信源战略规划", "梳理企业事实体系与高价值知识主题，建立长期可维护的权威内容地图。", "/enterprise-knowledge-base#geo-knowledge-center"],
  ["深度知识工程", "将产品、服务、案例和术语沉淀为可组合、可引用的企业专属知识库。", "/enterprise-knowledge-base#enterprise-terminology"],
  ["高级MCP服务集成", "让 Agent 不仅能阅读官网，还能通过标准接口查询企业能力与知识资源。", "/enterprise-knowledge-base#ai-semantic-enhancement"],
  ["信源运维与影响力扩张", "持续维护知识时效性，扩大企业在 AI 生态中的可信引用范围。", "/enterprise-knowledge-base#delivery-standards"],
] as const;

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "现状诊断",
    summary: "识别品牌在 AI 搜索中的可见度、断流节点与竞品差距。",
    painPoint: "内容做了很多，但在 AI 推荐里，您的品牌是否成了“数字隐形人”？",
    quote: "您在传统搜索排第一，但在 ChatGPT 的推荐里，甚至没有名字。",
    deliverables: ["AI 寻址率评分", "全网信源穿透图谱", "竞品引用差距白皮书"],
  },
  {
    number: "02",
    title: "方案设计",
    summary: "把复杂 GEO 技术翻译为明确、可排序、可执行的路线图。",
    painPoint: "不需要理解向量数据库或 RAG，也能清楚知道预算花在哪里。",
    quote: "我们不卖概念，而是把官网拆解成 AI 一秒读懂的“标准答案卡”。",
    deliverables: ["新旧架构解耦对比", "GEO 实施优先级矩阵", "知识块与语义层蓝图"],
  },
  {
    number: "03",
    title: "工程落地",
    summary: "在人类体验与机器可读之间建立兼容的双轨官网。",
    painPoint: "既不牺牲原有 SEO 权重，也不让 AI 改造停留在技术口号。",
    quote: "真正落地的不只是代码，而是一张让主流大模型无法忽略的品牌信任网。",
    deliverables: ["人类视角 / 机器视角双轨页面", "JSON-LD 与权威佐证", "视频、PDF 等多模态资产提炼"],
  },
  {
    number: "04",
    title: "持续运营",
    summary: "用 AI 提及率与增量数据持续证明 GEO 投入价值。",
    painPoint: "让管理者能够看见召回率、提及率和内容迭代带来的实际变化。",
    quote: "大模型的知识每天都在洗牌，持续运营决定品牌能否长期被优先推荐。",
    deliverables: ["AI 提及率仪表盘", "搜索召回率趋势图", "动态知识资产迭代追踪"],
  },
];

export const homeContent: BaseContent = {
  id: "home",
  metadata: {
    title: "优服优科 AI友好型官网与GEO服务",
    summary: "优服优科提供AI友好型官网建设、老网站AI友好度升级、GEO策略审计与企业知识库信源构建服务。",
    dateModified: siteConfig.dateModified,
    version: siteConfig.version,
  },
  sections: [
    {
      id: "hero",
      aiChunk: "hero",
      title: "让官网成为AI信任并引用的企业知识源",
      body: "优服优科以 AI 友好型官网、GEO 策略与企业知识库信源构建，帮助企业在生成式搜索时代被准确理解、可信引用。官网建设围绕四个目标：可读，让 AI 清晰提取企业事实；可信，维护权威口径；可引用，形成独立知识块；可交互，通过 MCP 提供受控查询。",
      summary: "优服优科帮助企业将官网升级为可读、可信、可引用、可交互的知识源。",
    },
    {
      id: "geo-practice",
      aiChunk: "geo-practice",
      title: "企业级 GEO 建设实践",
      body: geoPracticeStats.map((item) => `${item.value} ${item.label}`).join("\n"),
      summary: "展示优服优科在企业服务经验、覆盖行业、知识资产节点和 Schema 实体部署方面的实践数据。",
    },
    {
      id: "featured-cases",
      aiChunk: "featured-cases",
      title: "从典型场景开始建设AI信源",
      body: caseStudies.map((item) => `### ${item.title}\n${item.description}\n\n重点能力：${item.highlights.join("、")}`).join("\n\n"),
      summary: "展示网站 AI 改造、GEO 原生建站、多语言知识信源、品牌信任强化与持续运营等典型项目方向。",
    },
    {
      id: "geo-service-flow",
      aiChunk: "geo-service-flow",
      title: "GEO 建设服务流程",
      body: geoServiceFlowBody,
      summary: "从项目启动、GEO 诊断、竞品分析到页面优化、语义部署、知识建设、系统集成与持续运营的完整 GEO 建设路径。",
    },
    {
      id: "business-tech-outline",
      aiChunk: "business-tech-outline",
      title: "三大业务硬核技术大纲",
      body: businessTechOutlineBody,
      summary: "展示老站 GEO 升级、新一代 GEO 官网和企业 AI 知识库构建三大业务的技术交付大纲。",
    },
    {
      id: "contact",
      aiChunk: "contact",
      title: "开始建设企业AI信源",
      body: `项目询价热线：${siteConfig.hotline}\n\n技术咨询：${siteConfig.mobile}\n\n业务邮箱：${siteConfig.email}`,
      summary: "通过热线、手机或业务邮箱联系优服优科。",
    },
  ],
};

export const allServices = [
  ...products,
  ...upgradeServices.map(([number, title, description, href]) => ({
    id: `upgrade-${number}`,
    title,
    description,
    href,
    tags: ["AI友好度升级"],
    features: [],
  })),
  ...knowledgeServices.map(([title, description, href], index) => ({
    id: `knowledge-${index + 1}`,
    title,
    description,
    href,
    tags: ["企业知识信源"],
    features: [],
  })),
];
