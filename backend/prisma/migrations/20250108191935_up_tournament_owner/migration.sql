/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_owner_id_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "owner_id",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
