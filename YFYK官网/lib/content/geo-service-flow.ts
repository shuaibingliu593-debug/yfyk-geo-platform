export type GeoServiceFlowIcon =
  | "launch"
  | "scan"
  | "compare"
  | "layout"
  | "schema"
  | "knowledge"
  | "integrate"
  | "ops";

export type GeoServiceFlowTextPosition = "below" | "left" | "right";

export interface GeoServiceFlowStep {
  number: string;
  title: string;
  items: string[];
  icon: GeoServiceFlowIcon;
  textPosition: GeoServiceFlowTextPosition;
}

export const geoServiceFlowSteps: GeoServiceFlowStep[] = [
  {
    number: "01",
    title: "项目启动",
    items: ["需求梳理", "目标确认", "场景规划"],
    icon: "launch",
    textPosition: "below",
  },
  {
    number: "02",
    title: "GEO 诊断",
    items: ["官网检测", "AI 信号检查", "标准端点检测"],
    icon: "scan",
    textPosition: "below",
  },
  {
    number: "03",
    title: "竞品分析",
    items: ["引用对比", "内容缺口", "优先级判断"],
    icon: "compare",
    textPosition: "below",
  },
  {
    number: "04",
    title: "页面优化",
    items: ["信息架构", "核心页面", "知识块重构"],
    icon: "layout",
    textPosition: "below",
  },
  {
    number: "05",
    title: "语义部署",
    items: ["Schema 标记", "Markdown 内容", "AI Sitemap"],
    icon: "schema",
    textPosition: "below",
  },
  {
    number: "06",
    title: "知识建设",
    items: ["产品资料", "FAQ 术语", "SSOT 体系"],
    icon: "knowledge",
    textPosition: "below",
  },
  {
    number: "07",
    title: "系统集成",
    items: ["MCP 接口", "数据对接", "权限设置"],
    icon: "integrate",
    textPosition: "below",
  },
  {
    number: "08",
    title: "持续运营",
    items: ["引用监测", "缺口分析", "定期优化"],
    icon: "ops",
    textPosition: "below",
  },
];

export const geoServiceFlowBody = geoServiceFlowSteps
  .map((step) => `### ${step.number} / ${step.title}\n\n${step.items.join(" · ")}`)
  .join("\n\n");
