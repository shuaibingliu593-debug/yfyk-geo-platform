import type { ContentSection, BaseContent } from "@/lib/content/types";
import { siteConfig } from "@/lib/content/home";

export const patentsMeta = {
  title: "专利与高新技术企业｜YFYK 技术资质与创新能力",
  description:
    "了解YFYK在高新技术企业、软件著作权、知识产权和技术研发方面的积累，以及这些能力如何支撑GEO原生建站、AI友好度升级与企业知识库工程服务。",
  path: "/about/patents",
};

export const patentsHeroTags = [
  "高新技术企业",
  "软件著作权",
  "知识产权",
  "技术研发",
  "AI搜索",
  "GEO服务",
];

export const patentsHeroFlow = [
  { label: "技术研发", icon: "code" as const },
  { label: "知识产权", icon: "shield" as const },
  { label: "软件能力", icon: "source" as const },
  { label: "GEO服务落地", icon: "graph" as const },
];

export const patentsOverviewCards = [
  {
    id: "high-tech-enterprise",
    title: "高新技术企业",
    description: "体现企业在研发投入、知识产权和科技成果转化方面的综合能力。",
  },
  {
    id: "software-copyright",
    title: "软件著作权",
    description: "沉淀自主研发的软件系统与数字化工具能力。",
  },
  {
    id: "ip-accumulation",
    title: "知识产权积累",
    description: "围绕网站建设、AI搜索、内容结构化与知识资产管理持续沉淀。",
  },
  {
    id: "tech-service",
    title: "技术服务能力",
    description: "将技术研发能力应用于 GEO建站、AI友好度升级和企业知识库工程。",
  },
];

export type PatentCredentialType = "企业资质" | "软件著作权" | "知识产权" | "技术成果";

export type PatentCredential = {
  id: string;
  name: string;
  type: PatentCredentialType;
  date: string;
  number?: string;
  numberLabel?: string;
  description: string;
};

export const patentCredentials: PatentCredential[] = [
  {
    id: "high-tech-cert",
    name: "高新技术企业证书",
    type: "企业资质",
    date: "YYYY年",
    number: "待补充",
    numberLabel: "证书编号",
    description: "对企业研发投入、技术成果转化和创新能力的综合认定。",
  },
  {
    id: "software-copyright-cert",
    name: "软件著作权证书",
    type: "软件著作权",
    date: "YYYY年",
    number: "待补充",
    numberLabel: "登记号",
    description: "用于支撑网站AI友好度分析、内容结构化治理或知识库管理相关能力。",
  },
  {
    id: "patent-ip",
    name: "专利 / 知识产权成果",
    type: "知识产权",
    date: "YYYY年",
    number: "待补充",
    numberLabel: "编号",
    description: "围绕数字化内容、AI搜索适配和企业知识资产建设持续积累。",
  },
  {
    id: "digital-capability",
    name: "数字化技术能力成果",
    type: "技术成果",
    date: "持续建设",
    description: "围绕GEO原生建站、AI可读性建设和企业知识库工程形成的技术实践能力。",
  },
];

export const patentsMarkdownSections: ContentSection[] = [
  {
    id: "patents-hero",
    aiChunk: "patents-hero",
    title: "技术资质与创新能力",
    summary:
      "YFYK 持续投入数字化、AI搜索与企业知识资产相关技术建设，通过高新技术企业认定、软件著作权与知识产权积累，支撑长期服务能力。",
    body: patentsMeta.description,
  },
  {
    id: "patents-overview",
    aiChunk: "patents-overview",
    title: "资质与能力概览",
    summary: "技术资质的价值，不在于展示数量，而在于能否支撑真实业务场景中的持续交付。",
    body: patentsOverviewCards.map((item) => `### ${item.title}\n${item.description}`).join("\n\n"),
  },
  {
    id: "patents-credentials",
    aiChunk: "patents-credentials",
    title: "证书与知识产权",
    summary: "以下为企业技术资质与知识产权成果展示，具体信息可在合作沟通中进一步提供。",
    body: patentCredentials
      .map((item) => {
        const numberLine = item.number ? `${item.numberLabel ?? "编号"}：${item.number}` : "";
        return `### ${item.name}\n类型：${item.type}\n时间：${item.date}${numberLine ? `\n${numberLine}` : ""}\n${item.description}`;
      })
      .join("\n\n"),
  },
];

export function getPatentsPageContent(): BaseContent {
  return {
    id: "about-patents",
    metadata: {
      title: patentsMeta.title,
      summary: patentsMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: patentsMarkdownSections,
  };
}
