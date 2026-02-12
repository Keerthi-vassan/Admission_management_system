/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assignment_applicationId_verifierId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_applicationId_key" ON "Assignment"("applicationId");
