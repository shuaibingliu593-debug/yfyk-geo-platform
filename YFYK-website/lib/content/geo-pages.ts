import type { ContentCard, FaqItem, GeoPageContent, PublicReference, VisualAsset } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";
import { servicesOverviewFaqs, servicesOverviewMarkdownSections } from "@/lib/content/services-overview";
import { brandSiteFaqs, brandSiteMarkdownSections } from "@/lib/content/brand-site-overview";
import { globalSiteFaqs, globalSiteMarkdownSections } from "@/lib/content/global-site-overview";
import { knowledgeSourceFaqs, knowledgeSourceMarkdownSections } from "@/lib/content/knowledge-source-overview";
import { upgradeFaqs, upgradeMarkdownSections } from "@/lib/content/upgrade-site-overview";
import { aboutCompanySections } from "@/lib/content/about-company";

type Seed = {
  path: string;
  title: string;
  description: string;
  pageType?: GeoPageContent["pageType"];
  templateKind?: GeoPageContent["templateKind"];
  knowsAbout: string[];
  audience: string;
  painPoints: string[];
  strategies: string[];
  deliverables: string[];
  compliance?: string[];
};

const officialReferences: PublicReference[] = [
  { title: "中华人民共和国个人信息保护法", description: "用于判断个人信息处理、最小必要收集、告知同意和跨境提供边界。", url: "https://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html" },
  { title: "生成式人工智能服务管理暂行办法", description: "用于区分展示型官网与面向公众提供的生成式人工智能服务。", url: "https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm" },
  { title: "人工智能生成合成内容标识办法", description: "用于判断生成内容标识、来源字段和发布边界。", url: "https://www.cac.gov.cn/2025-03/14/c_1743654685899683.htm" },
  { title: "促进和规范数据跨境流动规定", description: "用于评估跨境页面、表单和境外模型接口的数据边界。", url: "https://www.cac.gov.cn/2024-03/22/c_1712776612187994.htm" },
  { title: "JSON-LD 1.1", description: "W3C 发布的 JSON-LD 数据表达规范。", url: "https://www.w3.org/TR/json-ld11/" },
  { title: "Schema.org", description: "页面结构化数据类型与属性参考。", url: "https://schema.org/" },
  { title: "Model Context Protocol", description: "MCP 工具、资源与安全边界的公开规范。", url: "https://modelcontextprotocol.io/specification/2025-06-18" },
];

const baseCompliance = [
  "页面内容由同一份 SSOT 生成 HTML、Markdown 与 JSON-LD。",
  "本站首批不提供面向公众的生成式 AI 问答，仅发布可核验的企业公开事实。",
  "C2PA 内容凭证状态为 pending，完成签名链接入前不声明已签名。",
];

