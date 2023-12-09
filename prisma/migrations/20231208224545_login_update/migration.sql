-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT;

-- CreateTable
CREATE TABLE "_Supervisors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Supervisors_AB_unique" ON "_Supervisors"("A", "B");

-- CreateIndex
CREATE INDEX "_Supervisors_B_index" ON "_Supervisors"("B");

-- AddForeignKey
ALTER TABLE "_Supervisors" ADD CONSTRAINT "_Supervisors_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Supervisors" ADD CONSTRAINT "_Supervisors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
