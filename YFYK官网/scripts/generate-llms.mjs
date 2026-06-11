import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getRegistryPagesForLlms } from "../lib/geo/static-pages-registry.ts";

const siteUrl = "https://www.shyfyk.com";
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const header = readFileSync(join(rootDir, "llms/llms.header.txt"), "utf8");
const footer = readFileSync(join(rootDir, "llms/llms.footer.txt"), "utf8");

function pageUrl(path) {
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

const staticLines = getRegistryPagesForLlms().flatMap((page) => {
  const lines = [`- ${page.title}: ${pageUrl(page.path)}`];
  if (page.markdownPath) {
    lines.push(`- ${page.title} Markdown: ${siteUrl}${page.markdownPath}`);
  }
  return lines;
});

const output = `${header}${staticLines.join("\n")}\n${footer}`;
writeFileSync(join(rootDir, "public/llms.txt"), output, "utf8");
console.log(`Generated public/llms.txt with ${getRegistryPagesForLlms().length} static pages from staticPageRegistry.`);
