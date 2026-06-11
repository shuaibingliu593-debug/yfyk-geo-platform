export type BusinessOutlineId = "legacy-geo" | "geo-native-site" | "ai-knowledge";

export interface BusinessOutlineItem {
  number: string;
  title: string;
  description: string;
  href: string;
}

export interface BusinessOutlineTab {
  id: BusinessOutlineId;
  label: string;
  title: string;
  description: string;
  detailHref: string;
  items: BusinessOutlineItem[];
}

export const businessTechOutlineTabs: BusinessOutlineTab[] = [
  {
    id: "legacy-geo",
    label: "老站 GEO 升级",
    title: "升级现有官网，提升品牌在 AI 搜索中的可见度",
    description: "不必推翻现有官网-数字资产。通过系统化 GEO 升级，让老网站拥有更清晰的语义结构和更高的 AI 可见度。",
    detailHref: "/geo-native-website",
    items: [
      { number: "01", title: "GEO 策略与审计", description: "先给你出一份“AI体检报告”——你的网站在DeepSeek、文心一言、Kimi眼里长什么样？哪里被忽略了？竞争对手为什么被推荐？我们把这些缺口一次性列清楚。", href: "/ai-friendly-upgrade#geo-audit" },
      { number: "02", title: "内容结构化重塑", description: "把你现有的产品页、文章、案例，加上AI能读懂的语言标签。以后AI抓取时，不会再看错、漏掉关键信息，而是精准提取你的型号、参数、应用场景。", href: "/ai-friendly-upgrade#content-structure" },
      { number: "03", title: "权威背书强化", description: "把你公司的资质、行业认证、第三方报道，变成AI认可的“信任凭证”。AI在回答问题时，会更倾向于引用你的内容，而不是随便找个竞品。", href: "/ai-friendly-upgrade#authority" },
      { number: "04", title: "GEO 监测与报告", description: "每个月告诉你：你的网站在各大AI模型里被提到了几次？被问了哪些问题？和上个月比是涨是跌？每一分投入都能看到回报。", href: "/ai-friendly-upgrade#monitoring" },
      { number: "05", title: "基础 MCP 接口集成", description: "为你的网站开一扇“门”，让企业微信、钉钉里的AI助手能直接查你的产品信息。客户问AI“你们的XX产品有货吗”，AI能实时给出答案。", href: "/ai-friendly-upgrade#mcp-basic" },
    ],
  },
  {
    id: "geo-native-site",
    label: "新一代 GEO 官网",
    title: "从零构建 · 面向 AI 时代的企业官网",
    description: "从网站架构、内容组织到页面呈现，系统性打造更容易被 AI 理解、抓取与引用的企业官网，让品牌信息在生成式搜索中更清晰、更可信。",
    detailHref: "/geo-native-website",
    items: [
      { number: "01", title: "原生 AI 友好型架构设计", description: "你的新网站从骨子里就按AI最习惯的方式搭建。别人在AI眼里是乱码，你的网站是整整齐齐的答案素材库。", href: "/geo-native-website#ai-enterprise-site" },
      { number: "02", title: "Schema 字典全量注入", description: "上线第一天，你的每一个产品、参数、价格都自带“身份证”。AI不会猜错、不会编造——你写什么，AI就引用什么。", href: "/geo-native-website#ai-enterprise-site" },
      { number: "03", title: "全站内容语义段落优化", description: "把你的产品说明、解决方案，切成AI最容易检索、最擅长引用的信息块。客户问“你们能不能做XX”，AI能秒级定位到对应段落。", href: "/geo-native-website#ai-brand-site" },
      { number: "04", title: "动态高频 QA 自动生成", description: "系统会根据行业热点，自动生成新的问答对并补充进网站。你不用天天手动更新，AI提问的热门方向，你的网站永远有答案。", href: "/geo-native-website#delivery-standards" },
      { number: "05", title: "全球边缘网络与 MCP 铺设", description: "无论客户在美国、欧洲还是东南亚，用Perplexity、Claude还是ChatGPT提问，你的官网信息都能被毫秒级调用。不卡、不慢、不丢失。", href: "/geo-native-website#ai-global-site" },
    ],
  },
  {
    id: "ai-knowledge",
    label: "企业 AI 知识库构建",
    title: "让企业知识更有价值 · 成为 AI 信赖的专业信源",
    description: "将技术资料、产品文档、解决方案与项目经验统一梳理，构建清晰、可调用的企业知识库，让 AI 更准确地理解并引用您的专业内容。",
    detailHref: "/enterprise-knowledge-base",
    items: [
      { number: "01", title: "行业专属语料库清洗", description: "把你那些厚厚的内部文档、技术白皮书、标书，提炼成AI最喜欢读的格式。不用再担心机密外泄，我们只把可以公开的知识提炼出来。", href: "/enterprise-knowledge-base#geo-knowledge-center" },
      { number: "02", title: "高级实体与关系图谱映射", description: "把你的产品、技术、服务之间的关系画成一张AI看得懂的地图。以后AI问“A产品和B标准有什么关系”，你的知识库能直接给出答案，而不是让人翻三页文档。", href: "/enterprise-knowledge-base#enterprise-terminology" },
      { number: "03", title: "高阶 MCP 2.0 协议部署", description: "让你的知识库变成AI的“插件”。客户问AI“你们的标准是什么”“报价多少”，AI能实时从你的知识库里调数据，而不是随便编一个。", href: "/enterprise-knowledge-base#ai-semantic-enhancement" },
      { number: "04", title: "联邦主权与安全隔离网关", description: "你想让AI引用的内容（比如公开标准、产品介绍），我们帮你推到全网。你不想让AI碰的机密数据（比如客户名单、未公开配方），我们帮你锁死在本地。主动权在你手里。", href: "/enterprise-knowledge-base#geo-knowledge-center" },
      { number: "05", title: "全网信源主动影响力扩张", description: "我们把你的知识主动推送到百度百科、行业标准库、知乎等高权重平台。AI在这些地方抓取到你，就等于在更多问题里推荐你。一次建设，长期扩散。", href: "/enterprise-knowledge-base#ai-semantic-enhancement" },
    ],
  },
];

export const businessTechOutlineBody = businessTechOutlineTabs.map((tab) => `### ${tab.label}\n${tab.title}\n\n${tab.description}\n\n${tab.items.map((item) => `- ${item.number} / ${item.title}：${item.description}`).join("\n")}`).join("\n\n");
