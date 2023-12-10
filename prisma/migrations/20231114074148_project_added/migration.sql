-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_industryOrgId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "industryOrgId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_industryOrgId_fkey" FOREIGN KEY ("industryOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
