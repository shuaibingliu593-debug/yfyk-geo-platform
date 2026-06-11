export interface SiteMenuLink {
  label: string;
  href: string;
}

export interface SiteMenuGroup {
  title: string;
  href: string;
  links: SiteMenuLink[];
}

export interface SiteMenu {
  label: string;
  href: string;
  menuDescription?: string;
  links?: SiteMenuLink[];
  groups?: SiteMenuGroup[];
}

export const siteMenus: SiteMenu[] = [
  {
    label: "产品&服务",
    href: "/geo-native-website",
    menuDescription: "从官网建设到知识资产沉淀，帮助企业提升 AI 可见度与数字影响力。",
    groups: [
      {
        title: "GEO原生建站",
        href: "/geo-native-website",
        links: [
          { label: "AI企业官网", href: "/geo-native-website#ai-enterprise-site" },
          { label: "AI品牌官网", href: "/geo-native-website#ai-brand-site" },
          { label: "AI外贸独立站", href: "/geo-native-website#ai-global-site" },
          { label: "建站交付标准", href: "/geo-native-website#delivery-standards" },
        ],
      },
      {
        title: "老网站AI友好度升级",
        href: "/ai-friendly-upgrade",
        links: [
          { label: "GEO策略与审计", href: "/ai-friendly-upgrade#geo-audit" },
          { label: "内容结构化重塑", href: "/ai-friendly-upgrade#content-structure" },
          { label: "权威背书强化", href: "/ai-friendly-upgrade#authority" },
          { label: "GEO监测与报告", href: "/ai-friendly-upgrade#monitoring" },
          { label: "MCP接口集成", href: "/ai-friendly-upgrade#mcp-basic" },
        ],
      },
      {
        title: "企业知识库工程",
        href: "/enterprise-knowledge-base",
        links: [
          { label: "GEO知识中心", href: "/enterprise-knowledge-base#geo-knowledge-center" },
          { label: "FAQ知识体系", href: "/enterprise-knowledge-base#faq-knowledge-system" },
          { label: "企业术语库", href: "/enterprise-knowledge-base#enterprise-terminology" },
          { label: "知识库交付标准", href: "/enterprise-knowledge-base#delivery-standards" },
        ],
      },
    ],
  },
  {
    label: "案例",
    href: "/cases",
  },
  {
    label: "知识中心",
    href: "/glossary",
    menuDescription: "探索 GEO、AI搜索与企业知识资产建设相关知识与实践。",
    links: [
      { label: "术语表", href: "/glossary" },
      { label: "资讯动态", href: "/news" },
      { label: "FAQ中心", href: "/faq" },
    ],
  },
  {
    label: "关于我们",
    href: "/about",
    menuDescription: "了解 YFYK 的背景&定位、技术积累与服务理念。",
    links: [
      { label: "公司简介", href: "/about" },
      { label: "专利&高新技术企业", href: "/about/patents" },
      { label: "联系我们", href: "/contact" },
    ],
  },
];

export function getFooterMenuLinks(menu: SiteMenu): SiteMenuLink[] {
  if (menu.groups) {
    return menu.groups.map((group) => ({ label: group.title, href: group.href }));
  }
  return menu.links ?? [];
}
