"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TargetType = "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";

type GeoIssueRow = {
  id: string;
  targetType: TargetType;
  targetId: string;
  issueType: string;
  severity: "high" | "medium" | "low";
  description: string;
  suggestion: string;
  status: "open" | "resolved";
  updatedAt: string;
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

const severityLabels = {
  high: "高",
  medium: "中",
  low: "低"
};

export function AuditIssuesClient() {
  const [issues, setIssues] = useState<GeoIssueRow[]>([]);
  const [query, setQuery] = useState("");
  const [targetType, setTargetType] = useState<"all" | TargetType>("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("open");
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const filteredIssues = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return issues;
    return issues.filter((item) =>
      [item.target.title, item.target.url, item.issueType, item.description, item.suggestion].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized))
    );
  }, [issues, query]);

  const metrics = useMemo(() => {
    return {
      open: issues.filter((item) => item.status === "open").length,
      high: issues.filter((item) => item.severity === "high" && item.status === "open").length,
      resolved: issues.filter((item) => item.status === "resolved").length
    };
  }, [issues]);

  const loadIssues = useCallback(async () => {
    setIsBusy(true);
    const params = new URLSearchParams();
    if (targetType !== "all") params.set("targetType", targetType);
    if (severity !== "all") params.set("severity", severity);
    if (status !== "all") params.set("status", status);

    try {
      const data = await apiFetch<GeoIssueRow[]>(`/api/v1/audit/issues?${params.toString()}`);
      setIssues(data);
      setStatusText("问题诊断已更新");
    } catch (error) {
      setStatusText("问题加载失败");
      toastError(error instanceof Error ? error.message : "问题加载失败");
    } finally {
      setIsBusy(false);
    }
  }, [severity, status, targetType]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  async function resolveIssue(issue: GeoIssueRow) {
    setIsBusy(true);
    try {
      await apiFetch(`/api/v1/audit/issues/${issue.id}/resolve`, { method: "PATCH" });
      await loadIssues();
      setStatusText("问题已标记为已处理");
      toastSuccess("问题已标记为已处理");
    } catch (error) {
      setStatusText("标记失败");
      toastError(error instanceof Error ? error.message : "标记失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="admin-grid">
      <section className="col-span-12 grid gap-4 md:grid-cols-3">
        <Metric label="未处理问题" value={metrics.open.toString()} icon="alert" />
        <Metric label="高优先级" value={metrics.high.toString()} icon="alert" />
        <Metric label="已处理" value={metrics.resolved.toString()} icon="check" />
      </section>

      <Card className="col-span-12">
        <CardHeader>
          <div>
            <CardTitle>问题诊断</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">重新评分会自动生成当前问题，修复 GEO 配置后再次评分即可观察分数变化。</p>
            <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_160px_140px_140px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClassName + " pl-9"}
                placeholder="搜索对象、问题类型、建议"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select className={inputClassName} value={targetType} onChange={(event) => setTargetType(event.target.value as "all" | TargetType)}>
              <option value="all">全部对象</option>
              {Object.entries(targetLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select className={inputClassName} value={severity} onChange={(event) => setSeverity(event.target.value)}>
              <option value="all">全部等级</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <select className={inputClassName} value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="open">未处理</option>
              <option value="resolved">已处理</option>
              <option value="all">全部状态</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <section className="col-span-12 grid gap-3">
        {filteredIssues.map((issue) => (
          <Card key={issue.id}>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={issue.severity === "high" ? "default" : issue.severity === "medium" ? "warning" : "neutral"}>{severityLabels[issue.severity]}</Badge>
                    <Badge tone={issue.status === "open" ? "warning" : "success"}>{issue.status === "open" ? "未处理" : "已处理"}</Badge>
                    <Badge tone="neutral">{targetLabels[issue.targetType]}</Badge>
                    <span className="text-xs text-muted-foreground">{issue.issueType}</span>
                  </div>
                  <p className="mt-3 font-medium">{issue.target.title}</p>
                  {issue.target.url ? <p className="mt-1 text-xs text-muted-foreground">{issue.target.url}</p> : null}
                  <p className="mt-4 text-sm leading-6 text-foreground">{issue.description}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{issue.suggestion}</p>
                </div>
                {issue.status === "open" ? (
                  <Button variant="outline" disabled={isBusy} onClick={() => resolveIssue(issue)}>
                    标记已处理
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredIssues.length === 0 ? <div className="rounded-md border border-border/80 bg-white px-4 py-10 text-center text-sm text-muted-foreground">暂无问题</div> : null}
      </section>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: "alert" | "check" }) {
  const Icon = icon === "alert" ? AlertTriangle : CheckCircle2;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-muted text-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";
