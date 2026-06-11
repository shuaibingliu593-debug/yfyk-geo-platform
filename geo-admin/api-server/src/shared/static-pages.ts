export type {
  StaticPageDefinition,
  StaticPageKey,
  StaticPageType
} from "./static-pages-registry";

export {
  STATIC_PAGE_REGISTRY_KEYS,
  PRESET_STATIC_RESOURCE_KEYS,
  compareRegistryKeys,
  getRegistryPagesForAiSitemap,
  getRegistryPagesForGeoScore,
  getRegistryPagesForLlms,
  getStaticPageByKey,
  getStaticPageByPath,
  pathToSlug,
  resolveStaticResourceType,
  staticPageDisplayType,
  staticPageRegistry
} from "./static-pages-registry";
