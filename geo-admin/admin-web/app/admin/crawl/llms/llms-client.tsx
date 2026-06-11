"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, RefreshCw, Rocket, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LlmsItem = {
  id: string;
  targetType: "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";
  title: string;
  url: string | null;
  section: "site" | "cases" | "faqs" | "news";
};

type LlmsState = {
  generatedAt: string;
  totalCount: number;
  counts: Record<"site" | "cases" | "faqs" | "news", number>;
  items: LlmsItem[];
  llmsText: string;
  llmsFullText: string;
  published: boolean;
};

const emptyState: LlmsState = {
  generatedAt: "",
  totalCount: 0,
  counts: { site: 0, cases: 0, faqs: 0, news: 0 },
  items: [],
  llmsText: "YFYK\n\nSite\n",
  llmsFullText: "# YFYK\n",
  published: false
};

const sectionLabels = {
  site: "Site",
  cases: "Cases",
  faqs: "FAQs",
  news: "News"
};

const targetLabels = {
  STATIC_RESOURCE: "静态资源",
  CASE: "案例",
  FAQ: "FAQ",
  NEWS: "资讯"
};

export function LlmsClient() {
  const [state, setState] = useState<LlmsState>(emptyState);
  const [activePreview, setActivePreview] = useState<"llms" | "full">("llms");
  const [query, setQuery] = useState("");
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.items;
    return state.items.filter((item) => [item.title, item.url, item.section, item.targetType].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized)));
  }, [query, state.items]);

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    setIsBusy(true);
    try {
      const data = await apiFetch<LlmsState>("/api/v1/llms");
      setState(data);
      setStatusText(data.published ? "已读取已发布版本" : "已生成预览，尚未发布");
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "llms 状态加载失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function generate(publish: boolean) {
    setIsBusy(true);
    try {
      const data = await apiFetch<LlmsState>("/api/v1/llms/generate", {
        method: "POST",
        body: JSON.stringify({ publish })
      });
      setState(data);
      setStatusText(publish ? "已生成并发布，可公开访问" : "已重新生成预览");
      toastSuccess(publish ? "llms.txt 已发布" : "llms.txt 预览已生成");
    } catch (error) {
      setStatusText("生成失败");
      toastError(error instanceof Error ? error.message : "生成失败");
    } finally {
      setIsBusy(false);
    }
  }

  const previewText = activePreview === "llms" ? state.llmsText : state.llmsFullText;

  return (
    <div className="admin-grid">
      <section className="col-span-12 grid gap-4 md:grid-cols-4">
        <Metric label="收录总数" value={state.totalCount.toString()} />
        <Metric label="Site" value={state.counts.site.toString()} />
        <Metric label="Cases" value={state.counts.cases.toString()} />
        <Metric label="FAQs / News" value={`${state.counts.faqs} / ${state.counts.news}`} />
      </section>

      <Card className="col-span-12">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>llms.txt管理</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">只收录启用 llms_enabled 且状态为 active / published 的对象。</p>
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
            <a className="text-sm font-medium text-foreground underline-offset-4 hover:underline" href="/llms.txt" target="_blank">
              /llms.txt
            </a>
            <a className="text-sm font-medium text-foreground underline-offset-4 hover:underline" href="/llms-full.txt" target="_blank">
              /llms-full.txt
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="col-span-12 grid gap-6 xl:grid-cols-12">
        <section className="min-w-0 xl:col-span-7">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle>文件预览</CardTitle>
                <div className="flex rounded-md border border-border/80 bg-white p-1">
                  <button className={tabClassName(activePreview === "llms")} type="button" onClick={() => setActivePreview("llms")}>
                    llms.txt
                  </button>
                  <button className={tabClassName(activePreview === "full")} type="button" onClick={() => setActivePreview("full")}>
                    llms-full.txt
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="min-w-0">
              <pre className="max-h-[560px] min-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/50 p-4 text-xs leading-6 text-foreground">
                {previewText}
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0 xl:col-span-5">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle>收录对象列表</CardTitle>
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
              <div className="grid max-h-[560px] gap-3 overflow-auto">
                {filteredItems.map((item) => (
                  <div key={`${item.targetType}-${item.id}`} className="rounded-md border border-border/80 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <Badge tone="neutral">{sectionLabels[item.section]}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{targetLabels[item.targetType]}</span>
                      {item.url ? <span>{item.url}</span> : null}
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 ? (
                  <div className="rounded-md border border-border/80 bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                    暂无符合条件的收录对象
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function tabClassName(active: boolean) {
  return "rounded px-3 py-1.5 text-sm font-medium transition-colors " + (active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground");
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

