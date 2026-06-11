"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { clearAuthSession, getToken, isTokenExpired } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type AuthStatus = "checking" | "authenticated" | "error";

const VERIFY_TIMEOUT_MS = 5000;

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const verifyGenerationRef = useRef(0);

  useEffect(() => {
    const generation = ++verifyGenerationRef.current;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, VERIFY_TIMEOUT_MS);

    const isActive = () => verifyGenerationRef.current === generation;

    async function verifySession() {
      const token = getToken();

      if (!token || isTokenExpired(token)) {
        clearAuthSession();
        window.location.replace("/");
        return;
      }

      try {
        await apiFetch("/api/auth/me", {
          auth: true,
          skipAuthRedirect: true,
          signal: controller.signal
        });

        if (isActive()) {
          setStatus("authenticated");
        }
      } catch (error) {
        if (!isActive()) {
          return;
        }

        clearAuthSession();

        if (
          (error instanceof DOMException && error.name === "AbortError") ||
          (error instanceof ApiError && error.status === 0)
        ) {
          setStatus("error");
          return;
        }

        window.location.replace("/");
      } finally {
        if (isActive()) {
          window.clearTimeout(timeoutId);
        }
      }
    }

    void verifySession();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
    // 仅在 Guard 挂载时校验一次，后台内部路由切换不重复阻塞
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 兜底：校验请求异常挂起时，避免无限停留在 loading
  useEffect(() => {
    const fallbackId = window.setTimeout(() => {
      setStatus((current) => (current === "checking" ? "error" : current));
    }, VERIFY_TIMEOUT_MS + 2000);

    return () => window.clearTimeout(fallbackId);
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-lg border border-border/80 bg-white px-6 py-4 text-sm text-muted-foreground">
          正在校验登录状态...
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-sm rounded-lg border border-border/80 bg-white px-6 py-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-foreground">登录状态校验失败</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            无法连接后台 API。请确认 api-server 已启动（默认端口 3001），或使用 http://localhost:3000 访问管理后台后重新登录。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                clearAuthSession();
                window.location.replace("/");
              }}
            >
              返回登录页
            </Button>
            <Button onClick={() => window.location.reload()}>重新校验</Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