const seeds: Seed[] = [
  { path: "/services", title: "产品与服务", description: "基于 GEO 标准，重点适配国内主流 AI，同时兼容国际模型。从新站打造到老站升级，再到企业知识库信源建设，一步到位。", pageType: "CollectionPage", knowsAbout: ["GEO", "AI友好型官网", "企业知识信源"], audience: "希望在 AI 搜索时代建设、升级或长期运营企业数字资产的团队", painPoints: ["新网站缺少面向 AI 抓取与理解的内容架构。", "老网站已有内容资产，但难以判断 GEO 缺口。", "专业知识分散，尚未形成可持续维护的可靠信源。"], strategies: ["从零建设遵循 GEO 标准的 AI 友好型官网。", "以诊断、改造、监测和连接能力完成老网站升级。", "将内部专业沉淀建设为可维护、可查询的企业知识信源。"], deliverables: ["AI友好型官网", "老网站GEO化升级", "企业知识库信源"] },
  { path: "/services/products/ai-enterprise-site", title: "AI企业官网", description: "将企业服务、资质、流程与案例方向沉淀为可维护、可定位、可引用的官网事实。", knowsAbout: ["企业官网", "SSOT", "JSON-LD"], audience: "业务复杂、需要统一官方口径的企业", painPoints: ["部门资料分散，官网更新依赖临时沟通。", "产品、服务和资质混在长页面中，机器难以准确提取。", "改版完成后缺少可重复执行的验收口径。"], strategies: ["建立企业事实注册表，指定内容责任和更新时间。", "按语义块同步输出 HTML、Markdown 与 JSON-LD。", "使用 CLA 在 prebuild 阶段阻断缺失项和口径差异。"], deliverables: ["企业事实清单", "页面与知识块矩阵", "CLA 页面级报告"] },
  { path: "/services/products/ai-brand-site", title: "AI品牌官网", description: "为消费品牌、高端服务与创意企业建设兼顾品牌美学和 AI 可读结构的官网。", knowsAbout: ["品牌实体", "品牌故事结构化", "GEO", "知识图谱"], audience: "希望保持品牌调性，同时让公开信息更容易被主流 AI 准确理解的团队", painPoints: ["品牌故事分散在多个页面，缺少稳定摘要。", "视觉内容丰富，但机器难以识别品牌定位与差异点。", "媒体、奖项和评价缺少来源、日期与状态关联。"], strategies: ["建立品牌语义架构与公开事实边界。", "将品牌故事、产品系列和证据目录整理为可定位知识块。", "上线后按月记录公开引用样本、内容健康度与修订项。"], deliverables: ["完整品牌官网", "品牌故事结构化文档", "GEO 基线审计报告", "品牌内容结构化部署文档", "首月 GEO 复查报告"] },
  { path: "/services/products/ai-global-site", title: "AI外贸独立站", description: "面向出口企业建设多语言、结构化、可归因的海外 AI 可读独立站。", knowsAbout: ["多语言官网", "结构化产品数据", "询盘归因", "数据跨境"], audience: "希望统一产品事实、拓展海外发现入口并改善询盘分析能力的出口企业", painPoints: ["产品参数、认证和应用信息散落，采购问题难以快速定位。", "多语言版本仅翻译文本，长期维护后参数与术语容易漂移。", "询盘来源字段不足，难以判断内容与渠道的实际贡献。"], strategies: ["建立海外 AI 友好的产品信息架构。", "使用统一事实源生成多语言摘要、参数表和结构化数据。", "通过 UTM、来源字段和访问日志记录可归因信号。"], deliverables: ["完整可编辑外贸独立站", "海外 AI 可见度基线报告", "结构化产品数据部署文档", "多语言摘要优化包", "首月 AI 复查报告"], compliance: ["涉及向境外提供个人信息时，按个人信息保护法与数据跨境规则单独评估。"] },
  { path: "/services/upgrade", title: "老网站 AI 友好度升级", description: "针对现有网站的 GEO 化升级与运维方案，不推翻重建，按审计、结构化、权威、监测和 MCP 逐步补齐 AI 可读能力。", pageType: "CollectionPage", knowsAbout: ["GEO审计", "内容结构化", "权威背书", "GEO监测", "MCP"], audience: "已有官网，希望保留视觉和 URL 资产，同时提升 AI 可读性与复查能力的企业", painPoints: ["旧网站结构对 AI 不友好，关键信息可能被忽略。", "历史内容缺少结构化数据、公开证据状态和稳定摘要。", "发布后缺少持续监测和修订闭环。"], strategies: ["先做 GEO 策略与审计，形成基线报告。", "按页面价值分批重塑内容结构并强化公开证据链。", "通过监测报告与基础 MCP 接口持续迭代。"], deliverables: ["GEO 可见度基线报告", "结构化数据与 AI 摘要区", "公开证据目录", "GEO 监测报告", "基础 MCP 字段白名单"] },
  { path: "/services/knowledge-source", title: "企业知识库信源构建", description: "将产品、案例、白皮书和术语系统化沉淀为 AI 友好的知识资产，支持 Markdown、JSON-LD 与授权 MCP 调用。", pageType: "CollectionPage", knowsAbout: ["企业知识库", "知识工程", "MCP", "JSON-LD", "信源运维"], audience: "希望把内部专业知识建设为可维护、可授权调用、可复查行业信源的企业", painPoints: ["专业资料散落在文档、Wiki、CRM 与官网中，缺少统一知识边界。", "普通知识库面向人类阅读，缺少 AI 可定位的实体、关系和语义结构。", "知识上线后缺少版本、权限、引用监测和影响力扩张机制。"], strategies: ["通过信源战略规划定义知识边界、核心实体和公开优先级。", "通过深度知识工程输出 Markdown、JSON-LD、知识图谱三元组与 QA 对。", "通过高级 MCP 集成与信源运维，在授权边界内持续更新、调用和复查。"], deliverables: ["知识领域地图", "实体关系图谱", "结构化知识库", "高级 MCP 权限矩阵", "信源运维与影响力报告"], compliance: ["涉及内部知识库、客户资料或授权 AI 调用时，必须执行数据分类分级、访问权限和日志留存检查。"] },
  { path: "/solutions", title: "解决方案", description: "根据企业现状选择新建官网、旧站升级或知识信源建设路径。", pageType: "CollectionPage", knowsAbout: ["解决方案", "GEO原生建站", "网站AI改造"], audience: "希望按业务场景选择实施路径的企业", painPoints: ["不清楚应当新建还是增量改造。", "预算与具体交付物难以对应。", "项目缺少阶段验收。"], strategies: ["按现状和目标选择实施路径。", "把页面、协议和知识交付映射到阶段。", "为每个阶段配置验收项。"], deliverables: ["路径说明", "阶段计划", "验收表"] },
  { path: "/solutions/geo-native", title: "GEO原生建站", description: "在页面设计阶段同步定义事实源、语义结构和协议文件，减少上线后的补丁式改造。", knowsAbout: ["GEO原生建站", "SSG", "内容协商"], audience: "准备建设新官网的企业", painPoints: ["传统建站项目只讨论视觉与栏目。", "上线后补充机器可读结构需要重复整理内容。", "页面与知识资产无法同步更新。"], strategies: ["在页面设计阶段定义 SSOT。", "同步建设 HTML、Markdown、schema 与 sitemap。", "在 prebuild 阶段执行 CLA。"], deliverables: ["页面矩阵", "SSOT 注册表", "构建门禁报告"] },
  { path: "/solutions/site-upgrade", title: "网站 AI 改造", description: "以最小必要改动补齐现有官网的抓取、语义、版本和协议能力。", knowsAbout: ["网站AI改造", "增量升级", "CLA"], audience: "已有官网并希望控制迁移风险的企业", painPoints: ["历史页面数量多，无法一次性重构。", "改造期间需要保持业务连续性。", "现有 URL 与搜索资产需要保护。"], strategies: ["优先处理高价值页面。", "保持 canonical 与 URL 稳定。", "按批次加入 Markdown 与 schema。"], deliverables: ["批次计划", "URL 对照表", "回归报告"] },
  { path: "/solutions/knowledge-source", title: "知识库信源构建方案", description: "把公开知识目录、术语治理与只读 MCP 查询组合为长期维护的信源体系。", knowsAbout: ["知识信源", "术语治理", "MCP"], audience: "需要建设长期知识入口的企业", painPoints: ["官网页面不足以承载复杂知识。", "术语与事实缺少统一维护。", "Agent 查询入口缺少公开边界。"], strategies: ["建设知识栏目和术语表。", "对公开事实建立版本治理。", "通过只读 MCP 提供结构化查询。"], deliverables: ["知识栏目", "术语注册表", "只读 MCP 工具"] },
  { path: "/about", title: "关于优服优科", description: "从搜索优化到AI搜索，了解优服优科从SEO、SMO到智能GEO的服务历程与核心能力。", pageType: "AboutPage", templateKind: "company", knowsAbout: ["优服优科", "GEO优化", "AI搜索优化", "企业AI知识库"], audience: "希望了解优服优科公司背景、发展历程、GEO能力与服务数据的企业客户", painPoints: ["搜索行为从关键词检索迁移到AI问答推荐。", "企业需要建立可被AI理解和信任的公开知识资产。", "品牌内容需要同时服务SEO、SMO和GEO场景。"], strategies: ["基于主流AI模型答案生成逻辑制定GEO策略。", "建设企业AI知识库与结构化QA信源。", "持续优化AI友好型内容并复查展现率。"], deliverables: ["GEO诊断方案", "企业AI知识库", "AI友好型内容优化"] },
  { path: "/knowledge", title: "知识库", description: "查阅企业官网 GEO、数据安全、结构化内容与 MCP 接入的基础知识。", pageType: "CollectionPage", templateKind: "editorial", knowsAbout: ["GEO知识库", "数据安全", "MCP"], audience: "希望理解实施原则的业务和技术人员", painPoints: ["概念混用，沟通成本高。", "法规与技术措施缺少对应关系。", "缺少可复用的检查项。"], strategies: ["按主题发布基础清单。", "区分展示站与生成式 AI 服务。", "为 MCP 查询配置公开边界。"], deliverables: ["GEO 基础清单", "展示站边界说明", "MCP 数据分级检查"] },
];

