-- CreateTable
CREATE TABLE "HeroSetting" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "badge" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "year" TEXT,
    "description" TEXT,
    "primaryButtonText" TEXT,
    "primaryButtonUrl" TEXT,
    "secondaryButtonText" TEXT,
    "secondaryButtonUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSetting_siteId_key" ON "HeroSetting"("siteId");

-- AddForeignKey
ALTER TABLE "HeroSetting" ADD CONSTRAINT "HeroSetting_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
