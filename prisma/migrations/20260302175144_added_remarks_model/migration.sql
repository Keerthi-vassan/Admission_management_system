-- CreateTable
CREATE TABLE "Remark" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Remark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Remark_applicationId_idx" ON "Remark"("applicationId");

-- CreateIndex
CREATE INDEX "Remark_authorId_idx" ON "Remark"("authorId");

-- AddForeignKey
ALTER TABLE "Remark" ADD CONSTRAINT "Remark_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remark" ADD CONSTRAINT "Remark_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
