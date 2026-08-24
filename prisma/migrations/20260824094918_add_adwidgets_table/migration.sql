-- CreateEnum
CREATE TYPE "AdWidgetPosition" AS ENUM ('head', 'body', 'article', 'sidebar', 'floating', 'footer');

-- CreateTable
CREATE TABLE "ad_widgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "htmlCode" TEXT,
    "scriptCode" TEXT,
    "position" "AdWidgetPosition" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "height" INTEGER NOT NULL DEFAULT 90,
    "maxWidth" TEXT NOT NULL DEFAULT 'md',
    "mobileOnly" BOOLEAN NOT NULL DEFAULT true,
    "showClose" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ad_widgets_position_isActive_idx" ON "ad_widgets"("position", "isActive");
