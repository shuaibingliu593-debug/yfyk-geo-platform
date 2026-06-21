export const knowledgeSourceAnchorItems = [
  ["overview", "综述"],
  ["strategy", "战略规划"],
  ["enterprise-terminology", "企业术语库"],
  ["engineering", "知识工程"],
  ["mcp-advanced", "MCP集成"],
  ["operations", "运维扩张"],
  ["knowledge-proof", "案例证据"],
  ["knowledge-faq", "FAQ"],
] as const;

export const knowledgeSourceHighlights = [
  "从等待 AI 抓取，到主动建设可复查的公共知识信源。企业事实、术语、案例与白皮书不再散落在多个系统里。",
  "把文档、Wiki、CRM 和产品资料沉淀为结构化知识块，让人类可读、AI 可定位、系统可调用，降低重复解释成本。",
  "当知识边界、版本和证据链长期维护后，企业会形成更稳定的行业内容资产，竞争对手难以快速复制。",
];

export const knowledgeSourceServices = [
  {
    id: "strategy",
    eyebrow: "01 / STRATEGY",
    title: "信源战略规划",
    subtitle: "定义知识边界与核心实体",
    description: "与业务专家一起界定知识库的领域范围、核心实体类型和关联关系，先确定哪些知识值得公开、哪些需要权限控制。",
    bullets: ["知识领域地图：明确纳入范围与暂不纳入内容", "实体关系图谱：产品、标准、案例、术语之间建立关联", "优先级规划：优先构建高价值知识块", "公开边界：区分公开、受限和禁止公开信息"],
    deliverable: "战略规划是整个信源建设的蓝图，用于减少后期返工和口径冲突。",
  },
  {
    id: "engineering",
    eyebrow: "02 / ENGINEERING",
    title: "深度知识工程",
    subtitle: "将内部知识转化为AI可读格式",
    description: "系统提取产品规格、技术白皮书、FAQ 和案例研究，并转化为结构化、语义化、可持续维护的 AI 可读格式。",
    bullets: ["实体抽取与对齐：产品名、参数值、关系与别名统一", "多格式输出：Markdown、JSON-LD 与知识图谱三元组", "建立 QA 对：典型问题对应标准答案，支持 RAG 检索", "保留上下文：专业术语、版本来源和适用范围同步维护"],
    deliverable: "支持批量处理，具体范围、节奏和自动化比例会在资料盘点后确认。",
  },
  {
    id: "mcp-advanced",
    eyebrow: "03 / MCP",
    title: "高级MCP服务集成",
    subtitle: "让知识库成为AI的能力插件",
    description: "基于 Model Context Protocol，让知识库不仅被动展示，还能在授权边界内支持问答、上下文查询和服务调用。",
    bullets: ["部署 MCP 服务端，提供授权 AI 可调用的 API", "配置对话记忆、权限控制与不同用户组的数据范围", "按问题自动推荐产品配置、技术参数和购买入口", "适配企业微信 AI 助手、官网智能客服与内部知识问答等场景"],
    deliverable: "典型交付：MCP 工具清单 + 权限矩阵 + 字段白名单 + 调用日志规范。",
  },
  {
    id: "operations",
    eyebrow: "04 / OPERATIONS",
    title: "信源运维与影响力扩张",
    subtitle: "保持权威，持续增长",
    description: "知识库不是一次性工程。通过持续更新、CLA 巡检、跨平台监测和信源拓展，让知识资产保持准确、鲜活和可复查。",
    bullets: ["持续更新：处理新产品、新案例和新术语", "合规巡检：CLA 自动化检测许可证、版权与公开边界", "引用监测：记录公开引用样本、问题类型和异常结果", "影响力扩张：建议提交到行业标准库、学术索引或媒体合作渠道"],
    deliverable: "目标是让知识库成为动态生长的权威信源，而不是静态档案。",
  },
] as const;

export const enterpriseTerminologyBullets = [
  "统一产品、标准、参数与行业术语的公开定义",
  "建立 DefinedTerm 与 sameAs 等语义关联，避免 AI 猜错名称",
  "维护术语版本、适用范围与来源依据",
  "与 FAQ、产品页和 Wiki 内容形成交叉引用",
];

export const knowledgeSourceFaqs = [
  {
    question: "我们公司已经有 Wiki 或 Confluence，还需要这个吗？",
    answer: "内部 Wiki 主要为人类协作设计，通常缺少稳定实体、公开边界、语义标记和 AI 可调用接口。我们会在现有资料基础上做知识工程和 MCP 接入，不要求推翻原系统。",
  },
  {
    question: "知识库构建后，如何保证安全性？",
    answer: "支持私有化部署、API 密钥、访问频率限制、用户组权限和字段白名单。只有获得授权的 AI 或业务系统才能调用指定范围内的知识。",
  },
  {
    question: "整个过程需要多长时间？",
    answer: "周期取决于知识库规模、资料质量、权限复杂度和是否接入 MCP。启动前会先完成资料盘点与分阶段排期，再分别安排战略规划、知识工程、MCP 集成和长期运维。",
  },
];

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

export const knowledgeSourceMarkdownSections = [
  { id: "top", aiChunk: "top", title: "企业知识库信源构建", summary: "将企业专业知识建设为 AI 更容易理解、复查和引用的行业信源。", body: "将产品、案例、白皮书和术语系统化沉淀为 AI 友好的知识资产，支持 Markdown、JSON-LD 与授权 MCP 调用。" },
  { id: "overview", aiChunk: "overview", title: "为什么企业需要构建专属AI知识库", summary: "从散落资料变成结构化信源。", body: list(knowledgeSourceHighlights) },
  { id: "enterprise-terminology", aiChunk: "enterprise-terminology", title: "企业术语库", summary: "统一术语定义与语义关联，降低 AI 误解风险。", body: `${list(enterpriseTerminologyBullets)}\n\n术语库是知识工程的基础层，确保 FAQ 与产品资料引用同一套公开口径。` },
  ...knowledgeSourceServices.map((item) => ({ id: item.id, aiChunk: item.id, title: `${item.title} —— ${item.subtitle}`, summary: item.description, body: `${item.description}\n\n${list(item.bullets)}\n\n${item.deliverable}` })),
  { id: "knowledge-proof", aiChunk: "knowledge-proof", title: "案例与数据", summary: "未授权客户证据不对外展示。", body: "客户授权后公开。当前页面不展示客户名称、文档数量、AI 引用占比、咨询提升数据、模拟截图或虚构证言。" },
  { id: "knowledge-faq", aiChunk: "knowledge-faq", title: "常见问题", summary: "说明 Wiki 差异、安全边界和实施周期。", body: knowledgeSourceFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n") },
  { id: "contact-cta", aiChunk: "contact-cta", title: "让专业知识成为AI可复查的权威信源", summary: "通过联系页预约免费战略咨询。", body: "[预约免费战略咨询](/contact)\n\n[获取信源建设白皮书](/contact)" },
];
