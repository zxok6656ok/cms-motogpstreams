-- CreateEnum
CREATE TYPE "StatusArticle" AS ENUM ('publish', 'draft');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "status" "StatusArticle" NOT NULL DEFAULT 'publish';
