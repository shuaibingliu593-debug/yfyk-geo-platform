-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('new', 'following', 'done', 'invalid');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT,
    "contact" TEXT NOT NULL,
    "demand_type" TEXT NOT NULL,
    "message" TEXT,
    "source_page" TEXT NOT NULL,
    "source_page_title" TEXT,
    "source_module" TEXT NOT NULL,
    "source_button_text" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "status" "lead_status" NOT NULL DEFAULT 'new',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_demand_type_idx" ON "leads"("demand_type");

-- CreateIndex
CREATE INDEX "leads_source_page_idx" ON "leads"("source_page");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");
