export const globalSitePlatforms = ["Perplexity", "Claude", "ChatGPT", "Gemini", "Grok"];
export const globalSiteIndustries = ["机械", "电子", "化工", "家居", "汽配", "工业零部件"];

export const globalSiteTrustItems = [
  { value: "5 类", label: "海外 AI 平台覆盖说明", note: "围绕公开抓取、语义理解与可复查入口实施" },
  { value: "多语言", label: "产品事实统一维护", note: "不同语言版本共享参数源，并保留本地化摘要" },
  { value: "可归因", label: "询盘路径记录", note: "通过 UTM、表单来源字段和访问日志辅助分析" },
];

export const globalSitePainPoints = [
  "海外买家正在增加对 AI 助手的使用，常用自然语言询问供应商、型号、认证和应用场景。",
  "传统外贸站通常围绕搜索引擎和广告建设，产品参数、MOQ、认证与应用信息未必适合 AI 准确提取。",
  "多语言页面如果只翻译文本，容易出现参数漂移、术语不一致和区域市场重点不清晰的问题。",
];

export const globalSiteComparison = [
  ["流量入口", "谷歌搜索、广告与社媒为主", "保留搜索渠道，并补充海外 AI 可读入口"],
  ["产品理解", "参数与应用信息容易散落在正文中", "结构化产品数据、参数表与采购 FAQ 同源维护"],
  ["多语言适配", "以文本翻译为主", "统一产品事实源，并为各语言配置本地化摘要"],
  ["询盘路径", "主要依赖表单和在线客服", "明确产品摘要、联系信息与询盘归因字段"],
  ["内容更新", "更新页面后缺少跨格式检查", "同步更新页面、Markdown、Schema 与 sitemap"],
  ["长期获客", "持续依赖广告预算", "增加可复查、可积累的公开内容资产"],
];

export const globalSiteCapabilities = [
  { title: "海外AI友好信息架构", description: "围绕型号、应用场景、技术参数、认证和采购问题安排产品页信息层级，让公开信息更容易定位。", example: "例如：防水连接器页面优先展示 IP 等级、户外适用场景、认证状态与可公开参数。" },
  { title: "结构化产品数据工程", description: "为产品、报价边界、FAQ 和参数表配置合适的 Schema 与知识块，让产品画像保持完整。", example: "例如：采购人员查询 MOQ 时，可沿产品页稳定字段复查公开起订量说明。" },
  { title: "多语言AI摘要优化", description: "不同语言版本共享产品事实源，同时针对区域市场整理摘要、术语与公开标准依据。", example: "例如：面向德国市场，优先说明适用标准、交付区域和本地化术语。" },
  { title: "询盘转化与归因强化", description: "在产品摘要、FAQ 与联系页明确行动入口，并通过 UTM、来源字段和日志辅助分析。", example: "例如：报价咨询可携带产品型号与来源页面，减少销售再次确认成本。" },
  { title: "持续监测与迭代", description: "周期记录公开引用样本、重点问题集、内容健康度和竞品差异，形成修订清单。", example: "例如：每月检查核心产品问题是否仍能定位到准确参数、认证与联系入口。" },
];

export const globalSiteDeliverables = [
  "完整可编辑的外贸独立站：支持 CMS 与多语言页面",
  "海外 AI 可见度基线报告：记录公开抓取与内容状态",
  "结构化产品数据部署文档：包含 Schema、参数与撰写规范",
  "多语言摘要优化包：按项目范围确认目标语言",
  "首月 AI 复查报告：记录公开引用样本、询盘相关问题与修订项",
  "可选模块：询盘跟踪代码、UTM 与来源字段集成",
];

export const globalSiteModules = [
  ["产品中心", "结构化参数与多语言摘要"],
  ["应用场景", "按行业与区域组织，便于匹配采购需求"],
  ["认证与资质", "国际标准、状态与公开依据"],
  ["采购 FAQ", "覆盖型号、MOQ、交期和适用边界"],
  ["询盘入口", "表单、联系信息与来源归因"],
  ["行业知识库", "可选的专业信源与术语入口"],
];

