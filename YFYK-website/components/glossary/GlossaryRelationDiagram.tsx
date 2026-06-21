"use client";

import { useLayoutEffect, useRef, useState } from "react";

const CANVAS = { width: 400, height: 300 };

type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const diagramNodes: DiagramNode[] = [
  { id: "schema", label: "Schema", x: 72, y: 60 },
  { id: "faq", label: "FAQ", x: 328, y: 60 },
  { id: "ai-summary", label: "AI Summary", x: 56, y: 167 },
  { id: "llms", label: "llms.txt", x: 344, y: 167 },
  { id: "mcp", label: "MCP", x: 88, y: 260 },
  { id: "ai-sitemap", label: "AI Sitemap", x: 312, y: 260 },
];

const CORE = { x: 200, y: 150, r: 44 };

type LineSegment = { id: string; x1: number; y1: number; x2: number; y2: number };

export function GlossaryRelationDiagram() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<LineSegment[]>([]);

  useLayoutEffect(() => {
    const updateLines = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const coreX = CORE.x;
      const coreY = CORE.y;
      const coreR = CORE.r;

      const nextLines = diagramNodes.map((node) => {
        const dx = node.x - coreX;
        const dy = node.y - coreY;
        const len = Math.hypot(dx, dy) || 1;

        return {
          id: node.id,
          x1: coreX + (coreR * dx) / len,
          y1: coreY + (coreR * dy) / len,
          x2: node.x,
          y2: node.y,
        };
      });

      setLines(nextLines);
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    const observer = new ResizeObserver(updateLines);
    observer.observe(canvasRef.current!);
    return () => {
      window.removeEventListener("resize", updateLines);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="glossary-visual glossary-visual-graph" aria-hidden="true">
      <div className="glossary-graph-canvas" ref={canvasRef}>
        <svg
          className="glossary-graph-lines"
          viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {lines.map((line) => (
            <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          ))}
        </svg>
        <div
          className="glossary-graph-core"
          style={{
            left: `${(CORE.x / CANVAS.width) * 100}%`,
            top: `${(CORE.y / CANVAS.height) * 100}%`,
          }}
        >
          GEO
        </div>
        {diagramNodes.map((node) => (
          <span
            key={node.id}
            className="glossary-graph-node"
            style={{
              left: `${(node.x / CANVAS.width) * 100}%`,
              top: `${(node.y / CANVAS.height) * 100}%`,
            }}
          >
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}
