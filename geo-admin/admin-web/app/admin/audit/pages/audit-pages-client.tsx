"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Gauge, RefreshCw, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TargetType = "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";

type GeoScoreRow = {
  id: string;
  targetType: TargetType;
  targetId: string;
  crawlScore: number;
  understandingScore: number;
  structureScore: number;
  totalScore: number;
  updatedAt: string;
  openIssueCount: number;
  target: {
    title: string;
    url: string | null;
  };
};

const targetLabels: Record<TargetType, string> = {
  STATIC_RESOURCE: "静态资源",
  CASE: "案例",
  FAQ: "FAQ",
  NEWS: "资讯"
};

const scoreBands = [
  { value: "all", label: "全部评分" },
  { value: "excellent", label: "90-100" },
  { value: "good", label: "75-89" },
  { value: "warning", label: "60-74" },
  { value: "poor", label: "0-59" }
] as const;

export function AuditPagesClient() {
  const [scores, setScores] = useState<GeoScoreRow[]>([]);
  const [query, setQuery] = useState("");
  const [targetType, setTargetType] = useState<"all" | TargetType>("all");
  const [scoreBand, setScoreBand] = useState("all");
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const filteredScores = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return scores;
    return scores.filter((item) => [item.target.title, item.target.url, item.targetType, item.targetId].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized)));
  }, [query, scores]);

  const metrics = useMemo(() => {
    const total = scores.length;
    const average = total ? Math.round(scores.reduce((sum, item) => sum + item.totalScore, 0) / total) : 0;
    const issueCount = scores.reduce((sum, item) => sum + item.openIssueCount, 0);
    return { total, average, issueCount };
  }, [scores]);

  const loadScores = useCallback(async () => {
    setIsBusy(true);
    const params = new URLSearchParams();
    if (targetType !== "all") params.set("targetType", targetType);
    if (scoreBand !== "all") params.set("scoreBand", scoreBand);

    try {
      const data = await apiFetch<GeoScoreRow[]>(`/api/v1/audit/scores?${params.toString()}`);
      setScores(data);
      setStatusText("评分已更新");
    } catch (error) {
      setStatusText("评分加载失败");
      toastError(error instanceof Error ? error.message : "评分加载失败");
    } finally {
      setIsBusy(false);
    }
  }, [scoreBand, targetType]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  async function rescoreAll() {
    setIsBusy(true);
    try {
      await apiFetch("/api/v1/audit/rescore", { method: "POST" });
      await loadScores();
      setStatusText("批量重新评分完成");
      toastSuccess("批量重新评分完成");
    } catch (error) {
      setStatusText("批量重新评分失败");
      toastError(error instanceof Error ? error.message : "批量重新评分失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function rescoreOne(item: GeoScoreRow) {
    setIsBusy(true);
    try {
      await apiFetch(`/api/v1/audit/scores/${item.targetType}/${item.targetId}/rescore`, { method: "POST" });
      await loadScores();
      setStatusText(`${item.target.title} 已重新评分`);
      toastSuccess(`${item.target.title} 已重新评分`);
    } catch (error) {
      setStatusText("重新评分失败");
      toastError(error instanceof Error ? error.message : "重新评分失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="admin-grid">
      <section className="col-span-12 grid gap-4 md:grid-cols-3">
        <Metric label="评分对象" value={metrics.total.toString()} />
        <Metric label="平均分" value={metrics.average.toString()} />
        <Metric label="未处理问题" value={metrics.issueCount.toString()} />
      </section>

      <Card className="col-span-12">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>页面评分列表</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">总分 100 分：AI可抓取性 30、AI可理解性 30、结构化程度 40。</p>
              <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
            </div>
            <Button disabled={isBusy} onClick={rescoreAll}>
              <RefreshCw className="mr-2 h-4 w-4" />
              批量重新评分
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClassName + " pl-9"}
                placeholder="搜索对象标题、URL"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select className={inputClassName} value={targetType} onChange={(event) => setTargetType(event.target.value as "all" | TargetType)}>
              <option value="all">全部对象类型</option>
              {Object.entries(targetLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select className={inputClassName} value={scoreBand} onChange={(event) => setScoreBand(event.target.value)}>
              {scoreBands.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">对象</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">AI可抓取性</th>
                  <th className="px-4 py-3 font-medium">AI可理解性</th>
                  <th className="px-4 py-3 font-medium">结构化程度</th>
                  <th className="px-4 py-3 font-medium">总分</th>
                  <th className="px-4 py-3 font-medium">问题</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((item) => (
                  <tr key={`${item.targetType}-${item.targetId}`} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-medium">{item.target.title}</p>
                      {item.target.url ? <p className="mt-1 text-xs text-muted-foreground">{item.target.url}</p> : null}
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone="neutral">{targetLabels[item.targetType]}</Badge>
                    </td>
                    <td className="px-4 py-4">{item.crawlScore}/30</td>
                    <td className="px-4 py-4">{item.understandingScore}/30</td>
                    <td className="px-4 py-4">{item.structureScore}/40</td>
                    <td className="px-4 py-4">
                      <Badge tone={scoreTone(item.totalScore)}>{item.totalScore}</Badge>
                    </td>
                    <td className="px-4 py-4">{item.openIssueCount}</td>
                    <td className="px-4 py-4">
                      <Button variant="outline" disabled={isBusy} onClick={() => rescoreOne(item)}>
                        重新评分
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredScores.length === 0 ? <div className="px-4 py-10 text-center text-sm text-muted-foreground">暂无评分对象</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
          <Gauge className="h-5 w-5" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function scoreTone(score: number) {
  if (score >= 90) return "success" as const;
  if (score >= 60) return "warning" as const;
  return "default" as const;
}

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";
