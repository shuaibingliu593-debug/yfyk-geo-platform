"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { apiFetch, apiFetchPublic } from "@/lib/api";
import { clearAuthSession, hasValidSession, setAuthSession } from "@/lib/auth";
import { toastError, toastSuccess } from "@/lib/toast";
import { Button } from "@/components/ui/button";

type LoginResponse = {
  accessToken: string;
  user: { sub: string; username: string; roles: string[] };
};

export function LoginClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasValidSession()) {
      return;
    }

    let cancelled = false;

    apiFetch("/api/auth/me", { skipAuthRedirect: true })
      .then(() => {
        if (!cancelled) {
          router.replace("/admin/dashboard");
        }
      })
      .catch(() => {
        clearAuthSession();
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      const message = "请输入账号和密码";
      setError(message);
      toastError(message);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiFetchPublic<LoginResponse>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });

      if (!data.accessToken) {
        throw new Error("登录响应缺少 accessToken");
      }

      setAuthSession(data.accessToken, data.user);
      toastSuccess("登录成功");
      router.replace("/admin/dashboard");
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "登录失败";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-6 py-8 lg:px-10">
        <div className="grid min-h-[760px] w-full grid-cols-12 overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.08)]">
          <section className="order-2 col-span-12 flex flex-col border-t border-border/80 bg-[#f7f7f8] p-6 lg:order-1 lg:col-span-7 lg:border-t-0 lg:border-r lg:p-12">
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center lg:py-16">
              <p className="text-3xl font-semibold tracking-tight text-foreground lg:text-5xl">GEO Admin Console</p>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground lg:text-xl lg:leading-8">
                官网 GEO 运维与内容控制台
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/80 bg-white p-5 sm:grid-cols-3">
              {[
                ["GEO 配置", "统一管理 AI Summary、Meta、Schema"],
                ["AI 抓取", "llms.txt 与 AI Sitemap 生成发布"],
                ["问题诊断", "低分对象、风险项与修复建议"]
              ].map(([title, description]) => (
                <div key={title}>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 col-span-12 flex items-center bg-white p-6 lg:order-2 lg:col-span-5 lg:p-12">
            <div className="mx-auto w-full max-w-[420px]">
              <div className="rounded-[24px] border border-border/80 bg-[#fcfcfc] p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)] lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-foreground">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">后台登录</p>
                    <p className="text-sm text-muted-foreground">使用管理员账号进入控制台</p>
                  </div>
                </div>

                <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">账号</span>
                    <input
                      autoComplete="username"
                      className={inputClassName}
                      disabled={isLoading}
                      required
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">密码</span>
                    <input
                      autoComplete="current-password"
                      className={inputClassName}
                      disabled={isLoading}
                      required
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>

                  {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

                  <Button className="h-12 justify-between rounded-xl px-4" disabled={isLoading} type="submit">
                    <span>{isLoading ? "登录中..." : "进入后台"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 rounded-2xl border border-border/80 bg-white px-4 py-4">
                  <p className="text-sm font-medium text-foreground">演示账号</p>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    <p>
                      账号：<span className="font-mono text-foreground">admin</span>
                    </p>
                    <p>
                      密码：<span className="font-mono text-foreground">admin123456</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-2 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60";
