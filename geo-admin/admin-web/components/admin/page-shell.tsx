import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FileCode2, Layers3, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHelpTrigger } from "./page-help-trigger";
import { routeMeta, staticGeoPages } from "./menu";

type PageShellProps = {
  path: keyof typeof routeMeta;
  children?: React.ReactNode;
};

const pageHelpPaths = new Set([
  "/admin/dashboard",
  "/admin/geo/schema",
  "/admin/geo/static-pages",
  "/admin/content/faqs",
  "/admin/content/cases",
  "/admin/content/news",
  "/admin/leads",
  "/admin/audit/issues",
  "/admin/audit/pages",
  "/admin/crawl/sitemap",
  "/admin/crawl/llms",
  "/admin/settings"
]);

export function PageShell({ path, children }: PageShellProps) {
  const meta = routeMeta[path];
  const hasHelp = pageHelpPaths.has(path);
  const Icon = meta.icon;

  return (
    <div className="grid gap-8">
      <section className="border-b border-border/80 bg-white">
        <div className="admin-container py-8">
          <div className="admin-grid items-center">
            <div className="col-span-12 flex min-w-0 items-center gap-4 lg:col-span-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-normal">{meta.title}</h1>
                  <Badge tone="neutral">GEO Ready</Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{meta.description}</p>
              </div>
            </div>
            {hasHelp ? (
              <div className="col-span-12 flex justify-end lg:col-span-4">
                <PageHelpTrigger helpPath={path} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="admin-container pb-10">
        {children ?? (
          <ModuleOverview title={meta.title} />
        )}
      </section>
    </div>
  );
}

function ModuleOverview({ title }: { title: string }) {
  const rows = [
    { label: "静态资源", value: "static_resources", icon: Layers3, tone: "default" as const },
    { label: "统一 GEO 配置", value: "geo_configs", icon: FileCode2, tone: "neutral" as const },
    { label: "动态内容", value: "cases / faqs / news", icon: Newspaper, tone: "neutral" as const }
  ];

  return (
    <div className="admin-grid">
      <section className="col-span-12 grid gap-4 md:grid-cols-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <Card key={row.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge tone={row.tone}>{row.value}</Badge>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{title}</p>
                <p className="mt-1 text-lg font-semibold">{row.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="col-span-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>配置队列</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/admin/settings">
                查看
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {["静态页面 GEO 配置", "Schema 配置", "动态内容 GEO 配置"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-border/80 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/80 bg-muted text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                  <Badge tone={index < 2 ? "success" : "neutral"}>{index < 2 ? "已接入" : "自动同步"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>运行状态</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-medium">统一对象模型</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">static_resource、case、faq、news 统一读取 geo_configs。</p>
              </div>
            </div>
            <div className="rounded-md border border-border/80 px-4 py-3 text-sm leading-6 text-muted-foreground">
              当前范围聚焦内容中心、静态页面 GEO 配置与 Schema 配置。
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function StaticGeoScopeCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>静态资源范围</CardTitle>
          <Badge tone="neutral">正文由官网维护</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {staticGeoPages.map((page) => (
            <div key={page.title} className="rounded-md border border-border/80 bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{page.title}</p>
                <Badge tone={page.type === "集合" ? "warning" : "default"}>{page.type}</Badge>
              </div>
              <p className="mt-2 truncate text-xs text-muted-foreground">{page.url}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          术语表、专利资质不进入内容中心，只进入静态页面 GEO 配置与自动检测范围。
        </p>
      </CardContent>
    </Card>
  );
}
