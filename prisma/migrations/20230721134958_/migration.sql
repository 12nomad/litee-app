/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `reposts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `reposts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reposts" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reposts_userId_key" ON "reposts"("userId");

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
