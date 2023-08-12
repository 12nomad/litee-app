-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('POST', 'USER', 'MESSAGE');

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notifType" "NotifType" NOT NULL,
    "typeId" INTEGER,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "notifFromId" INTEGER NOT NULL,
    "notifToId" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notifFromId_fkey" FOREIGN KEY ("notifFromId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notifToId_fkey" FOREIGN KEY ("notifToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
