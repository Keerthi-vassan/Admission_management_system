"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {basicInfoSchema,academicInfoSchema,type BasicInfoFormData,type AcademicInfoFormData,} from "@/lib/validations/student-registration";
import { ProgressIndicator } from "@/components/registration/ProgressIndicator";
import { BasicInfoForm } from "@/components/registration/BasicInfoForm";
import { AcademicInfoForm } from "@/components/registration/AcademicInfoForm";
import { DocumentUploadForm } from "@/components/registration/DocumentUploadForm";

export default function RegisterPage() {
   const [currentStep, setCurrentStep] = useState(1);
   const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);

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
         alert("Error: Basic info missing");
         setCurrentStep(1);
         return;
      }

      const completeData = { ...basicInfo, ...data };
      console.log("Complete Registration Data:", completeData);

      // TODO: Next session - API integration
      alert("Form validated! API integration coming next session.");
      setCurrentStep(3);
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
         <Card className="w-full max-w-2xl">
            <CardHeader>
               <CardTitle>Student Registration</CardTitle>
               <CardDescription>
                  Step {currentStep} of 3 -{" "}
                  {currentStep === 1 ? "Basic Information"
                     : currentStep === 2 ? "Academic Information"
                     : "Document Uploads"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               
               <ProgressIndicator currentStep={currentStep} />

               {currentStep === 1 && (<BasicInfoForm form={basicForm} onSubmit={onBasicInfoSubmit} />)}

               {currentStep === 2 && (<AcademicInfoForm form={academicForm} onSubmit={onAcademicInfoSubmit} onBack={() => setCurrentStep(1)} />)}

               {currentStep === 3 && (<DocumentUploadForm onBack={() => setCurrentStep(2)} />)}

            </CardContent>
         </Card>
      </div>
   );
}