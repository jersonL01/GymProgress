/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "categoryEs" TEXT,
ADD COLUMN     "equipment" TEXT,
ADD COLUMN     "equipmentEs" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "force" TEXT,
ADD COLUMN     "forceEs" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "instructions" TEXT[],
ADD COLUMN     "instructionsEs" TEXT[],
ADD COLUMN     "level" TEXT,
ADD COLUMN     "levelEs" TEXT,
ADD COLUMN     "mechanic" TEXT,
ADD COLUMN     "mechanicEs" TEXT,
ADD COLUMN     "nameEs" TEXT,
ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "primaryMusclesEs" TEXT[],
ADD COLUMN     "secondaryMuscles" TEXT[],
ADD COLUMN     "secondaryMusclesEs" TEXT[],
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_externalId_key" ON "Exercise"("externalId");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Exercise_nameEs_idx" ON "Exercise"("nameEs");
