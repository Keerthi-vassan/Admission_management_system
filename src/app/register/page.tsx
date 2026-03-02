"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { basicInfoSchema, academicInfoSchema, type BasicInfoFormData, type AcademicInfoFormData, } from "@/lib/validations/student-registration";
import { ProgressIndicator } from "@/components/registration/ProgressIndicator";
import { BasicInfoForm } from "@/components/registration/BasicInfoForm";
import { AcademicInfoForm } from "@/components/registration/AcademicInfoForm";
import { DocumentUploadForm } from "@/components/registration/DocumentUploadForm";
import { on } from "events";

export default function RegisterPage() {
   const [currentStep, setCurrentStep] = useState(1);
   const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
   const [alertMessage, setAlertMessage] = useState("");
   const [alertType, setAlertType] = useState<"error" | "success">("error");

   const router = useRouter();
   const { data: session, status } = useSession();

   // Redirect if not logged in


   // Form for Step 1
   const basicForm = useForm<BasicInfoFormData>({
      resolver: zodResolver(basicInfoSchema),
      defaultValues: basicInfo || {
         name: "",
         dateOfBirth: "",
         contactNumber: "",
         guardianName: "",
         guardianNumber: "",
         guardianEmail: "",
      },
   });

   // Form for Step 2
   const academicForm = useForm<AcademicInfoFormData>({
      resolver: zodResolver(academicInfoSchema),
      defaultValues: {
         aadharNumber: "",
         religion: "",
         casteCategory: "GENERAL",
         branchAllotted: "",
         seatAllotmentSource: "JOSSA",
         permanentAddress: "",
         state: "",
         bloodGroup: "",
         remarksFromStudent: "",
      },
   });

   // Step 1 Submit Handler
   const onBasicInfoSubmit = (data: BasicInfoFormData) => {
      setBasicInfo(data);
      setCurrentStep(2);
   };

   // Step 2 Submit Handler
   const onAcademicInfoSubmit = async (data: AcademicInfoFormData) => {
      if (!basicInfo) {
         setAlertMessage("Error: Basic info missing");
         setAlertType("error");
         setCurrentStep(1);
         return;
      }

      // Store academic info and move to document upload
      setCurrentStep(3);
   };

   const onDocumentUploadSubmit = async (documentUrls: Record<string, string>) => {
      if (!basicInfo || !session?.user?.id) {
         setAlertMessage("Error: Missing data or not logged in");
         setAlertType("error");
         return;
      }

      // Get academic form data
      const academicData = academicForm.getValues();

      // Combine all data
      const completeData = {
         ...basicInfo,
         ...academicData,
         documentUrls,
      };

      try {
         // Call API route
         const response = await fetch("/api/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(completeData),
         });

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.error || "Registration failed");
         }

         // Success!
         setAlertMessage("Application submitted successfully!");
         setAlertType("success");
         setTimeout(() => router.push("/dashboard"), 2000);
      } catch (error) {
         console.error("Submission error:", error);
         setAlertMessage(error instanceof Error ? error.message : "Failed to submit application");
         setAlertType("error");
      }
   }

   if (status === "loading") {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
   }

   if (status === "unauthenticated") {
      router.push("/login");
      return null;
   }


   return (
      <div className="min-h-screen flex flex-col justify-center bg-[#f3f4f6] py-10 px-4">
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl mx-auto p-6 md:p-10">
            <div className="bg-[#2563eb] text-white rounded-t-xl -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-6 px-6 md:px-10 py-4">
               <h1 className="text-2xl md:text-3xl font-semibold">Student Registration</h1>
               <p className="text-sm md:text-base opacity-90">
                  Step {currentStep} of 3 -{" "}
                  {currentStep === 1 ? "Basic Information"
                     : currentStep === 2 ? "Academic Information"
                        : "Document Uploads"}
               </p>
            </div>

            {alertMessage && (
               <Alert 
                  message={alertMessage} 
                  type={alertType} 
                  onClose={() => setAlertMessage("")} 
               />
            )}

            <ProgressIndicator currentStep={currentStep} />

            {currentStep === 1 && (<BasicInfoForm form={basicForm} onSubmit={onBasicInfoSubmit} />)}

            {currentStep === 2 && (<AcademicInfoForm form={academicForm} onSubmit={onAcademicInfoSubmit} onBack={() => setCurrentStep(1)} />)}

            {currentStep === 3 && (<DocumentUploadForm onBack={() => setCurrentStep(2)} userId={session?.user?.id || ""} onSubmit={onDocumentUploadSubmit} />)}
         </div>
      </div>
   );

}
