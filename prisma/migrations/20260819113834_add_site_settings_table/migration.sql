-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "siteUrl" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "ogImage" TEXT,
    "telegram" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "discord" TEXT,
    "navbar" JSONB,
    "footer" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
