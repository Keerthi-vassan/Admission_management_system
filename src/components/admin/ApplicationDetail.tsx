"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Application } from "@/types/index";


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
         {/* Back Button */}
         <button
            onClick={() => router.push("/admin")}
            className="text-blue-600 hover:underline text-sm mb-6"
         >
            ← Back to Applications
         </button>

         {/* Top Status Banner */}
         <div className="bg-blue-700 text-white rounded-xl p-6 flex justify-between items-center shadow-sm">
            <div>
               <h1 className="text-xl font-semibold">{application.name}</h1>
               <p className="text-sm text-blue-100 mt-1">
                  Applied on {new Date(application.createdAt).toLocaleDateString('en-GB')}
               </p>
            </div>
            <span className={`px-4 py-2 text-xs font-semibold rounded-full 
               ${application.applicationStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
               ${application.applicationStatus === "IN_REVIEW" ? "bg-blue-100 text-blue-700" : ""}
               ${application.applicationStatus === "DOCUMENTS_REJECTED" ? "bg-red-100 text-red-700" : ""}
               ${application.applicationStatus === "VERIFIED" ? "bg-green-100 text-green-700" : ""}
               ${application.applicationStatus === "FEE_PENDING" ? "bg-orange-100 text-orange-700" : ""}
               ${application.applicationStatus === "CONFIRMED" ? "bg-green-200 text-green-800" : ""}
               ${application.applicationStatus === "REJECTED" ? "bg-red-200 text-red-800" : ""}
            `}>
               {application.applicationStatus.replace(/_/g, ' ')}
            </span>
         </div>

         {/* Personal Information */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InfoRow label="Email" value={application.user.email} />
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
         </div>

         {/* Guardian Information */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2 mb-4">Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InfoRow label="Guardian Name" value={application.guardianName} />
               <InfoRow label="Guardian Number" value={application.guardianNumber} />
               <InfoRow label="Guardian Email" value={application.guardianEmail} />
            </div>
         </div>

         {/* Academic Information */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2 mb-4">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InfoRow label="Branch Allotted" value={application.branchAllotted} />
               <InfoRow label="Seat Allotment Source" value={application.seatAllotmentSource} />
            </div>
         </div>

         {/* Documents */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2 mb-4">Uploaded Documents</h2>
            <div className="space-y-3">
               {application.documents.length === 0 ? (
                  <p className="text-gray-500">No documents uploaded yet.</p>
               ) : (
                  application.documents.map((doc) => (
                     <div
                        key={doc.id}
                        className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                     >
                        <div className="flex-1">
                           <p className="font-medium text-sm">{formatDocumentType(doc.documentType)}</p>
                           <p className="text-xs text-gray-500 mt-1">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                           </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                           <span className={`px-3 py-1 text-xs font-semibold rounded-full
                              ${doc.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${doc.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
                              ${doc.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                           `}>
                              {doc.status}
                           </span>
                           <button
                              onClick={()=> handleViewDocument(doc.fileUrl)}
                              className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-3 py-1 text-sm transition"
                           >
                              Download
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Remarks */}
         {application.remarksFromStudent && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h2 className="text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2 mb-4">Student Remarks</h2>
               <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.remarksFromStudent}</p>
            </div>
         )}
      </div>
   );
}

// Helper component for consistent info display
function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div>
         <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
         <p className="font-medium text-gray-800 mt-1">{value || "Not provided"}</p>
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