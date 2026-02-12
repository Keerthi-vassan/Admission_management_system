// Shared type definitions - single source of truth
// All components import from here - prevents name mismatches
export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";
export type ApplicationStatus = "PENDING" | "IN_REVIEW" | "DOCUMENTS_REJECTED" | "VERIFIED" | "FEE_PENDING" | "CONFIRMED" | "REJECTED";

export type Document = {
  id: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  status: DocumentStatus;
  uploadedAt: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  guardianName: string;
  guardianNumber: string;
  guardianEmail: string;
  aadharNumber: string;
  religion: string;
  casteCategory: string;
  branchAllotted: string;
  permanentAddress: string;
  state: string;
  bloodGroup: string;
  seatAllotmentSource: string;
  applicationStatus: ApplicationStatus;
  remarksFromStudent: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  documents: Document[];
};

export type Application = {
  id: string;
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  guardianName: string;
  guardianNumber: string;
  guardianEmail: string;
  aadharNumber: string;
  religion: string;
  casteCategory: string;
  branchAllotted: string;
  permanentAddress: string;
  state: string;
  bloodGroup: string;
  seatAllotmentSource: string;
  applicationStatus: ApplicationStatus;
  remarksFromStudent: string | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
  };
  documents: Document[];
};

// For table list view (lighter version)
export type ApplicationListItem = {
  id: string;
  name: string;
  branchAllotted: string;
  applicationStatus: string;
  createdAt: string;
  user: {
    email: string;
  };
  documents: Array<{
    id: string;
    documentType: string;
    status: string;
  }>;
};

export type Verifier = {
  id: string;
  name: string | null;
  email: string;
};

export type AssignedVerifier = {
  name: string | null;
  email: string;
};

export type ApplicationWithAssignment = {
  id: string;
  name: string;
  email: string;
  branchAllotted: string;
  applicationStatus: string;
  createdAt: string;
  assignedVerifier?: AssignedVerifier | null;
};

export type Assignment = {
  id: string;
  applicationId: string;
  verifierId: string;
  assignedBy: string;
  assignedAt: string;
};
