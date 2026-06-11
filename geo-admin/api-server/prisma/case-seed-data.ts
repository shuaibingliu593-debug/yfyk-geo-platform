/**
 * YFYK 案例种子数据（5 条）
 * 重复执行 seed 时通过 slug 去重，不会产生重复记录。
 */

import { CaseType, ContentStatus, RelatedServiceType } from "@prisma/client";

export type CaseSeedItem = {
  slug: string;
  title: string;
  caseType: CaseType;
  industry: string;
  clientName: string;
  clientDisplayName: string;
  isAnonymized: boolean;
  challenge: string;
  solution: string;
  results: string;
  metrics: Record<string, string | number>;
  excerpt: string;
  content: string;
  coverImage: string;
  relatedServiceType: RelatedServiceType;
  status: ContentStatus;
  featured: boolean;
  sortOrder: number;
  geoSummary: string;
};

function buildContent(sections: {
  background: string;
  challenges: string;
  solution: string;
  implementation: string;
  results: string;
  lessons: string;
}): string {
  return [
    "## 项目背景",
    sections.background,
    "",
    "## 面临挑战",
    sections.challenges,
    "",
    "## 解决方案",
    sections.solution,
    "",
    "## 实施过程",
    sections.implementation,
    "",
    "## 项目成果",
    sections.results,
    "",
    "## 经验总结",
    sections.lessons
  ].join("\n");
}

