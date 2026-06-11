import type { ReactNode } from "react";

interface NewsMarkdownProps {
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

export function NewsMarkdown({ markdown }: NewsMarkdownProps) {
  const blocks = markdown.trim().split(/\n\n+/);
  const nodes: ReactNode[] = [];

  blocks.forEach((block, blockIndex) => {
    const lines = block.split("\n");

    if (lines[0]?.startsWith("## ")) {
      const title = lines[0].replace(/^##\s+/, "").trim();
      nodes.push(
        <h2 id={slugifyHeading(title)} key={`h2-${blockIndex}`}>
          {title}
        </h2>,
      );
      return;
    }

    if (lines[0]?.startsWith("### ")) {
      const title = lines[0].replace(/^###\s+/, "").trim();
      nodes.push(
        <h3 id={slugifyHeading(title)} key={`h3-${blockIndex}`}>
          {title}
        </h3>,
      );
      return;
    }

    if (lines.every((line) => line.startsWith("- "))) {
      nodes.push(
        <ul key={`ul-${blockIndex}`}>
          {lines.map((line) => (
            <li key={line}>{renderInline(line.replace(/^-\s+/, ""))}</li>
          ))}
        </ul>,
      );
      return;
    }

    nodes.push(<p key={`p-${blockIndex}`}>{renderInline(block.replace(/\n/g, " "))}</p>);
  });

  return <div className="news-markdown">{nodes}</div>;
}
