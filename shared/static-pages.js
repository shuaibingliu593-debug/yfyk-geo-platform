"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESET_STATIC_RESOURCE_KEYS = exports.STATIC_PAGE_REGISTRY_KEYS = exports.staticPageRegistry = void 0;
exports.getStaticPageByKey = getStaticPageByKey;
exports.getStaticPageByPath = getStaticPageByPath;
exports.pathToSlug = pathToSlug;
exports.resolveStaticResourceType = resolveStaticResourceType;
exports.staticPageDisplayType = staticPageDisplayType;
function pageDescription(title) {
    return `${title}页面介绍 YFYK GEO 原生建站、AI 友好度升级与企业知识库相关能力，帮助访问者与 AI 系统理解官网信息。`;
}
function pageAiSummary(title) {
    return `${title}是 YFYK 官网静态页面，用于向 AI 搜索与企业客户说明相关服务、公司信息与 GEO 能力建设。`;
}
exports.staticPageRegistry = [
    {
        key: "home",
        path: "/",
        title: "首页",
        menuTitle: "首页",
        pageType: "home",
        description: pageDescription("首页"),
        aiSummary: pageAiSummary("首页"),
        priority: 1.0,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/page.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "WebSite",
        robotsPolicy: "index,follow"
    },
    {
        key: "geo_native_website",
        path: "/geo-native-website",
        title: "GEO原生建站",
        menuTitle: "GEO原生建站",
        pageType: "service",
        description: pageDescription("GEO原生建站"),
        aiSummary: pageAiSummary("GEO原生建站"),
        priority: 0.95,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/geo-native-website.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "Service",
        robotsPolicy: "index,follow"
    },
    {
        key: "ai_friendly_upgrade",
        path: "/ai-friendly-upgrade",
        title: "老网站AI友好度升级",
        menuTitle: "老网站AI友好度升级",
        pageType: "service",
        description: pageDescription("老网站AI友好度升级"),
        aiSummary: pageAiSummary("老网站AI友好度升级"),
        priority: 0.95,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/ai-friendly-upgrade.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "Service",
        robotsPolicy: "index,follow"
    },
    {
        key: "enterprise_knowledge_base",
        path: "/enterprise-knowledge-base",
        title: "企业知识库工程",
        menuTitle: "企业知识库工程",
        pageType: "service",
        description: pageDescription("企业知识库工程"),
        aiSummary: pageAiSummary("企业知识库工程"),
        priority: 0.95,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/enterprise-knowledge-base.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "Service",
        robotsPolicy: "index,follow"
    },
    {
        key: "glossary",
        path: "/glossary",
        title: "术语表",
        menuTitle: "术语表",
        pageType: "knowledge",
        description: pageDescription("术语表"),
        aiSummary: pageAiSummary("术语表"),
        priority: 0.75,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/glossary.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "DefinedTermSet",
        robotsPolicy: "index,follow"
    },
    {
        key: "about_company",
        path: "/about",
        title: "公司简介",
        menuTitle: "公司简介",
        pageType: "about",
        description: pageDescription("公司简介"),
        aiSummary: pageAiSummary("公司简介"),
        priority: 0.7,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/about.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "AboutPage",
        robotsPolicy: "index,follow"
    },
    {
        key: "about_patents",
        path: "/about/patents",
        title: "专利 & 高新技术企业",
        menuTitle: "专利 & 高新技术企业",
        pageType: "about",
        description: pageDescription("专利 & 高新技术企业"),
        aiSummary: pageAiSummary("专利 & 高新技术企业"),
        priority: 0.65,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/about/patents.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "WebPage",
        robotsPolicy: "index,follow"
    },
    {
        key: "about_contact",
        path: "/contact",
        title: "联系我们",
        menuTitle: "联系我们",
        pageType: "contact",
        description: pageDescription("联系我们"),
        aiSummary: pageAiSummary("联系我们"),
        priority: 0.65,
        changeFrequency: "monthly",
        isStatic: true,
        markdownPath: "/contact.md",
        includeInAiSitemap: true,
        includeInLlms: true,
        includeInGeoScore: true,
        schemaType: "ContactPage",
        robotsPolicy: "index,follow"
    }
];
exports.STATIC_PAGE_REGISTRY_KEYS = exports.staticPageRegistry.map((page) => page.key);
exports.PRESET_STATIC_RESOURCE_KEYS = new Set(exports.STATIC_PAGE_REGISTRY_KEYS);
function getStaticPageByKey(key) {
    return exports.staticPageRegistry.find((page) => page.key === key);
}
function getStaticPageByPath(path) {
    return exports.staticPageRegistry.find((page) => page.path === path);
}
function pathToSlug(path) {
    if (path === "/") {
        return "home";
    }
    return path.replace(/^\//, "").replace(/\//g, "-");
}
function resolveStaticResourceType(page) {
    if (page.key === "about_patents") {
        return "STATIC_CERTIFICATION";
    }
    if (page.pageType === "knowledge") {
        return "STATIC_COLLECTION";
    }
    return "STATIC_PAGE";
}
function staticPageDisplayType(page) {
    const resourceType = resolveStaticResourceType(page);
    if (resourceType === "STATIC_COLLECTION") {
        return "集合";
    }
    if (resourceType === "STATIC_CERTIFICATION") {
        return "资质";
    }
    return "页面";
}
//# sourceMappingURL=static-pages.js.map