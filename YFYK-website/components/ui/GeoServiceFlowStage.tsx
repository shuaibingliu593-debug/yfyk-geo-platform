"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { GeoServiceFlowIcon, GeoServiceFlowStep } from "@/lib/content/geo-service-flow";
import { geoServiceFlowSteps } from "@/lib/content/geo-service-flow";

const stepMap = Object.fromEntries(geoServiceFlowSteps.map((step) => [step.number, step]));

const ROW_LAYOUT: string[][] = [
  ["01", "02", "03"],
  ["06", "05", "04"],
  ["07", "08"],
];

/** 蛇形路径顺序：01→02→03→04→05→06→07→08 */
const PATH_ORDER = ["01", "02", "03", "04", "05", "06", "07", "08"];

const flowIconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function FlowIcon({ name }: { name: GeoServiceFlowIcon }) {
  switch (name) {
    case "launch":
      return (
        <svg {...flowIconProps}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v2" />
          <path d="M12 4a6 6 0 0 1 4 10.5V18H8v-3.5A6 6 0 0 1 12 4Z" />
        </svg>
      );
    case "scan":
      return (
        <svg {...flowIconProps}>
          <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" />
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 9.5v5M9.5 12h5" />
        </svg>
      );
    case "compare":
      return (
        <svg {...flowIconProps}>
          <path d="M4 19V5M4 19h16" />
          <path d="m8 15 3-4 3 2.5 4-5" />
          <path d="M18 8h-3M18 8v3" />
        </svg>
      );
    case "layout":
      return (
        <svg {...flowIconProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M9 10v10" />
        </svg>
      );
    case "schema":
      return (
        <svg {...flowIconProps}>
          <path d="M12 3 4 7l8 4 8-4-8-4Z" />
          <path d="m4 12 8 4 8-4M4 17l8 4 8-4" />
        </svg>
      );
    case "knowledge":
      return (
        <svg {...flowIconProps}>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H18v16H7.5A2.5 2.5 0 0 0 5 20.5Z" />
          <path d="M5 5.5A2.5 2.5 0 0 0 7.5 8H18" />
        </svg>
      );
    case "integrate":
      return (
        <svg {...flowIconProps}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.3 11.2 15.4 7M8.3 12.8 15.4 17" />
        </svg>
      );
    case "ops":
      return (
        <svg {...flowIconProps}>
          <path d="M3 12h4l2.2-5 4.3 10 2.5-6H21" />
        </svg>
      );
  }
}

function FlowNode({ number, title, items, icon }: GeoServiceFlowStep) {
  return (
    <article className="geo-service-flow-node">
      <div className="geo-service-flow-node-core">
        <span className="geo-service-flow-node-icon">
          <FlowIcon name={icon} />
        </span>
      </div>
      <div className="geo-service-flow-node-copy">
        <span className="geo-service-flow-node-label">STEP {number}</span>
        <h3>{title}</h3>
        <p>{items.join(" · ")}</p>
      </div>
    </article>
  );
}

type Point = { x: number; y: number };

/** 右侧 U 型弯：外缘贴齐容器右边界（与导航菜单垂直对齐） */
function rightTurn(from: Point, to: Point, rightEdge: number): string {
  const midY = (from.y + to.y) / 2;
  const cp1x = Math.min(rightEdge, from.x + (rightEdge - from.x) * 0.55);
  const cp2x = rightEdge;
  return `C ${cp1x} ${from.y}, ${cp2x} ${from.y + (midY - from.y) * 0.35}, ${cp2x} ${midY} C ${cp2x} ${to.y - (to.y - midY) * 0.35}, ${cp1x} ${to.y}, ${to.x} ${to.y}`;
}

/** 左侧 U 型弯：外缘贴齐容器左边界（与 Logo 垂直对齐） */
function leftTurn(from: Point, to: Point, leftEdge: number): string {
  const midY = (from.y + to.y) / 2;
  const cp1x = Math.max(leftEdge, from.x - (from.x - leftEdge) * 0.55);
  const cp2x = leftEdge;
  return `C ${cp1x} ${from.y}, ${cp2x} ${from.y + (midY - from.y) * 0.35}, ${cp2x} ${midY} C ${cp2x} ${to.y - (to.y - midY) * 0.35}, ${cp1x} ${to.y}, ${to.x} ${to.y}`;
}

function buildFlowPath(
  points: Point[],
  leftEdge: number,
  rightEdge: number,
  pageRight: number,
): string {
  if (points.length < 2) return "";

  const [p0, p1, p2, p3, p4, p5, p6, p7] = points;
  const segments = [
    `M 0 ${p0.y}`,
    `L ${p0.x} ${p0.y}`,
    `L ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    rightTurn(p2, p3, rightEdge),
    `L ${p4.x} ${p4.y}`,
    `L ${p5.x} ${p5.y}`,
    leftTurn(p5, p6, leftEdge),
    `L ${p7.x} ${p7.y}`,
    `L ${pageRight} ${p7.y}`,
  ];

  return segments.join(" ");
}

export function GeoServiceFlowStage() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathD, setPathD] = useState("");
  const [viewBox, setViewBox] = useState("0 0 1 1");

  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    const svg = svgRef.current;
    if (!diagram || !svg) return;

    const measure = () => {
      const diagramRect = diagram.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      if (diagramRect.height <= 0 || svgRect.width <= 0) return;

      const points: Point[] = [];

      for (const id of PATH_ORDER) {
        const core = diagram.querySelector<HTMLElement>(`[data-step="${id}"] .geo-service-flow-node-core`);
        if (!core) return;

        const rect = core.getBoundingClientRect();
        points.push({
          x: rect.left + rect.width / 2 - svgRect.left,
          y: rect.top + rect.height / 2 - diagramRect.top,
        });
      }

      if (points.length !== PATH_ORDER.length) return;

      const shellLeft = diagramRect.left - svgRect.left;
      const shellRight = diagramRect.right - svgRect.left;

      setViewBox(`0 0 ${Math.round(svgRect.width)} ${Math.round(diagramRect.height)}`);
      setPathD(buildFlowPath(points, shellLeft, shellRight, svgRect.width));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(diagram);
    observer.observe(svg);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="geo-service-flow-stage" aria-label="GEO 建设服务流程">
      <div className="geo-service-flow-safe geo-service-flow-head">
        <h2>GEO 建设服务流程</h2>
        <p>
          从诊断评估到语义部署、知识建设与持续运营，
          形成可验收、可追踪的企业级 GEO 交付路径。
        </p>
      </div>

      <div className="geo-service-flow-diagram" ref={diagramRef}>
        <svg
          ref={svgRef}
          className="geo-service-flow-path"
          viewBox={viewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="geo-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          {pathD ? (
            <path
              className="geo-service-flow-path-line"
              d={pathD}
              fill="none"
              stroke="url(#geo-flow-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>

        <div className="geo-service-flow-grid-wrap">
          <ol className="geo-service-flow-grid">
            {ROW_LAYOUT.map((row, rowIndex) => (
              <li key={rowIndex} className={`geo-service-flow-row${rowIndex === 2 ? " is-row-third" : ""}`}>
                {row.map((id) => {
                  const step = stepMap[id];
                  if (!step) return null;
                  return (
                    <div key={id} className="geo-service-flow-cell" data-step={id}>
                      <FlowNode {...step} />
                    </div>
                  );
                })}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
