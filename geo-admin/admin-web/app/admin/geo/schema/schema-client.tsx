"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Code2, Gauge, Save, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { EditorDrawer } from "@/components/admin/editor-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TargetType = "STATIC_RESOURCE" | "CASE" | "FAQ" | "NEWS";

type SchemaConfig = {
  id: string;
  targetType: TargetType;
  targetId: string;
  targetTitle: string;
  targetUrl: string | null;
  schemaType: string;
  schemaJsonText: string;
  schemaEnabled: boolean;
  lastScore?: number;
};

const supportedSchemaTypes = [
  "Organization",
  "WebPage",
  "Service",
  "Article",
  "NewsArticle",
  "FAQPage",
  "DefinedTerm",
  "CreativeWork",
  "Product",
  "LocalBusiness"
];

const recommendedSchemaTypes = ["CollectionPage", "DefinedTermSet", "ContactPage"];

const targetLabels: Record<TargetType, string> = {
  STATIC_RESOURCE: "静态资源",
  CASE: "案例",
  FAQ: "FAQ",
  NEWS: "资讯"
};

export function SchemaClient() {
  const [configs, setConfigs] = useState<SchemaConfig[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [targetType, setTargetType] = useState<"all" | TargetType>("all");
  const [schemaTypeFilter, setSchemaTypeFilter] = useState("all");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);

  const loadConfigs = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<ApiSchemaConfig[]>("/api/geo/schema-configs");
      const nextConfigs = data.map(mapApiSchemaConfig);
      setConfigs(nextConfigs);
      setStatusText(`已加载 ${nextConfigs.length} 条 Schema 配置`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "Schema 配置加载失败");
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const activeConfig = configs.find((item) => item.id === activeId);
  const validation = validateSchema(activeConfig?.schemaJsonText ?? "");

  const filteredConfigs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return configs.filter((item) => {
      const matchesQuery = normalized
        ? [item.targetTitle, item.targetUrl, item.schemaType, item.targetId].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized))
        : true;
      const matchesTarget = targetType === "all" || item.targetType === targetType;
      const matchesSchema = schemaTypeFilter === "all" || item.schemaType === schemaTypeFilter;

      return matchesQuery && matchesTarget && matchesSchema;
    });
  }, [configs, query, schemaTypeFilter, targetType]);

  function openEditor(id: string) {
    setActiveId(id);
    setIsDrawerOpen(true);
  }

  function closeEditor() {
    setIsDrawerOpen(false);
    setActiveId("");
  }

  function updateActive(next: Partial<SchemaConfig>) {
    if (!activeConfig) {
      return;
    }
    setConfigs((items) => items.map((item) => (item.id === activeConfig.id ? { ...item, ...next } : item)));
    setStatusText("有未保存修改");
  }

  async function save() {
    if (!activeConfig) {
      toastError("请先选择 Schema 配置");
      return;
    }

    const current = configs.find((item) => item.id === activeConfig.id) ?? activeConfig;
    const result = validateSchema(current.schemaJsonText);

    if (current.schemaEnabled && !result.valid) {
      toastError("JSON 格式错误，禁止保存");
      setStatusText("JSON格式错误，禁止保存");
      return;
    }

    setIsBusy(true);
    try {
      await apiFetch(`/api/geo/configs/${current.id}/schema`, {
        method: "PATCH",
        body: JSON.stringify({
          schemaType: current.schemaEnabled ? current.schemaType : null,
          schemaJson: current.schemaEnabled ? result.value : null
        })
      });
      setStatusText("已保存到 geo_configs.schema_json");
      toastSuccess("Schema 已保存");
    } catch (error) {
      setStatusText("保存失败");
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function rescore() {
    if (!activeConfig) {
      toastError("请先选择 Schema 配置");
      return;
    }

    setIsBusy(true);
    try {
      const data = await apiFetch<{ geoCheck?: { score: number } }>(`/api/geo/configs/${activeConfig.id}/rescore`, {
        method: "POST"
      });
      const nextScore = data.geoCheck?.score;
      if (typeof nextScore !== "number") {
        throw new Error("评分结果无效");
      }
      updateActive({ lastScore: nextScore });
      setStatusText(`GEO评分已更新：${nextScore}`);
      toastSuccess(`GEO评分已更新：${nextScore}`);
    } catch (error) {
      setStatusText("重新评分失败");
      toastError(error instanceof Error ? error.message : "重新评分失败");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="admin-grid">
      <Card className="col-span-12">
        <CardHeader>
          <div>
            <CardTitle>Schema列表</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Schema 统一存储在 geo_configs.schema_json。</p>
            <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_200px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClassName + " pl-9"}
                placeholder="搜索对象、URL、Schema类型"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select className={inputClassName} value={targetType} onChange={(event) => setTargetType(event.target.value as "all" | TargetType)}>
              <option value="all">全部对象类型</option>
              {Object.entries(targetLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select className={inputClassName} value={schemaTypeFilter} onChange={(event) => setSchemaTypeFilter(event.target.value)}>
              <option value="all">全部Schema类型</option>
              {[...supportedSchemaTypes, ...recommendedSchemaTypes].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <section className="col-span-12 grid gap-4">
        {isBusy && configs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">正在加载 Schema 配置...</CardContent>
          </Card>
        ) : filteredConfigs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {configs.length === 0 ? "暂无 Schema 配置，请先创建内容或执行 seed。" : "没有匹配的 Schema 配置。"}
            </CardContent>
          </Card>
        ) : (
          filteredConfigs.map((item) => (
            <button
              key={item.id}
              className={
                "rounded-lg border p-4 text-left transition-colors " +
                (item.id === activeId && isDrawerOpen
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/80 bg-white hover:bg-muted")
              }
              type="button"
              onClick={() => openEditor(item.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold">{item.targetTitle}</p>
                <Badge tone={item.schemaEnabled ? "success" : "neutral"}>{item.schemaEnabled ? "启用" : "禁用"}</Badge>
              </div>
              <p className="mt-2 truncate text-xs opacity-70">
                {targetLabels[item.targetType]} · {item.schemaType || "未设置"}
              </p>
              {item.targetUrl ? <p className="mt-2 truncate text-xs opacity-70">{item.targetUrl}</p> : null}
            </button>
          ))
        )}
      </section>

      <EditorDrawer
        className="max-w-2xl"
        open={isDrawerOpen && Boolean(activeConfig)}
        title={activeConfig?.targetTitle ?? "编辑 Schema"}
        onClose={closeEditor}
      >
        {activeConfig ? (
          <div className="grid min-w-0 gap-6">
            <div className="flex flex-wrap gap-2">
              <Badge tone={validation.valid ? "success" : "warning"}>{validation.valid ? "JSON有效" : "JSON错误"}</Badge>
              <Badge tone={validation.hasContext ? "success" : "warning"}>@context</Badge>
              <Badge tone={validation.hasType ? "success" : "warning"}>@type</Badge>
              {activeConfig.lastScore ? <Badge tone="neutral">GEO评分 {activeConfig.lastScore}</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {targetLabels[activeConfig.targetType]} · {getRecommendation(activeConfig)}
            </p>

            <div className="grid min-w-0 gap-5">
              <div className="grid min-w-0 gap-4">
                <Field label="Schema类型">
                  <select className={inputClassName} value={activeConfig.schemaType} onChange={(event) => updateActive({ schemaType: event.target.value })}>
                    {[...supportedSchemaTypes, ...recommendedSchemaTypes].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="flex items-end">
                  <span className="flex h-10 w-full items-center justify-between rounded-md border border-border/80 px-3 text-sm">
                    Schema启用
                    <input
                      checked={activeConfig.schemaEnabled}
                      className="h-4 w-4"
                      type="checkbox"
                      onChange={(event) => updateActive({ schemaEnabled: event.target.checked })}
                    />
                  </span>
                </label>
              </div>

              <Field label="Schema JSON">
                <div className="relative min-w-0">
                  <Code2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    className="min-h-80 w-full min-w-0 resize-y overflow-x-hidden whitespace-pre-wrap break-all rounded-md border border-border bg-white py-2 pl-9 pr-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/20"
                    disabled={!activeConfig.schemaEnabled}
                    value={activeConfig.schemaJsonText}
                    onChange={(event) => updateActive({ schemaJsonText: event.target.value })}
                  />
                </div>
              </Field>

              {validation.error ? (
                <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  {validation.error}
                </div>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2">
                <Button disabled={isBusy} variant="outline" onClick={rescore}>
                  <Gauge className="mr-2 h-4 w-4" />
                  重新评分
                </Button>
                <Button disabled={isBusy} onClick={save}>
                  <Save className="mr-2 h-4 w-4" />
                  保存Schema
                </Button>
              </div>
            </div>

            <div className="min-w-0 border-t border-border/80 pt-6">
              <h3 className="text-sm font-semibold">JSON-LD实时预览</h3>
              <div className="mb-3 mt-3 flex flex-wrap gap-2">
                <CheckItem checked={activeConfig.schemaEnabled} label="Schema启用" />
                <CheckItem checked={validation.valid} label="JSON格式" />
                <CheckItem checked={validation.hasContext} label="@context存在" />
                <CheckItem checked={validation.hasType} label="@type存在" />
              </div>
              <pre className="max-h-96 overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted/50 p-4 text-xs leading-6">
                {activeConfig.schemaEnabled && validation.valid
                  ? `<script type="application/ld+json">\n${JSON.stringify(validation.value, null, 2)}\n</script>`
                  : "Schema 已禁用或 JSON 无效。"}
              </pre>
            </div>
          </div>
        ) : null}
      </EditorDrawer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="min-w-0">{children}</div>
    </label>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <Badge tone={checked ? "success" : "warning"}>
      {checked ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  );
}

function validateSchema(value: string) {
  if (!value.trim()) {
    return { valid: true, value: null, hasContext: false, hasType: false, error: "" };
  }

  try {
    const parsed = JSON.parse(value);
    const isObject = parsed && typeof parsed === "object" && !Array.isArray(parsed);
    return {
      valid: true,
      value: parsed,
      hasContext: isObject && "@context" in parsed,
      hasType: isObject && "@type" in parsed,
      error: ""
    };
  } catch (error) {
    return {
      valid: false,
      value: null,
      hasContext: false,
      hasType: false,
      error: error instanceof Error ? error.message : "JSON格式错误"
    };
  }
}

function getRecommendation(config: SchemaConfig) {
  if (config.targetType === "FAQ") return "推荐 FAQPage";
  if (config.targetType === "NEWS") return "推荐 NewsArticle";
  if (config.targetType === "CASE") return "推荐 CreativeWork 或 Article";
  if (config.targetTitle.includes("首页")) return "推荐 Organization 或 WebPage";
  if (config.targetTitle.includes("知识库")) return "推荐 CollectionPage 或 WebPage";
  if (config.targetTitle.includes("术语表")) return "推荐 DefinedTermSet 或 WebPage";
  if (config.targetTitle.includes("公司简介")) return "推荐 Organization";
  if (config.targetTitle.includes("联系")) return "推荐 ContactPage 或 LocalBusiness";
  return "服务页推荐 Service";
}

type ApiSchemaConfig = {
  id: string;
  targetType: TargetType;
  targetId: string;
  schemaType: string | null;
  schemaJson: unknown;
  schemaEnabled: boolean;
  target?: {
    title: string;
    url: string | null;
  };
  geoChecks?: Array<{ score: number }>;
};

function mapApiSchemaConfig(item: ApiSchemaConfig): SchemaConfig {
  return {
    id: item.id,
    targetType: item.targetType,
    targetId: item.targetId,
    targetTitle: item.target?.title ?? item.targetId,
    targetUrl: item.target?.url ?? null,
    schemaType: item.schemaType ?? "WebPage",
    schemaEnabled: item.schemaEnabled,
    schemaJsonText: item.schemaJson ? JSON.stringify(item.schemaJson, null, 2) : "",
    lastScore: item.geoChecks?.[0]?.score
  };
}

const inputClassName = "h-10 w-full min-w-0 rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";
