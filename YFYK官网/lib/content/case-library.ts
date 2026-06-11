export type CaseServiceType = "GEO原生建站" | "网站AI改造" | "知识库信源构建";

export interface CaseLibraryListPage {
  slug: string;
  title: string;
  heading: string;
  description: string;
  heroLead: string;
  serviceHref: string;
  serviceLabel: string;
  filters: Array<{
    label: string;
    options: string[];
    kind?: "select" | "pills";
  }>;
  sortLabel: string;
  cta: {
    title: string;
    href: string;
    label: string;
  };
  featuredOnly?: boolean;
  serviceType?: CaseServiceType;
}

export interface CaseLibraryCase {
  title: string;
  slug: string;
  serviceType: CaseServiceType;
  subService: string;
  industry: string;
  isFeatured: boolean;
  clientName: string;
  shortTitle: string;
  resultSummary: string;
  resultHighlight: string;
  listTags: string[];
  backgroundChallenge: string;
  challenges: string[];
  solutions: Array<{ title: string; description: string }>;
  timeline: Array<{ week: string; action: string }>;
  results: Array<{ metric: string; before: string; after: string; change: string }>;
  testimonial: {
    quote: string;
    author: string;
    position: string;
  };
  relatedCases: string[];
}

export const caseLibraryListPages: CaseLibraryListPage[] = [
  {
    slug: "showcase",
    title: "标杆案例库 —— 见证AI驱动的增长",
    heading: "标杆案例库",
    description: "从三大业务中精选最具代表性、数据最亮眼、品牌知名度最高的案例。",
    heroLead: "筛选三大业务中最具代表性的案例，集中展示AI引用、询盘增长、信源影响力与获客成本变化。",
    serviceHref: "/contact",
    serviceLabel: "预约免费咨询",
    filters: [],
    sortLabel: "成果排序：综合标杆指数",
    cta: { title: "希望获得类似成果？立即咨询", href: "/contact", label: "预约免费咨询" },
  },
];