export const caseSeedData: CaseSeedItem[] = [
  {
    slug: "manufacturing-geo-native-website",
    title: "制造业企业官网 GEO 原生重构项目",
    caseType: CaseType.GEO_NATIVE,
    industry: "高端制造",
    clientName: "某工业设备制造企业",
    clientDisplayName: "某工业设备制造企业（脱敏）",
    isAnonymized: true,
    challenge:
      "客户拥有多年行业经验和丰富产品线，但官网长期以产品展示为主，内容结构分散，缺少案例体系、FAQ体系和术语定义。虽然行业知名度较高，但在 AI 搜索场景中几乎没有有效曝光。各产品线页面语义边界模糊，AI 难以判断企业核心能力与适用场景，销售团队也缺乏可被引用的标准化表达。",
    solution:
      "围绕 GEO 原生架构重构官网信息体系：建立服务—案例—FAQ—术语四层内容结构；为核心页面补充 AI Summary 与 Schema 标记；输出 llms.txt 与 AI Sitemap，形成可被 AI 持续抓取与理解的内容基础设施。",
    results:
      "官网内容结构显著优化，AI 可读性基础设施完成建设，企业知识形成统一表达体系，核心服务页在 AI 问答中的引用稳定性明显提升，为后续知识库扩展奠定基础。",
    metrics: {
      "AI可读性评分": "93分",
      "结构化页面": "32页",
      "FAQ条目": "56条",
      "交付周期": "10周"
    },
    excerpt:
      "为工业设备制造企业完成 GEO 原生官网重构，建立案例、FAQ、术语与结构化数据体系，显著提升 AI 搜索场景下的内容可理解性与引用能力。",
    content: buildContent({
      background:
        "客户是一家专注工业装备与自动化解决方案的制造企业，成立逾十五年，产品线覆盖数控机床、工业机器人集成及定制化产线设计。企业在细分行业具备稳定客户群与项目交付经验，但官网自 2019 年上线后仅以产品图册与企业简介为主，内容更新依赖市场部门零散发布，未形成可被外部系统稳定理解的知识结构。随着采购方与合作伙伴越来越多通过 AI 工具进行前期调研，客户发现品牌在相关技术问答中几乎不被提及，即便企业具备对应能力，AI 回答也往往指向竞品或行业第三方解读。",
      challenges:
        "首要问题是信息架构以产品型号为中心，缺少围绕客户问题组织的内容入口，AI 抓取后难以归纳企业服务能力边界。其次，案例材料分散于 PDF 与销售 PPT，未在官网形成结构化案例库，导致 AI 无法关联项目经验与行业场景。第三，FAQ 与术语体系缺失，同一概念在不同页面表述不一致，增加了 AI 理解成本。第四，页面级 Schema 与摘要信息不完整，AI Summary 未覆盖核心服务页，llms.txt 与 AI Sitemap 均未配置，企业在 AI 搜索生态中缺乏主动参与的入口。",
      solution:
        "项目以 GEO 原生建站方法论为框架，分阶段推进信息架构重构与 AI 友好度建设。首先梳理企业对外需表达的核心能力、典型客户场景与差异化优势，将原有产品页重组为「行业方案—核心服务—交付能力」三层结构。其次建立案例中心，按行业、项目类型与成果指标结构化沉淀过往项目。同步建设 FAQ 中心，将销售、售前高频问题标准化为可检索问答。再次建立术语表，统一设备、工艺与服务相关概念的定义与引用关系。最后为关键页面补充 AI Summary、Schema.org 标记，并输出 llms.txt 与 AI Sitemap，使 AI 系统能够按优先级发现与理解企业内容。",
      implementation:
        "第1-2周：完成业务访谈与内容审计，输出信息架构蓝图与页面迁移清单，明确 32 个核心页面的重构优先级。\n第3-4周：搭建案例中心与 FAQ 框架，迁移首批 12 个典型案例与 28 条高频问答，建立术语表初稿 40 条。\n第5-6周：完成服务页与方案页正文重写，补充 AI Summary，部署 WebPage 与 Organization Schema。\n第7-8周：扩展 FAQ 至 56 条，完善案例指标字段，配置 llms.txt 与 AI Sitemap 收录策略。\n第9-10周：全站 GEO 评分复检，修复结构化数据缺口，完成上线验收与运营交接文档。",
      results:
        "重构后官网形成清晰的内容层级，核心服务页均具备 AI Summary 与 Schema 覆盖。案例中心收录 12 个结构化案例，FAQ 中心上线 56 条问答，术语表收录 40 个关键概念。GEO 综合评分从实施前 41 分提升至 93 分。销售团队反馈，客户在前期调研中提及「通过 AI 搜索了解到企业能力」的情况有所增加。项目交付后，客户具备自主维护案例与 FAQ 的标准流程，为后续知识库扩展预留了接口与内容基础。",
      lessons:
        "制造业官网 GEO 建设不宜从产品目录直接改造，而应从客户问题与行业场景出发重组内容。案例与 FAQ 是最易被 AI 引用、也最能体现专业深度的两类资产，应优先于视觉改版投入资源。术语标准化看似基础，却是降低 AI 误解风险的关键环节。Schema 与 AI Summary 需要与正文同步规划，事后补录往往导致语义不一致。建议将 GEO 配置纳入官网日常运营 checklist，而非一次性项目交付物。"
    }),
    coverImage:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80",
    relatedServiceType: RelatedServiceType.GEO_NATIVE_WEBSITE,
    status: ContentStatus.PUBLISHED,
    featured: true,
    sortOrder: 10,
    geoSummary:
      "制造业企业 GEO 原生官网重构案例：通过信息架构重组、案例与 FAQ 体系建设、术语标准化及 Schema/AI Summary 配置，提升 AI 搜索可理解性与引用稳定性。"
  },
  {
    slug: "healthcare-ai-friendly-upgrade",
    title: "医疗健康企业官网 AI 友好度升级项目",
    caseType: CaseType.AI_UPGRADE,
    industry: "医疗健康",
    clientName: "某医疗服务机构",
    clientDisplayName: "某医疗服务机构（脱敏）",
    isAnonymized: true,
    challenge:
      "客户官网运营多年，积累大量内容，但信息组织方式以传统 SEO 为主，FAQ、知识库和术语体系缺失，AI 搜索场景中的引用率较低。医疗内容专业度高，若缺乏标准化表达，AI 容易在回答中出现概念混淆或信息不完整的情况。",
    solution:
      "开展 AI 友好度审计，优化页面结构与摘要表达；建设 FAQ 体系与医疗术语标准化词表；重构页面摘要并优化 Schema 配置，使既有内容资产适配 AI 搜索时代的理解与引用需求。",
    results:
      "官网知识结构更加清晰，AI 理解成本显著降低，企业内容可持续维护机制建立，核心诊疗与服务页面在 AI 问答中的表述准确度提升，为后续知识库建设打下基础。",
    metrics: {
      "AI理解度": "89分",
      "FAQ覆盖": "42条",
      "术语标准化": "68项",
      "优化周期": "7周"
    },
    excerpt:
      "为医疗服务机构完成官网 AI 友好度升级，通过审计、FAQ 建设、术语标准化与 Schema 优化，提升既有内容在 AI 搜索中的可理解性与引用质量。",
    content: buildContent({
      background:
        "客户是一家区域性医疗健康服务机构，业务涵盖专科诊疗、健康管理与医疗咨询服务，官网已运营超过八年，积累了诊疗介绍、健康科普、专家团队与服务流程等大量内容。网站在搜索引擎自然流量方面表现稳定，但近一年市场团队注意到，潜在患者与合作方通过 AI 助手获取机构信息时，回答内容常出现偏差：服务项目边界模糊、科室能力描述不完整，甚至与其他医疗机构混淆。管理层判断，这并非内容总量不足，而是内容组织方式尚未适配 AI 搜索时代的语义理解需求。",
      challenges:
        "现有内容按科室与栏目分类，缺少围绕患者常见问题的聚合入口，AI 难以快速定位「某症状是否适合就诊」「某检查项目如何预约」等高频意图。医疗术语在科普文章、服务介绍与专家介绍中表述不一，增加了 AI 解析歧义。页面摘要多为营销导向短句，无法有效传递专业语义。Schema 标记覆盖有限，FAQ 结构化数据缺失，导致 AI 平台倾向引用第三方医疗资讯而非官网原文。内容维护流程也未区分「面向人类阅读」与「面向 AI 理解」的编写规范。",
      solution:
        "项目采用「审计—优化—体系建设」三步策略。首先对全站 180 余个页面进行 AI 友好度审计，识别语义重复、结构断层与摘要缺失问题。其次按患者旅程重构关键页面层级，将分散的诊疗说明整合为可独立引用的服务说明页。同步建设 FAQ 体系，覆盖预约、诊疗流程、费用与术后康复等 42 个高频问题。建立医疗术语标准化词表 68 项，统一症状、检查项目与服务名称的对外表达。为核心页面重写 AI Summary，补充 MedicalOrganization 与 FAQPage Schema，并优化内链关系以强化主题聚合信号。",
      implementation:
        "第1周：完成全站 AI 友好度审计，输出问题清单与优先级矩阵，锁定 24 个核心改造页面。\n第2-3周：建立 FAQ 框架与术语词表，完成首批 26 条问答与 40 项术语对齐。\n第4-5周：重构服务页与科室页摘要，补充 Schema 标记，统一标题与描述语义。\n第6周：扩展 FAQ 至 42 条，完成术语表全量审核，修复内链断层。\n第7周：GEO 复检与 AI 引用抽样测试，交付内容维护指南与更新流程。",
      results:
        "升级后官网核心页面均具备结构化摘要与 Schema 覆盖，FAQ 中心上线 42 条标准化问答，术语词表收录 68 项医疗概念。AI 友好度综合评分从 52 分提升至 89 分。抽样测试显示，10 个核心业务问题的 AI 回答中，引用官网信息或准确复述官网表述的比例明显提升。内容团队建立了 FAQ 与术语的季度复审机制，确保新增内容延续统一标准。",
      lessons:
        "医疗行业内容的专业性决定了 AI 友好度建设必须优先解决术语一致性与语义准确性，而非追求内容数量增长。FAQ 是医疗官网最易产生 AI 引用价值的模块，应直接对应真实患者问题编写。页面摘要需要从「吸引点击」转向「准确描述」，这要求临床与市场团队协同审核。Schema 标记应与正文严格对应，避免标记内容与实际服务不符引发合规风险。建议将 AI 友好度纳入内容发布前的标准审核环节。"
    }),
    coverImage:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    relatedServiceType: RelatedServiceType.AI_FRIENDLY_UPGRADE,
    status: ContentStatus.PUBLISHED,
    featured: true,
    sortOrder: 20,
    geoSummary:
      "医疗健康企业官网 AI 友好度升级案例：通过审计、FAQ 体系、医疗术语标准化与 Schema 优化，提升既有官网内容在 AI 搜索中的理解准确度。"
  },
  {
    slug: "enterprise-knowledge-base-project",
    title: "企业知识库工程建设项目",
    caseType: CaseType.KNOWLEDGE_BASE,
    industry: "企业服务",
    clientName: "某中型企业服务集团",
    clientDisplayName: "某中型企业服务集团（脱敏）",
    isAnonymized: true,
    challenge:
      "企业内部知识分散于多个业务系统与文档库，对外官网、方案材料与售前支持使用不同版本的内容，导致 AI 搜索与企业内部检索均难以获得一致、权威的信息来源。缺乏统一知识库工程，内容更新成本高且质量不可控。",
    solution:
      "以企业知识库工程方法论为核心，建立「采集—结构化—发布—维护」全流程：统一知识分类体系，构建对外知识门户，打通官网、方案库与 FAQ 的内容源，并配置 GEO 基础设施支持 AI 引用。",
    results:
      "形成企业级统一知识表达体系，对外内容一致性显著提升，售前材料编制效率提高，AI 搜索可引用的权威内容源建立，知识维护流程实现标准化运营。",
    metrics: {
      "知识条目": "240条",
      "内容一致性": "96%",
      "编制效率提升": "35%",
      "建设周期": "12周"
    },
    excerpt:
      "为企业服务集团建设统一知识库工程，整合分散内容资产，建立对外知识门户与标准化维护流程，提升 AI 搜索引用质量与内部协同效率。",
    content: buildContent({
      background:
        "客户是一家提供管理咨询、数字化服务与企业培训的中型服务集团，旗下多个事业部独立运营，各自维护产品说明、解决方案与案例材料。随着业务线扩展，知识资产快速膨胀，但缺乏统一的分类标准与版本管理机制。售前团队常需从多个网盘与旧版 PPT 中拼凑材料，同一服务在不同场合表述差异明显。客户意识到，在 AI 搜索逐渐成为 B2B 采购前期调研工具的背景下，企业若不能提供权威、一致、可引用的知识源，将在潜在客户认知中失去话语权。",
      challenges:
        "知识分布在事业部私有文档库、旧官网子站与 CRM 附件中，没有统一索引与元数据标准。内容重复与版本冲突频繁，市场部门难以确认对外发布口径。FAQ 与术语各自维护，跨业务线概念定义不一致。官网仅展示部分精选内容，大量成熟方案与行业洞察未对外释放。AI 搜索测试中，企业内容极少被引用，回答多依赖第三方行业分析。缺乏知识更新责任制，内容陈旧问题突出。",
      solution:
        "项目以企业知识库工程五层架构推进：知识采集层梳理各事业部内容清单，建立来源登记与去重规则；结构化层定义统一分类（行业、服务类型、交付阶段、客户规模）与元数据字段；表达层制定对外写作规范与术语标准；发布层建设知识门户，与官网案例中心、FAQ 区联动；运营层建立内容责任人、复审周期与 GEO 配置标准。同步为知识门户配置 AI Summary、Schema 与 llms.txt，确保 AI 系统可优先发现权威内容。",
      implementation:
        "第1-2周：完成各事业部内容盘点，输出知识清单 380 份，筛选首批入库 120 条高价值内容。\n第3-4周：建立分类体系与元数据规范，完成术语表 55 项，设计知识门户信息架构。\n第5-7周：结构化处理首批知识条目，开发对外知识门户并与官网打通。\n第8-9周：扩展知识库至 200 条，联动 FAQ 与案例中心，配置 GEO 基础设施。\n第10-12周：全量上线 240 条知识条目，培训各事业部内容管理员，交付运营手册与复审机制。",
      results:
        "知识库收录 240 条结构化知识条目，覆盖 6 大服务线与 12 个行业场景。对外内容一致性评估达 96%，售前方案编制周期平均缩短 35%。知识门户与官网形成统一内容源，GEO 评分达 91 分。AI 引用抽样中，企业知识门户内容开始出现在 B2B 服务相关问答中。各事业部建立了季度内容复审机制，知识陈旧率显著下降。",
      lessons:
        "企业知识库工程的核心价值在于建立「单一可信源」，而非简单搭建文档管理系统。分类体系必须兼顾内部管理效率与对外 AI 可理解性，两者需在项目初期联合设计。知识发布应与官网 GEO 配置同步推进，否则知识库将成为内部工具而非 AI 时代的信源资产。建议明确各业务线的内容责任人，将知识维护纳入绩效考核。对于多事业部企业，术语标准化是跨团队协作的基础投入，不可省略。"
    }),
    coverImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
    relatedServiceType: RelatedServiceType.ENTERPRISE_KNOWLEDGE_BASE,
    status: ContentStatus.PUBLISHED,
    featured: true,
    sortOrder: 30,
    geoSummary:
      "企业知识库工程建设案例：整合分散知识资产，建立统一分类与对外知识门户，配套 GEO 配置，提升 AI 搜索可引用的权威内容源质量。"
  },
  {
    slug: "technology-content-structure-upgrade",
    title: "科技企业官网内容结构化升级项目",
    caseType: CaseType.AI_UPGRADE,
    industry: "科技服务",
    clientName: "某科技服务企业",
    clientDisplayName: "某科技服务企业（脱敏）",
    isAnonymized: true,
    challenge:
      "科技企业官网技术内容密集，但页面结构偏向研发视角，客户关注的应用场景、集成方式与交付边界表达不足。AI 搜索在回答相关产品问题时，常无法准确提取企业技术优势与适用条件。",
    solution:
      "对官网进行内容结构化升级：将技术参数转化为场景化表达，建立产品—方案—案例的映射关系，补充 FAQ 与 API 级 Schema 标记，优化 AI Summary 以提升机器可读性。",
    results:
      "官网技术内容实现场景化表达，AI 对产品的理解准确度提升，潜在客户可通过 AI 搜索获取更清晰的能力说明，销售线索质量有所改善。",
    metrics: {
      "结构化页面": "28页",
      "场景化案例": "8个",
      "AI可读性": "87分",
      "升级周期": "6周"
    },
    excerpt:
      "为科技服务企业完成官网内容结构化升级，将技术参数转化为场景化表达，建设 FAQ 与 Schema 体系，提升 AI 搜索对产品的理解准确度。",
    content: buildContent({
      background:
        "客户是一家提供企业级软件与数据智能服务的科技公司，主营数据中台、API 集成与行业 SaaS 解决方案。官网由技术团队主导建设，页面充满架构图、技术参数与功能清单，对技术受众信息充分，但对业务决策者与 AI 搜索系统不够友好。销售团队反馈，客户在初次接触时常通过 AI 工具了解产品，但获得的回答往往停留在「提供数据服务」的笼统层面，无法区分客户与竞品的差异点。公司决定在不更换技术栈的前提下，对现有内容进行结构化升级。",
      challenges:
        "产品页以功能模块为单元组织，缺少「什么行业、什么规模、什么场景」的明确指引，AI 难以建立产品与业务问题的关联。技术文档与官网内容割裂，API 说明、集成指南未在官网形成可检索入口。案例材料偏技术实现描述，缺少业务成果量化。FAQ 缺失导致 AI 将常见集成问题归于通用技术讨论。Schema 仅覆盖基础 Organization 信息，Product 与 SoftwareApplication 标记未部署。",
      solution:
        "项目聚焦「内容结构化」而非视觉改版。首先将 15 个核心产品页按「适用场景—核心能力—集成方式—交付边界」模板重组。其次建立 8 个场景化案例，每个案例明确行业、痛点、方案与量化成果。建设 30 条技术与商务 FAQ，覆盖部署模式、数据安全、集成周期等关键问题。为产品页补充 SoftwareApplication Schema，为案例页补充 CreativeWork 标记。重写 AI Summary，确保每个摘要包含场景、能力与差异化三个要素。",
      implementation:
        "第1周：完成内容审计与场景映射，确定 28 个结构化改造页面与 8 个案例编写计划。\n第2-3周：重组产品页结构，完成首批 4 个场景化案例与 18 条 FAQ。\n第4-5周：部署 Schema 标记，重写 AI Summary，完成剩余案例与 FAQ 上线。\n第6周：全站 GEO 复检，进行 AI 引用抽样测试，交付内容更新规范。",
      results:
        "28 个核心页面完成结构化升级，上线 8 个场景化案例与 30 条 FAQ。AI 可读性评分从 48 分提升至 87 分。抽样显示，产品相关 AI 回答开始准确提及企业特定能力与适用场景。销售团队使用结构化案例进行客户沟通的效率提升，线索跟进中「已了解产品适用场景」的客户占比增加。",
      lessons:
        "科技企业的 AI 友好度升级关键在于将「技术语言」转化为「场景语言」，这不意味着降低专业深度，而是增加上下文锚点。FAQ 应同时覆盖技术集成与商务决策两类问题。Schema 标记对科技产品尤为重要，SoftwareApplication 类型能显著提升 AI 对产品的识别精度。内容结构化升级应优先于视觉翻新，投入产出比更高。建议技术与市场团队共同维护案例库，确保场景表达持续准确，并将新版本发布纳入 GEO 复检流程。"
    }),
    coverImage:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80",
    relatedServiceType: RelatedServiceType.AI_FRIENDLY_UPGRADE,
    status: ContentStatus.PUBLISHED,
    featured: false,
    sortOrder: 40,
    geoSummary:
      "科技企业官网内容结构化升级案例：将技术参数转化为场景化表达，建设 FAQ 与 Schema 体系，提升 AI 搜索对 SaaS 产品的理解准确度。"
  },
  {
    slug: "enterprise-ai-content-assets",
    title: "集团企业 AI 内容资产建设项目",
    caseType: CaseType.KNOWLEDGE_BASE,
    industry: "集团企业",
    clientName: "某多元化集团企业",
    clientDisplayName: "某多元化集团企业（脱敏）",
    isAnonymized: true,
    challenge:
      "集团下属多个业务板块各自运营品牌官网，内容标准不一，AI 搜索中集团整体形象碎片化。缺乏统一的 AI 内容资产管理体系，无法形成集团级知识协同与引用优势。",
    solution:
      "建设集团级 AI 内容资产体系：制定统一 GEO 标准与内容规范，建立集团知识中台对外发布层，整合各板块案例、FAQ 与术语，输出集团级 llms.txt 与 AI Sitemap 策略。",
    results:
      "集团形成统一的 AI 内容资产管理体系，各板块内容按标准协同发布，集团品牌在 AI 搜索中的整体表达能力提升，为多板块协同获客奠定基础。",
    metrics: {
      "业务板块": "5个",
      "统一案例": "18个",
      "集团FAQ": "64条",
      "建设周期": "14周"
    },
    excerpt:
      "为多元化集团企业建设 AI 内容资产体系，统一各板块 GEO 标准，建立集团知识发布层，提升 AI 搜索中集团整体品牌的表达能力与引用质量。",
    content: buildContent({
      background:
        "客户是一家涵盖制造、能源、科技服务与供应链管理的多元化集团，旗下 5 个业务板块均设有独立品牌官网。各板块自主运营内容，集团层面仅有简单的集团介绍页，缺乏统一的内容战略与 AI 搜索应对机制。在 AI 搜索测试中，集团品牌常被简化为「综合性企业」，各板块的核心能力与典型案例难以被准确引用。集团管理层认识到，在 AI 搜索时代，需要以「集团级内容资产」视角统筹各板块对外表达，而非继续各自为政。",
      challenges:
        "五个板块官网的技术栈、内容结构与运营标准各不相同，GEO 配置水平参差不齐。集团案例分散在各板块，缺少集团级案例聚合与交叉推荐。FAQ 与术语在各板块独立维护，同一集团概念存在多种表述。llms.txt 与 AI Sitemap 均未在集团层统一部署。品牌管理部门缺乏对各板块内容的可见性与审核机制。AI 搜索引用测试中，集团整体曝光度远低于各板块业务实力。",
      solution:
        "项目设计集团级 AI 内容资产建设框架。首先制定集团 GEO 标准手册，明确 AI Summary、Schema、FAQ 与术语的最低配置要求。其次建设集团知识中台对外发布层，作为各板块内容的统一索引与聚合入口。整合 18 个跨板块典型案例，建立集团 FAQ 64 条，覆盖集团战略、各板块协同与统一采购等主题。制定集团级 llms.txt 与 AI Sitemap 策略，按板块优先级配置收录权重。建立内容审核与发布流程，品牌管理部门对各板块 GEO 配置拥有审计权限。",
      implementation:
        "第1-2周：完成五板块官网 GEO 审计，输出差异报告与集团标准手册初稿。\n第3-5周：设计集团知识中台发布层架构，完成首批 8 个集团案例与 30 条 FAQ 整合。\n第6-8周：各板块按标准改造核心页面，品牌管理部门完成首轮 GEO 配置审计。\n第9-11周：扩展集团案例至 18 个，FAQ 至 64 条，部署集团级 llms.txt 与 AI Sitemap。\n第12-14周：全集团 GEO 复检，完成运营培训与季度复审机制上线。",
      results:
        "集团 GEO 标准手册在 5 个板块全面落地，知识中台发布层上线并索引各板块核心内容。集团案例库收录 18 个跨板块案例，FAQ 中心 64 条。集团整体 GEO 评分从 38 分提升至 88 分。AI 搜索抽样中，集团品牌开始以「多元化业务组合」的准确表述出现，部分板块核心能力被一并引用。品牌管理部门建立了季度 GEO 审计机制，内容资产实现可管可控。",
      lessons:
        "集团企业 AI 内容资产建设的核心挑战是标准统一与执行落地，需要在集团战略高度推动而非仅由 IT 部门执行。知识中台的价值在于「聚合信号」——让 AI 理解集团内各板块的关联与协同关系。集团 FAQ 应覆盖跨板块客户常见问题，这是单体板块无法提供的独特内容资产。llms.txt 与 AI Sitemap 在集团层统一配置，能显著提升 AI 对集团内容体系的发现效率。建议将 GEO 配置达标率纳入各板块年度考核指标。"
    }),
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    relatedServiceType: RelatedServiceType.ENTERPRISE_KNOWLEDGE_BASE,
    status: ContentStatus.PUBLISHED,
    featured: false,
    sortOrder: 50,
    geoSummary:
      "集团企业 AI 内容资产建设案例：统一五板块 GEO 标准，建设集团知识发布层与案例/FAQ 聚合体系，提升 AI 搜索中集团品牌的整体表达能力。"
  }
];
