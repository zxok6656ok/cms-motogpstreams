-- CreateTable
CREATE TABLE "ad_links" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "siteSettingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ad_links_siteSettingId_idx" ON "ad_links"("siteSettingId");

-- AddForeignKey
ALTER TABLE "ad_links" ADD CONSTRAINT "ad_links_siteSettingId_fkey" FOREIGN KEY ("siteSettingId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
