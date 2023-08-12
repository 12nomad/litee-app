/*
  Warnings:

  - You are about to drop the `reposts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reposts" DROP CONSTRAINT "reposts_postId_fkey";

-- DropForeignKey
ALTER TABLE "reposts" DROP CONSTRAINT "reposts_userId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isRepost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repostId" INTEGER;

-- DropTable
DROP TABLE "reposts";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_repostId_fkey" FOREIGN KEY ("repostId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
