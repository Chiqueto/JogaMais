/*
  Warnings:

  - Added the required column `owner_id` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "owner_id" TEXT NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'Brasil';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "country" SET DEFAULT 'Brasil';

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
