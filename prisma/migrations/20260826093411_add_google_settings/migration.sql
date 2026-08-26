-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "googleAnalyticsId" TEXT,
ADD COLUMN     "googleSiteVerification" TEXT;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "uploadBy" TEXT NOT NULL DEFAULT 'X';
