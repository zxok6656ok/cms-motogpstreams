-- CreateEnum
CREATE TYPE "AdPosition" AS ENUM ('head', 'body');

-- AlterTable
ALTER TABLE "ad_links" ADD COLUMN     "position" "AdPosition" NOT NULL DEFAULT 'body';
