import { clearAuthSession, getToken, isTokenExpired } from "./auth";

function resolveApiBaseUrl(): string {
  // 浏览器端始终走同源 /api 代理（next.config rewrites），
  // 避免 NEXT_PUBLIC_API_BASE_URL 导致跨域、localhost/127.0.0.1 不一致、登录校验挂起等问题
  if (typeof window !== "undefined") {
    return "";
  }
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  const serverOrigin =
    process.env.API_INTERNAL_BASE_URL?.trim() ?? process.env.API_PROXY_TARGET?.trim() ?? "http://localhost:3001";
  return serverOrigin.replace(/\/$/, "");
}

export const apiBaseUrl = resolveApiBaseUrl();

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  skipAuthRedirect?: boolean;
};

let isRedirectingToLogin = false;

export function parseApiErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }
  const record = data as { message?: string | string[]; error?: string };
  if (Array.isArray(record.message)) {
    return record.message.join("；");
  }
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }
  if (typeof record.error === "string" && record.error.trim()) {
    return record.error;
  }
  return fallback;
}

export function handleUnauthorized() {
  if (isRedirectingToLogin || typeof window === "undefined") {
    return;
  }
  isRedirectingToLogin = true;
  clearAuthSession();
  window.location.replace("/");
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, skipAuthRedirect = false, headers, ...rest } = options;
  const nextHeaders = new Headers(headers);

  if (auth) {
    const token = getToken();
    if (!token) {
      if (!skipAuthRedirect) {
        handleUnauthorized();
      }
      throw new ApiError("未登录", 401);
    }
    if (isTokenExpired(token)) {
      if (!skipAuthRedirect) {
        handleUnauthorized();
      }
      throw new ApiError("登录已过期", 401);
    }
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (rest.body && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...rest,
      headers: nextHeaders
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError("无法连接 API 服务，请确认 api-server 已启动", 0);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (response.status === 401 || response.status === 403) {
    const message = parseApiErrorMessage(data, response.status === 403 ? "没有权限执行此操作" : "登录已失效，请重新登录");
    if (!skipAuthRedirect) {
      handleUnauthorized();
    }
    throw new ApiError(message, response.status);
  }

  if (!response.ok) {
    throw new ApiError(parseApiErrorMessage(data, `请求失败 (${response.status})`), response.status);
  }

  return data as T;
}

export async function apiFetchPublic<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  return apiFetch<T>(path, { ...options, auth: false, skipAuthRedirect: true });
}
