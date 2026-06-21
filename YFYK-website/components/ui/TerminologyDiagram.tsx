"use client";

import { useLayoutEffect, useRef, useState } from "react";

const CANVAS = { width: 400, height: 340 };
const EDGE_INSET = 12;

type TerminologyNode =
  | { id: string; label: string; y: number; anchor: "left" | "right" }
  | { id: string; lines: string[]; y: number; anchor: "center" };

const terminologyNodes: TerminologyNode[] = [
  { id: "cn-geo", label: "生成式引擎优化", y: 54, anchor: "left" },
  { id: "ai-search", label: "AI搜索优化", y: 54, anchor: "right" },
  { id: "schema", label: "Schema", y: 170, anchor: "left" },
  { id: "llms", label: "llms.txt", y: 286, anchor: "right" },
  {
    id: "geo-en",
    lines: ["Generative Engine", "Optimization"],
    y: 316,
    anchor: "center",
  },
];

type LineSegment = { id: string; x1: number; y1: number; x2: number; y2: number };

function getRectIntersection(
  fromX: number,
  fromY: number,
  rect: { left: number; top: number; right: number; bottom: number },
): { x: number; y: number } {
  const cx = (rect.left + rect.right) / 2;
  const cy = (rect.top + rect.bottom) / 2;
  const dx = cx - fromX;
  const dy = cy - fromY;

  let bestT = Infinity;
  let ix = cx;
  let iy = cy;

  const tryEdge = (t: number, x: number, y: number) => {
    if (t <= 0 || t >= bestT) return;
    if (x < rect.left - 0.5 || x > rect.right + 0.5) return;
    if (y < rect.top - 0.5 || y > rect.bottom + 0.5) return;
    bestT = t;
    ix = x;
    iy = y;
  };

  if (dx !== 0) {
    tryEdge((rect.left - fromX) / dx, rect.left, fromY + ((rect.left - fromX) / dx) * dy);
    tryEdge((rect.right - fromX) / dx, rect.right, fromY + ((rect.right - fromX) / dx) * dy);
  }
  if (dy !== 0) {
    tryEdge((rect.top - fromY) / dy, fromX + ((rect.top - fromY) / dy) * dx, rect.top);
    tryEdge((rect.bottom - fromY) / dy, fromX + ((rect.bottom - fromY) / dy) * dx, rect.bottom);
  }

  return { x: ix, y: iy };
}

export function TerminologyDiagram() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [lines, setLines] = useState<LineSegment[]>([]);

  useLayoutEffect(() => {
    const updateLines = () => {
      const canvas = canvasRef.current;
      const core = coreRef.current;
      if (!canvas || !core) return;

      const canvasRect = canvas.getBoundingClientRect();
      if (!canvasRect.width || !canvasRect.height) return;

      const coreRect = core.getBoundingClientRect();
      const coreX =
        ((coreRect.left + coreRect.width / 2 - canvasRect.left) / canvasRect.width) * CANVAS.width;
      const coreY =
        ((coreRect.top + coreRect.height / 2 - canvasRect.top) / canvasRect.height) * CANVAS.height;
      const coreR = (coreRect.width / canvasRect.width) * CANVAS.width * 0.5;

      const nextLines: LineSegment[] = terminologyNodes.map((node) => {
        const el = nodeRefs.current[node.id];
        if (!el) {
          return { id: node.id, x1: coreX, y1: coreY, x2: coreX, y2: coreY };
        }

        const rect = el.getBoundingClientRect();
        const vbRect = {
          left: ((rect.left - canvasRect.left) / canvasRect.width) * CANVAS.width,
          top: ((rect.top - canvasRect.top) / canvasRect.height) * CANVAS.height,
          right: ((rect.right - canvasRect.left) / canvasRect.width) * CANVAS.width,
          bottom: ((rect.bottom - canvasRect.top) / canvasRect.height) * CANVAS.height,
        };

        const end = getRectIntersection(coreX, coreY, vbRect);
        const dx = end.x - coreX;
        const dy = end.y - coreY;
        const len = Math.hypot(dx, dy) || 1;

        return {
          id: node.id,
          x1: coreX + (coreR * dx) / len,
          y1: coreY + (coreR * dy) / len,
          x2: end.x,
          y2: end.y,
        };
      });

      setLines(nextLines);
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    const observer = new ResizeObserver(updateLines);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => {
      window.removeEventListener("resize", updateLines);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ekb-visual ekb-visual-terms">
      <div className="ekb-term-canvas" ref={canvasRef}>
        <svg
          className="ekb-term-lines"
          viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {lines.map((line) => (
            <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          ))}
        </svg>
        <div className="ekb-term-core" ref={coreRef}>
          GEO
        </div>
        {terminologyNodes.map((node) => (
          <span
            className={`ekb-term-node${"lines" in node ? " is-multiline" : ""}${node.anchor === "left" ? " is-anchor-left" : ""}${node.anchor === "right" ? " is-anchor-right" : ""}`}
            key={node.id}
            ref={(el) => {
              nodeRefs.current[node.id] = el;
            }}
            style={{
              ...(node.anchor === "left"
                ? {
                    left: `${(EDGE_INSET / CANVAS.width) * 100}%`,
                    top: `${(node.y / CANVAS.height) * 100}%`,
                  }
                : node.anchor === "right"
                  ? {
                      right: `${(EDGE_INSET / CANVAS.width) * 100}%`,
                      top: `${(node.y / CANVAS.height) * 100}%`,
                    }
                  : {
                      left: "50%",
                      top: `${(node.y / CANVAS.height) * 100}%`,
                    }),
            }}
          >
            {"lines" in node
              ? node.lines.map((line) => (
                  <span className="ekb-term-node-line" key={line}>
                    {line}
                  </span>
                ))
              : node.label}
          </span>
        ))}
      </div>
    </div>
  );
}
