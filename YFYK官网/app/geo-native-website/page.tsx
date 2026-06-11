import type { Metadata } from "next";
import "./geo-native-website.css";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { GeoNativeWebsiteOverview } from "@/components/ui/GeoNativeWebsiteOverview";
import { geoNativeWebsiteMeta } from "@/lib/content/geo-native-website";
import { getGeoNativeWebsiteSchemas } from "@/lib/schema/geo-native-website";

export const metadata: Metadata = {
  title: geoNativeWebsiteMeta.title,
  description: geoNativeWebsiteMeta.description,
  alternates: {
    canonical: geoNativeWebsiteMeta.path,
    types: {
      "text/markdown": `${geoNativeWebsiteMeta.path}.md`,
    },
  },
  openGraph: {
    title: geoNativeWebsiteMeta.title,
    description: geoNativeWebsiteMeta.description,
    url: geoNativeWebsiteMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function GeoNativeWebsitePage() {
  return (
    <>
      <SchemaInjector
        id="yfyk-geo-native-website-schema"
        schemas={getGeoNativeWebsiteSchemas()}
      />
      <GeoNativeWebsiteOverview />
    </>
  );
}
