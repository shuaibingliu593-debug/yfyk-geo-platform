import { existsSync } from "node:fs";
import { join } from "node:path";

export function resolveStorageDir(envValue: string | undefined, segment: string) {
  const fallback = join(process.cwd(), "storage", segment);
  const configured = envValue?.trim();

  if (!configured) {
    return fallback;
  }

  // .env 中常见的 Docker 路径在本地开发机不存在，自动回退到项目内 storage 目录
  if (configured.startsWith("/app/") && !existsSync("/app")) {
    return fallback;
  }

  return configured;
}
