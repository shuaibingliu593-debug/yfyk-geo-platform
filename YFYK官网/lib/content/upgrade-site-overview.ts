export const upgradeAnchorItems = [
  ["overview", "综述"],
  ["geo-audit", "策略与审计"],
  ["content-structure", "结构化重塑"],
  ["authority", "权威背书"],
  ["monitoring", "监测报告"],
  ["mcp-basic", "MCP集成"],
  ["upgrade-proof", "案例证据"],
  ["upgrade-faq", "FAQ"],
] as const;

export const upgradeHighlights = [
  "旧网站结构常为人类阅读设计，缺少 AI 可定位的语义层和公开事实边界。",
  "无需推翻重建，通过结构化数据、语义标记和内容策略调整补上 AI 可读语言。",
  "上线后持续记录公开引用样本、内容健康度和修订项，跟随模型环境迭代。",
];

export const upgradeServices = [
  { id: "geo-audit", eyebrow: "01 / AUDIT", title: "GEO策略与审计", subtitle: "全面诊断AI可见度", description: "使用可复查的问题集、抓取模拟和结构化数据检查，输出 GEO 可见度基线报告。", bullets: ["当前公开内容可被哪些问题定位", "AI 想知道但页面没有清晰回答的内容缺口", "竞品公开信号与您网站的差异", "按影响范围排序的优化路线图"], deliverable: "典型交付：审计报告 + 线上解读会议" },
  { id: "content-structure", eyebrow: "02 / STRUCTURE", title: "内容结构化重塑", subtitle: "让AI精准提取核心信息", description: "对产品页、文章、案例和 FAQ 做语义化改造，让型号、参数、优势与适用场景具备稳定入口。", bullets: ["添加 Schema.org 标记", "注入 JSON-LD 数据块", "为关键页面撰写 AI 摘要区", "批量处理核心产品与文章模板"], deliverable: "支持批量处理，优先覆盖高价值页面与产品线" },
  { id: "authority", eyebrow: "03 / AUTHORITY", title: "权威背书强化", subtitle: "在AI知识图谱中建立专业关联", description: "整理行业标准、第三方引用、合作伙伴、认证和媒体依据，并用语义字段建立公开证据链。", bullets: ["标记资质、认证、协会与标准", "关联 mentions、citation、knowsAbout 等字段", "为过期或未授权证据设置公开状态", "适合医疗、工业、法律等重视资质行业"], deliverable: "典型交付：公开证据目录 + 语义字段说明" },
  { id: "monitoring", eyebrow: "04 / MONITORING", title: "GEO监测与报告", subtitle: "量化AI可读资产的变化", description: "按月记录主流 AI 场景中的公开引用样本、问题类型、页面健康度与竞品差异。", bullets: ["引用样本变化趋势", "被定位的具体问题和关键词", "与竞品公开内容的对比", "下一轮优化建议"], deliverable: "支持导出周报/月报，可按项目范围对接既有 BI 口径" },
  { id: "mcp-basic", eyebrow: "05 / MCP", title: "基础MCP接口集成", subtitle: "让网站具备与AI交互的能力", description: "部署轻量级只读 MCP 端点，让授权 AI 在边界内查询公开数据，如产品目录、FAQ 和公开参数。", bullets: ["定义只读公开数据范围", "配置基础工具与结构化响应", "记录调用量、失败率和响应时间", "高级权限控制可升级至高级 MCP 服务"], deliverable: "典型交付：工具清单 + 字段白名单 + 调用日志规范" },
];

export const upgradeFaqs = [
  { question: "老网站升级会影响现有功能和外观吗？", answer: "通常不会。优先在后台、结构化数据和少量语义层做改造；如需调整页面，会先列入变更清单并确认影响范围。" },
  { question: "升级后多久能看到效果？", answer: "模型抓取、引用和回答由平台策略决定，不能承诺固定周期。我们会通过监测报告记录公开引用样本、内容健康度和修订项，持续判断变化。" },
  { question: "自研网站或复杂 CMS 能实施吗？", answer: "可以。只要能编辑 HTML、模板或注入必要脚本，就可以实施。复杂 CMS 会先做技术审计，再决定插件、模板或静态注入方案。" },
];

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
export const upgradeMarkdownSections = [
  { id: "top", aiChunk: "top", title: "老网站AI友好度升级", summary: "不改颜值，改变 AI 眼中的你。", body: "针对现有网站的 GEO 化升级与运维方案，先审计，再按页面价值分批微创改造。" },
  { id: "overview", aiChunk: "overview", title: "为什么老网站急需一次 AI 友好度升级", summary: "补齐 AI 可读语言，不推翻重来。", body: list(upgradeHighlights) },
  ...upgradeServices.map((item) => ({ id: item.id, aiChunk: item.id, title: `${item.title} —— ${item.subtitle}`, summary: item.description, body: `${item.description}\n\n${list(item.bullets)}\n\n${item.deliverable}` })),
  { id: "upgrade-proof", aiChunk: "upgrade-proof", title: "案例与数据", summary: "未授权客户证据不对外展示。", body: "客户授权后公开。当前页面不展示客户名称、AI 引用增长数字、询盘数字、模拟截图或虚构证言。" },
  { id: "upgrade-faq", aiChunk: "upgrade-faq", title: "常见问题", summary: "说明外观影响、效果观测和 CMS 适配。", body: upgradeFaqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n") },
  { id: "contact-cta", aiChunk: "contact-cta", title: "让旧网站重新被AI看见", summary: "通过联系页预约免费 AI 诊断。", body: "[预约免费AI诊断](/contact)\n\n[获取GEO升级白皮书](/contact)" },
];
