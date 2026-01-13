-- CreateEnum
CREATE TYPE "CasteCategory" AS ENUM ('GENERAL', 'GENERAL_EWS', 'OBC_NCL', 'SC', 'ST');

-- CreateEnum
CREATE TYPE "SeatAllotmentSource" AS ENUM ('JOSSA', 'CSAB');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'DOCUMENTS_REJECTED', 'VERIFIED', 'FEE_PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PASSPORT_PHOTO', 'PROVISIONAL_LETTER', 'CLASS_10_MARKSHEET', 'CLASS_12_MARKSHEET', 'JEE_RANK_CARD', 'CASTE_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'INSTITUTE_FEE_RECEIPT', 'HOSTEL_FEE_RECEIPT', 'UNDERTAKING', 'CLASS_12_PERFORMANCE', 'AADHAR_CARD');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUPERSEDED');

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "guardianName" TEXT NOT NULL,
    "guardianNumber" TEXT NOT NULL,
    "guardianEmail" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "casteCategory" "CasteCategory" NOT NULL,
    "branchAllotted" TEXT NOT NULL,
    "seatAllotmentSource" "SeatAllotmentSource" NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "remarksFromStudent" TEXT,
    "applicationStatus" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "studentProfileId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_aadharNumber_key" ON "StudentProfile"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_applicationStatus_idx" ON "StudentProfile"("applicationStatus");

-- CreateIndex
CREATE INDEX "StudentProfile_branchAllotted_idx" ON "StudentProfile"("branchAllotted");

-- CreateIndex
CREATE INDEX "StudentProfile_state_idx" ON "StudentProfile"("state");

-- CreateIndex
CREATE INDEX "Document_studentProfileId_documentType_idx" ON "Document"("studentProfileId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "Document_studentProfileId_documentType_version_key" ON "Document"("studentProfileId", "documentType", "version");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