export const globalSiteProcess = [
  ["01", "外贸需求对齐与基线诊断", "确认目标市场、产品线、语言范围、公开边界和现有页面状态。"],
  ["02", "产品结构化与多语言规划", "整理参数、认证、应用场景、采购 FAQ 和区域市场摘要。"],
  ["03", "网站开发与语义嵌入", "建设响应式页面，并同步生成机器可读结构与发现协议。"],
  ["04", "海外 AI 场景复查", "使用问题集检查产品信息、语言版本、联系入口和公开依据。"],
  ["05", "上线与首月监测", "记录公开引用样本、询盘归因信号和后续修订清单。"],
];

export const globalSiteFaqs = [
  { question: "外贸独立站还需要做谷歌 SEO 吗？", answer: "需要。GEO 不替代专门的谷歌 SEO。结构化数据、内容质量和清晰信息架构通常有助于搜索体验，但海外 AI 入口属于额外的发现渠道，建议并行建设。" },
  { question: "产品很多，能批量结构化处理吗？", answer: "可以按产品线分层处理。关键产品做深度优化，普通产品复用基础模板与字段规范，并由团队抽样复查参数、语言和公开边界。" },
  { question: "如何分析询盘是否来自 AI 搜索？", answer: "可以结合 UTM 参数、落地页、表单来源字段、访问日志和客户自报来源进行分析。由于部分 AI 平台不会完整透传来源，报告会区分可确认、可推断和未知来源。" },
];

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
export const globalSiteMarkdownSections = [
  { id: "top", aiChunk: "top", title: "AI外贸独立站", summary: "面向出口企业的海外 AI 可读独立站。", body: `覆盖说明：${globalSitePlatforms.join("、")}。\n\n行业方向：${globalSiteIndustries.join("、")}。` },
  { id: "global-trust", aiChunk: "global-trust", title: "信任速览", summary: "发布可验证的覆盖范围、多语言能力和归因机制。", body: globalSiteTrustItems.map(item => `### ${item.value} · ${item.label}\n${item.note}`).join("\n\n") },
  { id: "global-challenges", aiChunk: "global-challenges", title: "海外采购行为正在变化", summary: "从搜索入口扩展到自然语言询问。", body: list(globalSitePainPoints) },
  { id: "global-comparison", aiChunk: "global-comparison", title: "AI外贸独立站与传统外贸站", summary: "保留搜索渠道，并增加可积累的 AI 可读资产。", body: globalSiteComparison.map(([a,b,c]) => `### ${a}\n传统外贸站：${b}\n\nAI 外贸独立站：${c}`).join("\n\n") },
  { id: "global-capabilities", aiChunk: "global-capabilities", title: "五项核心能力", summary: "围绕产品、语言、转化和复查建设。", body: globalSiteCapabilities.map(item => `### ${item.title}\n${item.description}\n\n${item.example}`).join("\n\n") },
  { id: "global-deliverables", aiChunk: "global-deliverables", title: "交付物与可观测结果", summary: "交付清单和复查口径可验收。", body: list(globalSiteDeliverables) },
  { id: "global-modules", aiChunk: "global-modules", title: "典型外贸独立站模块", summary: "模块可按产品线和市场范围组合。", body: globalSiteModules.map(([a,b]) => `### ${a}\n${b}`).join("\n\n") },
  { id: "global-proof", aiChunk: "global-proof", title: "案例与信任证据", summary: "未授权客户证据不对外展示。", body: "客户授权后公开。当前页面不展示客户名称、询盘数字、CPA、模拟截图或虚构证言。" },
  { id: "global-process-faq", aiChunk: "global-process-faq", title: "合作流程与常见问题", summary: "从需求诊断到首月监测形成闭环。", body: `${globalSiteProcess.map(([,a,b]) => `### ${a}\n${b}`).join("\n\n")}\n\n${globalSiteFaqs.map(item => `### ${item.question}\n${item.answer}`).join("\n\n")}` },
  { id: "contact-cta", aiChunk: "contact-cta", title: "让海外买家更容易发现你的产品", summary: "通过联系页沟通独立站现状并获取快速诊断。", body: "[预约免费咨询](/contact)\n\n[获取外贸 AI 方案书](/contact)" },
];
