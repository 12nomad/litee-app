/*
  Warnings:

  - The values [POST,USER] on the enum `NotifType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotifType_new" AS ENUM ('FOLLOW', 'LIKE', 'REPLY', 'MESSAGE');
ALTER TABLE "notifications" ALTER COLUMN "notifType" TYPE "NotifType_new" USING ("notifType"::text::"NotifType_new");
ALTER TYPE "NotifType" RENAME TO "NotifType_old";
ALTER TYPE "NotifType_new" RENAME TO "NotifType";
DROP TYPE "NotifType_old";
COMMIT;