const aggregatePaths = new Set(["/services", "/services/upgrade", "/services/knowledge-source", "/solutions"]);
const editorialPaths = new Set(["/knowledge"]);
const companyPaths = new Set(["/about"]);
const titleByPath = new Map(seeds.map((seed) => [seed.path, seed.title]));
const titleByAnchor = new Map([
  ["/services/upgrade#geo-audit", "GEO策略与审计"],
  ["/services/upgrade#content-structure", "内容结构化重塑"],
  ["/services/upgrade#authority", "权威背书强化"],
  ["/services/upgrade#monitoring", "GEO监测与报告"],
  ["/services/upgrade#mcp-basic", "基础MCP接口集成"],
  ["/services/knowledge-source#strategy", "信源战略规划"],
  ["/services/knowledge-source#engineering", "深度知识工程"],
  ["/services/knowledge-source#mcp-advanced", "高级MCP服务集成"],
  ["/services/knowledge-source#operations", "信源运维与影响力扩张"],
  ["/ai-friendly-upgrade", "老网站 AI 友好度升级"],
  ["/ai-friendly-upgrade#geo-audit", "GEO策略与审计"],
  ["/ai-friendly-upgrade#content-structure", "内容结构化重塑"],
  ["/ai-friendly-upgrade#authority", "权威背书强化"],
  ["/ai-friendly-upgrade#monitoring", "GEO监测与报告"],
  ["/ai-friendly-upgrade#mcp-basic", "基础MCP接口集成"],
  ["/geo-native-website", "GEO原生建站"],
  ["/geo-native-website#ai-enterprise-site", "AI企业官网"],
  ["/geo-native-website#ai-brand-site", "AI品牌官网"],
  ["/geo-native-website#ai-global-site", "AI外贸独立站"],
  ["/geo-native-website#delivery-standards", "建站交付标准"],
  ["/enterprise-knowledge-base", "企业知识库工程"],
  ["/enterprise-knowledge-base#geo-knowledge-center", "GEO知识中心"],
  ["/enterprise-knowledge-base#faq-knowledge-system", "FAQ知识体系"],
  ["/enterprise-knowledge-base#enterprise-terminology", "企业术语库"],
  ["/enterprise-knowledge-base#ai-semantic-enhancement", "AI语义增强"],
  ["/enterprise-knowledge-base#delivery-standards", "知识库交付标准"],
]);

