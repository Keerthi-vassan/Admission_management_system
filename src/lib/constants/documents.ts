export const DOCUMENT_TYPES = [
  {
    type: "PASSPORT_PHOTO",
    label: "Passport Size Photo",
    accept: "image/jpeg,image/png,image/jpg",
    maxSize: 2, // MB
  },
  {
    type: "PROVISIONAL_LETTER",
    label: "Provisional Admission Letter (JOSSA/CSAB)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "CLASS_10_MARKSHEET",
    label: "Class X Marksheet",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "CLASS_12_MARKSHEET",
    label: "Class XII/Intermediate Marksheet",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "JEE_RANK_CARD",
    label: "JEE Rank Card/Admit Card",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "CASTE_CERTIFICATE",
    label: "Caste Certificate (if applicable)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "MEDICAL_CERTIFICATE",
    label: "Medical Fitness Certificate",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "INSTITUTE_FEE_RECEIPT",
    label: "Institute Fee Payment Receipt (SBI Collect)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "HOSTEL_FEE_RECEIPT",
    label: "Hostel Fee Payment Receipt (SBI Collect)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "UNDERTAKING",
    label: "Undertaking (Student + Parents)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "CLASS_12_PERFORMANCE",
    label: "Class XII Performance Proof (if below criteria)",
    accept: "application/pdf",
    maxSize: 5,
  },
  {
    type: "AADHAR_CARD",
    label: "Aadhar Card",
    accept: "application/pdf,image/jpeg,image/png",
    maxSize: 5,
  },
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number]["type"];