import type { Metadata } from "next";
import "./ai-friendly-upgrade.css";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { AiFriendlyUpgradeOverview } from "@/components/ui/AiFriendlyUpgradeOverview";
import { aiFriendlyUpgradeMeta } from "@/lib/content/ai-friendly-upgrade";
import { getAiFriendlyUpgradeSchemas } from "@/lib/schema/ai-friendly-upgrade";

export const metadata: Metadata = {
  title: aiFriendlyUpgradeMeta.title,
  description: aiFriendlyUpgradeMeta.description,
  alternates: {
    canonical: aiFriendlyUpgradeMeta.path,
    types: {
      "text/markdown": `${aiFriendlyUpgradeMeta.path}.md`,
    },
  },
  openGraph: {
    title: aiFriendlyUpgradeMeta.title,
    description: aiFriendlyUpgradeMeta.description,
    url: aiFriendlyUpgradeMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function AiFriendlyUpgradePage() {
  return (
    <>
      <SchemaInjector
        id="yfyk-ai-friendly-upgrade-schema"
        schemas={getAiFriendlyUpgradeSchemas()}
      />
      <AiFriendlyUpgradeOverview />
    </>
  );
}
