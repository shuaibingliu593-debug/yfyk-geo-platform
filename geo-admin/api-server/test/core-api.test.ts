import { INestApplication, RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";

type Json = Record<string, unknown>;

async function main() {
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin";
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123456";
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

  const app = await createApp();
  const baseUrl = await app.getUrl();

  try {
    const login = await request<{ accessToken: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { username: "admin", password: "admin123456" }
    });
    assert(Boolean(login.accessToken), "登录接口应返回 accessToken");
    const token = login.accessToken;

    const caseSlug = `test-case-${Date.now()}`;
    const caseItem = await request<Json>(baseUrl, "/api/cases", {
      method: "POST",
      token,
      body: {
        title: "测试案例",
        slug: caseSlug,
        caseType: "GEO_NATIVE",
        industry: "测试行业",
        content: "测试案例正文",
        excerpt: "测试案例摘要，描述 GEO 配置和案例价值。",
        metrics: [
          { label: "AI引用率", value: "37", unit: "%" },
          { label: "可读取", value: "98", unit: "%" }
        ],
        status: "DRAFT"
      }
    });
    assert(typeof caseItem.id === "string", "案例创建应返回 id");
    await request(baseUrl, `/api/cases/${caseItem.id}`, { method: "PATCH", token, body: { title: "测试案例更新" } });
    await request(baseUrl, `/api/cases/${caseItem.id}/publish`, { method: "PATCH", token });

    const faqItem = await request<Json>(baseUrl, "/api/faqs", {
      method: "POST",
      token,
      body: {
        question: "测试FAQ问题？",
        answer: "测试FAQ答案，用于验证 FAQ CRUD 接口。",
        category: "测试",
        relatedServiceType: "general",
        status: "draft"
      }
    });
    assert(typeof faqItem.id === "string", "FAQ创建应返回 id");
    await request(baseUrl, `/api/faqs/${faqItem.id}`, { method: "PATCH", token, body: { sortOrder: 3 } });
    await request(baseUrl, `/api/faqs/${faqItem.id}/publish`, { method: "PATCH", token });

    const newsItem = await request<Json>(baseUrl, "/api/news", {
      method: "POST",
      token,
      body: {
        title: "测试资讯",
        slug: `test-news-${Date.now()}`,
        category: "测试",
        content: "测试资讯正文",
        excerpt: "测试资讯摘要，用于验证资讯 CRUD 接口。",
        status: "DRAFT"
      }
    });
    assert(typeof newsItem.id === "string", "资讯创建应返回 id");
    await request(baseUrl, `/api/news/${newsItem.id}`, { method: "PATCH", token, body: { author: "tester" } });
    await request(baseUrl, `/api/news/${newsItem.id}/publish`, { method: "PATCH", token });

    const staticPages = await request<Array<{ id: string }>>(baseUrl, "/api/static-resources/static-pages", { token });
    assert(staticPages.length > 0, "静态页面列表应有数据");
    await request(baseUrl, `/api/static-resources/${staticPages[0].id}/geo-config`, {
      method: "PATCH",
      token,
      body: {
        aiSummary: "测试 AI Summary，长度超过五十字，用于验证 GEO 配置保存接口是否正常写入并参与后续评分。",
        metaTitle: "测试 Meta Title",
        metaDescription: "测试 Meta Description",
        canonicalUrl: "/",
        llmsEnabled: true,
        sitemapEnabled: true,
        sitemapPriority: 1
      }
    });

    const llms = await request<{ totalCount: number }>(baseUrl, "/api/v1/llms/generate", { method: "POST", token, body: { publish: false } });
    assert(llms.totalCount > 0, "llms.txt 生成应有收录内容");

    const sitemap = await request<{ totalCount: number; xmlText: string }>(baseUrl, "/api/v1/sitemap/generate", { method: "POST", token, body: { publish: false } });
    assert(sitemap.totalCount > 0 && sitemap.xmlText.includes("<urlset"), "AI Sitemap 生成应返回 XML");

    const audit = await request<{ count: number }>(baseUrl, "/api/v1/audit/rescore", { method: "POST", token });
    assert(audit.count > 0, "GEO 重新评分应返回评分对象数量");

    const publicCases = await request<{ success: boolean; data: { items: Array<{ slug: string; metrics: unknown }> } }>(baseUrl, "/api/v1/cases");
    assert(publicCases.success && publicCases.data.items.length > 0, "公开案例接口应返回 published 内容");
    const publicCaseInList = publicCases.data.items.find((item) => item.slug === caseSlug);
    assert(publicCaseInList, "公开案例列表应包含新发布案例");
    const publicCaseDetail = await request<{ success: boolean; data: { metrics: unknown } }>(
      baseUrl,
      `/api/v1/cases/${caseSlug}`
    );
    assert(
      JSON.stringify(publicCaseInList.metrics) === JSON.stringify(publicCaseDetail.data.metrics),
      "公开案例列表与详情应返回完全一致的 metrics"
    );

    await request(baseUrl, `/api/cases/${caseItem.id}`, { method: "DELETE", token });
    await request(baseUrl, `/api/faqs/${faqItem.id}`, { method: "DELETE", token });
    await request(baseUrl, `/api/news/${newsItem.id}`, { method: "DELETE", token });

    console.log("Core API tests passed");
  } finally {
    await app.close();
  }
}

async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "llms.txt", method: RequestMethod.GET },
      { path: "llms-full.txt", method: RequestMethod.GET },
      { path: "ai-sitemap.xml", method: RequestMethod.GET }
    ]
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(0);
  return app as INestApplication;
}

async function request<T = Json>(baseUrl: string, path: string, options: { method?: string; token?: string; body?: unknown } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed: ${response.status} ${text}`);
  }

  return data as T;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