const terms = [
  { id: "geo", term: "GEO", definition: "生成式引擎优化。围绕企业公开事实、内容结构和发现协议，提升生成式搜索场景下的信息可读性与可核验性。" },
  { id: "ssot", term: "SSOT", definition: "Single Source of Truth，单一事实源。HTML、Markdown 与 JSON-LD 从同一份内容数据生成。" },
  { id: "json-ld", term: "JSON-LD", definition: "基于 JSON 的关联数据表达方式。本项目用于输出与页面可见内容同源的结构化数据。" },
  { id: "mcp", term: "MCP", definition: "Model Context Protocol。本站首批仅提供只读公开事实查询，不开放写操作或内部原文。" },
  { id: "canonical", term: "canonical", definition: "页面规范地址声明，用于指明同一内容的首选 URL。" },
  { id: "icp-record", term: "ICP备案", definition: "中国大陆网站上线前需要完成的互联网信息服务备案事项。" },
  { id: "cross-border-data", term: "数据跨境", definition: "数据向境外提供或由境外主体处理时需要评估的法律与工程边界。" },
];

function cards(items: string[], prefix: string): ContentCard[] {
  return items.map((description, index) => ({ title: `${prefix} ${String(index + 1).padStart(2, "0")}`, description }));
}

function professionalKnowledgeFor(seed: Seed): ContentCard[] {
  const common = [
    { title: "公开事实边界", description: "官网优先发布可核验的企业事实。内部资料、客户数据、个人信息和未经授权的案例不进入公开页面。" },
    { title: "多格式同源发布", description: "核心页面同步输出 HTML、Markdown、JSON-LD、canonical 和 sitemap 记录，并由构建门禁检查版本、锚点与事实一致性。" },
  ];
  if (seed.path.includes("global")) return [
    ...common,
    { title: "跨境字段分级", description: "外贸页面区分公开产品资料、联系信息、表单字段和日志数据。涉及向境外提供个人信息时，单独评估数据出境路径。" },
    { title: "多语言口径治理", description: "不同语言页面共享实体与参数源，使用 canonical、hreflang 和区域部署策略保持语义对应关系。" },
  ];
  if (seed.path.includes("mcp")) return [
    ...common,
    { title: "只读资源白名单", description: "MCP 首批仅开放公开事实查询。工具、参数、返回字段、错误结构和限流规则需要显式定义。" },
    { title: "提示词注入防护", description: "查询入口执行输入长度限制、参数校验和注入语句清洗，不返回内部研究记录、客户数据或知识库原文。" },
  ];
  if (seed.path.includes("audit") || seed.path.includes("monitoring")) return [
    ...common,
    { title: "国内爬虫兼容", description: "robots.txt、llms.txt 与 CDN/WAF 白名单需要覆盖 Baiduspider、ERNIEBot、YiyanBot、Bytespider、TiantianSpider 与 Kimibot。" },
    { title: "周期性复查", description: "监测记录关联 URL、内容版本、更新时间、协议文件、抓取状态和异常修订记录，避免只看单次模型回答。" },
  ];
  if (seed.path.includes("knowledge-source") || seed.path.includes("content-structure")) return [
    ...common,
    { title: "知识块设计", description: "围绕客户问题、产品实体、参数、术语和流程拆分内容。每个知识块使用稳定锚点，避免一个长页面混杂多个主题。" },
    { title: "术语与版本治理", description: "中文专业术语、产品别名和业务范围进入静态注册表。页面变化同步更新 Markdown 与结构化数据。" },
  ];
  if (seed.path.includes("authority") || seed.path.includes("brand")) return [
    ...common,
    { title: "品牌实体一致性", description: "公司名称、品牌别名、服务范围、资质状态和联系信息保持一致，降低不同渠道之间的身份冲突。" },
    { title: "证据链状态管理", description: "区分企业事实、公开证据、观点和典型场景。资质、认证和案例方向配置来源、日期与公开范围。" },
  ];
  return [
    ...common,
    { title: "中国站点合规", description: "大陆站点上线前完成 ICP 备案。涉及生成内容、个人信息或跨境处理时，分别检查内容标识、最小必要收集和数据出境边界。" },
    { title: "SSR 与可访问性", description: "核心正文通过 SSR 或 SSG 输出，禁用 JavaScript 后仍可阅读。交互组件支持键盘访问、焦点状态和语义化标签。" },
  ];
}

