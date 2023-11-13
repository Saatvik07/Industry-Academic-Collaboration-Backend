-- CreateTable
CREATE TABLE "AreaOfInterest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AreaOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreaOfInterestToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaOfInterest_title_key" ON "AreaOfInterest"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaOfInterestToUser_AB_unique" ON "_AreaOfInterestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaOfInterestToUser_B_index" ON "_AreaOfInterestToUser"("B");

-- AddForeignKey
ALTER TABLE "_AreaOfInterestToUser" ADD CONSTRAINT "_AreaOfInterestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaOfInterestToUser" ADD CONSTRAINT "_AreaOfInterestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
