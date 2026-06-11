-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "static_resource_type" AS ENUM ('static_page', 'static_collection', 'static_article', 'static_glossary', 'static_certification');

-- CreateEnum
CREATE TYPE "static_resource_source_type" AS ENUM ('frontend_static', 'mdx', 'json', 'manual_registered');

-- CreateEnum
CREATE TYPE "geo_target_type" AS ENUM ('static_resource', 'case', 'faq', 'news');

-- CreateEnum
CREATE TYPE "case_type" AS ENUM ('benchmark', 'geo_native', 'ai_upgrade', 'knowledge_base');

-- CreateEnum
CREATE TYPE "related_service_type" AS ENUM ('geo_native_website', 'ai_friendly_upgrade', 'enterprise_knowledge_base', 'general');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "case_type" "case_type" NOT NULL,
    "industry" TEXT,
    "client_name" TEXT,
    "client_display_name" TEXT,
    "is_anonymized" BOOLEAN NOT NULL DEFAULT false,
    "challenge" TEXT,
    "solution" TEXT,
    "results" TEXT,
    "metrics" JSONB,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "cover_image" TEXT,
    "related_service_type" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "related_service_type" "related_service_type" NOT NULL DEFAULT 'general',
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "source" TEXT,
    "author" TEXT,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "cover_image" TEXT,
    "publish_date" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "static_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resource_key" TEXT NOT NULL,
    "resource_type" "static_resource_type" NOT NULL,
    "url" TEXT NOT NULL,
    "source_type" "static_resource_source_type" NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "static_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_configs" (
    "id" TEXT NOT NULL,
    "target_type" "geo_target_type" NOT NULL,
    "target_id" TEXT NOT NULL,
    "ai_summary" TEXT,
    "schema_type" TEXT,
    "schema_json" JSONB,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "llms_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sitemap_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sitemap_priority" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "detect_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_detected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_checks" (
    "id" TEXT NOT NULL,
    "geo_config_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "findings" JSONB NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geo_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_resource_key" ON "Permission"("action", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "cases_slug_key" ON "cases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "static_resources_slug_key" ON "static_resources"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "static_resources_resource_key_key" ON "static_resources"("resource_key");

-- CreateIndex
CREATE UNIQUE INDEX "static_resources_url_key" ON "static_resources"("url");

-- CreateIndex
CREATE INDEX "geo_configs_target_type_idx" ON "geo_configs"("target_type");

-- CreateIndex
CREATE UNIQUE INDEX "geo_configs_target_type_target_id_key" ON "geo_configs"("target_type", "target_id");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_checks" ADD CONSTRAINT "geo_checks_geo_config_id_fkey" FOREIGN KEY ("geo_config_id") REFERENCES "geo_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

