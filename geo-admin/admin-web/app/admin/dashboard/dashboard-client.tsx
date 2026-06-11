"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Clock, FileQuestion, FileText, Gauge, Layers3, Newspaper, RefreshCw, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TargetType = "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";

type DashboardOverview = {
  metrics: {
    geoTotalScore: number;
    staticResourceCount: number;
    caseCount: number;
    faqCount: number;
    newsCount: number;
    publishedContentCount: number;
    aiSummaryCoverage: number;
    schemaCoverage: number;
    llmsIncludedCount: number;
    sitemapIncludedCount: number;
    highRiskIssueCount: number;
  };
  lowScorePages: Array<{
    targetType: TargetType;
    targetId: string;
    crawlScore: number;
    understandingScore: number;
    structureScore: number;
    totalScore: number;
    href: string;
    target: { title: string; url: string | null };
  }>;
  recentUpdates: Array<{
    id: string;
    targetType: TargetType;
    title: string;
    url: string | null;
    href: string;
    updatedAt: string;
  }>;
  generation: {
    llmsGeneratedAt: string | null;
    sitemapGeneratedAt: string | null;
  };
};

const emptyOverview: DashboardOverview = {
  metrics: {
    geoTotalScore: 0,
    staticResourceCount: 0,
    caseCount: 0,
    faqCount: 0,
    newsCount: 0,
    publishedContentCount: 0,
    aiSummaryCoverage: 0,
    schemaCoverage: 0,
    llmsIncludedCount: 0,
    sitemapIncludedCount: 0,
    highRiskIssueCount: 0
  },
  lowScorePages: [],
  recentUpdates: [],
  generation: { llmsGeneratedAt: null, sitemapGeneratedAt: null }
};

const targetLabels: Record<TargetType, string> = {
  STATIC_RESOURCE: "静态资源",
  CASE: "案例",
  FAQ: "FAQ",
  NEWS: "资讯"
};

export function DashboardClient() {
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const countCards = useMemo(
    () => [
      { label: "静态资源数量", value: overview.metrics.staticResourceCount, icon: Layers3 },
      { label: "案例数量", value: overview.metrics.caseCount, icon: Sparkles },
      { label: "FAQ数量", value: overview.metrics.faqCount, icon: FileQuestion },
      { label: "资讯数量", value: overview.metrics.newsCount, icon: Newspaper },
      { label: "已发布内容数量", value: overview.metrics.publishedContentCount, icon: FileText },
      { label: "高风险问题数量", value: overview.metrics.highRiskIssueCount, icon: AlertTriangle }
    ],
    [overview]
  );

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setIsBusy(true);
    try {
      const data = await apiFetch<DashboardOverview>("/api/v1/admin/dashboard/overview");
      setOverview(data);
      setStatusText("Dashboard 数据已更新");
    } catch (error) {
      setStatusText("Dashboard 加载失败");
      toastError(error instanceof Error ? error.message : "Dashboard 加载失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="admin-grid">
      <Card className="col-span-12">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">后端实时聚合</Badge>
              <span className="text-xs text-muted-foreground">{statusText}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">新增内容、修改 GEO 配置、重新评分后，刷新即可看到指标变化。</p>
          </div>
          <Button disabled={isBusy} onClick={loadOverview}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
        </CardContent>
      </Card>

      <section className="col-span-12 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>GEO总评分</CardTitle>
              <Gauge className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-6xl font-semibold tracking-normal">{overview.metrics.geoTotalScore}</p>
                <p className="mt-2 text-sm text-muted-foreground">来自 geo_scores.total_score 平均值</p>
              </div>
              <div className="grid min-w-72 gap-4">
                <CoverageBar label="AI Summary覆盖率" value={overview.metrics.aiSummaryCoverage} />
                <CoverageBar label="Schema覆盖率" value={overview.metrics.schemaCoverage} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>生成状态</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <GenerationRow label="最近一次llms.txt生成时间" value={overview.generation.llmsGeneratedAt} href="/admin/crawl/llms" />
            <GenerationRow label="最近一次AI Sitemap生成时间" value={overview.generation.sitemapGeneratedAt} href="/admin/crawl/sitemap" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SmallMetric label="llms.txt收录数量" value={overview.metrics.llmsIncludedCount} />
              <SmallMetric label="AI Sitemap收录数量" value={overview.metrics.sitemapIncludedCount} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="col-span-12 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {countCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="col-span-12 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>低分页面Top 10</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.lowScorePages.map((item) => (
              <Link key={`${item.targetType}-${item.targetId}`} className="rounded-md border border-border/80 bg-white px-4 py-3 transition-colors hover:bg-muted/60" href={item.href}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.target.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{item.target.url ?? targetLabels[item.targetType]}</p>
                  </div>
                  <Badge tone={item.totalScore >= 60 ? "warning" : "default"}>{item.totalScore}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>抓取 {item.crawlScore}/30</span>
                  <span>理解 {item.understandingScore}/30</span>
                  <span>结构 {item.structureScore}/40</span>
                </div>
              </Link>
            ))}
            {overview.lowScorePages.length === 0 ? <EmptyState label="暂无低分页面" /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近更新内容</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.recentUpdates.map((item) => (
              <Link key={`${item.targetType}-${item.id}`} className="rounded-md border border-border/80 bg-white px-4 py-3 transition-colors hover:bg-muted/60" href={item.href}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{item.url ?? targetLabels[item.targetType]}</p>
                  </div>
                  <Badge tone="neutral">{targetLabels[item.targetType]}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.updatedAt)}</p>
              </Link>
            ))}
            {overview.recentUpdates.length === 0 ? <EmptyState label="暂无最近更新" /> : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CoverageBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-foreground" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function GenerationRow({ label, value, href }: { label: string; value: string | null; href: string }) {
  return (
    <Link className="flex items-center justify-between gap-3 rounded-md border border-border/80 px-4 py-3 transition-colors hover:bg-muted/60" href={href}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ? formatDate(value) : "未生成"}</span>
    </Link>
  );
}

function SmallMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border/80 px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-md border border-border/80 bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">{label}</div>;
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

