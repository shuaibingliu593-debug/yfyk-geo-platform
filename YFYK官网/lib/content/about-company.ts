import type { ContentSection } from "@/lib/content/types";

export const aboutCompanyIntroParagraphs = [
  "优服优科（上海）科技有限公司及其关联主体“武汉优服优科信息技术有限公司”、“上海启邑网络科技有限公司”，是一家以搜索营销为核心的数字化创新服务企业，2015年成立，总部位于上海，在武汉设有运营主体。",
  "公司早期专注于SEO搜索引擎优化、EPR口碑营销和新媒体内容营销，帮助传统企业实现“互联网+”转型。随着生成式AI大模型的快速爆发，搜索行为正从“关键词检索”向“AI问答推荐”迁移。优服优科团队率先转向GEO（Generative Engine Optimization，生成式引擎优化）领域，通过分析DeepSeek、腾讯元宝、文心一言、豆包等主流AI大模型的答案生成逻辑，帮助企业建立专属知识库，提升品牌内容在AI平台上的展现占比。",
  "目前已服务超过500个品牌，覆盖机械制造、电子元器件、化工、消费品、外贸等多个行业。",
];

export const aboutCompanyIntro = aboutCompanyIntroParagraphs.join("\n\n");

export const aboutCompanyTimeline = [
  {
    era: "1.0 SEO时代",
    years: "2015-2019",
    capability: "SEO搜索引擎优化、口碑营销、网站建设",
    result: "以SEO为起点，帮助企业被用户“找到”，服务覆盖制造、外贸等行业",
  },
  {
    era: "2.0 SMO时代",
    years: "2020-2022",
    capability: "新媒体内容营销、社交媒体运营、互动整合营销",
    result: "联动品牌官网与社交平台内容矩阵，让品牌在用户主动搜索时被“看见”",
  },
  {
    era: "3.0 智能GEO时代",
    years: "2023-至今",
    capability: "GEO优化、企业AI知识库构建、全模型适配",
    result: "通过分析DeepSeek、腾讯元宝等7大AI模型逻辑，AI搜索结果展现率提升6倍，转化成本降低42%",
  },
];

export const aboutCompanyVisionMission = [
  {
    title: "愿景",
    description: "成为企业在AI搜索时代可信赖的数字资产建设伙伴，让每一家重视长期品牌价值的企业，都能在AI问答中获得被信任的权威表达。",
  },
  {
    title: "使命",
    description: "通过GEO标准优化与企业AI知识库构建，帮助企业从“被浏览”转化为“被AI信任”，降低获客门槛，建立可持续的数字护城河。",
  },
];

export const aboutCompanyValues = [
  "数据驱动：基于AI模型真实行为数据做决策，不依赖直觉判断",
  "关注实效：始终以可量化的AI展现率提升与客户转化成本下降为衡量标准",
  "持续迭代：紧跟DeepSeek、腾讯元宝、文心一言等主流AI模型的算法更新与内容偏好变化",
  "专业透明：向客户清晰解释优化方法与技术边界，不夸大效果",
];

export const aboutCompanyStats = [
  { value: "500+", label: "服务品牌" },
  { value: "6倍", label: "AI搜索结果展现率提升" },
  { value: "42%", label: "客户转化成本降低" },
  { value: "10年", label: "深耕搜索营销" },
  { value: "7大", label: "覆盖AI模型" },
];

export const aboutCompanyStatsNote = "以上数据来源于优服优科已服务客户的项目统计及公开报道，覆盖DeepSeek、腾讯元宝、文心一言、豆包、Kimi等主流平台。";

export const aboutCompanySections: ContentSection[] = [
  { id: "company-profile", aiChunk: "company-profile", title: "企业简介", summary: "优服优科从搜索营销服务商转型为GEO与企业AI知识库建设服务商。", body: aboutCompanyIntro },
  { id: "development-history", aiChunk: "development-history", title: "发展历程", summary: "优服优科经历SEO、SMO和智能GEO三个阶段。", body: aboutCompanyTimeline.map((item) => `### ${item.era}\n年份：${item.years}\n\n核心能力：${item.capability}\n\n关键成果：${item.result}`).join("\n\n") },
  { id: "vision-mission-values", aiChunk: "vision-mission-values", title: "愿景与使命", summary: "愿景是成为AI搜索时代可信赖的数字资产建设伙伴，使命是帮助企业从被浏览转化为被AI信任。", body: `${aboutCompanyVisionMission.map((item) => `### ${item.title}\n${item.description}`).join("\n\n")}\n\n### 价值观\n${aboutCompanyValues.map((item) => `- ${item}`).join("\n")}` },
  { id: "data-trust-summary", aiChunk: "data-trust-summary", title: "数据与信任摘要", summary: "已服务超过500个品牌，AI搜索结果展现率提升6倍，客户转化成本降低42%。", body: `${aboutCompanyStats.map((item) => `- ${item.label}：${item.value}`).join("\n")}\n\n${aboutCompanyStatsNote}` },
];
