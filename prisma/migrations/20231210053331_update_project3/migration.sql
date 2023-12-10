-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "academicSupervisorId" INTEGER,
ADD COLUMN     "industrySupervisorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_academicSupervisorId_fkey" FOREIGN KEY ("academicSupervisorId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_industrySupervisorId_fkey" FOREIGN KEY ("industrySupervisorId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
