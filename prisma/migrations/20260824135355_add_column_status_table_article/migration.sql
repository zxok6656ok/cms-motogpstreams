-- CreateEnum
CREATE TYPE "StatusArticle" AS ENUM ('pulish', 'draft');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "status" "StatusArticle" NOT NULL DEFAULT 'pulish';
