-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'VERFICATION_PENDING', 'ONGOING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "industryOrgId" INTEGER NOT NULL,
    "academicOrgId" INTEGER NOT NULL,
    "progressUpdates" TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IndustryUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AcademicUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IndustryUsers_AB_unique" ON "_IndustryUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_IndustryUsers_B_index" ON "_IndustryUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AcademicUsers_AB_unique" ON "_AcademicUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AcademicUsers_B_index" ON "_AcademicUsers"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_industryOrgId_fkey" FOREIGN KEY ("industryOrgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_academicOrgId_fkey" FOREIGN KEY ("academicOrgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IndustryUsers" ADD CONSTRAINT "_IndustryUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IndustryUsers" ADD CONSTRAINT "_IndustryUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicUsers" ADD CONSTRAINT "_AcademicUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AcademicUsers" ADD CONSTRAINT "_AcademicUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
