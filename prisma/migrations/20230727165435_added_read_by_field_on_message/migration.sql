-- CreateTable
CREATE TABLE "_ReadBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReadBy_AB_unique" ON "_ReadBy"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadBy_B_index" ON "_ReadBy"("B");

-- AddForeignKey
ALTER TABLE "_ReadBy" ADD CONSTRAINT "_ReadBy_A_fkey" FOREIGN KEY ("A") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadBy" ADD CONSTRAINT "_ReadBy_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
