-- CreateTable
CREATE TABLE "geo_scores" (
    "id" TEXT NOT NULL,
    "target_type" "geo_target_type" NOT NULL,
    "target_id" TEXT NOT NULL,
    "crawl_score" INTEGER NOT NULL,
    "understanding_score" INTEGER NOT NULL,
    "structure_score" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_issues" (
    "id" TEXT NOT NULL,
    "target_type" "geo_target_type" NOT NULL,
    "target_id" TEXT NOT NULL,
    "issue_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "geo_scores_target_type_target_id_key" ON "geo_scores"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "geo_scores_target_type_idx" ON "geo_scores"("target_type");

-- CreateIndex
CREATE INDEX "geo_issues_target_type_idx" ON "geo_issues"("target_type");

-- CreateIndex
CREATE INDEX "geo_issues_status_idx" ON "geo_issues"("status");
