"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileCode2, RefreshCw, Rocket, Search, SlidersHorizontal } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SitemapItem = {
  geoConfigId: string;
  targetId: string;
  targetType: "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";
  title: string;
  url: string;
  loc: string;
  lastmod: string;
  priority: number;
  defaultPriority: number;
};

type SitemapState = {
  generatedAt: string;
  totalCount: number;
  items: SitemapItem[];
  xmlText: string;
  published: boolean;
};

const emptyState: SitemapState = {
  generatedAt: "",
  totalCount: 0,
  items: [],
  xmlText: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n',
  published: false
};

const targetLabels = {
  STATIC_RESOURCE: "静态资源",
  CASE: "案例",
  FAQ: "FAQ",
  NEWS: "资讯"
};

export function SitemapClient() {
  const [state, setState] = useState<SitemapState>(emptyState);
  const [query, setQuery] = useState("");
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.items;
    return state.items.filter((item) => [item.title, item.url, item.loc, item.targetType].some((value) => value.toLowerCase().includes(normalized)));
  }, [query, state.items]);

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    setIsBusy(true);
    try {
      const data = await apiFetch<SitemapState>("/api/v1/sitemap");
      setState(data);
      setStatusText(data.published ? "已读取已发布版本" : "已生成预览，尚未发布");
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "Sitemap 状态加载失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function generate(publish: boolean) {
    setIsBusy(true);
    try {
      const data = await apiFetch<SitemapState>("/api/v1/sitemap/generate", {
        method: "POST",
        body: JSON.stringify({ publish })
      });
      setState(data);
      setStatusText(publish ? "已生成并发布，可公开访问" : "已重新生成预览");
      toastSuccess(publish ? "AI Sitemap 已发布" : "AI Sitemap 预览已生成");
    } catch (error) {
      setStatusText("生成失败");
      toastError(error instanceof Error ? error.message : "生成失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function updatePriority(item: SitemapItem, priority: number) {
    const normalized = Math.min(1, Math.max(0, priority));
    setState((current) => ({
      ...current,
      items: current.items.map((row) => (row.geoConfigId === item.geoConfigId ? { ...row, priority: normalized } : row))
    }));

    try {
      const data = await apiFetch<SitemapState>(`/api/v1/sitemap/configs/${item.geoConfigId}/priority`, {
        method: "PATCH",
        body: JSON.stringify({ priority: normalized })
      });
      setState(data);
      setStatusText("优先级已写入 geo_configs.sitemap_priority");
      toastSuccess("优先级已保存");
    } catch (error) {
      setStatusText("优先级保存失败");
      toastError(error instanceof Error ? error.message : "优先级保存失败");
      await loadState();
    }
  }

  return (
    <div className="admin-grid">
      <section className="col-span-12 grid gap-4 md:grid-cols-3">
        <Metric label="收录URL数量" value={state.totalCount.toString()} />
        <Metric label="最高优先级" value={state.items.length ? Math.max(...state.items.map((item) => item.priority)).toFixed(2) : "0.00"} />
        <Metric label="发布状态" value={state.published ? "已发布" : "预览"} />
      </section>

      <Card className="col-span-12">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>AI Sitemap管理</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">只收录启用 sitemap_enabled 且状态为 active / published 的对象。</p>
              <p className="mt-1 text-xs text-muted-foreground">
                最近生成时间：{state.generatedAt ? formatDate(state.generatedAt) : "未生成"} · {statusText}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={isBusy} onClick={() => generate(false)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                手动生成
              </Button>
              <Button disabled={isBusy} onClick={() => generate(true)}>
                <Rocket className="mr-2 h-4 w-4" />
                一键发布
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={state.published ? "success" : "warning"}>{state.published ? "已发布" : "预览"}</Badge>
            <a className="text-sm font-medium text-foreground underline-offset-4 hover:underline" href="/ai-sitemap.xml" target="_blank">
              /ai-sitemap.xml
            </a>
          </div>
        </CardContent>
      </Card>

      <section className="col-span-12 grid gap-6 xl:col-span-7">
        <Card>
          <CardHeader>
            <CardTitle>XML预览</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[680px] min-h-96 overflow-auto rounded-md border border-border bg-muted/50 p-4 text-xs leading-6 text-foreground">
              {state.xmlText}
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="col-span-12 grid gap-6 xl:col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap内容列表</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="relative mb-4 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="搜索标题、URL、对象类型"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="grid max-h-[680px] gap-3 overflow-auto">
              {filteredItems.map((item) => (
                <div key={item.geoConfigId} className="rounded-md border border-border/80 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <Badge tone="neutral">{targetLabels[item.targetType]}</Badge>
                  </div>
                  <p className="mt-2 truncate text-xs text-muted-foreground">{item.url}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{item.loc}</p>
                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>优先级</span>
                      <span>
                        {item.priority.toFixed(2)} · 默认 {item.defaultPriority.toFixed(2)}
                      </span>
                    </div>
                    <input
                      className="w-full accent-foreground"
                      max={1}
                      min={0}
                      step={0.05}
                      type="range"
                      value={item.priority}
                      onChange={(event) => updatePriority(item, Number(event.target.value))}
                    />
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 ? (
                <div className="rounded-md border border-border/80 bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                  暂无符合条件的 Sitemap URL
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
            {label.includes("优先") ? <SlidersHorizontal className="h-5 w-5" /> : <FileCode2 className="h-5 w-5" />}
          </div>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

