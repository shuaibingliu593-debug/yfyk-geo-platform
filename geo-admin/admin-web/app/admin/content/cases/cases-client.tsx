"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { EditorDrawer } from "@/components/admin/editor-drawer";

type CaseType = "benchmark" | "geo_native" | "ai_upgrade" | "knowledge_base";
type CaseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type CaseMetric = {
  label: string;
  value: string;
  unit: string;
};

type CaseItem = {
  id: string;
  title: string;
  slug: string;
  caseType: CaseType;
  industry: string;
  clientName: string;
  clientDisplayName: string;
  isAnonymized: boolean;
  challenge: string;
  solution: string;
  results: string;
  metrics: CaseMetric[];
  excerpt: string;
  content: string;
  coverImage: string;
  relatedServiceType: string;
  status: CaseStatus;
  featured: boolean;
  sortOrder: number;
  publishedAt: string | null;
};

const caseTypeLabels: Record<CaseType, string> = {
  benchmark: "标杆案例",
  geo_native: "GEO原生建站",
  ai_upgrade: "AI友好度升级",
  knowledge_base: "企业知识库"
};

const emptyCase: CaseItem = {
  id: "",
  title: "",
  slug: "",
  caseType: "geo_native",
  industry: "",
  clientName: "",
  clientDisplayName: "",
  isAnonymized: false,
  challenge: "",
  solution: "",
  results: "",
  metrics: [{ label: "AI引用率", value: "", unit: "%" }],
  excerpt: "",
  content: "",
  coverImage: "",
  relatedServiceType: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
  publishedAt: null
};

