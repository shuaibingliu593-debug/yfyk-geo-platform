"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorDrawer } from "@/components/admin/editor-drawer";

type LeadStatus = "NEW" | "FOLLOWING" | "DONE" | "INVALID";

type LeadItem = {
  id: string;
  name: string;
  companyName: string | null;
  contact: string;
  demandType: string;
  message: string | null;
  sourcePage: string;
  sourcePageTitle: string | null;
  sourceModule: string;
  sourceButtonText: string | null;
  referrer: string | null;
  userAgent: string | null;
  ip: string | null;
  status: LeadStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

type LeadStats = {
  todayNew: number;
  pending: number;
  done: number;
  total: number;
};

type LeadsListResponse = {
  items: LeadItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  stats: LeadStats;
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "新留言",
  FOLLOWING: "跟进中",
  DONE: "已处理",
  INVALID: "无效"
};

const statusTone: Record<LeadStatus, "default" | "warning" | "success" | "neutral"> = {
  NEW: "default",
  FOLLOWING: "warning",
  DONE: "success",
  INVALID: "neutral"
};

const demandTypeOptions = [
  "GEO原生建站",
  "老网站AI友好度升级",
  "企业知识库工程",
  "网站诊断",
  "其他咨询"
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function LeadsClient() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState<LeadStats>({ todayNew: 0, pending: 0, done: 0, total: 0 });
  const [selected, setSelected] = useState<LeadItem | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("NEW");
  const [editNote, setEditNote] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [demandType, setDemandType] = useState("all");
  const [sourcePage, setSourcePage] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sourcePageOptions = useMemo(() => {
    const pages = new Set(leads.map((item) => item.sourcePage));
    return Array.from(pages).sort();
  }, [leads]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("keyword", query.trim());
    if (status !== "all") params.set("status", status);
    if (demandType !== "all") params.set("demandType", demandType);
    if (sourcePage !== "all") params.set("sourcePage", sourcePage);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("pageSize", "100");
    return params.toString();
  }, [dateFrom, dateTo, demandType, query, sourcePage, status]);

  const loadLeads = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<LeadsListResponse>(`/api/admin/leads?${buildQueryString()}`);
      setLeads(data.items);
      setStats(data.stats);
      setStatusText(`已加载 ${data.items.length} 条留言`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "留言加载失败");
    } finally {
      setIsBusy(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  function openDetail(item: LeadItem) {
    setSelected(item);
    setEditStatus(item.status);
    setEditNote(item.note ?? "");
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setSelected(null);
  }

  async function saveLead() {
    if (!selected) return;
    setIsBusy(true);
    try {
      const saved = await apiFetch<LeadItem>(`/api/admin/leads/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: editStatus, note: editNote })
      });
      setLeads((items) => items.map((item) => (item.id === saved.id ? saved : item)));
      setSelected(saved);
      toastSuccess("留言已更新");
      await loadLeads();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function markInvalid(item: LeadItem) {
    setIsBusy(true);
    try {
      const saved = await apiFetch<LeadItem>(`/api/admin/leads/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "INVALID" })
      });
      setLeads((items) => items.map((current) => (current.id === saved.id ? saved : current)));
      if (selected?.id === item.id) {
        setEditStatus("INVALID");
        setSelected(saved);
      }
      toastSuccess("已标记为无效");
      await loadLeads();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "操作失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">今日新增</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-blue-600">{stats.todayNew}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待跟进</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已处理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">{stats.done}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总留言数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>官网留言</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{statusText}</p>
          </div>
          <Button variant="outline" onClick={loadLeads} disabled={isBusy}>
            刷新
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">搜索</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3"
                  placeholder="姓名 / 公司 / 联系方式 / 留言"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">状态</span>
              <select
                className="rounded-md border border-border bg-background px-3 py-2"
                value={status}
                onChange={(event) => setStatus(event.target.value as "all" | LeadStatus)}
              >
                <option value="all">全部</option>
                <option value="NEW">新留言</option>
                <option value="FOLLOWING">跟进中</option>
                <option value="DONE">已处理</option>
                <option value="INVALID">无效</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">需求类型</span>
              <select
                className="rounded-md border border-border bg-background px-3 py-2"
                value={demandType}
                onChange={(event) => setDemandType(event.target.value)}
              >
                <option value="all">全部</option>
                {demandTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">来源页面</span>
              <select
                className="rounded-md border border-border bg-background px-3 py-2"
                value={sourcePage}
                onChange={(event) => setSourcePage(event.target.value)}
              >
                <option value="all">全部</option>
                {sourcePageOptions.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">开始日期</span>
              <input
                type="date"
                className="rounded-md border border-border bg-background px-3 py-2"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted-foreground">结束日期</span>
              <input
                type="date"
                className="rounded-md border border-border bg-background px-3 py-2"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">提交时间</th>
                  <th className="px-4 py-3 font-medium">姓名</th>
                  <th className="px-4 py-3 font-medium">公司</th>
                  <th className="px-4 py-3 font-medium">联系方式</th>
                  <th className="px-4 py-3 font-medium">需求类型</th>
                  <th className="px-4 py-3 font-medium">来源页面</th>
                  <th className="px-4 py-3 font-medium">来源模块</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      暂无留言数据
                    </td>
                  </tr>
                ) : (
                  leads.map((item) => {
                    const isMuted = item.status === "DONE" || item.status === "INVALID";
                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-border ${isMuted ? "opacity-60" : ""} ${item.status === "NEW" ? "bg-blue-50/60" : ""}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(item.createdAt)}</td>
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3">{item.companyName || "—"}</td>
                        <td className="px-4 py-3">{item.contact}</td>
                        <td className="px-4 py-3">{item.demandType}</td>
                        <td className="px-4 py-3">{item.sourcePage}</td>
                        <td className="px-4 py-3">{item.sourceModule}</td>
                        <td className="px-4 py-3">
                          <Badge tone={statusTone[item.status]}>{statusLabels[item.status]}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" onClick={() => openDetail(item)}>
                            <Eye className="mr-1 h-4 w-4" />
                            查看
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EditorDrawer open={isDrawerOpen} title="留言详情" onClose={closeDrawer}>
        {selected ? (
          <div className="grid gap-6 p-6">
            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground">基础信息</h3>
              <dl className="grid gap-2 text-sm">
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">姓名</dt>
                  <dd>{selected.name}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">公司名称</dt>
                  <dd>{selected.companyName || "—"}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">联系方式</dt>
                  <dd>{selected.contact}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">需求类型</dt>
                  <dd>{selected.demandType}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">留言内容</dt>
                  <dd className="whitespace-pre-wrap">{selected.message || "—"}</dd>
                </div>
              </dl>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground">来源信息</h3>
              <dl className="grid gap-2 text-sm">
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">来源页面</dt>
                  <dd>{selected.sourcePage}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">页面标题</dt>
                  <dd>{selected.sourcePageTitle || "—"}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">来源模块</dt>
                  <dd>{selected.sourceModule}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">触发按钮</dt>
                  <dd>{selected.sourceButtonText || "—"}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">Referrer</dt>
                  <dd className="break-all">{selected.referrer || "—"}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">User Agent</dt>
                  <dd className="break-all text-xs">{selected.userAgent || "—"}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-muted-foreground">提交时间</dt>
                  <dd>{formatDateTime(selected.createdAt)}</dd>
                </div>
              </dl>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground">处理信息</h3>
              <label className="grid gap-1 text-sm">
                <span>当前状态</span>
                <select
                  className="rounded-md border border-border bg-background px-3 py-2"
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value as LeadStatus)}
                >
                  <option value="NEW">新留言</option>
                  <option value="FOLLOWING">跟进中</option>
                  <option value="DONE">已处理</option>
                  <option value="INVALID">无效</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span>后台备注</span>
                <textarea
                  className="min-h-28 rounded-md border border-border bg-background px-3 py-2"
                  value={editNote}
                  onChange={(event) => setEditNote(event.target.value)}
                  placeholder="记录跟进情况、沟通摘要等"
                />
              </label>
              <p className="text-xs text-muted-foreground">更新时间：{formatDateTime(selected.updatedAt)}</p>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveLead} disabled={isBusy}>
                保存
              </Button>
              <Button variant="outline" onClick={() => markInvalid(selected)} disabled={isBusy}>
                标记无效
              </Button>
              <Button variant="ghost" onClick={closeDrawer}>
                关闭
              </Button>
            </div>
          </div>
        ) : null}
      </EditorDrawer>
    </div>
  );
}
