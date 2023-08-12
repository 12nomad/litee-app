/*
  Warnings:

  - You are about to drop the column `hasSeenLatestMessage` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "hasSeenLatestMessage";

-- CreateTable
CREATE TABLE "_SeenBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeenBy_AB_unique" ON "_SeenBy"("A", "B");

-- CreateIndex
CREATE INDEX "_SeenBy_B_index" ON "_SeenBy"("B");

-- AddForeignKey
ALTER TABLE "_SeenBy" ADD CONSTRAINT "_SeenBy_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeenBy" ADD CONSTRAINT "_SeenBy_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