export function CasesClient() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [editing, setEditing] = useState<CaseItem>({ ...emptyCase });
  const [query, setQuery] = useState("");
  const [caseType, setCaseType] = useState<"all" | CaseType>("all");
  const [status, setStatus] = useState<"all" | CaseStatus>("all");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadCases = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<ApiCase[]>("/api/cases");
      setCases(data.map(mapApiCase));
      setStatusText(`已加载 ${data.length} 条案例`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "案例加载失败");
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesQuery = normalized
        ? [item.title, item.slug, item.industry, item.clientDisplayName, item.excerpt]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalized))
        : true;
      const matchesType = caseType === "all" || item.caseType === caseType;
      const matchesStatus = status === "all" || item.status === status;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [caseType, cases, query, status]);

  function openCreate() {
    setEditing({ ...emptyCase });
    setIsEditorOpen(true);
  }

  function openEdit(item: CaseItem) {
    setEditing(item);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditing({ ...emptyCase });
  }

  async function saveCase() {
    if (!editing.title.trim() || !editing.content.trim()) {
      toastError("请填写标题和正文");
      return;
    }

    const payload = toApiPayload({
      ...editing,
      slug: editing.slug || slugify(editing.title)
    });
    const isUpdate = Boolean(editing.id);

    setIsBusy(true);
    try {
      const saved = isUpdate
        ? await apiFetch<ApiCase>(`/api/cases/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ApiCase>("/api/cases", { method: "POST", body: JSON.stringify(payload) });

      setCases((items) => {
        const mapped = mapApiCase(saved);
        const exists = items.some((item) => item.id === mapped.id);
        return exists ? items.map((item) => (item.id === mapped.id ? mapped : item)) : [mapped, ...items];
      });
      closeEditor();
      toastSuccess(isUpdate ? "案例已更新" : "案例已创建");
      await loadCases();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function removeCase(id: string) {
    setIsBusy(true);
    try {
      await apiFetch(`/api/cases/${id}`, { method: "DELETE" });
      setCases((items) => items.filter((item) => item.id !== id));
      if (editing.id === id) {
        closeEditor();
      }
      toastSuccess("案例已删除");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "删除失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function toggleFeatured(item: CaseItem) {
    setIsBusy(true);
    try {
      const saved = await apiFetch<ApiCase>(`/api/cases/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: !item.featured })
      });
      setCases((items) => items.map((current) => (current.id === item.id ? mapApiCase(saved) : current)));
      toastSuccess(saved.featured ? "已设为首页推荐" : "已取消首页推荐");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "首页推荐更新失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function setCaseStatus(item: CaseItem, nextStatus: CaseStatus) {
    setIsBusy(true);
    try {
      let saved: ApiCase;
      if (nextStatus === "PUBLISHED") {
        saved = await apiFetch<ApiCase>(`/api/cases/${item.id}/publish`, { method: "PATCH" });
      } else if (nextStatus === "DRAFT") {
        saved = await apiFetch<ApiCase>(`/api/cases/${item.id}/offline`, { method: "PATCH" });
      } else {
        saved = await apiFetch<ApiCase>(`/api/cases/${item.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ARCHIVED" })
        });
      }
      setCases((items) => items.map((current) => (current.id === item.id ? mapApiCase(saved) : current)));
      toastSuccess(nextStatus === "PUBLISHED" ? "案例已发布" : nextStatus === "DRAFT" ? "案例已下线" : "案例已归档");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "状态更新失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="admin-grid">
      <Card className="col-span-12">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>案例列表</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">案例创建或更新后自动同步 geo_configs。</p>
              <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
            </div>
            <Button disabled={isBusy} onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新增案例
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="搜索标题、slug、行业、客户"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select
              className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              value={caseType}
              onChange={(event) => setCaseType(event.target.value as "all" | CaseType)}
            >
              <option value="all">全部类型</option>
              {Object.entries(caseTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | CaseStatus)}
            >
              <option value="all">全部状态</option>
              <option value="DRAFT">草稿/下线</option>
              <option value="PUBLISHED">已发布</option>
              <option value="ARCHIVED">已归档</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <section className="col-span-12 grid content-start gap-4">
        {filteredCases.length === 0 ? (
          <Card className="self-start">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">暂无案例，点击「新增案例」创建。</CardContent>
          </Card>
        ) : null}
        {filteredCases.map((item) => (
          <Card key={item.id} className="self-start">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex gap-4">
                    {item.coverImage ? (
                      <img
                        alt=""
                        className="h-20 w-28 shrink-0 rounded-md border border-border/80 object-cover"
                        src={item.coverImage}
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold">{item.title}</h2>
                    <Badge tone={item.status === "PUBLISHED" ? "success" : "neutral"}>
                      {item.status === "PUBLISHED" ? "已发布" : item.status === "ARCHIVED" ? "已归档" : "草稿"}
                    </Badge>
                    {item.isAnonymized ? (
                      <Badge tone="warning">
                        <EyeOff className="mr-1 h-3 w-3" />
                        已脱敏
                      </Badge>
                    ) : null}
                    {item.featured ? <Badge tone="default">首页推荐</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">/{item.slug}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.excerpt || "暂无摘要"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="default">{caseTypeLabels[item.caseType]}</Badge>
                    {item.industry ? <Badge tone="neutral">{item.industry}</Badge> : null}
                    {item.relatedServiceType ? <Badge tone="neutral">{item.relatedServiceType}</Badge> : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <div key={`${item.id}-${metric.label}`} className="min-w-[120px] rounded-md border border-border/80 px-3 py-2">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="mt-1 text-sm font-semibold">
                          {metric.value || "-"}
                          {metric.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button disabled={isBusy} variant="outline" onClick={() => openEdit(item)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                  <Button
                    disabled={isBusy}
                    variant={item.featured ? "default" : "outline"}
                    onClick={() => toggleFeatured(item)}
                  >
                    {item.featured ? "取消推荐" : "首页推荐"}
                  </Button>
                  {item.status === "PUBLISHED" ? (
                    <Button disabled={isBusy} variant="outline" onClick={() => setCaseStatus(item, "DRAFT")}>
                      下线
                    </Button>
                  ) : (
                    <Button disabled={isBusy} variant="outline" onClick={() => setCaseStatus(item, "PUBLISHED")}>
                      发布
                    </Button>
                  )}
                  <Button disabled={isBusy} variant="ghost" onClick={() => removeCase(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <EditorDrawer open={isEditorOpen} title={editing.id ? "编辑案例" : "新增案例"} onClose={closeEditor}>
        <CaseForm disabled={isBusy} value={editing} onChange={setEditing} onSubmit={saveCase} />
      </EditorDrawer>
    </div>
  );
}

function CaseForm({
  value,
  onChange,
  onSubmit,
  disabled
}: {
  value: CaseItem;
  onChange: (value: CaseItem) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  function update<K extends keyof CaseItem>(key: K, nextValue: CaseItem[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  function updateMetric(index: number, key: keyof CaseMetric, nextValue: string) {
    update(
      "metrics",
      value.metrics.map((metric, currentIndex) =>
        currentIndex === index
          ? {
              ...metric,
              [key]: nextValue
            }
          : metric
      )
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="标题">
          <input className={inputClassName} disabled={disabled} value={value.title} onChange={(event) => update("title", event.target.value)} />
        </Field>
        <Field label="Slug">
          <input className={inputClassName} disabled={disabled} value={value.slug} onChange={(event) => update("slug", event.target.value)} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="案例类型">
          <select className={inputClassName} disabled={disabled} value={value.caseType} onChange={(event) => update("caseType", event.target.value as CaseType)}>
            {Object.entries(caseTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="状态">
          <select className={inputClassName} disabled={disabled} value={value.status} onChange={(event) => update("status", event.target.value as CaseStatus)}>
            <option value="DRAFT">草稿/下线</option>
            <option value="PUBLISHED">发布</option>
            <option value="ARCHIVED">归档</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="行业">
          <input className={inputClassName} disabled={disabled} value={value.industry} onChange={(event) => update("industry", event.target.value)} />
        </Field>
        <Field label="关联服务">
          <input className={inputClassName} disabled={disabled} value={value.relatedServiceType} onChange={(event) => update("relatedServiceType", event.target.value)} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="客户名称">
          <input className={inputClassName} disabled={disabled} value={value.clientName} onChange={(event) => update("clientName", event.target.value)} />
        </Field>
        <Field label="展示名称">
          <input className={inputClassName} disabled={disabled} value={value.clientDisplayName} onChange={(event) => update("clientDisplayName", event.target.value)} />
        </Field>
      </div>

      <label className="flex items-center justify-between rounded-md border border-border/80 px-3 py-2 text-sm">
        <span>脱敏案例</span>
        <input
          checked={value.isAnonymized}
          className="h-4 w-4"
          disabled={disabled}
          type="checkbox"
          onChange={(event) => update("isAnonymized", event.target.checked)}
        />
      </label>

      <label className="flex items-center justify-between rounded-md border border-border/80 px-3 py-2 text-sm">
        <span>首页推荐</span>
        <input
          checked={value.featured}
          className="h-4 w-4"
          disabled={disabled}
          type="checkbox"
          onChange={(event) => update("featured", event.target.checked)}
        />
      </label>

      <CoverImageField allowGif disabled={disabled} label="案例封面图" value={value.coverImage} onChange={(nextValue) => update("coverImage", nextValue)} />

      <Field label="摘要">
        <textarea className={textareaClassName} disabled={disabled} value={value.excerpt} onChange={(event) => update("excerpt", event.target.value)} />
      </Field>
      <Field label="挑战">
        <textarea className={textareaClassName} disabled={disabled} value={value.challenge} onChange={(event) => update("challenge", event.target.value)} />
      </Field>
      <Field label="方案">
        <textarea className={textareaClassName} disabled={disabled} value={value.solution} onChange={(event) => update("solution", event.target.value)} />
      </Field>
      <Field label="结果">
        <textarea className={textareaClassName} disabled={disabled} value={value.results} onChange={(event) => update("results", event.target.value)} />
      </Field>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">指标数据</p>
          <Button
            disabled={disabled}
            type="button"
            variant="outline"
            onClick={() => update("metrics", [...value.metrics, { label: "", value: "", unit: "" }])}
          >
            添加指标
          </Button>
        </div>
        {value.metrics.map((metric, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_80px]">
            <input className={inputClassName} disabled={disabled} placeholder="指标名" value={metric.label} onChange={(event) => updateMetric(index, "label", event.target.value)} />
            <input className={inputClassName} disabled={disabled} placeholder="数值" value={metric.value} onChange={(event) => updateMetric(index, "value", event.target.value)} />
            <input className={inputClassName} disabled={disabled} placeholder="单位" value={metric.unit} onChange={(event) => updateMetric(index, "unit", event.target.value)} />
          </div>
        ))}
      </div>

      <Field label="正文">
        <textarea className="min-h-36 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60" disabled={disabled} value={value.content} onChange={(event) => update("content", event.target.value)} />
      </Field>

      <div className="flex justify-end gap-2">
        <Button disabled={disabled} type="button" variant="outline" onClick={() => onChange({ ...emptyCase })}>
          重置
        </Button>
        <Button disabled={disabled} type="button" onClick={onSubmit}>
          保存并同步 GEO
        </Button>
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

type ApiCase = {
  id: string;
  title: string;
  slug: string;
  caseType: keyof typeof apiCaseTypeToUi;
  industry: string | null;
  clientName: string | null;
  clientDisplayName: string | null;
  isAnonymized: boolean;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: CaseMetric[] | null;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  relatedServiceType: string | null;
  status: CaseStatus;
  featured: boolean;
  sortOrder: number;
  publishedAt: string | null;
};

const apiCaseTypeToUi = {
  BENCHMARK: "benchmark",
  GEO_NATIVE: "geo_native",
  AI_UPGRADE: "ai_upgrade",
  KNOWLEDGE_BASE: "knowledge_base"
} as const;

const uiCaseTypeToApi = {
  benchmark: "BENCHMARK",
  geo_native: "GEO_NATIVE",
  ai_upgrade: "AI_UPGRADE",
  knowledge_base: "KNOWLEDGE_BASE"
} as const;

function mapApiCase(item: ApiCase): CaseItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    caseType: apiCaseTypeToUi[item.caseType] ?? "geo_native",
    industry: item.industry ?? "",
    clientName: item.clientName ?? "",
    clientDisplayName: item.clientDisplayName ?? "",
    isAnonymized: item.isAnonymized,
    challenge: item.challenge ?? "",
    solution: item.solution ?? "",
    results: item.results ?? "",
    metrics: normalizeMetrics(item.metrics),
    excerpt: item.excerpt ?? "",
    content: item.content,
    coverImage: item.coverImage ?? "",
    relatedServiceType: item.relatedServiceType ?? "",
    status: item.status,
    featured: item.featured ?? false,
    sortOrder: item.sortOrder,
    publishedAt: item.publishedAt
  };
}

function normalizeMetrics(value: unknown): CaseMetric[] {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const metric = item as Partial<CaseMetric>;
      return {
        label: metric.label ?? "",
        value: metric.value ?? "",
        unit: metric.unit ?? ""
      };
    });
  }
  return [{ label: "AI引用率", value: "", unit: "%" }];
}

function toApiPayload(item: CaseItem) {
  return {
    title: item.title.trim(),
    slug: item.slug.trim(),
    caseType: uiCaseTypeToApi[item.caseType],
    industry: item.industry || undefined,
    clientName: item.clientName || undefined,
    clientDisplayName: item.clientDisplayName || undefined,
    isAnonymized: item.isAnonymized,
    challenge: item.challenge || undefined,
    solution: item.solution || undefined,
    results: item.results || undefined,
    metrics: item.metrics.filter((metric) => metric.label || metric.value),
    excerpt: item.excerpt || undefined,
    content: item.content.trim(),
    coverImage: item.coverImage || undefined,
    relatedServiceType: item.relatedServiceType || undefined,
    status: item.status,
    featured: item.featured,
    sortOrder: item.sortOrder
  };
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClassName = "h-10 rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
const textareaClassName = "min-h-24 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
