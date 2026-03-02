/*
  Warnings:

  - You are about to drop the column `key` on the `Exercise` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Exercise_userId_key_key";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "key";
