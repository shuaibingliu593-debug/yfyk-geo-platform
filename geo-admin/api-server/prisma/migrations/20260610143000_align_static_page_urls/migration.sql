-- Align legacy static page URLs with staticPageRegistry without touching geo_configs content.
UPDATE "static_resources"
SET
  "url" = '/about',
  "slug" = 'about',
  "title" = '公司简介',
  "resource_type" = 'static_page',
  "status" = 'ACTIVE',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "resource_key" = 'about_company';

UPDATE "static_resources"
SET
  "url" = '/contact',
  "slug" = 'contact',
  "title" = '联系我们',
  "resource_type" = 'static_page',
  "status" = 'ACTIVE',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "resource_key" = 'about_contact';

UPDATE "geo_configs"
SET
  "canonical_url" = '/about',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "target_type" = 'static_resource'
  AND "target_id" IN (
    SELECT "id" FROM "static_resources" WHERE "resource_key" = 'about_company'
  )
  AND ("canonical_url" = '/about/company' OR "canonical_url" IS NULL OR "canonical_url" = '');

UPDATE "geo_configs"
SET
  "canonical_url" = '/contact',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "target_type" = 'static_resource'
  AND "target_id" IN (
    SELECT "id" FROM "static_resources" WHERE "resource_key" = 'about_contact'
  )
  AND ("canonical_url" = '/about/contact' OR "canonical_url" IS NULL OR "canonical_url" = '');

UPDATE "static_resources"
SET
  "status" = 'INACTIVE',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "resource_key" = 'knowledge';