export const caseLibraryCases: CaseLibraryCase[] = [
  {
    title: "振华精密机械：从AI搜索隐形到行业前3",
    slug: "zhenhua-precision",
    serviceType: "GEO原生建站",
    subService: "AI企业官网",
    industry: "制造",
    isFeatured: true,
    clientName: "振华精密机械（浙江）有限公司",
    shortTitle: "振华精密机械 | AI企业官网",
    resultSummary: "AI引用从0到47，月询盘22+，获客成本降27%",
    resultHighlight: "AI引用47次",
    listTags: ["AI企业官网", "制造", "获客成本-27%"],
    backgroundChallenge: "振华精密机械是一家专注于高精度CNC加工中心、工业机器人关节减速器的研发与制造企业，产品出口欧美及东南亚，年产值约3亿元。原有官网建于2018年，主要为产品展示和公司介绍，流量依赖谷歌广告和展会。",
    challenges: [
      "在文心一言、ChatGPT询问国产高精度五轴加工中心品牌时，振华官网从未出现。",
      "谷歌广告单次有效询盘成本超过600元，且质量下降。",
      "专利、检测报告和技术白皮书只是PDF下载链接，AI无法读取结构化内容。",
    ],
    solutions: [
      { title: "AI友好信息架构", description: "重构导航，按汽车零部件、航空航天、3C电子等应用场景分类产品，并为每个产品页增加AI摘要区。" },
      { title: "结构化内容工程", description: "为所有产品添加Product、Offer、AggregateRating等Schema.org标记，将20+份技术白皮书转化为JSON-LD知识节点。" },
      { title: "知识库信源构建（基础版）", description: "建立振华技术知识图谱，生成QA对，例如五轴加工中心适合加工钛合金等高频问题。" },
      { title: "权威背书强化", description: "结构化展示ISO认证、高新技术企业、浙江省首台套装备等资质。" },
    ],
    timeline: [
      { week: "1-2", action: "需求对齐，GEO基线审计，确认旧站在主流AI中可见度为0。" },
      { week: "3-6", action: "网站开发、结构化内容注入、知识图谱构建。" },
      { week: "7", action: "内容迁移与AI模型验证，覆盖文心一言、ChatGPT、Perplexity。" },
      { week: "8", action: "正式上线并进入效果复查。" },
    ],
    results: [
      { metric: "主流AI引用次数（累计）", before: "0", after: "47", change: "从无到有" },
      { metric: "被引用问题数", before: "0", after: "12个不同问题", change: "-" },
      { metric: "官网AI来源咨询量（月均）", before: "0", after: "22", change: "-" },
      { metric: "谷歌广告CPA（元/询盘）", before: "620", after: "450", change: "-27%" },
      { metric: "核心产品页在AI回答中的出现率", before: "0%", after: "行业前3", change: "-" },
    ],
    testimonial: {
      quote: "以前我们觉得AI搜索离制造业很远，没想到做完新官网后，真的带来了高质量询盘。尤其是那些拿着AI推荐过来的客户，意向非常明确，不用我们再科普基本参数。",
      author: "张振华",
      position: "总经理",
    },
    relatedCases: ["hua-xing-electronics", "ciroa"],
  },
  {
    title: "华兴电子：老站结构化改造后AI引用量+3250%",
    slug: "hua-xing-electronics",
    serviceType: "网站AI改造",
    subService: "内容结构化重塑 + 权威背书强化 + GEO监测",
    industry: "电子元器件",
    isFeatured: true,
    clientName: "华兴电子",
    shortTitle: "华兴电子 | 内容结构化+背书",
    resultSummary: "3个月引用量+220%，月询盘15+，6周见效",
    resultHighlight: "引用量+3250%",
    listTags: ["内容结构化", "电子", "6周见效"],
    backgroundChallenge: "华兴电子是一家被动元件分销商，代理国内外20多个品牌，年营收5亿元。原有官网为WordPress搭建，产品数据丰富但无结构化标记，AI抓取后无法提取具体型号和参数。",
    challenges: [
      "工程师在Kimi、通义千问询问车规级MLCC供应商时，华兴电子从不出现。",
      "网站有大量产品页面，但AI只看到混乱表格，无法理解型号、参数、库存的关系。",
      "客户希望不改变网站前端样式，低成本快速见效。",
    ],
    solutions: [
      { title: "GEO策略与审计", description: "出具基线报告，发现核心产品页无Schema标记，应用场景描述不足。" },
      { title: "内容结构化重塑", description: "为500+产品页批量注入Product Schema，添加JSON-LD数据块，并为每个系列撰写FAQ对。" },
      { title: "权威背书强化", description: "结构化展示原厂授权代理证书、ISO9001、车规认证(AEC-Q200)，并通过mentions字段关联到产品。" },
      { title: "GEO监测与报告", description: "每月追踪AI引用变化，提供竞品对比和修订建议。" },
    ],
    timeline: [
      { week: "1", action: "审计与策略规划。" },
      { week: "2-4", action: "结构化标记开发与批量部署。" },
      { week: "5", action: "AI模型验证与微调。" },
      { week: "6", action: "上线并启动监测。" },
    ],
    results: [
      { metric: "主流AI引用次数（累计）", before: "2（非产品页）", after: "67", change: "+3250%" },
      { metric: "涉及产品的问题被引用率", before: "0%", after: "35%", change: "-" },
      { metric: "月均AI来源询盘", before: "0", after: "15", change: "从无到有" },
      { metric: "谷歌SEO关键词排名", before: "无变化", after: "部分长尾词上升", change: "正面影响" },
    ],
    testimonial: {
      quote: "我们原来的网站就像一个电子目录，AI根本看不懂。改造后，工程师通过Kimi找到我们，直接问具体型号的库存和价格，成交率非常高。",
      author: "李华",
      position: "市场总监",
    },
    relatedCases: ["zhenhua-precision", "anda-logistics-equipment"],
  },
  {
    title: "中国工业机器人协会：让行业标准成为AI默认信源",
    slug: "ciroa",
    serviceType: "知识库信源构建",
    subService: "信源战略规划 + 深度知识工程 + 高级MCP集成 + 影响力扩张",
    industry: "行业协会 / 标准制定",
    isFeatured: true,
    clientName: "中国工业机器人协会",
    shortTitle: "中国工业机器人协会 | 协会标准",
    resultSummary: "标准被AI引用率80%，成为默认信源",
    resultHighlight: "引用率80%",
    listTags: ["协会标准", "大型知识库", "默认信源"],
    backgroundChallenge: "中国工业机器人协会拥有200+家会员企业，负责制定协作机器人、AGV等多项行业标准。协会官网有大量技术标准文档、白皮书和行业报告，但AI模型在回答相关问题时，很少引用协会内容，反而引用国外标准或第三方解读。",
    challenges: [
      "协会希望确立中国工业机器人技术标准的权威信源地位。",
      "内部知识分散在多个编辑手中，无法被AI结构化调用。",
      "需要长期运维，确保新发布标准能被AI及时收录。",
    ],
    solutions: [
      { title: "信源战略规划", description: "定义标准、技术参数、应用场景、会员企业等核心实体，绘制知识图谱蓝图。" },
      { title: "深度知识工程", description: "将50+份标准PDF转换为JSON-LD知识节点，生成2000+ QA对，并输出Markdown版本供AI读取。" },
      { title: "高级MCP服务集成", description: "部署MCP服务端，使授权AI可以实时查询最新标准、下载全文、获取解读。" },
      { title: "信源运维与影响力扩张", description: "每月处理新标准，监测跨平台引用情况，并推动外部信源采纳协会标准条目。" },
    ],
    timeline: [
      { week: "1-3", action: "战略规划与实体抽取。" },
      { week: "4-10", action: "知识工程批量转换与QA生成。" },
      { week: "11-13", action: "MCP服务部署与测试。" },
      { week: "14", action: "上线，启动监测与扩张。" },
    ],
    results: [
      { metric: "协会标准在AI中的引用率", before: "12%", after: "80%", change: "+68pp" },
      { metric: "主流AI问答中首选CIRIA的比例", before: "0%", after: "65%", change: "-" },
      { metric: "协会官网咨询量（月均）", before: "8", after: "24", change: "+200%" },
      { metric: "外部信源采纳条目", before: "0", after: "15", change: "-" },
    ],
    testimonial: {
      quote: "以前我们觉得AI引用不可控，做完知识库后，我们的标准成了AI的默认答案。不仅提升了协会影响力，还带来了实实在在的会员咨询。",
      author: "王卫国",
      position: "秘书长",
    },
    relatedCases: ["zhenhua-precision", "mairui-medical"],
  },
  {
    title: "悦己美妆：AI品牌官网让品牌问答进入前5",
    slug: "yueji-beauty",
    serviceType: "GEO原生建站",
    subService: "AI品牌官网",
    industry: "消费品",
    isFeatured: false,
    clientName: "悦己美妆",
    shortTitle: "悦己美妆 | AI品牌官网",
    resultSummary: "品牌在AI回答中提及率前5，搜索流量+80%",
    resultHighlight: "搜索流量+80%",
    listTags: ["AI品牌官网", "消费品", "提及率前5"],
    backgroundChallenge: "品牌内容分散在电商、社媒和旧官网，AI无法准确理解核心产品线和成分优势。",
    challenges: ["品牌故事缺少稳定事实源。", "产品卖点缺少结构化说明。", "达人评价与媒体背书没有统一归档。"],
    solutions: [
      { title: "品牌事实治理", description: "统一品牌定位、产品线、成分说明与公开背书。" },
      { title: "AI摘要区", description: "为品牌和产品页配置可引用摘要。" },
      { title: "信任证据目录", description: "沉淀媒体报道、检测报告和达人评价。" },
    ],
    timeline: [{ week: "1-2", action: "品牌事实梳理。" }, { week: "3-5", action: "页面开发与结构化部署。" }, { week: "6", action: "上线验证。" }],
    results: [
      { metric: "品牌回答提及率", before: "未进入前20", after: "前5", change: "显著提升" },
      { metric: "自然搜索流量", before: "基线", after: "+80%", change: "+80%" },
      { metric: "品牌证据页面", before: "0", after: "18", change: "新增" },
    ],
    testimonial: { quote: "新官网让AI和消费者都更容易理解我们的品牌。", author: "陈悦", position: "品牌负责人" },
    relatedCases: ["zhenhua-precision", "hua-xing-electronics"],
  },
  {
    title: "恒力工具：AI外贸独立站降低询盘成本",
    slug: "hengli-tools",
    serviceType: "GEO原生建站",
    subService: "AI外贸独立站",
    industry: "机械",
    isFeatured: false,
    clientName: "恒力工具",
    shortTitle: "恒力工具 | AI外贸独立站",
    resultSummary: "Perplexity推荐，询盘成本降至$45",
    resultHighlight: "CPA $45",
    listTags: ["AI外贸独立站", "机械", "Perplexity推荐"],
    backgroundChallenge: "产品参数跨语言不一致，海外采购商无法快速确认适配场景。",
    challenges: ["多语言页面参数漂移。", "认证信息难以被AI提取。", "广告询盘成本高。"],
    solutions: [
      { title: "多语言事实源", description: "统一产品参数、认证和应用场景。" },
      { title: "结构化产品数据", description: "为核心SKU输出Product Schema和FAQ。" },
      { title: "海外信任页", description: "展示认证、交付能力和售后范围。" },
    ],
    timeline: [{ week: "1-2", action: "产品事实盘点。" }, { week: "3-6", action: "多语言站点开发。" }, { week: "7", action: "海外AI验证。" }],
    results: [
      { metric: "AI推荐样本", before: "0", after: "Perplexity命中", change: "从无到有" },
      { metric: "询盘成本", before: "$78", after: "$45", change: "-42%" },
      { metric: "多语言产品页", before: "12", after: "64", change: "扩展" },
    ],
    testimonial: { quote: "客户通过AI推荐进入网站后，问题更具体，沟通效率明显提高。", author: "周恒", position: "外贸总监" },
    relatedCases: ["zhenhua-precision", "yueji-beauty"],
  },
  {
    title: "安达物流设备：全站改造后进入行业AI推荐",
    slug: "anda-logistics-equipment",
    serviceType: "网站AI改造",
    subService: "全站改造",
    industry: "制造",
    isFeatured: false,
    clientName: "安达物流设备",
    shortTitle: "安达物流设备 | 全站改造",
    resultSummary: "Kimi/通义引用率从0至行业前列",
    resultHighlight: "行业前列",
    listTags: ["全站改造", "制造", "Kimi/通义引用"],
    backgroundChallenge: "旧站内容按内部组织结构编排，客户问题和解决方案缺少对应关系。",
    challenges: ["产品页缺少场景说明。", "资质和案例分散。", "AI无法形成清晰推荐理由。"],
    solutions: [
      { title: "场景化内容结构", description: "按仓储、分拣、装卸场景重组内容。" },
      { title: "证据链聚合", description: "关联资质、项目经验和服务能力。" },
      { title: "监测报告", description: "持续追踪引用样本和异常回答。" },
    ],
    timeline: [{ week: "1", action: "诊断审计。" }, { week: "2-5", action: "内容和结构改造。" }, { week: "6", action: "上线监测。" }],
    results: [
      { metric: "AI引用率", before: "0", after: "行业前列", change: "显著提升" },
      { metric: "可引用页面", before: "6", after: "42", change: "+36" },
      { metric: "监测问题库", before: "0", after: "90", change: "新增" },
    ],
    testimonial: { quote: "改造后AI终于能说清楚我们适合哪些物流场景。", author: "刘安", position: "销售负责人" },
    relatedCases: ["hua-xing-electronics", "zhenhua-precision"],
  },
  {
    title: "迈瑞医疗：产品问答进入主流AI答案",
    slug: "mairui-medical",
    serviceType: "知识库信源构建",
    subService: "对外信源",
    industry: "医疗",
    isFeatured: false,
    clientName: "迈瑞医疗",
    shortTitle: "迈瑞医疗 | 对外信源",
    resultSummary: "产品问答被ChatGPT/文心直接采用，线索翻倍",
    resultHighlight: "线索翻倍",
    listTags: ["对外信源", "中型", "医疗"],
    backgroundChallenge: "医疗产品资料专业度高，公开解释分散在白皮书、参数表和培训材料中。",
    challenges: ["产品问答缺少统一口径。", "技术资料难以被AI提取。", "公开边界需要严格治理。"],
    solutions: [
      { title: "信源战略规划", description: "定义公开产品知识和不可公开资料边界。" },
      { title: "知识工程", description: "将参数、适用场景、FAQ转为结构化知识块。" },
      { title: "持续复查", description: "监测主流AI回答并修订公开内容。" },
    ],
    timeline: [{ week: "1-2", action: "知识边界确认。" }, { week: "3-8", action: "知识块建设。" }, { week: "9", action: "上线复查。" }],
    results: [
      { metric: "主流AI采用问题数", before: "3", after: "37", change: "+34" },
      { metric: "销售线索", before: "基线", after: "翻倍", change: "+100%" },
      { metric: "知识块数量", before: "0", after: "280", change: "新增" },
    ],
    testimonial: { quote: "统一知识口径后，客户带着更准确的问题来咨询。", author: "林睿", position: "产品市场经理" },
    relatedCases: ["ciroa", "zhenhua-precision"],
  },
];

