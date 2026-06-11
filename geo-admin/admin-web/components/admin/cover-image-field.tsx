"use client";

import { ImagePlus, X } from "lucide-react";
import { toastError } from "@/lib/toast";
import { Button } from "@/components/ui/button";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE_LABEL = "2MB";
const ACCEPT_WITH_GIF = "image/jpeg,image/png,image/webp,image/gif,.gif";
const ACCEPT_WITHOUT_GIF = "image/jpeg,image/png,image/webp";

const inputClassName =
  "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";

function isAllowedImage(file: File, allowGif: boolean) {
  if (file.type === "image/gif") {
    return allowGif;
  }

  if (file.type.startsWith("image/")) {
    return true;
  }

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (allowGif && extension === ".gif") {
    return true;
  }

  return false;
}

export function CoverImageField({
  value,
  onChange,
  disabled,
  label = "封面图",
  allowGif = false
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  allowGif?: boolean;
}) {
  const accept = allowGif ? ACCEPT_WITH_GIF : ACCEPT_WITHOUT_GIF;
  const formatHint = allowGif ? "JPG、PNG、WebP、GIF" : "JPG、PNG、WebP";

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isAllowedImage(file, allowGif)) {
      toastError(allowGif ? "请选择 JPG、PNG、WebP 或 GIF 图片" : "请选择 JPG、PNG 或 WebP 图片");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toastError(`图片大小不能超过 ${MAX_IMAGE_SIZE_LABEL}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.onerror = () => toastError("图片读取失败");
    reader.readAsDataURL(file);
  }

  return (
    <label className="grid gap-2">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">支持 {formatHint}，单张不超过 {MAX_IMAGE_SIZE_LABEL}</span>
      </div>
      <div className="grid gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className={inputClassName + " sm:flex-1"}
            disabled={disabled}
            placeholder="图片 URL，或点击右侧上传本地图片"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <label className="inline-flex">
            <input accept={accept} className="sr-only" disabled={disabled} type="file" onChange={handleFileChange} />
            <span className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
              <ImagePlus className="mr-2 h-4 w-4" />
              上传图片
            </span>
          </label>
        </div>
        {value ? (
          <div className="relative overflow-hidden rounded-md border border-border/80">
            <img alt="封面预览" className="h-36 w-full object-cover" src={value} />
            <Button
              className="absolute right-2 top-2 h-8 w-8 bg-white/90 p-0 hover:bg-white"
              disabled={disabled}
              type="button"
              variant="outline"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border/80 bg-muted/20 text-sm text-muted-foreground transition hover:bg-muted/40">
            <input accept={accept} className="sr-only" disabled={disabled} type="file" onChange={handleFileChange} />
            <ImagePlus className="mb-2 h-6 w-6" />
            <span>点击上传封面图，或填写上方图片 URL</span>
            <span className="mt-1 text-xs">单张不超过 {MAX_IMAGE_SIZE_LABEL}</span>
          </label>
        )}
      </div>
    </label>
  );
}
