/*
  Warnings:

  - Added the required column `userId` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
