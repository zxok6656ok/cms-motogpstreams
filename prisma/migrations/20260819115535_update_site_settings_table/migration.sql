/*
  Warnings:

  - You are about to drop the column `discord` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `footer` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `navbar` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `telegram` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `SiteSetting` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('telegram', 'facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'pinterest');

-- AlterTable
ALTER TABLE "SiteSetting" DROP COLUMN "discord",
DROP COLUMN "facebook",
DROP COLUMN "footer",
DROP COLUMN "instagram",
DROP COLUMN "navbar",
DROP COLUMN "telegram",
DROP COLUMN "twitter",
DROP COLUMN "youtube";

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "siteSettingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navbar_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "siteSettingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navbar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "siteSettingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_links_siteSettingId_idx" ON "social_links"("siteSettingId");

-- CreateIndex
CREATE INDEX "navbar_items_siteSettingId_idx" ON "navbar_items"("siteSettingId");

-- CreateIndex
CREATE INDEX "footer_items_siteSettingId_idx" ON "footer_items"("siteSettingId");

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_siteSettingId_fkey" FOREIGN KEY ("siteSettingId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navbar_items" ADD CONSTRAINT "navbar_items_siteSettingId_fkey" FOREIGN KEY ("siteSettingId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "footer_items" ADD CONSTRAINT "footer_items_siteSettingId_fkey" FOREIGN KEY ("siteSettingId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
