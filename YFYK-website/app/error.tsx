"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[website] dynamic content failed:", error);
  }, [error]);

  return (
    <main className="shell" style={{ padding: "120px 24px", textAlign: "center" }}>
      <h1>内容暂时不可用</h1>
      <p>官网暂时无法连接后台数据，请稍后重试。</p>
      <button className="button" type="button" onClick={() => reset()}>重新加载</button>
    </main>
  );
}
