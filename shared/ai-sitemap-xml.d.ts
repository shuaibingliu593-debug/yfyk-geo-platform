export type AiSitemapUrlEntry = {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
};
export declare function escapeXml(value: string): string;
export declare function renderAiSitemapXml(entries: AiSitemapUrlEntry[]): string;
