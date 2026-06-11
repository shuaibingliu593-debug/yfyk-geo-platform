import {
  Activity,
  FileCode2,
  FileQuestion,
  FileText,
  Gauge,
  Home,
  Inbox,
  Newspaper,
  Settings,
  Share2,
  Sparkles
} from "lucide-react";
import { staticPageDisplayType, staticPageRegistry } from "../../../../shared/static-pages";

export type AdminMenuItem = {
  title: string;
  href: string;
  description: string;
};

export type AdminMenuGroup = {
  title: string;
  href?: string;
  icon: typeof Home;
  items?: AdminMenuItem[];
};

export const adminMenuGroups: AdminMenuGroup[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home
  },
  {
    title: "内容中心",
    icon: Newspaper,
    items: [
      {
        title: "官网留言",
        href: "/admin/leads",
        description: "查看、筛选和处理官网咨询表单提交的留言线索。"
      },
      {
        title: "案例管理",
        href: "/admin/content/cases",
        description: "只维护官网案例内容，不承载静态页面。"
      },
      {
        title: "FAQ管理",
        href: "/admin/content/faqs",
        description: "维护 FAQ 问答内容与发布状态。"
      },
      {
        title: "资讯动态管理",
        href: "/admin/content/news",
        description: "维护资讯动态内容与发布时间。"
      }
    ]
  },
  {
    title: "GEO配置中心",
    icon: Share2,
    items: [
      {
        title: "静态页面GEO配置",
        href: "/admin/geo/static-pages",
        description: "配置官网预置静态页面的 GEO 元数据。"
      },
      {
        title: "Schema配置",
        href: "/admin/geo/schema",
        description: "管理结构化数据模板与页面绑定。"
      }
    ]
  },
  {
    title: "AI抓取中心",
    icon: FileText,
    items: [
      {
        title: "llms.txt管理",
        href: "/admin/crawl/llms",
        description: "生成、预览并发布公开可访问的 llms.txt 与 llms-full.txt。"
      },
      {
        title: "AI Sitemap管理",
        href: "/admin/crawl/sitemap",
        description: "管理 AI Sitemap URL、优先级与 XML 发布。"
      }
    ]
  },
  {
    title: "GEO评分中心",
    icon: Gauge,
    items: [
      {
        title: "页面评分",
        href: "/admin/audit/pages",
        description: "查看 static_resource、case、faq、news 的 GEO 总分与维度分。"
      },
      {
        title: "问题诊断",
        href: "/admin/audit/issues",
        description: "查看自动生成的问题、严重程度与优化建议。"
      }
    ]
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings
  }
];

export const routeMeta: Record<string, { title: string; description: string; icon: typeof Home }> = {
  "/admin/dashboard": {
    title: "Dashboard",
    description: "查看内容中心、静态页面 GEO 配置、Schema 配置与服务状态。",
    icon: Activity
  },
  "/admin/leads": {
    title: "官网留言",
    description: "查看官网各页面表单提交的咨询留言，追踪来源并更新处理状态。",
    icon: Inbox
  },
  "/admin/content/cases": {
    title: "案例管理",
    description: "管理官网案例内容。知识库、术语表、专利资质不进入内容中心。",
    icon: Sparkles
  },
  "/admin/content/faqs": {
    title: "FAQ管理",
    description: "管理官网 FAQ 问答内容。",
    icon: FileQuestion
  },
  "/admin/content/news": {
    title: "资讯动态管理",
    description: "管理官网资讯动态内容。",
    icon: Newspaper
  },
  "/admin/geo/static-pages": {
    title: "静态页面GEO配置",
    description: "统一管理 static_resource 对象的 Meta、Schema、llms.txt、AI Sitemap 与检测配置。",
    icon: Share2
  },
  "/admin/geo/schema": {
    title: "Schema配置",
    description: "管理官网静态页面与内容页的 Schema 模板和绑定。",
    icon: FileCode2
  },
  "/admin/crawl/llms": {
    title: "llms.txt管理",
    description: "基于 geo_configs.llms_enabled 和内容发布状态生成 AI 抓取入口文件。",
    icon: FileText
  },
  "/admin/crawl/sitemap": {
    title: "AI Sitemap管理",
    description: "基于 geo_configs.sitemap_enabled 和内容发布状态生成 AI Sitemap XML。",
    icon: FileCode2
  },
  "/admin/audit/pages": {
    title: "页面评分",
    description: "按 AI 可抓取性、AI 可理解性、结构化程度评估 GEO 得分。",
    icon: Gauge
  },
  "/admin/audit/issues": {
    title: "问题诊断",
    description: "查看 GEO 评分自动生成的问题诊断、严重程度与修复建议。",
    icon: Gauge
  },
  "/admin/settings": {
    title: "系统设置",
    description: "配置管理员账号、RBAC 权限、接口与部署参数。",
    icon: Settings
  }
};

export const staticGeoPages = staticPageRegistry.map((page) => ({
  title: page.title,
  url: page.path,
  type: staticPageDisplayType(page)
}));
