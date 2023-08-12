/*
  Warnings:

  - You are about to drop the column `isRepost` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `rePostDataId` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_rePostDataId_fkey";

-- DropIndex
DROP INDEX "posts_rePostDataId_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "isRepost",
DROP COLUMN "rePostDataId";

-- CreateTable
CREATE TABLE "reposts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "reposts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reposts_postId_key" ON "reposts"("postId");

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
