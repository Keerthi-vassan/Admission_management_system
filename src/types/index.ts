// Shared type definitions - single source of truth
// All components import from here - prevents name mismatches

export type Document = {
  id: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  status: string;
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
  applicationStatus: string;
  remarksFromStudent: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
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
  applicationStatus: string;
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