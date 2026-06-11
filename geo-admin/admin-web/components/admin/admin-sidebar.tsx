"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearAuthSession } from "@/lib/auth";
import { adminMenuGroups } from "./menu";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function logout() {
    clearAuthSession();
    router.replace("/");
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-border/80 bg-white transition-[width] duration-200 md:block",
        collapsed ? "w-[78px]" : "w-[288px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("min-w-0", collapsed && "sr-only")}>
          <p className="truncate text-sm font-semibold">GEO Admin</p>
          <p className="truncate text-xs text-muted-foreground">AI 搜索可见性后台</p>
        </div>
        <Button
          aria-label={collapsed ? "展开菜单" : "折叠菜单"}
          className={cn("h-9 w-9 px-0", collapsed && "mx-auto")}
          type="button"
          variant="ghost"
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex h-[calc(100vh-64px)] flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className={cn("mb-5 rounded-lg border border-border/80 bg-muted/45 p-3", collapsed && "flex justify-center p-2")}>
          <ShieldCheck className="h-4 w-4 text-foreground" />
          <div className={cn("mt-2", collapsed && "sr-only")}>
            <p className="text-xs font-semibold">统一 GEO 配置</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">static_resource / case / faq / news</p>
          </div>
        </div>

        <div className="grid gap-4">
          {adminMenuGroups.map((group) => {
            const GroupIcon = group.icon;
            const groupActive = Boolean(
              group.href ? pathname === group.href : group.items?.some((item) => pathname === item.href)
            );

            if (group.href) {
              return (
                <Link
                  key={group.title}
                  className={cn(
                    "group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    groupActive && "bg-foreground text-background hover:bg-foreground hover:text-background",
                    collapsed && "justify-center px-0"
                  )}
                  href={group.href}
                  title={collapsed ? group.title : undefined}
                >
                  <GroupIcon className="h-4 w-4 shrink-0" />
                  <span className={cn(collapsed && "sr-only")}>{group.title}</span>
                </Link>
              );
            }

            return (
              <div key={group.title} className="grid gap-1">
                <div
                  className={cn(
                    "flex h-8 items-center gap-3 px-3 text-xs font-semibold text-muted-foreground",
                    groupActive && "text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? group.title : undefined}
                >
                  <GroupIcon className={cn("h-4 w-4 shrink-0", groupActive && "text-foreground")} />
                  <span className={cn(collapsed && "sr-only")}>{group.title}</span>
                </div>
                <div className="grid gap-1">
                  {group.items?.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        className={cn(
                          "relative flex min-h-9 items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                          collapsed ? "justify-center px-0" : "px-8",
                          active && "bg-muted font-medium text-foreground hover:bg-muted hover:text-foreground"
                        )}
                        href={item.href}
                        title={collapsed ? item.title : undefined}
                      >
                        {active && !collapsed ? <span className="absolute left-3 h-4 w-0.5 rounded-full bg-foreground" /> : null}
                        <span className={cn("truncate", collapsed && "sr-only")}>{item.title}</span>
                        {collapsed ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-border/80 px-3 py-3">
        <Button
          className={cn("w-full justify-start gap-3", collapsed && "justify-center px-0")}
          title={collapsed ? "退出登录" : undefined}
          type="button"
          variant="ghost"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>退出登录</span>
        </Button>
      </div>
      </div>
    </aside>
  );
}

export function MobileAdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    adminMenuGroups.find((group) => group.href === pathname)?.title ??
    adminMenuGroups.flatMap((group) => group.items ?? []).find((item) => item.href === pathname)?.title ??
    "GEO Admin";

  function logout() {
    clearAuthSession();
    router.replace("/");
  }

  return (
    <div className="border-b border-border bg-white px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">GEO Admin</p>
          <p className="text-base font-semibold">{current}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-9 w-9 px-0" type="button" variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
          <Menu className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {adminMenuGroups.flatMap((group) =>
          group.href
            ? [{ title: group.title, href: group.href }]
            : (group.items ?? []).map((item) => ({ title: item.title, href: item.href }))
        ).map((item) => (
          <Link
            key={item.href}
            className={cn(
              "whitespace-nowrap rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground",
              pathname === item.href && "border-foreground bg-foreground text-background"
            )}
            href={item.href}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
