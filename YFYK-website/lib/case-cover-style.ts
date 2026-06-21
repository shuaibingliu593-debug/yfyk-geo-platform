import type { CSSProperties } from "react";

const CASE_COVER_OVERLAY =
  "linear-gradient(180deg, rgba(2, 6, 23, 0.12), rgba(4, 15, 42, 0.68) 52%, rgba(4, 15, 42, 0.94))";

/** 将后台 coverImage 转为卡片背景样式（叠加暗色渐变以保证文字可读） */
export function caseCoverBackgroundStyle(coverImage?: string | null): CSSProperties | undefined {
  const src = coverImage?.trim();
  if (!src) return undefined;

  return {
    backgroundImage: `${CASE_COVER_OVERLAY}, url("${src}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
}
