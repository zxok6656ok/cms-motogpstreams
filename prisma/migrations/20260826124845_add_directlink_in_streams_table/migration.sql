-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "directLink" TEXT DEFAULT '',
ADD COLUMN     "directLinkActive" BOOLEAN NOT NULL DEFAULT false;
