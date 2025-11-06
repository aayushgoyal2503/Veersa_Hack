/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "yearsExperience" DROP DEFAULT,
ALTER COLUMN "rating" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_name_key" ON "Doctor"("name");
