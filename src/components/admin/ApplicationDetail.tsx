"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DocumentType } from '../../lib/constants/documents';


type Document = {
   id: string;
   documentType: string;
   fileUrl: string;
   status: string;
   uploadedAt: string;
};

type Application = {
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

type Props = {
   applicationId: string;
};

export default function ApplicationDetail({ applicationId }: Props) {
   const [application, setApplication] = useState<Application | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const router = useRouter();

   useEffect(() => {
      fetchApplication();
   }, [applicationId]);

   async function fetchApplication() {
      try {
         const res = await fetch(`/api/admin/applications/${applicationId}`);
         const data = await res.json();

         setApplication(data.application);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Error loading application");
      } finally {
         setLoading(false);
      }
   }
   
   function handleViewDocument(fileUrl: string) {
      // TODO Week 8: Implement signed URLs for private bucket access
      // Current: Public bucket (development only)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const bucketName = 'student-documents';
      const fullUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileUrl}`;
      window.open(fullUrl, '_blank');
   }


   

   if (loading) {
      return <div className="text-center py-8">Loading application...</div>;
   }

   if (error || !application) {
      return (
         <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error || "Application not found"}</p>
            <Button
               onClick={() => router.push("/admin")}
               className="mt-4"
            >
               Back to Dashboard
            </Button>
         </Card>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header with back button */}
         <div className="flex items-center justify-between">
            <div>
               <Button
                  onClick={() => router.push("/admin")}
                  variant="outline"
                  className="mb-4"
               >
                  ← Back to Applications
               </Button>
               <h1 className="text-3xl font-bold">{application.name}</h1>
               <p className="text-gray-600 mt-1">{application.user.email}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full 
          ${application.applicationStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
          ${application.applicationStatus === "IN_REVIEW" ? "bg-blue-100 text-blue-800" : ""}
          ${application.applicationStatus === "VERIFIED" ? "bg-green-100 text-green-800" : ""}
          ${application.applicationStatus === "REJECTED" ? "bg-red-100 text-red-800" : ""}
        `}>
               {application.applicationStatus}
            </span>
         </div>

         {/* Personal Information */}
         <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
               <InfoRow label="Date of Birth" value={new Date(application.dateOfBirth).toLocaleDateString('en-GB')} />
               <InfoRow label="Contact Number" value={application.contactNumber} />
               <InfoRow label="Blood Group" value={application.bloodGroup} />
               <InfoRow label="Aadhar Number" value={application.aadharNumber} />
               <InfoRow label="Religion" value={application.religion} />
               <InfoRow label="Caste Category" value={application.casteCategory} />
               <InfoRow label="State" value={application.state} />
            </div>
            <div className="mt-4">
               <InfoRow label="Permanent Address" value={application.permanentAddress} />
            </div>
         </Card>

         {/* Guardian Information */}
         <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Guardian Information</h2>
            <div className="grid grid-cols-2 gap-4">
               <InfoRow label="Guardian Name" value={application.guardianName} />
               <InfoRow label="Guardian Number" value={application.guardianNumber} />
               <InfoRow label="Guardian Email" value={application.guardianEmail} />
            </div>
         </Card>

         {/* Academic Information */}
         <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            <div className="grid grid-cols-2 gap-4">
               <InfoRow label="Branch Allotted" value={application.branchAllotted} />
               <InfoRow label="Seat Allotment Source" value={application.seatAllotmentSource} />
            </div>
         </Card>

         {/* Documents */}
         <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
            <div className="space-y-3">
               {application.documents.length === 0 ? (
                  <p className="text-gray-500">No documents uploaded yet.</p>
               ) : (
                  application.documents.map((doc) => (
                     <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                     >
                        <div className="flex-1">
                           <p className="font-medium">{formatDocumentType(doc.documentType)}</p>
                           <p className="text-sm text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                           </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-1 text-xs font-semibold rounded
                    ${doc.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${doc.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
                    ${doc.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                  `}>
                              {doc.status}
                           </span>
                           <Button
                              size="sm"
                              onClick={()=> handleViewDocument(doc.fileUrl)}
                           >
                              View
                           </Button>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </Card>

         {/* Remarks */}
         {application.remarksFromStudent && (
            <Card className="p-6">
               <h2 className="text-xl font-semibold mb-4">Student Remarks</h2>
               <p className="text-gray-700 whitespace-pre-wrap">{application.remarksFromStudent}</p>
            </Card>
         )}

         {/* Submission Info */}
         <Card className="p-6 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
               <InfoRow label="Application Submitted" value={new Date(application.createdAt).toLocaleString('en-GB')} />
               <InfoRow label="Account Created" value={new Date(application.user.createdAt).toLocaleString('en-GB')} />
            </div>
         </Card>
      </div>
   );
}

// Helper component for consistent info display
function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div>
         <p className="text-sm text-gray-600 font-medium">{label}</p>
         <p className="text-gray-900">{value || "Not provided"}</p>
      </div>
   );
}

// Format document type enum to readable text
// Format document type enum to readable text
function formatDocumentType(type: string | undefined | null): string {
   if (!type) {
      return "Unknown Document";
   }

   return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
}