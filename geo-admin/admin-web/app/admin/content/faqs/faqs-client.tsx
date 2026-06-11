"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorDrawer } from "@/components/admin/editor-drawer";

type FaqStatus = "draft" | "published" | "archived";
type RelatedServiceType = "geo_native_website" | "ai_friendly_upgrade" | "enterprise_knowledge_base" | "general";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedServiceType: RelatedServiceType;
  status: FaqStatus;
  sortOrder: number;
};

const emptyFaq: FaqItem = {
  id: "",
  question: "",
  answer: "",
  category: "",
  relatedServiceType: "general",
  status: "draft",
  sortOrder: 0
};

const serviceTypeLabels: Record<RelatedServiceType, string> = {
  geo_native_website: "GEO原生建站",
  ai_friendly_upgrade: "老网站AI友好度升级",
  enterprise_knowledge_base: "企业知识库",
  general: "通用"
};

export function FaqsClient() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [editing, setEditing] = useState<FaqItem>({ ...emptyFaq });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadFaqs = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<ApiFaq[]>("/api/faqs");
      setFaqs(data.map(mapApiFaq));
      setStatusText(`已加载 ${data.length} 条 FAQ`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "FAQ 加载失败");
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const categories = useMemo(() => {
    return Array.from(new Set(faqs.map((item) => item.category).filter(Boolean)));
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs
      .filter((item) => {
        const matchesQuery = normalized
          ? [item.question, item.answer, item.category, item.relatedServiceType]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(normalized))
          : true;
        const matchesCategory = category === "all" || item.category === category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [category, faqs, query]);

  function openCreate() {
    setEditing({ ...emptyFaq });
    setIsEditorOpen(true);
  }

  function openEdit(item: FaqItem) {
    setEditing(item);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditing({ ...emptyFaq });
  }

  async function saveFaq() {
    if (!editing.question.trim() || !editing.answer.trim()) {
      toastError("请填写问题和答案");
      return;
    }

    const payload = {
      question: editing.question.trim(),
      answer: editing.answer.trim(),
      category: editing.category || undefined,
      relatedServiceType: editing.relatedServiceType,
      status: editing.status,
      sortOrder: editing.sortOrder
    };
    const isUpdate = Boolean(editing.id);

    setIsBusy(true);
    try {
      const saved = isUpdate
        ? await apiFetch<ApiFaq>(`/api/faqs/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ApiFaq>("/api/faqs", { method: "POST", body: JSON.stringify(payload) });

      setFaqs((items) => {
        const mapped = mapApiFaq(saved);
        const exists = items.some((item) => item.id === mapped.id);
        return exists ? items.map((item) => (item.id === mapped.id ? mapped : item)) : [mapped, ...items];
      });
      closeEditor();
      toastSuccess(isUpdate ? "FAQ 已更新" : "FAQ 已创建");
      await loadFaqs();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function removeFaq(id: string) {
    setIsBusy(true);
    try {
      await apiFetch(`/api/faqs/${id}`, { method: "DELETE" });
      setFaqs((items) => items.filter((item) => item.id !== id));
      if (editing.id === id) {
        closeEditor();
      }
      toastSuccess("FAQ 已删除");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "删除失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function setFaqStatus(item: FaqItem, status: FaqStatus) {
    setIsBusy(true);
    try {
      let saved: ApiFaq;
      if (status === "published") {
        saved = await apiFetch<ApiFaq>(`/api/faqs/${item.id}/publish`, { method: "PATCH" });
      } else if (status === "draft") {
        saved = await apiFetch<ApiFaq>(`/api/faqs/${item.id}/offline`, { method: "PATCH" });
      } else {
        saved = await apiFetch<ApiFaq>(`/api/faqs/${item.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "archived" })
        });
      }
      setFaqs((items) => items.map((current) => (current.id === item.id ? mapApiFaq(saved) : current)));
      toastSuccess(status === "published" ? "FAQ 已发布" : status === "draft" ? "FAQ 已下线" : "FAQ 已归档");
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
              <CardTitle>FAQ列表</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                FAQ 创建或更新后自动同步 geo_configs，可按分类和服务公开查询。写作规范见 shared/faq-content-guidelines.ts，批量验收运行 npm run check:faq-content。
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
            </div>
            <Button disabled={isBusy} onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新增FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClassName + " pl-9"}
                placeholder="搜索问题、答案、分类、关联服务"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select className={inputClassName} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部分类</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <section className="col-span-12 grid content-start gap-4">
        {filteredFaqs.length === 0 ? (
          <Card className="self-start">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">暂无 FAQ，点击「新增FAQ」创建。</CardContent>
          </Card>
        ) : null}
        {filteredFaqs.map((item) => (
          <Card key={item.id} className="self-start">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold">{item.question}</h2>
                    <Badge tone={item.status === "published" ? "success" : "neutral"}>
                      {item.status === "published" ? "已发布" : item.status === "archived" ? "已归档" : "草稿"}
                    </Badge>
                    <Badge tone="default">#{item.sortOrder}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.category ? <Badge tone="neutral">{item.category}</Badge> : null}
                    <Badge tone="neutral">{serviceTypeLabels[item.relatedServiceType]}</Badge>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button disabled={isBusy} variant="outline" onClick={() => openEdit(item)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                  {item.status === "published" ? (
                    <Button disabled={isBusy} variant="outline" onClick={() => setFaqStatus(item, "draft")}>
                      下线
                    </Button>
                  ) : (
                    <Button disabled={isBusy} variant="outline" onClick={() => setFaqStatus(item, "published")}>
                      发布
                    </Button>
                  )}
                  <Button disabled={isBusy} variant="ghost" onClick={() => removeFaq(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <EditorDrawer open={isEditorOpen} title={editing.id ? "编辑FAQ" : "新增FAQ"} onClose={closeEditor}>
        <FaqForm disabled={isBusy} value={editing} onChange={setEditing} onSubmit={saveFaq} />
      </EditorDrawer>
    </div>
  );
}

function FaqForm({
  value,
  onChange,
  onSubmit,
  disabled
}: {
  value: FaqItem;
  onChange: (value: FaqItem) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  function update<K extends keyof FaqItem>(key: K, nextValue: FaqItem[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <div className="grid gap-4">
      <Field label="问题">
        <input className={inputClassName} disabled={disabled} value={value.question} onChange={(event) => update("question", event.target.value)} />
      </Field>
      <Field label="答案">
        <textarea className={textareaClassName} disabled={disabled} value={value.answer} onChange={(event) => update("answer", event.target.value)} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="分类">
          <input className={inputClassName} disabled={disabled} value={value.category} onChange={(event) => update("category", event.target.value)} />
        </Field>
        <Field label="排序">
          <input
            className={inputClassName}
            disabled={disabled}
            type="number"
            value={value.sortOrder}
            onChange={(event) => update("sortOrder", Number(event.target.value))}
          />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="关联服务类型">
          <select
            className={inputClassName}
            disabled={disabled}
            value={value.relatedServiceType}
            onChange={(event) => update("relatedServiceType", event.target.value as RelatedServiceType)}
          >
            {Object.entries(serviceTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="状态">
          <select className={inputClassName} disabled={disabled} value={value.status} onChange={(event) => update("status", event.target.value as FaqStatus)}>
            <option value="draft">草稿/下线</option>
            <option value="published">发布</option>
            <option value="archived">归档</option>
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button disabled={disabled} variant="outline" onClick={() => onChange({ ...emptyFaq })}>
          重置
        </Button>
        <Button disabled={disabled} onClick={onSubmit}>
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

type ApiFaq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  relatedServiceType: keyof typeof apiServiceTypeToUi;
  status: keyof typeof apiStatusToUi;
  sortOrder: number;
};

function mapApiFaq(item: ApiFaq): FaqItem {
  return {
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category ?? "",
    relatedServiceType: apiServiceTypeToUi[item.relatedServiceType] ?? "general",
    status: apiStatusToUi[item.status] ?? "draft",
    sortOrder: item.sortOrder
  };
}

const apiStatusToUi = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
} as const;

const apiServiceTypeToUi = {
  GEO_NATIVE_WEBSITE: "geo_native_website",
  AI_FRIENDLY_UPGRADE: "ai_friendly_upgrade",
  ENTERPRISE_KNOWLEDGE_BASE: "enterprise_knowledge_base",
  GENERAL: "general"
} as const;

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
const textareaClassName = "min-h-28 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
