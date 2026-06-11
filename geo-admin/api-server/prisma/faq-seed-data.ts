/**
 * YFYK 官网 FAQ 种子数据（75 条）
 * 分类：GEO / 官网建设 / 企业知识库 / AI搜索 / MCP，每类 15 条
 * 重复执行 seed 时通过 id 与 question 去重，不会产生重复记录。
 */

export type FaqSeedCategory = "GEO" | "官网建设" | "企业知识库" | "AI搜索" | "MCP";

export type FaqSeedRelatedServiceType =
  | "GEO_NATIVE_WEBSITE"
  | "AI_FRIENDLY_UPGRADE"
  | "ENTERPRISE_KNOWLEDGE_BASE"
  | "GENERAL";

export type FaqSeedItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqSeedCategory;
  relatedServiceType: FaqSeedRelatedServiceType;
  sortOrder: number;
};

export const faqSeedData: FaqSeedItem[] = [
  // ── GEO（15）sortOrder 10–150 ──
  {
    id: "seed-faq-geo-01",
    question: "什么样的企业适合开展 GEO 建设？",
    answer:
      "适合开展 GEO 建设的企业，通常官网已承担主要对外说明职能，且客户、合作伙伴或采购方开始通过 AI 工具了解企业能力与方案。\n\n原因在于 AI 搜索更依赖清晰的页面语义、FAQ 体系和可抓取的结构化数据，而非单纯的关键词排名。业务边界清楚、服务内容可结构化表达的企业，更容易建立稳定引用。\n\n建议先评估官网是否具备可被 AI 理解的基础结构，再按服务页、案例与 FAQ 分阶段补齐内容资产，避免在未明确业务重点前投入分散。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 10
  },
  {
    id: "seed-faq-geo-02",
    question: "企业什么时候应该启动 GEO 建设？",
    answer:
      "当企业官网已成为主要信息入口，且销售、市场或品牌团队开始收到「AI 搜不到我们」「回答不准确」等反馈时，就应启动 GEO 建设。\n\n原因在于 AI 引用依赖长期积累的结构化内容与统一表达。越早建立 FAQ、术语与页面级 Schema，后续内容更新越能持续转化为可见度，而非每次从零开始。\n\n建议先完成 AI 友好度诊断，明确核心服务页与 FAQ 缺口，再制定 3–6 个月分阶段计划，优先处理对外影响最大的页面。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 20
  },
  {
    id: "seed-faq-geo-03",
    question: "GEO 是否值得投入？",
    answer:
      "对官网承担获客、品牌说明或方案传递职能的企业，GEO 投入通常具有中长期价值，但应结合业务阶段与内容基础评估优先级。\n\n原因在于 AI 搜索正在改变信息获取路径，企业若无法在 AI 回答中被准确理解，可能逐步失去「被主动发现」的机会。GEO 投入主要转化为内容资产，而非一次性广告效果。\n\n建议以可衡量的目标启动，例如核心服务页引用稳定性、FAQ 覆盖率与线索页到达率，用小范围试点验证后再扩大投入范围。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 30
  },
  {
    id: "seed-faq-geo-04",
    question: "GEO 多久能看到效果？",
    answer:
      "基础结构化升级与 FAQ 体系上线后，通常在数周至三个月内可观察到 AI 理解与引用准确度的变化；完整效果积累往往需要 3–6 个月持续维护。\n\n原因在于 AI 平台对内容的抓取、索引与信任建立存在周期，且引用表现受内容完整度、更新频率与外部信号共同影响。短期可见的是结构改善，长期可见的是引用稳定性。\n\n建议将前 90 天设为验证期，重点监测核心问题的 AI 回答变化，并同步更新 FAQ 与关键服务页，形成持续迭代节奏。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 40
  },
  {
    id: "seed-faq-geo-05",
    question: "企业如何评估 GEO 项目效果？",
    answer:
      "GEO 项目效果应同时看「可被理解」与「可被引用」两类指标，而非仅用传统搜索流量衡量。\n\n原因在于 AI 搜索的价值体现在回答准确度、引用来源与企业信息一致性上。可结合核心问题的 AI 回答抽样、FAQ 覆盖率、结构化数据完整度与线索页转化进行综合判断。\n\n建议建立季度复盘机制，固定监测 10–20 个业务关键问题在各 AI 平台的表现，并与内容更新、案例发布联动分析。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 50
  },
  {
    id: "seed-faq-geo-06",
    question: "GEO 建设会影响现有网站吗？",
    answer:
      "规范的 GEO 建设以增量优化为主，通常不需要关停现有网站，也不会改变用户正常访问体验。\n\n原因在于 GEO 工作重点在信息架构、结构化数据、FAQ 与 AI Summary 等内容层，而非替换整套技术栈。分阶段实施可将改动控制在可回滚范围内，降低业务连续性风险。\n\n建议优先在 staging 环境验证 Schema 与页面结构调整，再按服务页、案例页、FAQ 区逐批上线，并保留变更记录便于回溯。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 60
  },
  {
    id: "seed-faq-geo-07",
    question: "企业如何建立长期 AI 内容资产？",
    answer:
      "长期 AI 内容资产应围绕「可被机器理解的标准答案」持续积累，而非一次性活动式内容生产。\n\n原因在于 AI 引用偏好结构稳定、表述一致、可持续更新的内容体系。FAQ、术语库、案例库与服务页说明共同构成企业对外语义底座，更新越规律，引用越稳定。\n\n建议将 FAQ 更新、案例沉淀与术语维护纳入市场或内容团队的常规流程，并配合季度 AI 可见度复盘，确保资产持续有效。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 70
  },
  {
    id: "seed-faq-geo-08",
    question: "GEO 与 SEO 可以同时进行吗？",
    answer:
      "GEO 与 SEO 可以并行推进，两者优化对象不同但大量基础工作可以复用，例如清晰的信息架构与高质量正文。\n\n原因在于 SEO 侧重搜索排名与点击获取，GEO 侧重 AI 理解、引用与语义可见度。页面标题、摘要与结构化数据同时服务两类场景，合理规划可避免重复劳动。\n\n建议在同一内容治理框架下分工：SEO 关注关键词与收录，GEO 关注 FAQ、Schema 与 AI Summary，由统一内容负责人协调优先级。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 80
  },
  {
    id: "seed-faq-geo-09",
    question: "已有官网的企业还需要 GEO 吗？",
    answer:
      "已有官网的企业同样需要 GEO，因为「有网站」不等于「可被 AI 准确理解与引用」。\n\n原因在于大量传统官网偏重视觉展示，缺少 FAQ 体系、结构化标注与面向 AI 的摘要层，导致 AI 回答时容易遗漏关键服务信息或产生歧义。GEO 解决的是机器可读性与语义一致性问题。\n\n建议对现有官网做 AI 友好度诊断，优先补齐服务边界说明、常见问题与案例成果三类高引用价值内容。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 90
  },
  {
    id: "seed-faq-geo-10",
    question: "GEO 项目失败的主要原因有哪些？",
    answer:
      "GEO 项目常见失败原因包括目标不清、只做技术配置不做内容治理、缺乏持续维护，以及将 GEO 等同于短期流量工具。\n\n原因在于 AI 可见度依赖内容质量与结构稳定性，若业务团队未参与 FAQ 与术语统一，技术层优化难以转化为引用改善。一次性上线后长期不更新，效果也会快速衰减。\n\n建议立项时明确业务负责人与内容维护机制，设定分阶段可验证目标，避免将 GEO 作为纯技术外包项目交付。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 100
  },
  {
    id: "seed-faq-geo-11",
    question: "如何判断企业官网是否具备 GEO 基础？",
    answer:
      "可从四个维度快速判断：核心服务是否有独立说明页、是否存在结构化 FAQ、关键页面是否有 Schema 与 AI Summary、对外术语是否统一。\n\n原因在于 AI 引用通常来自信息完整、语义清晰的页面组合，而非首页营销文案。缺少 FAQ 与术语统一时，AI 容易将企业与其他同业混淆。\n\n建议用 10 个典型客户问题做自测，检查官网与 AI 回答是否一致；若偏差明显，说明 GEO 基础仍需补齐。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 110
  },
  {
    id: "seed-faq-geo-12",
    question: "企业需要准备哪些资料才能启动 GEO？",
    answer:
      "启动 GEO 通常需要现有官网访问权限、核心服务与产品说明、典型客户案例、常见销售问答，以及品牌对外术语表（如有）。\n\n原因在于 GEO 建设需要把分散在 PPT、方案书与销售话术中的信息，整理为可被 AI 读取的公开标准答案。资料越完整，首轮 FAQ 与页面重构效率越高。\n\n建议由市场或产品负责人牵头汇总资料，优先整理客户最常问的 20 个问题及对应权威答复，作为第一阶段输入。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 120
  },
  {
    id: "seed-faq-geo-13",
    question: "GEO 项目周期一般多久？",
    answer:
      "GEO 项目通常分阶段交付：诊断与 FAQ 体系约 3–6 周，核心页面结构化升级约 1–3 个月，知识库与持续运营则为长期事项。\n\n原因在于不同企业的内容存量与组织协同难度差异较大。与其追求一次性全站改造，不如先完成高价值页面与 FAQ 上线，再逐步扩展至案例库与术语体系。\n\n建议按「诊断—试点—扩展—运营」四步规划周期，每阶段设定可验收成果，便于内部对齐投入与预期。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 130
  },
  {
    id: "seed-faq-geo-14",
    question: "GEO 内容如何持续维护？",
    answer:
      "GEO 内容维护应纳入企业常规内容运营，而非项目结束即停止更新。\n\n原因在于产品、服务与案例持续变化，若 FAQ 与关键页面长期不更新，AI 引用会逐渐偏离企业现状，甚至传递过时信息。稳定维护是保持引用准确度的前提。\n\n建议建立 FAQ 季度复审制度，新案例与新服务上线时同步更新对应页面与术语，并将 AI 回答抽样检查纳入市场复盘议程。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 140
  },
  {
    id: "seed-faq-geo-15",
    question: "什么是 GEO？",
    answer:
      "GEO（Generative Engine Optimization）是面向生成式 AI 搜索与大模型回答场景的内容优化方法，目标是提升企业内容被 AI 抓取、理解、引用与复述的稳定性。\n\n原因在于传统 SEO 主要服务搜索引擎排名，而 AI 问答更关注语义完整度、FAQ 体系与结构化表达。GEO 将官网与知识库建设为 AI 可依赖的信息源。\n\n建议将 GEO 理解为内容资产工程，而非单一技术手段；企业可从 FAQ 体系与核心服务页结构化升级开始实践。",
    category: "GEO",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 150
  },

  // ── 官网建设（15）sortOrder 160–300 ──
  {
    id: "seed-faq-website-01",
    question: "老网站升级还是重建更合适？",
    answer:
      "多数情况下，老网站通过 AI 友好度升级即可满足需求，无需整体重建。\n\n原因在于重建成本高、周期长，且可能中断现有收录与外链积累。若网站技术栈可维护、内容可重组，通过信息架构优化、FAQ 体系、Schema 与 AI Summary 升级，通常能以更低风险获得 GEO 效果。\n\n建议先做诊断：若技术债务严重或信息架构无法调整，再考虑重建；否则优先选择分阶段升级路径。",
    category: "官网建设",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 160
  },
  {
    id: "seed-faq-website-02",
    question: "企业官网为什么需要适配 AI 搜索？",
    answer:
      "越来越多 B2B 采购与市场人员通过 DeepSeek、Kimi、豆包、通义、ChatGPT 等工具了解企业，官网需要成为 AI 可信赖的信息源。\n\n原因在于 AI 不会「浏览」网站，而是基于可抓取内容与结构化信号形成回答。若官网缺少清晰服务说明与 FAQ，AI 可能引用二手信息，导致企业表述失真。\n\n建议将官网定位为「对外标准答案库」，优先保证核心服务、案例与常见问题的机器可读性与表述一致性。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 170
  },
  {
    id: "seed-faq-website-03",
    question: "企业应该先做官网还是先做知识库？",
    answer:
      "对多数企业，建议先夯实官网公开层（服务说明、FAQ、案例），再扩展至系统化知识库。\n\n原因在于官网是 AI 与用户最常访问的公开入口，优先在此建立标准答案，能快速改善对外可见度。知识库可在官网基础上沉淀术语、案例与内部知识的外化版本。\n\n建议采用「官网 FAQ 先行、知识库跟进」路径：先用 20–30 条高质量 FAQ 验证引用改善，再规划术语库与案例库工程。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 180
  },
  {
    id: "seed-faq-website-04",
    question: "官网结构对 AI 引用有什么影响？",
    answer:
      "清晰的信息架构直接影响 AI 能否准确定位服务边界、案例成果与标准答案，混乱结构会导致引用错位或遗漏。\n\n原因在于 AI 依赖页面层级、标题语义与内链关系判断内容重要性。服务、案例、FAQ 若混排在营销长页中，机器难以提取权威答复。\n\n建议按「服务—案例—FAQ—关于」建立稳定栏目结构，每个核心服务独立成页，并配套对应 FAQ 与 Schema 标注。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 190
  },
  {
    id: "seed-faq-website-05",
    question: "企业官网 FAQ 体系建设有什么价值？",
    answer:
      "FAQ 体系是官网面向 AI 搜索的高价值内容层，能将销售、客服中的高频问题转化为可被直接引用的标准答案。\n\n原因在于 AI 问答场景偏好问答对结构，FAQ 同时服务用户自助查询与模型语义理解。完整 FAQ 还有助于减少 AI 对非官方来源的依赖。\n\n建议按 GEO、官网建设、知识库、AI 搜索等业务主题分类建设 FAQ，每条答案保持结论清晰、长度适中，并定期复审更新。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 200
  },
  {
    id: "seed-faq-website-06",
    question: "官网改版期间如何降低业务风险？",
    answer:
      "官网改版应采用分阶段发布与可回滚策略，避免一次性全站切换影响收录、外链与关键转化页。\n\n原因在于大规模 URL 或结构变动可能导致短期可见度波动。保留核心页面 URL、设置合理重定向、先在低频页面试点，可显著降低风险。\n\n建议制定改版清单：标记不可变更 URL 的页面、优先保留已收录案例与服务页，再逐批上线 GEO 增强模块。",
    category: "官网建设",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 210
  },
  {
    id: "seed-faq-website-07",
    question: "多品牌企业官网如何统一 AI 可见度？",
    answer:
      "多品牌企业需要为每个对外品牌建立清晰的独立语义入口，同时通过集团层说明品牌关系，避免 AI 混淆主体。\n\n原因在于 AI 引用时容易将子品牌、产品线与集团能力混为一谈。统一术语、独立 FAQ 与明确的 Schema 组织标注，有助于模型建立正确关联。\n\n建议集团官网说明品牌矩阵，各子品牌站点维护独立服务页与 FAQ，并在关键页面互相引用以强化语义关联。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 220
  },
  {
    id: "seed-faq-website-08",
    question: "官网上线后还需要持续做什么？",
    answer:
      "官网上线只是起点，持续维护 FAQ、更新案例、校验 Schema 与监测 AI 引用表现，才是保持 GEO 效果的关键。\n\n原因在于企业业务、产品与方案持续演进，静态官网若长期不更新，AI 回答将逐渐偏离现状，影响销售与品牌信任。\n\n建议建立月度内容检查与季度 FAQ 复审机制，新服务或重大案例发布后两周内完成对应页面与 FAQ 同步更新。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 230
  },
  {
    id: "seed-faq-website-09",
    question: "如何判断现有官网是否需要 AI 友好度升级？",
    answer:
      "若官网缺少独立 FAQ 区、核心服务说明模糊、无结构化数据，或 AI 对企业的描述与官网不一致，通常需要进行 AI 友好度升级。\n\n原因在于上述症状表明机器难以从官网提取权威信息。升级重点不在视觉翻新，而在内容可理解性与标准答案建设。\n\n建议选取 5 个核心客户问题，在主流 AI 平台检索并对比官网表述；若偏差超过可接受范围，应启动升级评估。",
    category: "官网建设",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 240
  },
  {
    id: "seed-faq-website-10",
    question: "企业官网内容应该如何分层？",
    answer:
      "建议将官网内容分为「决策层（服务与方案）」「信任层（案例与资质）」「答疑层（FAQ）」「索引层（术语与资源）」四层结构。\n\n原因在于分层有助于 AI 按问题类型定位答案：采购决策看服务与案例，常见疑问看 FAQ，概念理解看术语。混排会降低引用准确度。\n\n建议先梳理客户旅程中的关键问题，再反推各层内容缺口，优先补齐答疑层与决策层的高频主题。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 250
  },
  {
    id: "seed-faq-website-11",
    question: "GEO 原生建站适合哪些业务场景？",
    answer:
      "GEO 原生建站适合新建官网、重大品牌升级，或现有站点技术债务高、信息架构无法支撑 AI 理解的场景。\n\n原因在于从零规划时可同步嵌入 FAQ 体系、Schema、AI Summary 与 llms.txt 等能力，避免后期反复改造。对内容复杂、服务线多的企业，原生架构更易维护长期语义一致性。\n\n建议结合 3–5 年品牌规划评估：若预期持续扩展服务与案例，原生建站的综合成本可能低于多次修补式升级。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 260
  },
  {
    id: "seed-faq-website-12",
    question: "企业需要准备哪些官网建设资料？",
    answer:
      "官网建设通常需要品牌视觉规范、服务与产品介绍、目标客户画像、竞品参考、案例素材、常见问题列表及现有内容资产清单。\n\n原因在于 GEO 原生建站不仅是设计页面，更是将业务知识转化为 AI 可读结构。资料完整度直接影响首轮 FAQ 与服务页质量。\n\n建议由市场与产品联合整理「对外标准表述」文档，作为文案、FAQ 与术语库的统一源头，减少上线后反复修改。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 270
  },
  {
    id: "seed-faq-website-13",
    question: "多语言官网如何处理？",
    answer:
      "多语言官网应为每种语言维护独立且语义等价的内容层，而非仅做字面翻译；同时标注语言版本与 canonical 关系，避免 AI 混淆。\n\n原因在于 AI 引用时会按语言上下文选择答案，机器翻译页面常缺少业务语境，导致表述失真。各语言版本应同步 FAQ 与核心服务说明。\n\n建议优先完成主语言版本的 GEO 结构与 FAQ，再按市场优先级扩展次要语言，保持术语表与 FAQ 映射一致。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 280
  },
  {
    id: "seed-faq-website-14",
    question: "官网项目周期一般多久？",
    answer:
      "GEO 原生官网通常需 2–4 个月完成首版上线，含信息架构、核心页面、FAQ 与基础 GEO 配置；AI 友好度升级视范围约 4–10 周。\n\n原因在于周期受内容准备、审批流程与多部门协同影响。分阶段交付可先上线服务页与 FAQ，再迭代案例库与多语言版本。\n\n建议立项时明确里程碑：诊断确认、内容冻结、灰度上线与正式推广四节点，便于控制范围与预期。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 290
  },
  {
    id: "seed-faq-website-15",
    question: "网站上线后内容如何持续维护？",
    answer:
      "上线后应建立内容责任制：新服务、新案例、新政策须在约定周期内同步至对应页面与 FAQ，并检查 Schema 与 AI Summary 是否需要更新。\n\n原因在于 GEO 效果依赖内容鲜度与一致性，缺乏维护会导致 AI 引用过时信息，损害客户信任。维护成本远低于纠正错误引用带来的品牌损失。\n\n建议指定内容负责人，将官网更新与产品发布、市场活动联动，并每季度做一次 AI 回答与官网一致性抽检。",
    category: "官网建设",
    relatedServiceType: "GEO_NATIVE_WEBSITE",
    sortOrder: 300
  },

  // ── 企业知识库（15）sortOrder 310–450 ──
  {
    id: "seed-faq-kb-01",
    question: "企业知识库应该从哪里开始建设？",
    answer:
      "建议从「对外高频问题」与「核心业务定义」两处开始：优先整理 FAQ、服务说明与术语，再扩展案例库与深度文档。\n\n原因在于 AI 引用最常发生在客户决策与初步了解阶段，此时 FAQ 与术语的 ROI 最高。先解决「AI 能否答对企业是谁、做什么」的问题，再建设更复杂的知识层级。\n\n建议用客户旅程地图列出 20 个关键问题，将其转化为首批 FAQ 与术语条目，作为知识库一期交付标准。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 310
  },
  {
    id: "seed-faq-kb-02",
    question: "FAQ 体系建设对企业有什么价值？",
    answer:
      "FAQ 体系将分散在销售、客服与方案中的重复问答沉淀为统一标准答案，既服务客户自助，也提升 AI 引用准确度。\n\n原因在于 FAQ 是机器最易识别的问答结构，能显著降低 AI 对非官方或过时信息的依赖。对企业内部，FAQ 也减少重复解释成本，支撑销售与客服一致表达。\n\n建议按业务主题分类建设，控制单条答案长度与表述风格，并建立季度复审机制保持内容有效。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 320
  },
  {
    id: "seed-faq-kb-03",
    question: "企业术语库如何支撑 AI 理解？",
    answer:
      "术语库为产品名、服务名与行业概念提供统一定义，减少 AI 在引用时产生歧义或将企业与其他主体混淆。\n\n原因在于同一概念在不同部门可能有多种表述，AI 难以判断权威版本。结构化术语条目相当于为企业建立对外语义坐标系。\n\n建议从客户最常混淆的 15–20 个概念入手，每条术语包含定义、适用场景与关联服务，并在官网与知识库双向引用。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 330
  },
  {
    id: "seed-faq-kb-04",
    question: "案例库应该如何规划？",
    answer:
      "案例库应围绕「行业—场景—成果—可验证指标」结构组织，而非仅展示客户 Logo 或宣传语。\n\n原因在于 AI 与客户在评估企业能力时，需要可复述的挑战、方案与结果。结构化案例更易被引用为「证据型」内容，支撑采购决策。\n\n建议每条案例包含背景、挑战、方案、量化成果与适用边界，并与服务页、FAQ 建立内链，形成完整语义网络。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 340
  },
  {
    id: "seed-faq-kb-05",
    question: "企业知识库与内部文档系统有什么区别？",
    answer:
      "内部文档系统服务员工协作与流程执行，企业知识库（面向 GEO）强调对外可公开、可被 AI 理解的标准化知识资产。\n\n原因在于 AI 引用主要来自公开可抓取内容，内部 Wiki 通常不对外且结构不适合机器阅读。知识库工程需筛选、改写并结构化内部精华，形成对外版本。\n\n建议明确「对内」与「对外」知识边界，建立外化审核流程，避免敏感信息泄露，同时保证公开层表述权威一致。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 350
  },
  {
    id: "seed-faq-kb-06",
    question: "知识库建设需要多少内容才能见效？",
    answer:
      "知识库见效不取决于绝对数量，而取决于是否覆盖了客户决策链上的关键问题。通常 20–40 条高质量 FAQ 加核心术语即可产生可感知改善。\n\n原因在于 AI 引用优先选择表述清晰、结构稳定的答案，而非海量低质内容。盲目追求篇数可能稀释重点，反而降低整体可信度。\n\n建议以「覆盖 Top 20 客户问题」为一期目标，上线后通过 AI 回答抽样验证缺口，再按需扩展案例与术语。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 360
  },
  {
    id: "seed-faq-kb-07",
    question: "内容团队如何参与知识库建设？",
    answer:
      "内容团队应参与 FAQ 撰写、案例结构化与术语审核，将市场传播经验转化为 AI 可引用的标准表述。\n\n原因在于知识库不是纯技术项目，需要业务语境与对外表达专业性。内容团队熟悉客户语言，能提升 FAQ 的可读性与引用价值。\n\n建议建立跨部门协作机制：产品提供事实源，内容负责表述，技术负责结构化发布，按双周节奏迭代一批 FAQ 或案例。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 370
  },
  {
    id: "seed-faq-kb-08",
    question: "企业知识分散在各系统，如何整合？",
    answer:
      "整合应遵循「选定权威源—去重—外化—结构化发布」四步，而非试图一次性迁移所有内部文档。\n\n原因在于各系统格式与权限不同，强行打通成本高。优先抽取客户面向的高频知识，在知识库中建立对外标准版本，再逐步扩展深度内容。\n\n建议先盘点销售方案、产品手册与客服话术三类来源，识别重复最高的问题，将其合并为 FAQ 与术语条目。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 380
  },
  {
    id: "seed-faq-kb-09",
    question: "知识库如何支撑销售与客服场景？",
    answer:
      "结构化知识库为销售与客服提供统一话术源头，减少个人经验差异，并可通过 AI 辅助快速生成准确答复。\n\n原因在于客户在各渠道获得的答案一致，有助于建立信任；销售在方案沟通中也可直接引用官网 FAQ 与案例链接作为权威依据。\n\n建议将高频销售异议与客服工单问题纳入 FAQ 更新清单，每月汇总新增问题并评估是否纳入标准答案。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 390
  },
  {
    id: "seed-faq-kb-10",
    question: "企业如何评估知识库建设效果？",
    answer:
      "可从 FAQ 覆盖率、术语统一度、AI 回答准确度、销售引用频率与客服重复咨询下降等维度综合评估。\n\n原因在于知识库价值体现在「减少歧义」与「提升一致表达」，不单是内容篇数。设定基线后对比 AI 引用与销售反馈，更能反映实际效果。\n\n建议每季度做一次知识库健康检查：标记过时条目、缺失主题与高引用 FAQ，形成下一周期优化清单。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 400
  },
  {
    id: "seed-faq-kb-11",
    question: "知识库建设是否会影响现有内容流程？",
    answer:
      "知识库建设会推动内容流程标准化，但不必推翻现有流程；可在发布链路中增加「FAQ/术语同步」检查点。\n\n原因在于现有流程多面向人类阅读，知识库要求额外考虑机器可读性与表述一致性。以增量方式嵌入，可降低组织变革阻力。\n\n建议在新产品发布、案例验收等环节加入知识库更新任务，将其作为上线必要条件之一，而非事后补录。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 410
  },
  {
    id: "seed-faq-kb-12",
    question: "企业需要准备哪些知识库建设资料？",
    answer:
      "通常需要产品与服务说明、历史方案与标书、客服工单摘要、销售常见问答、品牌术语表及已有对外文案。\n\n原因在于知识库是将隐性经验显性化的过程，资料越系统，首轮 FAQ 与术语质量越高。可先整理「客户最常问的 30 个问题」作为输入清单。\n\n建议指定业务接口人负责资料收集与事实核验，避免知识库内容出现部门间表述冲突。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 420
  },
  {
    id: "seed-faq-kb-13",
    question: "知识库项目周期一般多久？",
    answer:
      "知识库一期工程（FAQ + 核心术语 + 精选案例）通常 6–10 周可交付可用版本；完整体系化建设为 3–6 个月持续项目。\n\n原因在于周期取决于组织协同与资料完整度。采用敏捷批次交付，每 2 周上线一批 FAQ，可更快产生业务价值并积累反馈。\n\n建议将一期目标限定为覆盖 Top 20 决策问题，验收后再规划案例库扩展与深度文档外化。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 430
  },
  {
    id: "seed-faq-kb-14",
    question: "企业术语库如何建设？",
    answer:
      "术语库建设应从客户与销售最常混淆的概念入手，每条包含标准名称、定义、别名、适用场景与关联页面。\n\n原因在于术语统一是 AI 理解企业的基础，能显著减少「同一产品多种叫法」导致的引用错误。术语条目应经产品与市场共同审核后发布。\n\n建议首期收录 20–30 个核心术语，在官网、FAQ 与案例中使用统一表述，并标注 DefinedTerm 等结构化类型。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 440
  },
  {
    id: "seed-faq-kb-15",
    question: "知识库内容如何持续更新？",
    answer:
      "应建立「业务变更触发知识库更新」机制：产品、定价、案例、政策变化时，同步检查相关 FAQ、术语与案例条目。\n\n原因在于知识库一旦过时，AI 与销售将同步传递错误信息，损害大于不建设。持续更新是知识库能否长期有效的分水岭。\n\n建议设置内容负责人与复审日历，将知识库更新 KPI 纳入市场或产品运营考核，确保与业务节奏同步。",
    category: "企业知识库",
    relatedServiceType: "ENTERPRISE_KNOWLEDGE_BASE",
    sortOrder: 450
  },

  // ── AI搜索（15）sortOrder 460–600 ──
  {
    id: "seed-faq-ai-01",
    question: "企业为什么没有被 AI 引用？",
    answer:
      "常见原因包括：官网缺少结构化 FAQ、服务说明不清晰、无 Schema 标注、内容长期未更新，或 AI 引用了更易解析的第三方来源。\n\n原因在于 AI 优先选择语义完整、结构稳定且可验证的公开信息。若企业官网以图片与口号为主，机器难以提取可用答案，自然会转向其他站点。\n\n建议先对 10 个核心业务问题做 AI 回答审计，逐项补齐对应 FAQ 与服务页，并配置基础结构化数据与 AI Summary。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 460
  },
  {
    id: "seed-faq-ai-02",
    question: "AI 搜索时代企业应该优先做什么？",
    answer:
      "优先建立对外「标准答案层」：核心服务说明、分类 FAQ、精选案例与统一术语，再逐步扩展 AI Sitemap 与 llms.txt 等索引能力。\n\n原因在于 AI 可见度的基础是内容可被理解与信任，技术配置需建立在扎实内容之上。先答好「企业是谁、做什么、有何差异」三类问题，投入产出比最高。\n\n建议用 30 天完成首轮 FAQ 上线与核心页 Schema 配置，再以季度节奏扩展案例库与监测体系。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 470
  },
  {
    id: "seed-faq-ai-03",
    question: "如何判断企业 AI 可见度现状？",
    answer:
      "可通过固定问题集在各 AI 平台抽样检测：回答是否提及企业、信息是否准确、引用来源是否指向官网或权威页面。\n\n原因在于 AI 可见度是动态表现，需用可重复方法追踪。单次查询结果不代表长期状态，应建立基线并定期对比。\n\n建议选取 15–20 个与营收相关的客户问题，记录回答摘要、引用链接与偏差类型，形成季度可见度报告。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 480
  },
  {
    id: "seed-faq-ai-04",
    question: "AI Summary 对引用准确度有什么帮助？",
    answer:
      "AI Summary 为每个关键页面提供面向模型的精炼摘要，帮助 AI 在有限上下文中快速把握页面核心信息，减少误读与遗漏。\n\n原因在于大模型处理长页面时可能抓错重点，页面级摘要相当于企业主动提供的「阅读指引」。与服务页、FAQ 配合使用，可提升引用一致性。\n\n建议为核心服务页、案例页与关于页编写 80–200 字摘要，聚焦能力边界与成果，避免营销口号式表述。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 490
  },
  {
    id: "seed-faq-ai-05",
    question: "Schema 结构化数据是否必要？",
    answer:
      "对希望提升 AI 理解准确度与引用稳定性的企业，Schema 是重要而非可选的基础能力，尤其在 FAQ、组织信息与案例场景。\n\n原因在于结构化数据为机器提供显式语义标注，降低解析歧义成本。虽不能替代优质正文，但能明确「这是问答」「这是组织」「这是案例成果」等类型信息。\n\n建议优先为 FAQ 页、核心服务页与关于页配置 JSON-LD，随内容更新同步校验标注有效性。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 500
  },
  {
    id: "seed-faq-ai-06",
    question: "llms.txt 对企业 AI 可见度有什么作用？",
    answer:
      "llms.txt 作为面向大模型的站点索引入口，指引 AI 优先访问企业最重要的公开页面、FAQ 与术语资源，提升抓取效率与理解路径清晰度。\n\n原因在于 AI 系统面对大型网站时，需要明确「哪些页面代表企业权威表述」。llms.txt 相当于主动提交的阅读地图，与 AI Sitemap 形成互补。\n\n建议在完成核心 FAQ 与服务页建设后配置 llms.txt，列出高优先级 URL，并随重大内容更新及时调整。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 510
  },
  {
    id: "seed-faq-ai-07",
    question: "企业如何提升 AI 搜索中的引用稳定性？",
    answer:
      "引用稳定性来自内容一致性、结构规范与持续更新三者的组合，单靠某一项技术手段难以长期维持。\n\n原因在于 AI 平台算法与索引策略会变化，但清晰 FAQ、统一术语与可验证案例始终是高质量信号。减少对外表述冲突，比追逐单次排名更重要。\n\n建议建立内容治理规范：新文案发布前检查与 FAQ/术语是否冲突，每季度审计 AI 回答并回溯修正源头页面。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 520
  },
  {
    id: "seed-faq-ai-08",
    question: "不同 AI 平台对企业内容的理解方式一样吗？",
    answer:
      "各 AI 平台在索引来源、上下文长度与引用策略上存在差异，但对清晰 FAQ、结构化数据与权威正文的基本偏好一致。\n\n原因在于底层模型与检索机制不同，可能导致同一问题在不同平台引用不同页面。企业应追求「源内容足够清晰」，而非针对单一平台过度优化。\n\n建议以官网标准答案为统一源头，在多平台抽样验证，发现系统性偏差时回溯修正 FAQ 与服务页，而非逐平台定制矛盾表述。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 530
  },
  {
    id: "seed-faq-ai-09",
    question: "企业如何监测 AI 引用效果？",
    answer:
      "可结合定期问答抽样、引用链接记录、品牌提及监测与线索来源访谈，建立定性+定量结合的监测框架。\n\n原因在于目前多数 AI 平台不提供完整引用日志，企业需用可重复的人工抽样与业务反馈补位。关注「回答是否准确」比「是否出现」更重要。\n\n建议固定问题清单与记录模板，每季度输出可见度报告，并与 FAQ 更新、案例发布联动分析因果。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 540
  },
  {
    id: "seed-faq-ai-10",
    question: "AI 搜索流量与传统搜索有什么区别？",
    answer:
      "AI 搜索更多以「直接回答」形式完成信息获取，用户可能不点击来源链接；价值体现在品牌被准确提及与推荐，而非传统 CTR。\n\n原因在于交互形态变化，衡量标准应从「是否被正确理解并引用」出发。企业需要适应「零点击」场景下的影响力建设。\n\n建议在市场指标中增加 AI 可见度与回答准确度维度，与传统 SEO 流量并列观察，避免用单一指标误判 GEO 成效。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 550
  },
  {
    id: "seed-faq-ai-11",
    question: "竞品在 AI 搜索中更易被引用，企业如何应对？",
    answer:
      "应分析竞品被引用的页面类型与表述方式，补齐自身在 FAQ、案例证据与服务边界说明上的缺口，而非模仿其营销话术。\n\n原因在于 AI 倾向引用结构完整、可验证的信息。若竞品 FAQ 更完善或案例更具量化成果，引用优势往往来自内容工程而非品牌体量。\n\n建议做竞品 AI 回答对比表，标记己方缺失的问题类型，优先建设差异化且可验证的标准答案与案例。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 560
  },
  {
    id: "seed-faq-ai-12",
    question: "企业进行 AI 搜索优化需要准备什么？",
    answer:
      "需要官网访问与编辑权限、业务 FAQ 素材、核心服务与案例文档、品牌术语表，以及愿意参与内容审核的业务负责人。\n\n原因在于 AI 搜索优化本质是内容标准化工程，技术配置依赖准确源材料。资料缺失会导致 FAQ 空泛，难以产生引用改善。\n\n建议启动前完成「Top 20 客户问题」清单与现有内容盘点，明确一期要上线的页面与 FAQ 范围，控制项目边界。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 570
  },
  {
    id: "seed-faq-ai-13",
    question: "AI 可见度监测一般怎么做？",
    answer:
      "典型做法是建立固定问题集，按月或按季在各 AI 平台执行同条件查询，记录回答准确性、引用 URL 与竞品共现情况。\n\n原因在于随机单次查询噪声大，固定问题集才能反映趋势。结合销售一线反馈，可发现监测样本未覆盖的高价值问题。\n\n建议将监测结果与内容 backlog 挂钩：每次发现偏差，对应创建 FAQ 更新或新案例任务，形成闭环。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 580
  },
  {
    id: "seed-faq-ai-14",
    question: "AI Sitemap 如何规划收录优先级？",
    answer:
      "AI Sitemap 应优先收录服务说明、分类 FAQ、核心案例、术语页与关于页，低频或重复页面可降低优先级或不纳入。\n\n原因在于 AI 抓取资源有限，明确优先级有助于模型优先理解企业最重要的公开知识。与服务页、FAQ 的内链结构应保持一致。\n\n建议按业务价值排序 URL：决策相关页面优先级高于新闻归档，并随内容变更同步更新 Sitemap 条目。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 590
  },
  {
    id: "seed-faq-ai-15",
    question: "什么是 AI 可见度？",
    answer:
      "AI 可见度指企业内容在 AI 搜索与问答场景中被理解、准确描述与引用的程度，不同于传统搜索引擎排名。\n\n原因在于 AI 交互以生成式回答为主，企业影响力更多体现在「是否被正确写入答案」而非「是否排名第一」。可见度受 FAQ、结构化数据、内容鲜度与表述一致性共同影响。\n\n建议将 AI 可见度纳入数字化指标，与 SEO 并列跟踪，并以内容治理而非短期技巧作为主要提升手段。",
    category: "AI搜索",
    relatedServiceType: "AI_FRIENDLY_UPGRADE",
    sortOrder: 600
  },

  // ── MCP（15）sortOrder 610–750 ──
  {
    id: "seed-faq-mcp-01",
    question: "MCP 第一阶段是否有必要投入？",
    answer:
      "对多数处于 GEO 建设早期的企业，第一阶段不必急于投入 MCP，应优先完成官网结构化与 FAQ 体系。\n\n原因在于 MCP 解决的是 AI Agent 与企业数据源的实时连接，其价值建立在已有清晰知识资产之上。基础内容尚未标准化时，接入 MCP 难以显著改善对外 AI 可见度。\n\n建议将 MCP 纳入第二阶段规划：当 FAQ、案例库与术语体系稳定运行后，再评估客服、销售赋能等实时查询场景是否需要 MCP。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 610
  },
  {
    id: "seed-faq-mcp-02",
    question: "企业什么阶段适合考虑 MCP？",
    answer:
      "当企业已具备较完整的公开知识库，且存在 AI Agent 需实时查询产品参数、库存、报价或服务范围等动态数据场景时，适合评估 MCP。\n\n原因在于 MCP 擅长连接「会变化的业务数据」，而非替代静态 FAQ。静态内容仍应通过官网与知识库承载，MCP 作为增量能力接入。\n\n建议自检：是否存在高频、需实时准确的 Agent 查询需求；若否，继续深耕内容资产通常更务实。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 620
  },
  {
    id: "seed-faq-mcp-03",
    question: "MCP 与企业知识库建设如何配合？",
    answer:
      "知识库提供静态权威答案，MCP 提供动态数据查询，两者互补：FAQ 与术语回答「是什么」，MCP 回答「当前是多少、是否可用」。\n\n原因在于 AI Agent 需要同时访问稳定知识与实时状态。仅建设知识库无法覆盖时效性查询；仅做 MCP 则缺少语义底座，回答缺乏上下文。\n\n建议先完成知识库一期，再为 1–2 个高价值动态场景试点 MCP，验证 Agent 回答质量与业务价值。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 630
  },
  {
    id: "seed-faq-mcp-04",
    question: "MCP 投入产出如何评估？",
    answer:
      "MCP 的 ROI 应结合 Agent 查询成功率、人工处理时长下降、销售响应速度与错误率降低等指标评估，而非仅看技术接入完成度。\n\n原因在于 MCP 是赋能型基础设施，价值体现在业务场景效率提升。若接入后查询量低或数据质量差，投入难以回收。\n\n建议在试点阶段选定单一场景（如产品参数查询），设定 90 天可量化目标，达标后再扩展更多数据源与 Agent 入口。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 640
  },
  {
    id: "seed-faq-mcp-05",
    question: "MCP 和 API 接入应该怎么选择？",
    answer:
      "API 面向确定性系统集成，MCP 面向 AI Agent 的上下文化调用；若目标是让大模型安全、标准化地访问企业数据，MCP 通常更贴合。\n\n原因在于 Agent 需要协议层的工具描述与权限边界，MCP 提供统一约定，降低每个 Agent 单独适配 API 的成本。已有成熟 API 也可通过 MCP 封装暴露给模型。\n\n建议评估调用方是否为 AI Agent：是则优先 MCP 封装；仅为传统系统对接，沿用 API 即可，无需为 MCP 而 MCP。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 650
  },
  {
    id: "seed-faq-mcp-06",
    question: "MCP 适合哪些业务场景？",
    answer:
      "MCP 适合客服辅助、销售报价查询、产品选型、订单状态、知识检索增强等需要 AI 实时访问企业内部数据的场景。\n\n原因在于这些场景的答案随业务数据变化，静态 FAQ 无法覆盖全部时效性需求。MCP 让 Agent 在授权范围内查询最新状态，再组织成自然语言回答。\n\n建议从查询频率高、数据结构化程度高的场景选型，避免一开始接入复杂、低频的业务系统。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 660
  },
  {
    id: "seed-faq-mcp-07",
    question: "没有 MCP 企业能否做好 AI 服务？",
    answer:
      "可以。对多数企业，完善的官网 FAQ、案例库与术语体系已能显著改善 AI 对外回答质量，MCP 不是 GEO 的前置条件。\n\n原因在于客户初步了解企业时，主要依赖公开权威内容而非实时内部数据。MCP 是进阶能力，用于 Agent 深度赋能场景。\n\n建议按成熟度分阶段投入：先确保 AI 能准确介绍企业与服务，再考虑 Agent 对内对外实时查询类需求。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 670
  },
  {
    id: "seed-faq-mcp-08",
    question: "MCP 部署对安全合规有什么要求？",
    answer:
      "MCP 接入需明确数据分级、访问权限、审计日志与敏感字段脱敏策略，确保 Agent 仅能在授权范围内查询与返回信息。\n\n原因在于 Agent 调用链路比传统 API 更长，暴露面更大。缺乏权限控制可能导致内部数据通过对话泄露，合规风险高于静态官网内容。\n\n建议安全、法务与业务共同定义 MCP 数据白名单，Pilot 阶段限制查询范围，并记录完整调用日志供审计。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 680
  },
  {
    id: "seed-faq-mcp-09",
    question: "内部系统集成与 MCP 接入的优先级如何排序？",
    answer:
      "若企业数字化基础薄弱，应优先打通核心业务数据一致性，再考虑 MCP 对外暴露；若数据已规范，可将 MCP 作为 Agent 统一接入层。\n\n原因在于 MCP 依赖后端数据质量，脏数据或口径不一会直接放大到 AI 回答中。集成治理是 MCP 成功的前提，而非可跳过的步骤。\n\n建议先选一条数据链（如产品主数据）完成治理与 API 化，再以 MCP 包装供 Agent 调用，验证端到端准确性。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 690
  },
  {
    id: "seed-faq-mcp-10",
    question: "MCP 项目常见失败原因有哪些？",
    answer:
      "常见失败包括：数据质量未治理、场景选择不当、缺少业务 Owner、安全边界不清，以及期望 MCP 替代内容建设。\n\n原因在于 MCP 是数据访问协议，不能自动生成权威业务表述。若 FAQ 与术语缺失，Agent 即使查到数据也难以给出完整可信答案。\n\n建议立项时同步检查知识库基础，设定 Pilot 场景与退出标准，避免无边界扩展数据源导致项目失控。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 700
  },
  {
    id: "seed-faq-mcp-11",
    question: "企业如何规划 MCP 分阶段路线？",
    answer:
      "典型路线为：① 完成 FAQ/知识库 ② 选单场景 Pilot ③ 扩展数据源 ④ 建立治理与监控。每阶段应有明确验收指标。\n\n原因在于分阶段降低技术与组织风险，便于证明价值后再追加投入。一次性接入多系统往往因协调成本过高而停滞。\n\n建议第一期仅服务一个 Agent 场景（如销售助手查产品参数），验证准确率与使用率后，再规划客服与内部知识检索等扩展。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 710
  },
  {
    id: "seed-faq-mcp-12",
    question: "MCP 项目需要准备哪些资料？",
    answer:
      "需要目标场景说明、相关系统的数据字典与 API 文档、权限与合规要求、预期查询样例，以及负责业务审核的对接人。\n\n原因在于 MCP 封装需准确描述「工具能做什么、返回什么」，资料不完整会导致 Agent 误用或回答失真。业务样例问题有助于定义工具边界。\n\n建议整理 20 个典型 Agent 查询问题及期望答案，作为 MCP 工具设计与验收的测试集。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 720
  },
  {
    id: "seed-faq-mcp-13",
    question: "MCP 接入周期一般多久？",
    answer:
      "单场景 MCP Pilot 通常 4–8 周可完成，含数据源梳理、工具封装、安全评审与 Agent 联调；多系统扩展则需按场景累计周期。\n\n原因在于周期受数据质量、内网审批与联调复杂度影响。与内容项目不同，MCP 更依赖 IT 与业务系统协同。\n\n建议预留 2 周数据验证与 2 周安全评审缓冲，避免低估内部流程时间导致上线延期。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 730
  },
  {
    id: "seed-faq-mcp-14",
    question: "MCP 上线后如何运维？",
    answer:
      "MCP 运维需监控调用量、错误率、响应时延、数据漂移与权限异常，并建立数据源变更通知机制，避免接口变更导致 Agent 回答失效。\n\n原因在于 MCP 链路上任何环节故障都会传导至用户对话体验。静态 FAQ 可人工发现过时，MCP 问题往往隐蔽，需主动告警。\n\n建议指定运维 Owner，将 MCP 监控纳入现有 API 运维体系，数据源升级前强制回归 Agent 测试集。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 740
  },
  {
    id: "seed-faq-mcp-15",
    question: "什么是 MCP？",
    answer:
      "MCP（Model Context Protocol）是连接 AI 应用与企业数据源的开放协议，使 Agent 能在授权范围内标准化地查询与调用外部工具。\n\n原因在于大模型本身不持有企业实时数据，需要安全、可描述的接入层。MCP 提供统一约定，降低多 Agent、多系统重复对接成本。\n\n建议将 MCP 视为「AI 时代的集成协议」，在知识库与 FAQ 建设成熟后，按业务场景逐步接入，而非替代基础内容工程。",
    category: "MCP",
    relatedServiceType: "GENERAL",
    sortOrder: 750
  }
];
