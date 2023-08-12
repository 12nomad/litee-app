/*
  Warnings:

  - A unique constraint covering the columns `[rePostDataId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "rePostDataId" INTEGER;

-- CreateTable
CREATE TABLE "_RepostUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RepostUsers_AB_unique" ON "_RepostUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RepostUsers_B_index" ON "_RepostUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "posts_rePostDataId_key" ON "posts"("rePostDataId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_rePostDataId_fkey" FOREIGN KEY ("rePostDataId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepostUsers" ADD CONSTRAINT "_RepostUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepostUsers" ADD CONSTRAINT "_RepostUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
