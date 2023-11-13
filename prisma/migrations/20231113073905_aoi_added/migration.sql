/*
  Warnings:

  - Added the required column `createdByUserId` to the `AreaOfInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AreaOfInterest" ADD COLUMN     "createdByUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AreaOfInterest" ADD CONSTRAINT "AreaOfInterest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
