/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_CommentUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentUsers_AB_unique" ON "_CommentUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentUsers_B_index" ON "_CommentUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "comments_userId_key" ON "comments"("userId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentUsers" ADD CONSTRAINT "_CommentUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentUsers" ADD CONSTRAINT "_CommentUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
