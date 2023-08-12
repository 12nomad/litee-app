-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_messageId_fkey";

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "messageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
