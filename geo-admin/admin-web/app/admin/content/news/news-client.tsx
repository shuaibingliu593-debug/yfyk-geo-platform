"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Plus, Search, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { EditorDrawer } from "@/components/admin/editor-drawer";

type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  source: string;
  author: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: string;
  status: NewsStatus;
  sortOrder: number;
  publishedAt: string | null;
};

const emptyNews: NewsItem = {
  id: "",
  title: "",
  slug: "",
  category: "",
  source: "",
  author: "",
  excerpt: "",
  content: "",
  coverImage: "",
  publishDate: "",
  status: "DRAFT",
  sortOrder: 0,
  publishedAt: null
};

export function NewsClient() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem>({ ...emptyNews });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | NewsStatus>("all");
  const [statusText, setStatusText] = useState("加载中...");
  const [isBusy, setIsBusy] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadNews = useCallback(async () => {
    setIsBusy(true);
    try {
      const data = await apiFetch<ApiNews[]>("/api/news");
      setItems(data.map(mapApiNews));
      setStatusText(`已加载 ${data.length} 条资讯`);
    } catch (error) {
      setStatusText("加载失败");
      toastError(error instanceof Error ? error.message : "资讯加载失败");
    } finally {
      setIsBusy(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category).filter(Boolean))), [items]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesQuery = normalized
          ? [item.title, item.slug, item.category, item.source, item.author, item.excerpt]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(normalized))
          : true;
        const matchesCategory = category === "all" || item.category === category;
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [category, items, query, statusFilter]);

  function openCreate() {
    setEditing({ ...emptyNews });
    setIsEditorOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditing({ ...item });
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditing({ ...emptyNews });
  }

  async function saveNews() {
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
        ? await apiFetch<ApiNews>(`/api/news/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ApiNews>("/api/news", { method: "POST", body: JSON.stringify(payload) });

      setItems((current) => {
        const mapped = mapApiNews(saved);
        const exists = current.some((item) => item.id === mapped.id);
        return exists ? current.map((item) => (item.id === mapped.id ? mapped : item)) : [mapped, ...current];
      });
      closeEditor();
      toastSuccess(isUpdate ? "资讯已更新" : "资讯已创建");
      await loadNews();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function removeNews(item: NewsItem) {
    const confirmed = window.confirm("确定删除这篇资讯吗？删除后官网将不再展示该内容。");
    if (!confirmed) return;

    setIsBusy(true);
    try {
      await apiFetch(`/api/news/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (editing.id === item.id) {
        closeEditor();
      }
      toastSuccess("资讯已删除");
      await loadNews();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "删除失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function setNewsStatus(item: NewsItem, nextStatus: NewsStatus) {
    setIsBusy(true);
    try {
      let saved: ApiNews;
      if (nextStatus === "PUBLISHED") {
        saved = await apiFetch<ApiNews>(`/api/news/${item.id}/publish`, { method: "PATCH" });
      } else if (nextStatus === "DRAFT") {
        saved = await apiFetch<ApiNews>(`/api/news/${item.id}/offline`, { method: "PATCH" });
      } else {
        saved = await apiFetch<ApiNews>(`/api/news/${item.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ARCHIVED" })
        });
      }
      setItems((current) => current.map((news) => (news.id === item.id ? mapApiNews(saved) : news)));
      toastSuccess(nextStatus === "PUBLISHED" ? "资讯已发布" : nextStatus === "DRAFT" ? "资讯已下线" : "资讯已归档");
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
              <CardTitle>资讯动态列表</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">资讯是可选内容模块，创建或更新后自动同步 geo_configs。</p>
              <p className="mt-1 text-xs text-muted-foreground">{statusText}</p>
            </div>
            <Button disabled={isBusy} onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新增资讯
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClassName + " pl-9"}
                placeholder="搜索标题、slug、分类、来源、作者"
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
            <select
              className={inputClassName}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | NewsStatus)}
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
        {filteredItems.length === 0 ? (
          <Card className="self-start">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">暂无资讯，点击「新增资讯」创建。</CardContent>
          </Card>
        ) : null}
        {filteredItems.map((item) => (
          <Card key={item.id} className="self-start overflow-visible">
            <CardContent className="overflow-visible p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <Badge tone={item.status === "PUBLISHED" ? "success" : "neutral"}>
                    {newsStatusLabel(item.status)}
                  </Badge>
                  <Badge tone="default">#{item.sortOrder}</Badge>
                </div>
                <NewsItemActions
                  disabled={isBusy}
                  item={item}
                  onEdit={openEdit}
                  onRemove={removeNews}
                  onStatusChange={setNewsStatus}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">/news/{item.slug}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.excerpt || "暂无摘要"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.category ? <Badge tone="neutral">{item.category}</Badge> : null}
                {item.source ? <Badge tone="neutral">{item.source}</Badge> : null}
                {item.author ? <Badge tone="neutral">{item.author}</Badge> : null}
                {item.publishDate ? (
                  <Badge tone="neutral">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {item.publishDate}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <EditorDrawer open={isEditorOpen} title={editing.id ? "编辑资讯" : "新增资讯"} onClose={closeEditor}>
        <NewsForm
          disabled={isBusy}
          value={editing}
          onChange={setEditing}
          onSubmit={saveNews}
          onDelete={editing.id ? () => removeNews(editing) : undefined}
        />
      </EditorDrawer>
    </div>
  );
}

function NewsItemActions({
  item,
  disabled,
  onEdit,
  onRemove,
  onStatusChange
}: {
  item: NewsItem;
  disabled?: boolean;
  onEdit: (item: NewsItem) => void;
  onRemove: (item: NewsItem) => void;
  onStatusChange: (item: NewsItem, nextStatus: NewsStatus) => void;
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <Button disabled={disabled} variant="outline" onClick={() => onEdit(item)}>
        <Edit3 className="mr-2 h-4 w-4" />
        编辑
      </Button>
      {item.status === "PUBLISHED" ? (
        <Button disabled={disabled} variant="outline" onClick={() => onStatusChange(item, "DRAFT")}>
          下线
        </Button>
      ) : (
        <Button disabled={disabled} variant="outline" onClick={() => onStatusChange(item, "PUBLISHED")}>
          {item.status === "ARCHIVED" ? "重新发布" : "发布"}
        </Button>
      )}
      <Button disabled={disabled} variant="outline" onClick={() => onRemove(item)}>
        <Trash2 className="mr-2 h-4 w-4" />
        删除
      </Button>
    </div>
  );
}

function NewsForm({
  value,
  onChange,
  onSubmit,
  onDelete,
  disabled
}: {
  value: NewsItem;
  onChange: (value: NewsItem) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}) {
  function update<K extends keyof NewsItem>(key: K, nextValue: NewsItem[K]) {
    onChange({ ...value, [key]: nextValue });
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
        <Field label="分类">
          <input className={inputClassName} disabled={disabled} value={value.category} onChange={(event) => update("category", event.target.value)} />
        </Field>
        <Field label="来源">
          <input className={inputClassName} disabled={disabled} value={value.source} onChange={(event) => update("source", event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="作者">
          <input className={inputClassName} disabled={disabled} value={value.author} onChange={(event) => update("author", event.target.value)} />
        </Field>
        <Field label="发布日期">
          <input className={inputClassName} disabled={disabled} type="date" value={value.publishDate} onChange={(event) => update("publishDate", event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="状态">
          <select className={inputClassName} disabled={disabled} value={value.status} onChange={(event) => update("status", event.target.value as NewsStatus)}>
            <option value="DRAFT">草稿/下线</option>
            <option value="PUBLISHED">发布</option>
            <option value="ARCHIVED">归档</option>
          </select>
        </Field>
        <Field label="排序">
          <input className={inputClassName} disabled={disabled} type="number" value={value.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} />
        </Field>
      </div>
      <CoverImageField disabled={disabled} value={value.coverImage} onChange={(nextValue) => update("coverImage", nextValue)} />
      <Field label="摘要">
        <textarea className={textareaClassName} disabled={disabled} value={value.excerpt} onChange={(event) => update("excerpt", event.target.value)} />
      </Field>
      <Field label="正文">
        <textarea className="min-h-40 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60" disabled={disabled} value={value.content} onChange={(event) => update("content", event.target.value)} />
      </Field>
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {onDelete ? (
            <Button disabled={disabled} variant="outline" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={disabled} variant="outline" onClick={() => onChange({ ...emptyNews })}>
            重置
          </Button>
          <Button disabled={disabled} onClick={onSubmit}>
            保存并同步 GEO
          </Button>
        </div>
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

type ApiNews = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  source: string | null;
  author: string | null;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishDate: string | null;
  status: NewsStatus;
  sortOrder: number;
  publishedAt: string | null;
};

function newsStatusLabel(status: NewsStatus) {
  if (status === "PUBLISHED") return "已发布";
  if (status === "ARCHIVED") return "已归档";
  return "草稿/下线";
}

function mapApiNews(item: ApiNews): NewsItem {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category ?? "",
    source: item.source ?? "",
    author: item.author ?? "",
    excerpt: item.excerpt ?? "",
    content: item.content,
    coverImage: item.coverImage ?? "",
    publishDate: item.publishDate ? item.publishDate.slice(0, 10) : "",
    status: item.status,
    sortOrder: item.sortOrder,
    publishedAt: item.publishedAt
  };
}

function toApiPayload(item: NewsItem) {
  return {
    title: item.title.trim(),
    slug: item.slug.trim(),
    category: item.category || undefined,
    source: item.source || undefined,
    author: item.author || undefined,
    excerpt: item.excerpt || undefined,
    content: item.content.trim(),
    coverImage: item.coverImage || undefined,
    publishDate: item.publishDate || undefined,
    status: item.status,
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

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
const textareaClassName = "min-h-28 rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";