function visualAssetsFor(seed: Seed): VisualAsset[] {
  if (seed.path.includes("global")) return [{ src: "/images/subpages/global-trade.png", alt: "企业跨境业务团队在港口办公场景中讨论多语言官网与全球业务规划", caption: "跨境业务页面需要同时处理多语言口径、区域访问与数据边界。" }];
  if (seed.path.includes("audit")) return [{ src: "/images/subpages/site-audit.png", alt: "数字咨询团队在办公室中查看网站审计与数据分析界面", caption: "先核对页面、数据与抓取条件，再安排改造顺序。" }];
  if (seed.path.includes("monitoring") || seed.path.includes("mcp")) return [{ src: "/images/subpages/operations-monitoring.png", alt: "技术运维团队在监控中心查看网站运行与数据状态", caption: "持续监测、权限控制与日志留存进入同一套运维流程。" }];
  if (seed.path.includes("knowledge-source") || seed.path.includes("content-structure") || seed.path === "/knowledge") return [{ src: "/images/subpages/knowledge-workshop.png", alt: "企业知识工程团队在会议室中整理内容卡片与知识结构", caption: "将分散资料整理为可维护、可复查的企业知识结构。" }];
  if (seed.path === "/about") return [{ src: "/images/subpages/corporate-building.png", alt: "上海总部办公环境中的城市企业建筑群景观", caption: "优服优科总部位于上海，并在武汉设有运营主体。" }];
  return [{ src: "/images/subpages/team-collaboration.png", alt: "企业业务与技术团队在会议室中讨论官网信息架构", caption: "业务事实、页面设计与后续维护在同一套官网工程中协同推进。" }];
}

