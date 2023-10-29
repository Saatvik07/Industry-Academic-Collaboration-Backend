-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('INDUSTRY', 'ACADEMIC');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "type" "OrgType" NOT NULL DEFAULT 'ACADEMIC';
