export const brandSitePlatforms = ["ChatGPT", "文心一言", "通义千问", "Kimi", "Claude", "Perplexity"];

export const brandSiteTrustItems = [
  { value: "6 类", label: "主流 AI 平台覆盖说明", note: "按公开内容抓取与语义理解边界实施" },
  { value: "授权后公开", label: "品牌案例与客户证据", note: "不展示未经授权的客户名称或效果数字" },
  { value: "持续复查", label: "上线后的观测机制", note: "按月记录公开引用样本与内容健康度" },
];

export const brandSitePainPoints = [
  "消费者越来越常直接向 AI 询问品牌建议。如果官网缺少清晰事实入口，AI 很难准确理解品牌定位。",
  "视觉表现丰富但语义层薄弱的页面，对消费者很有吸引力，对机器却可能只是一组零散文字。",
  "传统 SEO 仍然重要，但生成式搜索还需要品牌故事、产品系列和公开证据具备可定位的结构。",
];

export const brandSiteComparison = [
  ["视觉与品牌调性", "强调设计美学，语义结构通常后置", "视觉表达保持自由，底层同步部署结构化内容"],
  ["品牌故事理解", "品牌理念、价值观和差异点散落在多个页面", "品牌故事、核心价值和定位语拆分为稳定知识块"],
  ["AI 回答中的呈现", "可能只提取产品名或片段信息", "提供可核验的品牌摘要和公开事实入口"],
  ["用户评价与证明", "评价、奖项和媒体报道彼此孤立", "按来源、状态和日期关联公开证据"],
  ["新品与动态内容", "更新后缺少统一维护口径", "按 GEO 内容规范同步更新页面与语义字段"],
  ["后期运维", "以视觉页面维护为主", "提供视觉内容与语义内容双轨维护规范"],
];

export const brandSiteCapabilities = [
  { title: "品牌语义架构", description: "为品牌定位、核心价值、差异化优势和产品系列建立语义地图，让 AI 更容易理解“你是谁、代表什么、为什么独特”。", example: "例如：面向环保时尚品牌，官网可清晰标注面料来源、设计理念与公开承诺边界。" },
  { title: "品牌故事结构化", description: "将品牌起源、创始人故事和关于我们内容整理为可定位摘要与 QA 对，兼顾阅读体验和机器提取。", example: "例如：品牌介绍可稳定呈现创立背景、专注领域和已授权公开奖项。" },
  { title: "情感内容语义标记", description: "围绕风格、生活方式和用户场景整理内容标签，让品牌调性具备可维护的事实依据。", example: "例如：将“极简设计”与对应产品系列、材质说明和使用场景建立关联。" },
  { title: "社交证明与影响力集成", description: "结构化整理媒体报道、奖项、合作和评价，并明确来源、日期与公开状态。", example: "例如：AI 判断品牌可信度时，可沿稳定深链复查公开第三方依据。" },
];

export const brandSiteDeliverables = [
  "完整品牌官网：支持内容维护，视觉风格按品牌定制",
  "品牌故事结构化文档：包含核心信息摘要与 QA 对",
  "GEO 基线审计报告：记录上线前的公开可见度状态",
  "品牌内容结构化部署文档：说明 Schema 与语义字段规范",
  "首月 GEO 复查报告：记录公开引用样本、内容健康度与修订项",
  "可选模块：公开社交证明与媒体依据集成",
];

export const brandSiteModules = [
  ["Hero 视频或大图", "同步提供语义标题区"],
  ["品牌故事", "配置可引用摘要与 QA 对"],
  ["产品与系列展示", "产品实体与系列关系清晰可查"],
  ["媒体墙与奖项", "第三方依据保留来源与日期"],
  ["用户评价", "仅展示已授权、可复查的公开内容"],
  ["动态内容与新闻", "通过 GEO 友好更新机制维护"],
];