function faqFor(seed: Seed): FaqItem[] {
  return [
    { question: `${seed.title}适合什么阶段的企业？`, answer: `适合${seed.audience}。项目先确认公开事实范围、页面清单和验收标准，再安排设计与开发。` },
    { question: "项目是否承诺模型收录、引用或推荐？", answer: "不承诺。模型抓取、收录和回答由平台规则、公开信号与模型策略共同决定。YFYK 交付可检查的页面结构、协议文件和内容治理机制。" },
    { question: "如何避免官网内容与机器可读内容不一致？", answer: "HTML、Markdown 与 JSON-LD 从同一份 SSOT 生成，并在 prebuild 阶段执行一致性检查。缺少必要字段或锚点时阻断构建。" },
  ];
}

function catalogFor(seed: Seed) {
  const directChildren = seeds.filter((item) => item.path.startsWith(`${seed.path}/`) && item.path.slice(seed.path.length + 1).split("/").length === 1);
  return directChildren.length ? [{ title: "相关服务", description: "按当前任务继续查看对应服务页面。", paths: directChildren.map((item) => item.path) }] : [];
}

function relatedFor(seed: Seed) {
  const parent = seed.path.includes("/") ? seed.path.slice(0, seed.path.lastIndexOf("/")) || "/services" : "/services";
  return seeds.filter((item) => item.path !== seed.path && (item.path.startsWith(`${parent}/`) || item.path === parent)).slice(0, 4).map((item) => item.path);
}

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function createPage(seed: Seed): GeoPageContent {
  const templateKind = seed.templateKind ?? (aggregatePaths.has(seed.path) ? "aggregate" : editorialPaths.has(seed.path) ? "editorial" : companyPaths.has(seed.path) ? "company" : "detail");
  const painPoints = cards(seed.painPoints, "问题");
  const capabilities = seed.strategies.map((description, index) => ({ title: ["事实源治理", "工程实施", "发布与复查"][index] ?? `实施动作 ${index + 1}`, description }));
  const professionalKnowledge = professionalKnowledgeFor(seed);
  const visualAssets = visualAssetsFor(seed);
  if (visualAssets.length < 1 || visualAssets.length > 10) throw new Error(`${seed.path} 必须配置 1 至 10 张实景图`);
  const processSteps = [
    { title: "范围确认", description: "确认目标页面、公开事实范围、数据边界和验收口径。" },
    { title: "结构实施", description: "按 SSOT 生成页面、Markdown、结构化数据与发现协议。" },
    { title: "发布复查", description: "执行构建门禁、爬虫模拟和版本记录，形成复查清单。" },
  ];
  const faqs = seed.path === "/services" ? servicesOverviewFaqs : seed.path === "/services/products/ai-brand-site" ? brandSiteFaqs : seed.path === "/services/products/ai-global-site" ? globalSiteFaqs : seed.path === "/services/upgrade" ? upgradeFaqs : seed.path === "/services/knowledge-source" ? knowledgeSourceFaqs : templateKind === "detail" ? faqFor(seed) : [];
  const catalogGroups = catalogFor(seed);
  const publicReferences = templateKind === "editorial" || seed.path.includes("global") || seed.path.includes("mcp") ? officialReferences : officialReferences.slice(2, 4);
  const relatedPaths = relatedFor(seed);
  const pageTerms = seed.path === "/knowledge" ? terms.slice(0, 4) : [];
  const cta = seed.path === "/services/products/ai-brand-site"
    ? { title: "让 AI 更容易理解你的品牌", description: "首次咨询用于了解品牌现状，并提供免费的 GEO 快速诊断。", href: "/contact", label: "预约品牌咨询" }
    : seed.path === "/services/products/ai-global-site"
    ? { title: "让海外买家更容易发现你的产品", description: "首次咨询用于了解当前独立站状态，并提供免费的 AI 可见度快速诊断。", href: "/contact", label: "预约免费咨询" }
    : seed.path === "/services/upgrade"
    ? { title: "让您的旧网站重新被 AI 看见", description: "首次沟通用于了解网站现状，并确认是否适合做 GEO 快速诊断。", href: "/contact", label: "预约免费AI诊断" }
    : seed.path === "/services/knowledge-source"
    ? { title: "让专业知识成为 AI 可复查的权威信源", description: "首次沟通用于确认知识范围、公开边界、资料状态和是否适合接入 MCP。", href: "/contact", label: "预约免费战略咨询" }
    : { title: "先确认范围，再安排实施", description: "准备官网地址、目标页面和业务范围，通过联系页或电话沟通项目条件。", href: "/contact", label: "联系优服优科" };
  const chinaCompliance = [...baseCompliance, ...(seed.compliance ?? [])];
  const sections = seed.path === "/services" ? servicesOverviewMarkdownSections : seed.path === "/services/products/ai-brand-site" ? brandSiteMarkdownSections : seed.path === "/services/products/ai-global-site" ? globalSiteMarkdownSections : seed.path === "/services/upgrade" ? upgradeMarkdownSections : seed.path === "/services/knowledge-source" ? knowledgeSourceMarkdownSections : seed.path === "/about" ? aboutCompanySections : [
    { id: "service-overview", aiChunk: "service-overview", title: "服务定义与适用对象", summary: seed.description, body: `${seed.description}\n\n适用对象：${seed.audience}。` },
    ...(catalogGroups.length ? [{ id: "service-catalog", aiChunk: "service-catalog", title: "相关服务", summary: "按当前任务继续查看对应服务页面。", body: list(catalogGroups.flatMap((group) => group.paths).map((path) => `${getGeoPageTitle(path)}：${path}`)) }] : []),
    { id: "industry-pain-points", aiChunk: "industry-pain-points", title: "需要先解决的问题", summary: "项目先识别内容、数据和长期维护风险。", body: list(seed.painPoints) },
    { id: "capabilities", aiChunk: "capabilities", title: "实施方法", summary: "以事实源、工程交付和发布复查组织实施。", body: list(seed.strategies) },
    { id: "professional-knowledge", aiChunk: "professional-knowledge", title: "专业知识与中国站点规则", summary: "页面结合国内站点发布、数据边界与工程交付规则说明。", body: professionalKnowledge.map((item) => `### ${item.title}\n${item.description}`).join("\n\n") },
    { id: "delivery-process", aiChunk: "delivery-process", title: "实施步骤", summary: "按范围确认、结构实施和发布复查推进。", body: list(processSteps.map((item) => `${item.title}：${item.description}`)) },
    { id: "deliverables", aiChunk: "deliverables", title: "交付物与验收", summary: "交付结果使用明确清单验收。", body: list(seed.deliverables) },
    ...(pageTerms.length ? [{ id: "defined-terms", aiChunk: "defined-terms", title: "工程与合规术语", summary: "术语使用稳定锚点，供页面深链与项目沟通引用。", body: pageTerms.map((item) => `### ${item.term} {#${item.id}}\n${item.definition}`).join("\n\n") }] : []),
    ...(faqs.length ? [{ id: "frequently-asked-questions", aiChunk: "frequently-asked-questions", title: "常见问题", summary: "围绕适用阶段、交付边界和一致性检查说明。", body: faqs.map((item) => `### ${item.question}\n${item.answer}`).join("\n\n") }] : []),
    { id: "public-references", aiChunk: "public-references", title: "公开依据", summary: "公开链接用于说明工程规则与合规边界，不代表平台对收录或引用作出承诺。", body: list(publicReferences.map((item) => `[${item.title}](${item.url})：${item.description}`)) },
    { id: "china-compliance", aiChunk: "china-compliance", title: "中国站点合规提示", summary: "中国站点开发同时处理备案、数据边界和内容凭证状态。", body: list(chinaCompliance) },
    ...(relatedPaths.length ? [{ id: "related-pages", aiChunk: "related-pages", title: "继续查看相关页面", summary: "根据当前任务继续查看相关服务和栏目。", body: list(relatedPaths.map((path) => `${getGeoPageTitle(path)}：${path}`)) }] : []),
    { id: "contact-cta", aiChunk: "contact-cta", title: cta.title, summary: cta.description, body: `[${cta.label}](${cta.href})` },
  ];
  return {
    id: seed.path.slice(1).replace(/\//g, "-"),
    slug: seed.path.slice(1),
    path: seed.path,
    description: seed.description,
    knowsAbout: seed.knowsAbout,
    pageType: seed.pageType ?? "Service",
    templateKind,
    hero: { eyebrow: templateKind === "aggregate" ? "SERVICE CATALOG" : templateKind === "editorial" ? "KNOWLEDGE INDEX" : templateKind === "company" ? "YFYK COMPANY" : "YFYK SERVICE", title: seed.title, lead: seed.path === "/about" ? "从搜索优化到AI搜索" : seed.description },
    audience: seed.audience,
    painPoints,
    capabilities,
    professionalKnowledge,
    visualAssets,
    deliverables: seed.deliverables,
    processSteps,
    faqs,
    relatedPaths,
    catalogGroups,
    publicReferences,
    terms: pageTerms,
    cta,
    chinaCompliance,
    researchSources: officialReferences.map((item) => item.url),
    metadata: { title: `${seed.title} | 优服优科`, summary: seed.description, dateModified: siteConfig.dateModified, version: siteConfig.version },
    sections,
  };
}

export const geoPages = seeds.map(createPage);
export const geoPagePaths = geoPages.map((page) => page.path);

export function getGeoPage(path: string) {
  return geoPages.find((page) => page.path === path);
}

export function getGeoPageTitle(path: string) {
  return titleByAnchor.get(path) ?? titleByPath.get(path.split("#")[0]) ?? path;
}
