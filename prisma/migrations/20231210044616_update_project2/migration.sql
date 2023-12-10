-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectProposalLink" TEXT;

-- CreateTable
CREATE TABLE "_AreaOfInterestToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AreaOfInterestToProject_AB_unique" ON "_AreaOfInterestToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaOfInterestToProject_B_index" ON "_AreaOfInterestToProject"("B");

-- AddForeignKey
ALTER TABLE "_AreaOfInterestToProject" ADD CONSTRAINT "_AreaOfInterestToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaOfInterestToProject" ADD CONSTRAINT "_AreaOfInterestToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
