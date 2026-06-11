"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Settings2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SettingsForm = {
  siteName: string;
  siteUrl: string;
  companyName: string;
  defaultLanguage: string;
  logoUrl: string;
  crawlWeight: number;
  understandingWeight: number;
  structureWeight: number;
};

const initialForm: SettingsForm = {
  siteName: "",
  siteUrl: "",
  companyName: "",
  defaultLanguage: "zh-CN",
  logoUrl: "",
  crawlWeight: 30,
  understandingWeight: 30,
  structureWeight: 40
};

export function SettingsClient() {
  const [form, setForm] = useState<SettingsForm>(initialForm);
  const [statusText, setStatusText] = useState("等待加载");
  const [isBusy, setIsBusy] = useState(false);

  const weightTotal = useMemo(() => form.crawlWeight + form.understandingWeight + form.structureWeight, [form]);
  const canSave = weightTotal === 100 && !isBusy;

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsBusy(true);
    try {
      const data = await apiFetch<SettingsResponse>("/api/v1/admin/settings");
      setForm({
        siteName: data.website.siteName ?? "",
        siteUrl: data.website.siteUrl ?? "",
        companyName: data.website.companyName ?? "",
        defaultLanguage: data.website.defaultLanguage ?? "zh-CN",
        logoUrl: data.website.logoUrl ?? "",
        crawlWeight: data.scoring.crawlWeight ?? 30,
        understandingWeight: data.scoring.understandingWeight ?? 30,
        structureWeight: data.scoring.structureWeight ?? 40
      });
      setStatusText("设置已加载");
    } catch (error) {
      setStatusText("设置加载失败");
      toastError(error instanceof Error ? error.message : "设置加载失败");
    } finally {
      setIsBusy(false);
    }
  }

  async function saveSettings() {
    if (weightTotal !== 100) {
      toastError("评分权重总和必须等于100");
      setStatusText("评分权重总和必须等于100");
      return;
    }

    setIsBusy(true);
    try {
      await apiFetch("/api/v1/admin/settings", {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setStatusText("设置已保存；修改评分权重后请在评分中心重新评分");
      toastSuccess("系统设置已保存");
    } catch (error) {
      setStatusText("保存失败");
      toastError(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsBusy(false);
    }
  }

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="admin-grid">
      <Card className="col-span-12">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={weightTotal === 100 ? "success" : "warning"}>权重总和 {weightTotal}</Badge>
              <span className="text-xs text-muted-foreground">{statusText}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">系统设置仅 super_admin 可修改，后台管理接口继续走 JWT。</p>
          </div>
          <Button disabled={!canSave} onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            保存设置
          </Button>
        </CardContent>
      </Card>

      <Card className="col-span-12 xl:col-span-7">
        <CardHeader>
          <CardTitle>网站设置</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="网站名称">
            <input className={inputClassName} value={form.siteName} onChange={(event) => update("siteName", event.target.value)} />
          </Field>
          <Field label="网站URL">
            <input className={inputClassName} value={form.siteUrl} onChange={(event) => update("siteUrl", event.target.value)} placeholder="https://www.yfyk.com" />
          </Field>
          <Field label="公司名称">
            <input className={inputClassName} value={form.companyName} onChange={(event) => update("companyName", event.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="默认语言">
              <input className={inputClassName} value={form.defaultLanguage} onChange={(event) => update("defaultLanguage", event.target.value)} />
            </Field>
            <Field label="Logo URL">
              <input className={inputClassName} value={form.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-12 xl:col-span-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>评分权重</CardTitle>
            <Settings2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <WeightField label="AI可抓取性" value={form.crawlWeight} onChange={(value) => update("crawlWeight", value)} />
          <WeightField label="AI可理解性" value={form.understandingWeight} onChange={(value) => update("understandingWeight", value)} />
          <WeightField label="结构化程度" value={form.structureWeight} onChange={(value) => update("structureWeight", value)} />
          <div className="rounded-md border border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            修改权重保存后，在 GEO评分中心执行重新评分即可生效。
          </div>
        </CardContent>
      </Card>
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

function WeightField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <input className="w-full accent-foreground" max={100} min={0} step={1} type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <input className={inputClassName} type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

type SettingsResponse = {
  website: {
    siteName?: string;
    siteUrl?: string;
    companyName?: string;
    defaultLanguage?: string;
    logoUrl?: string;
  };
  scoring: {
    crawlWeight?: number;
    understandingWeight?: number;
    structureWeight?: number;
  };
};

const inputClassName = "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20";