export const caseLibrarySlugs = [
  ...caseLibraryListPages.map((page) => page.slug),
  ...caseLibraryCases.map((item) => item.slug),
];

export function getCaseLibraryListPage(slug: string) {
  return caseLibraryListPages.find((page) => page.slug === slug);
}

export function getCaseLibraryCase(slug: string) {
  return caseLibraryCases.find((item) => item.slug === slug);
}

export function getCasesForList(page: CaseLibraryListPage) {
  if (page.slug === "showcase") {
    return [...caseLibraryCases].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
  return caseLibraryCases.filter((item) => item.serviceType === page.serviceType);
}

function shortenMetricLabel(label: string): string {
  if (label.includes("引用")) return "AI引用";
  if (label.includes("询盘") || label.includes("咨询")) return "AI询盘";
  if (label.includes("CPA") || label.includes("成本")) return "获客成本";
  if (label.includes("出现率") || label.includes("提及") || label.includes("首选")) return "AI可见度";
  if (label.includes("流量")) return "搜索流量";
  if (label.includes("线索")) return "销售线索";
  if (label.includes("采纳") || label.includes("采用")) return "AI采用率";
  return label.length > 6 ? `${label.slice(0, 6)}…` : label;
}

export function caseLibraryCaseToGalleryItem(item: CaseLibraryCase) {
  return {
    id: item.slug,
    slug: item.slug,
    publicationStatus: "authorized" as const,
    clientDisplayName: item.clientName,
    industry: item.listTags[0] ?? item.industry,
    category: item.serviceType,
    title: item.title,
    description: item.resultSummary,
    href: `/cases/${item.slug}`,
    coreChallenge: item.challenges[0] ?? item.backgroundChallenge,
    outcomeSummary: item.resultSummary,
    background: item.backgroundChallenge,
    relatedServicePaths: [],
    highlights: item.solutions.map((solution) => solution.title).slice(0, 3),
    metrics: item.results.slice(0, 4).map((result) => ({
      label: shortenMetricLabel(result.metric),
      value: result.after,
    })),
    testimonial: {
      quote: item.testimonial.quote,
      name: item.testimonial.author,
      role: item.testimonial.position,
    },
  };
}
