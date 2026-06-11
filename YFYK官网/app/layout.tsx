import type { Metadata } from "next";
import "./globals.css";
import { ContactModalRoot } from "@/components/contact/ContactModalRoot";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { siteConfig } from "@/lib/content/home";
import { getGlobalSchemas } from "@/lib/schema/home";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "优服优科 | AI友好型官网与GEO服务",
  description: "优服优科提供AI友好型官网建设、GEO策略审计、老网站AI友好度升级与企业知识库信源构建服务。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "优服优科 | AI友好型官网与GEO服务",
    description: "让官网成为AI信任并引用的企业知识源。",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brand,
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="zh-CN">
      <head>
        <SchemaInjector id="yfyk-global-schema" schemas={getGlobalSchemas()} />
      </head>
      <body>
        <ContactModalRoot>{children}</ContactModalRoot>
      </body>
    </html>
  );
}
