/*
  Warnings:

  - You are about to drop the `_CommentUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommentUsers" DROP CONSTRAINT "_CommentUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentUsers" DROP CONSTRAINT "_CommentUsers_B_fkey";

-- DropIndex
DROP INDEX "comments_postId_key";

-- DropIndex
DROP INDEX "comments_userId_key";

-- DropTable
DROP TABLE "_CommentUsers";
