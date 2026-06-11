"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileJson, Gauge, Save, Search } from "lucide-react";
import { getStaticPageByKey } from "../../../../../../shared/static-pages";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StaticPage = {
  id: string;
  title: string;
  slug: string;
  resourceKey: string;
  url: string;
  type: "页面" | "集合" | "资质";
  geoConfig: GeoConfigForm;
  lastScore?: number;
};

type GeoConfigForm = {
  aiSummary: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  schemaType: string;
  schemaJson: string;
  llmsEnabled: boolean;
  sitemapEnabled: boolean;
  sitemapPriority: number;
};

export function StaticPagesClient() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [query, setQuery] = useState("");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);

  const loadPages = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<ApiStaticResource[]>("/api/static-resources/static-pages");
      const nextPages = data.map(mapApiResource);
      setPages(nextPages);
      if (nextPages.length > 0) {
        setActiveKey((current) => current || nextPages[0].resourceKey);
      }
      setStatusText(`已加载 ${nextPages.length} 个静态资源`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "静态页面加载失败");
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return pages.filter((page) =>
      normalized ? [page.title, page.url, page.resourceKey].some((value) => value.toLowerCase().includes(normalized)) : true
    );
  }, [pages, query]);

  const activePage = pages.find((page) => page.resourceKey === activeKey);

  function updateGeoConfig(nextConfig: GeoConfigForm) {
    if (!activePage) {
      return;
    }
    setPages((items) => items.map((item) => (item.resourceKey === activePage.resourceKey ? { ...item, geoConfig: nextConfig } : item)));
    setStatusText("有未保存修改");
  }

  async function save() {
    if (!activePage) {
      toastError("请先选择静态页面");
      return;
    }

    let schemaJson: unknown;

    try {
      schemaJson = JSON.parse(activePage.geoConfig.schemaJson);
    } catch {
      toastError("Schema JSON 格式错误");
      setStatusText("Schema JSON 格式错误");
      return;
    }

    setIsBusy(true);
    try {
      await apiFetch(`/api/static-resources/${activePage.id}/geo-config`, {
        method: "PATCH",
        body: JSON.stringify({
          aiSummary: activePage.geoConfig.aiSummary,
          metaTitle: activePage.geoConfig.metaTitle,
          metaDescription: activePage.geoConfig.metaDescription,
          canonicalUrl: activePage.geoConfig.canonicalUrl,
          schemaType: activePage.geoConfig.schemaType,
          schemaJson,
          llmsEnabled: activePage.geoConfig.llmsEnabled,
          sitemapEnabled: activePage.geoConfig.sitemapEnabled,
          sitemapPriority: activePage.geoConfig.sitemapPriority
        })
      });
      setStatusText("已保存到 geo_configs");
      toastSuccess("GEO 配置已保存");
    } catch (error) {
      setStatusText("保存失败");
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function rescore() {
    if (!activePage) {
      toastError("请先选择静态页面");
      return;
    }

    setIsBusy(true);
    try {
      const data = await apiFetch<{ geoCheck?: { score: number } }>(`/api/static-resources/${activePage.id}/rescore`, {
        method: "POST"
      });
      const score = data.geoCheck?.score;
      if (typeof score !== "number") {
        throw new Error("评分结果无效");
      }
      setPages((items) => items.map((item) => (item.resourceKey === activePage.resourceKey ? { ...item, lastScore: score } : item)));
      setStatusText(`重新评分完成：${score}`);
      toastSuccess(`重新评分完成：${score}`);
    } catch (error) {
      setStatusText("重新评分失败");
      toastError(error instanceof Error ? error.message : "重新评分失败");
    } finally {
      setIsBusy(false);
    }
  }

  if (!activePage) {
    return (
      <Card className="col-span-12">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          {isBusy ? "正在加载静态页面..." : "暂无静态资源，请先执行数据库 seed。"}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="admin-grid">
      <Card className="col-span-12 xl:col-span-4">
        <CardHeader>
          <CardTitle>静态资源列表</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={inputClassName + " pl-9"}
              placeholder="搜索页面、URL、resource key"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="mt-4 grid gap-2">
            {filteredPages.map((page) => (
              <button
                key={page.resourceKey}
                className={
                  "rounded-md border px-4 py-3 text-left transition-colors " +
                  (page.resourceKey === activePage.resourceKey
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/80 bg-white hover:bg-muted")
                }
                type="button"
                onClick={() => setActiveKey(page.resourceKey)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{page.title}</p>
                  <Badge tone={page.type === "页面" ? "neutral" : "warning"}>{page.type}</Badge>
                </div>
                <p className="mt-2 truncate text-xs opacity-70">{page.url}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">预置静态页面不可删除，正文由官网项目维护。</p>
        </CardContent>
      </Card>

      <section className="col-span-12 grid gap-6 xl:col-span-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>{activePage.title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{activePage.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="neutral">{activePage.resourceKey}</Badge>
                <Badge tone={activePage.lastScore && activePage.lastScore >= 80 ? "success" : "warning"}>
                  {activePage.lastScore ? `GEO评分 ${activePage.lastScore}` : "未评分"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GeoConfigEditor value={activePage.geoConfig} onChange={updateGeoConfig} />
            <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{statusText}</p>
              <div className="flex gap-2">
                <Button disabled={isBusy} variant="outline" onClick={rescore}>
                  <Gauge className="mr-2 h-4 w-4" />
                  重新评分
                </Button>
                <Button disabled={isBusy} onClick={save}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>公开 API 读取</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-md border border-border/80 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-medium">GET /api/public/static-pages/{activePage.resourceKey}/geo-config</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  官网可通过 resource_key 读取该静态页面的 GEO 配置；后台不提供正文编辑。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function GeoConfigEditor({ value, onChange }: { value: GeoConfigForm; onChange: (value: GeoConfigForm) => void }) {
  function update<K extends keyof GeoConfigForm>(key: K, nextValue: GeoConfigForm[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <div className="grid gap-5">
      <Field label="AI Summary">
        <textarea className={textareaClassName} value={value.aiSummary} onChange={(event) => update("aiSummary", event.target.value)} />
      </Field>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Meta Title">
          <input className={inputClassName} value={value.metaTitle} onChange={(event) => update("metaTitle", event.target.value)} />
        </Field>
        <Field label="Canonical URL">
          <input className={inputClassName} value={value.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} />
        </Field>
      </div>
      <Field label="Meta Description">
        <textarea className={textareaClassName} value={value.metaDescription} onChange={(event) => update("metaDescription", event.target.value)} />
      </Field>
      <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
        <Field label="Schema 类型">
          <input className={inputClassName} value={value.schemaType} onChange={(event) => update("schemaType", event.target.value)} />
        </Field>
        <Field label="Sitemap 优先级">
          <input
            className={inputClassName}
            max={1}
            min={0}
            step={0.1}
            type="number"
            value={value.sitemapPriority}
            onChange={(event) => update("sitemapPriority", Number(event.target.value))}
          />
        </Field>
      </div>
      <Field label="Schema JSON">
        <div className="relative">
          <FileJson className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            className="min-h-44 w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/20"
            value={value.schemaJson}
            onChange={(event) => update("schemaJson", event.target.value)}
          />
        </div>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          checked={value.llmsEnabled}
          label="进入 llms.txt"
          onChange={(checked) => update("llmsEnabled", checked)}
        />
        <Toggle
          checked={value.sitemapEnabled}
          label="进入 AI Sitemap"
          onChange={(checked) => update("sitemapEnabled", checked)}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border/80 px-4 py-3 text-sm">
      <span>{label}</span>
      <input checked={checked} className="h-4 w-4" type="checkbox" onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";
const textareaClassName = "min-h-24 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20";

type ApiStaticResource = {
  id: string;
  title: string;
  slug: string;
  resourceKey: string;
  resourceType: string;
  url: string;
  geoConfig: null | {
    aiSummary: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    schemaType: string | null;
    schemaJson: unknown;
    llmsEnabled: boolean;
    sitemapEnabled: boolean;
    sitemapPriority: number;
  };
};

function mapApiResource(resource: ApiStaticResource): StaticPage {
  const schemaType = resource.geoConfig?.schemaType ?? defaultSchemaType(resource.resourceKey);
  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    resourceKey: resource.resourceKey,
    url: resource.url,
    type: resource.resourceType === "STATIC_COLLECTION" ? "集合" : resource.resourceType === "STATIC_CERTIFICATION" ? "资质" : "页面",
    geoConfig: {
      aiSummary: resource.geoConfig?.aiSummary ?? "",
      metaTitle: resource.geoConfig?.metaTitle ?? resource.title,
      metaDescription: resource.geoConfig?.metaDescription ?? "",
      canonicalUrl: resource.geoConfig?.canonicalUrl ?? resource.url,
      schemaType,
      schemaJson: JSON.stringify(resource.geoConfig?.schemaJson ?? { "@type": schemaType, name: resource.title, url: resource.url }, null, 2),
      llmsEnabled: resource.geoConfig?.llmsEnabled ?? true,
      sitemapEnabled: resource.geoConfig?.sitemapEnabled ?? true,
      sitemapPriority: resource.geoConfig?.sitemapPriority ?? 0.5
    }
  };
}

function defaultSchemaType(resourceKey: string) {
  return getStaticPageByKey(resourceKey)?.schemaType ?? "WebPage";
}
