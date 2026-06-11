export type IconName = "source" | "graph" | "agent" | "shield" | "pulse" | "arrow" | "scan" | "code" | "badge" | "chart" | "info";

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "source") return <svg {...common}><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="m4 12 8 4 8-4M4 17l8 4 8-4" /></svg>;
  if (name === "graph") return <svg {...common}><circle cx="5" cy="12" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="19" r="2" /><path d="m6.5 10.5 4-4m3 0 4 4m0 3-4 4m-3 0-4-4" /></svg>;
  if (name === "agent") return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M9 10h.01M15 10h.01M8 15h8M12 5V2" /></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === "pulse") return <svg {...common}><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></svg>;
  if (name === "scan") return <svg {...common}><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M7 10.5h7" /></svg>;
  if (name === "code") return <svg {...common}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></svg>;
  if (name === "badge") return <svg {...common}><path d="M12 3 15 8l5 1-3.5 4 1 5.5L12 16l-5.5 2.5 1-5.5L4 9l5-1 3-5Z" /><path d="m9.5 12 1.6 1.6 3.4-3.8" /></svg>;
  if (name === "chart") return <svg {...common}><path d="M4 19V5M4 19h17" /><path d="m7 15 3.5-4 3 2.5L19 7" /><path d="M18 7h-4M18 7v4" /></svg>;
  if (name === "info") return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
  return <svg {...common}><path d="M5 12h13m-5-5 5 5-5 5" /></svg>;
}
