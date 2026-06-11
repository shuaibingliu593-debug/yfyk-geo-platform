import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  staticPageRegistry,
  getRegistryPagesForAiSitemap,
  getRegistryPagesForLlms,
  getRegistryPagesForGeoScore,
  PRESET_STATIC_RESOURCE_KEYS,
  getStaticPageByKey
} from "../static-pages.ts";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(rootDir, "..");
const errors = [];

const REQUIRED_FIELDS = [
  "key",
  "path",
  "title",
  "pageType",
  "markdownPath",
  "priority",
  "changeFrequency",
  "includeInAiSitemap",
  "includeInLlms",
  "includeInGeoScore",
  "schemaType",
  "robotsPolicy"
];

const DYNAMIC_ROUTES = new Set([
  "/cases",
  "/cases/[slug]",
  "/news",
  "/news/[slug]",
  "/faq"
]);

const REQUIRED_PATHS = [
  "/",
  "/geo-native-website",
  "/ai-friendly-upgrade",
  "/enterprise-knowledge-base",
  "/glossary",
  "/about",
  "/about/patents",
  "/contact"
];

const DEPRECATED_PATHS = new Set(["/about/company", "/about/contact", "/knowledge"]);

function expectedMarkdownPath(path) {
  return path === "/" ? "/page.md" : `${path}.md`;
}

function readText(relativePath) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

for (const page of staticPageRegistry) {
  if (DYNAMIC_ROUTES.has(page.path)) {
    errors.push(`Dynamic route should not be in registry: ${page.path}`);
  }
}

for (const page of staticPageRegistry) {
  for (const field of REQUIRED_FIELDS) {
    const value = page[field];
    if (value === undefined || value === null || value === "") {
      errors.push(`Missing ${field} for ${page.path || page.key || "unknown"}`);
    }
  }
}

const pathCounts = new Map();
const keyCounts = new Map();
const markdownCounts = new Map();

for (const page of staticPageRegistry) {
  pathCounts.set(page.path, (pathCounts.get(page.path) ?? 0) + 1);
  keyCounts.set(page.key, (keyCounts.get(page.key) ?? 0) + 1);
  markdownCounts.set(page.markdownPath, (markdownCounts.get(page.markdownPath) ?? 0) + 1);
}

for (const [path, count] of pathCounts) {
  if (count > 1) errors.push(`Duplicate path: ${path}`);
}

for (const [key, count] of keyCounts) {
  if (count > 1) errors.push(`Duplicate key: ${key}`);
}

for (const [markdownPath, count] of markdownCounts) {
  if (count > 1) errors.push(`Duplicate markdownPath: ${markdownPath}`);
}

for (const page of staticPageRegistry) {
  if (!page.markdownPath?.endsWith(".md")) {
    errors.push(`markdownPath must end with .md: ${page.path} -> ${page.markdownPath}`);
  }

  const expected = expectedMarkdownPath(page.path);
  if (page.markdownPath !== expected) {
    errors.push(`markdownPath mismatch for ${page.path}: expected ${expected}, got ${page.markdownPath}`);
  }
}

const aiSitemapPages = new Set(getRegistryPagesForAiSitemap().map((page) => page.path));
for (const page of staticPageRegistry) {
  if (page.includeInAiSitemap && !aiSitemapPages.has(page.path)) {
    errors.push(`includeInAiSitemap page not readable by ai-sitemap logic: ${page.path}`);
  }
}

const llmsPages = new Set(getRegistryPagesForLlms().map((page) => page.path));
for (const page of staticPageRegistry) {
  if (page.includeInLlms && !llmsPages.has(page.path)) {
    errors.push(`includeInLlms page not readable by generate-llms logic: ${page.path}`);
  }
}

const geoScorePages = new Set(getRegistryPagesForGeoScore().map((page) => page.key));
for (const page of staticPageRegistry) {
  if (page.includeInGeoScore) {
    if (!geoScorePages.has(page.key)) {
      errors.push(`includeInGeoScore page not readable by GEO score whitelist: ${page.path}`);
    }
    if (!PRESET_STATIC_RESOURCE_KEYS.has(page.key)) {
      errors.push(`includeInGeoScore page missing from PRESET_STATIC_RESOURCE_KEYS: ${page.key}`);
    }
    if (!getStaticPageByKey(page.key)?.includeInGeoScore) {
      errors.push(`includeInGeoScore page not resolvable in GEO score whitelist: ${page.key}`);
    }
  }
}

const registryPaths = new Set(staticPageRegistry.map((page) => page.path));
for (const path of REQUIRED_PATHS) {
  if (!registryPaths.has(path)) {
    errors.push(`Missing required static page: ${path}`);
  }
}

for (const page of staticPageRegistry) {
  if (DEPRECATED_PATHS.has(page.path)) {
    errors.push(`Deprecated route found: ${page.path}`);
  }
}

const aiSitemapRoute = readText("YFYK官网/app/ai-sitemap.xml/route.ts");
if (!aiSitemapRoute.includes("getRegistryPagesForAiSitemap")) {
  errors.push("ai-sitemap route must read pages via getRegistryPagesForAiSitemap");
}

const generateLlms = readText("YFYK官网/scripts/generate-llms.mjs");
if (!generateLlms.includes("getRegistryPagesForLlms")) {
  errors.push("generate-llms.mjs must read pages via getRegistryPagesForLlms");
}

const auditService = readText("geo-admin/api-server/src/modules/audit/audit.service.ts");
if (!auditService.includes("PRESET_STATIC_RESOURCE_KEYS") || !auditService.includes("includeInGeoScore")) {
  errors.push("GEO score audit must whitelist pages via PRESET_STATIC_RESOURCE_KEYS and includeInGeoScore");
}

if (errors.length) {
  for (const error of errors) console.error(`❌ ${error}`);
  process.exit(1);
}

console.log("✅ staticPageRegistry check passed");
