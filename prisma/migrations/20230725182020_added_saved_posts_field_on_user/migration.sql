-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "userSavedPostsId" INTEGER;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userSavedPostsId_fkey" FOREIGN KEY ("userSavedPostsId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
