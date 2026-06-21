import type { ReactNode } from "react";

interface CaseMarkdownProps {
  markdown: string;
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isTableSeparator(line: string) {
  return /^\|[\s:|-]+\|$/.test(line.trim());
}

function parseTableRow(line: string) {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(lines: string[], key: string) {
  const rows = lines.filter((line) => !isTableSeparator(line)).map(parseTableRow);
  if (rows.length === 0) return null;

  const [head, ...body] = rows;
  return (
    <div className="cd-markdown-table-wrap" key={key}>
      <table className="cd-markdown-table">
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 渲染标题后的正文行（列表、引用、表格或段落） */
function renderBodyLines(lines: string[], keyPrefix: string): ReactNode[] {
  if (lines.length === 0) return [];

  if (lines.every(isTableRow)) {
    const table = renderTable(lines, `${keyPrefix}-table`);
    return table ? [table] : [];
  }

  if (lines.every((line) => line.startsWith("> "))) {
    return [
      <blockquote key={`${keyPrefix}-quote`}>
        {lines.map((line) => (
          <p key={line}>{renderInline(line.replace(/^>\s+/, ""))}</p>
        ))}
      </blockquote>,
    ];
  }

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return [
      <ul key={`${keyPrefix}-ul`}>
        {lines.map((line) => (
          <li key={line}>{renderInline(line.replace(/^[-*]\s+/, ""))}</li>
        ))}
      </ul>,
    ];
  }

  return lines.map((line, index) => (
    <p key={`${keyPrefix}-p-${index}`}>{renderInline(line)}</p>
  ));
}

export function CaseMarkdown({ markdown }: CaseMarkdownProps) {
  const lines = markdown.trim().split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;
  let blockKey = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      nodes.push(
        <h2 id={slugifyHeading(title)} key={`h2-${blockKey++}`}>
          {title}
        </h2>,
      );
      index += 1;

      const bodyLines: string[] = [];
      while (index < lines.length) {
        const next = lines[index].trim();
        if (!next) {
          index += 1;
          continue;
        }
        if (next.startsWith("## ") || next.startsWith("### ")) break;
        bodyLines.push(next);
        index += 1;
      }

      nodes.push(...renderBodyLines(bodyLines, `body-${blockKey}`));
      continue;
    }

    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "").trim();
      nodes.push(
        <h3 id={slugifyHeading(title)} key={`h3-${blockKey++}`}>
          {title}
        </h3>,
      );
      index += 1;

      const bodyLines: string[] = [];
      while (index < lines.length) {
        const next = lines[index].trim();
        if (!next) {
          index += 1;
          continue;
        }
        if (next.startsWith("## ") || next.startsWith("### ")) break;
        bodyLines.push(next);
        index += 1;
      }

      nodes.push(...renderBodyLines(bodyLines, `body-${blockKey}`));
      continue;
    }

    const blockLines: string[] = [];
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next) {
        if (blockLines.length > 0) break;
        index += 1;
        continue;
      }
      if (next.startsWith("## ") || next.startsWith("### ")) break;
      blockLines.push(next);
      index += 1;
    }

    nodes.push(...renderBodyLines(blockLines, `block-${blockKey++}`));
  }

  return <div className="cd-markdown">{nodes}</div>;
}
