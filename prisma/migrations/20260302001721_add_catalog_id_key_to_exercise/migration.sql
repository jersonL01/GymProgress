/*
  Warnings:

  - A unique constraint covering the columns `[userId,catalogId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,key]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catalogId` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Exercise_userId_name_key";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "catalogId" INTEGER NOT NULL,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_userId_catalogId_key" ON "Exercise"("userId", "catalogId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_userId_key_key" ON "Exercise"("userId", "key");