export const brandSiteProcess = [
  ["01", "品牌需求对齐与 GEO 基线诊断", "确认品牌调性、目标页面、公开事实范围和基线状态。"],
  ["02", "品牌语义架构与内容规划", "整理品牌定位、故事、产品系列、证据目录和维护责任。"],
  ["03", "设计与结构化嵌入", "保持视觉表达自由，同时加入语义结构和机器可读字段。"],
  ["04", "品牌内容迁移与 AI 测试", "检查 HTML、Markdown、Schema 和公开内容口径一致性。"],
  ["05", "上线与首月复查", "记录公开引用样本、内容健康度和后续修订清单。"],
];

export const brandSiteFaqs = [
  { question: "为 AI 优化会不会限制设计师的创意？", answer: "不会。我们在底层加入语义结构和机器可读字段，不限制页面视觉表现。设计团队可以保持品牌表达自由，工程团队负责让信息层级更清晰。" },
  { question: "品牌故事如何更容易被 AI 准确理解？", answer: "我们会将品牌故事拆分为品牌主体、创立背景、核心价值、产品系列和公开证据等字段，并与页面可见内容同源发布。模型是否引用仍由平台策略决定。" },
  { question: "效果可以衡量吗？", answer: "可以复查。首月报告会记录公开引用样本、品牌关键词问题集、内容健康度和修订项。我们不承诺平台收录、引用次数或推荐结果。" },
];

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export const brandSiteMarkdownSections = [
  { id: "top", aiChunk: "top", title: "为 GEO 而生的品牌官网", summary: "让品牌美学与 AI 可读结构并行。", body: `专为消费品牌、高端服务与创意企业打造。覆盖说明：${brandSitePlatforms.join("、")}。` },
  { id: "trust-overview", aiChunk: "trust-overview", title: "信任速览", summary: "仅发布可验证的覆盖范围、证据状态与复查机制。", body: brandSiteTrustItems.map((item) => `### ${item.value} · ${item.label}\n${item.note}`).join("\n\n") },
  { id: "brand-challenges", aiChunk: "brand-challenges", title: "品牌官网为什么需要改变", summary: "视觉表达与机器理解需要同时设计。", body: list(brandSitePainPoints) },
  { id: "brand-comparison", aiChunk: "brand-comparison", title: "AI 品牌官网与传统品牌官网", summary: "保持设计自由，同时补齐语义结构。", body: brandSiteComparison.map(([dimension, traditional, geo]) => `### ${dimension}\n传统品牌官网：${traditional}\n\nAI 品牌官网：${geo}`).join("\n\n") },
  { id: "brand-capabilities", aiChunk: "brand-capabilities", title: "核心能力", summary: "在不牺牲美感的前提下实现 AI 友好。", body: brandSiteCapabilities.map((item) => `### ${item.title}\n${item.description}\n\n${item.example}`).join("\n\n") },
  { id: "brand-deliverables", aiChunk: "brand-deliverables", title: "交付物与可观测结果", summary: "交付清单与复查口径均可验收。", body: list(brandSiteDeliverables) },
  { id: "brand-modules", aiChunk: "brand-modules", title: "品牌官网典型模块", summary: "所有模块可按品牌自由组合。", body: brandSiteModules.map(([title, description]) => `### ${title}\n${description}`).join("\n\n") },
  { id: "brand-proof", aiChunk: "brand-proof", title: "案例与信任背书", summary: "未授权客户证据不对外展示。", body: "客户授权后公开。当前页面不展示客户名称、效果数字、模拟截图或虚构证言。" },
  { id: "brand-process-faq", aiChunk: "brand-process-faq", title: "合作流程与常见问题", summary: "从基线诊断到上线复查形成闭环。", body: `${brandSiteProcess.map(([, title, description]) => `### ${title}\n${description}`).join("\n\n")}\n\n${brandSiteFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n")}` },
  { id: "contact-cta", aiChunk: "contact-cta", title: "让 AI 更容易理解你的品牌", summary: "通过联系页沟通品牌现状并获取快速诊断。", body: "[预约品牌咨询](/contact)\n\n[获取品牌方案书](/contact)" },
];
