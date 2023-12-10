/*
  Warnings:

  - The `startDate` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endDate` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_academicOrgId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "startDate",
ADD COLUMN     "startDate" INTEGER,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" INTEGER,
ALTER COLUMN "academicOrgId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_academicOrgId_fkey" FOREIGN KEY ("academicOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
