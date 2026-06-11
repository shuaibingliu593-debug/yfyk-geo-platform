import { siteConfig } from "./home";
import type { BaseContent } from "./types";

export const contactServiceInfo = {
  phone: siteConfig.hotline,
  serviceHours: "周一-周五 9:00-18:00",
} as const;

export const contactMeta = {
  path: "/contact",
  title: "联系我们｜YFYK GEO方案咨询与网站AI友好度诊断",
  description:
    "联系YFYK，获取GEO原生建站、老网站AI友好度升级、企业知识库工程与网站AI友好度诊断方案，提升企业在AI搜索时代的可见度与内容价值。",
} as const;

export const contactHeroTags = [
  "GEO原生建站",
  "AI友好度升级",
  "企业知识库工程",
  "AI可见度建设",
  "MCP知识服务",
] as const;

export const contactFlowSteps = [
  "咨询需求",
  "方案沟通",
  "项目评估",
  "合作实施",
] as const;

export type ContactNeedType =
  | "geo-native"
  | "ai-upgrade"
  | "knowledge-base"
  | "site-audit"
  | "other";

export const contactNeedOptions: { value: ContactNeedType; label: string }[] = [
  { value: "geo-native", label: "GEO原生建站" },
  { value: "ai-upgrade", label: "老网站AI友好度升级" },
  { value: "knowledge-base", label: "企业知识库工程" },
  { value: "site-audit", label: "网站诊断" },
  { value: "other", label: "其他咨询" },
];

export type ContactChannel = {
  id: string;
  title: string;
  description: string;
  icon: "business" | "support";
  email?: string;
  phone?: string;
  showWechat?: boolean;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "business-partnership",
    title: "商务咨询 · 项目合作",
    description:
      "获取 GEO 方案建议、官网诊断与项目评估，探讨 GEO原生建站、企业知识库与 AI 搜索优化合作。",
    icon: "business",
    email: "business@yfyk.com",
    phone: contactServiceInfo.phone,
    showWechat: true,
  },
  {
    id: "support",
    title: "技术支持",
    description: "项目交付后的技术咨询与服务支持。",
    icon: "support",
    email: "support@yfyk.com",
  },
];

export const contactFinalCta = {
  eyebrow: "START YOUR GEO PLAN",
  title: "开始您的 GEO 建设计划",
  description:
    "获取专属 GEO 方案，评估企业在 AI 搜索时代的可见度、内容价值与增长空间。",
  primaryButton: { label: "预约免费诊断", openContactModal: true },
  secondaryButton: { label: "咨询 GEO 方案", openContactModal: true },
} as const;

export function getContactPageContent(): BaseContent {
  return {
    id: "contact",
    metadata: {
      title: contactMeta.title,
      summary: contactMeta.description,
      dateModified: siteConfig.dateModified,
      version: siteConfig.version,
    },
    sections: [
      {
        id: "contact-hero",
        aiChunk: "contact-hero",
        title: "联系我们",
        summary: contactMeta.description,
        body: contactHeroTags.join("、"),
      },
      {
        id: "contact-channels",
        aiChunk: "contact-channels",
        title: "联系方式",
        summary: "通过商务咨询与技术支持渠道联系优服优科。",
        body: contactChannels
          .map((channel) => {
            const lines = [channel.description];
            if (channel.email) lines.push(`邮箱：${channel.email}`);
            if (channel.phone) lines.push(`电话：${channel.phone}`);
            return `### ${channel.title}\n${lines.join("\n")}`;
          })
          .join("\n\n"),
      },
      {
        id: "contact-flow",
        aiChunk: "contact-flow",
        title: "合作流程",
        summary: "从咨询需求到合作实施的标准流程。",
        body: contactFlowSteps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
      },
      {
        id: "contact-service-info",
        aiChunk: "contact-service-info",
        title: "服务信息",
        summary: "项目热线与服务时间。",
        body: `项目热线：${contactServiceInfo.phone}\n服务时间：${contactServiceInfo.serviceHours}\n业务邮箱：${siteConfig.email}`,
      },
      {
        id: "contact-cta",
        aiChunk: "contact-cta",
        title: contactFinalCta.title,
        summary: contactFinalCta.description,
        body: `[${contactFinalCta.primaryButton.label}](/contact)`,
      },
    ],
  };
}
