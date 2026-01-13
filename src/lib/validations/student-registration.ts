import { z } from "zod";

// Step 1: Basic Information Schema
export const basicInfoSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 17 && age <= 25;
  }, "Age must be between 17 and 25 years"),
  contactNumber: z.string()
    .length(10, "Contact number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  guardianName: z.string().min(3, "Guardian name must be at least 3 characters"),
  guardianNumber: z.string()
    .length(10, "Guardian number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  guardianEmail: z.string().email("Invalid email address"),
});

// Step 2: Academic Information Schema
export const academicInfoSchema = z.object({
  aadharNumber: z.string()
    .length(12, "Aadhar number must be 12 digits")
    .regex(/^\d{12}$/, "Aadhar must contain only digits"),
  religion: z.string().min(1, "Religion is required"),
  casteCategory: z.enum(["GENERAL", "GENERAL_EWS", "OBC_NCL", "SC", "ST"]),
  branchAllotted: z.string().min(1, "Branch is required"),
  seatAllotmentSource: z.enum(["JOSSA", "CSAB"]),
  permanentAddress: z.string().min(10, "Address must be at least 10 characters"),
  state: z.string().min(1, "State is required"),
  bloodGroup: z.string().optional(),
  remarksFromStudent: z.string().optional(),
});

// Combined schema using intersection
export const completeRegistrationSchema = basicInfoSchema.and(academicInfoSchema);

// TypeScript types
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;