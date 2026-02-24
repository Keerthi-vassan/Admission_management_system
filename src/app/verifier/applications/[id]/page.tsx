"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "@/types";

function handleViewDocument(fileUrl: string) {
   // TODO Week 8: Implement signed URLs for private bucket access
   // Current: Public bucket (development only)
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const bucketName = 'student-documents';
   const fullUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileUrl}`;
   window.open(fullUrl, '_blank');
}

export default function VerifierApplicationDetailPage({ params, }: { params: Promise<{ id: string }>; }) {
   const router = useRouter();
   const { data: session, status } = useSession();
   const resolvedParams = use(params);
   const [application, setApplication] = useState<Application | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Role-based redirect
   useEffect(() => {
      if (status === "loading") return;

      if (!session) {
         router.push("/login");
         return;
      }

      if (session.user.role !== "VERIFIER") {
         router.push("/");
         return;
      }
   }, [session, status, router]);

   // Fetch application details
   useEffect(() => {
      async function fetchApplication() {
         if (!session?.user || session.user.role !== "VERIFIER") return;

         try {
            setIsLoading(true);
            const response = await fetch(`/api/verifier/applications/${resolvedParams.id}`);
            const data = await response.json();

            if (response.ok) {
               setApplication(data.application);
            } else {
               console.error("Failed to fetch application:", data.error);
               if (response.status === 403) {
                  alert("You don't have access to this application");
                  router.push("/verifier");
               }
            }
         } catch (error) {
            console.error("Error fetching application:", error);
         } finally {
            setIsLoading(false);
         }
      }

      fetchApplication();
   }, [resolvedParams.id, session, router]);

   if (status === "loading" || !session || session.user.role !== "VERIFIER") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
         </div>
      );
   }

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Loading application details...</p>
         </div>
      );
   }

   if (!application) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <p className="text-gray-600 mb-4">Application not found</p>
               <button
                  onClick={() => router.push("/verifier")}
                  className="text-blue-600 hover:text-blue-800"
               >
                  ← Back to Assignments
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="p-6 max-w-6xl mx-auto">
         {/* Header with Back Button */}
         <div className="mb-6">
            <button
               onClick={() => router.push("/verifier")}
               className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
               ← Back to Assignments
            </button>
            <h1 className="text-3xl font-bold">Application Review</h1>
            <p className="text-gray-600 mt-2">{application.name}</p>
         </div>

         <div className="space-y-6">
            {/* Personal Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-sm text-gray-600">Full Name</p>
                     <p className="font-medium">{application.name}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Date of Birth</p>
                     <p className="font-medium">
                        {new Date(application.dateOfBirth).toLocaleDateString("en-GB")}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Contact Number</p>
                     <p className="font-medium">{application.contactNumber}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Aadhar Number</p>
                     <p className="font-medium">{application.aadharNumber}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Blood Group</p>
                     <p className="font-medium">{application.bloodGroup || "N/A"}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Religion</p>
                     <p className="font-medium">{application.religion}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Caste Category</p>
                     <p className="font-medium">{application.casteCategory}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">State</p>
                     <p className="font-medium">{application.state}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-sm text-gray-600">Permanent Address</p>
                     <p className="font-medium">{application.permanentAddress}</p>
                  </div>
               </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Guardian Information</CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-sm text-gray-600">Guardian Name</p>
                     <p className="font-medium">{application.guardianName}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Guardian Contact</p>
                     <p className="font-medium">{application.guardianNumber}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-sm text-gray-600">Guardian Email</p>
                     <p className="font-medium">{application.guardianEmail}</p>
                  </div>
               </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-sm text-gray-600">Branch Allotted</p>
                     <p className="font-medium">{application.branchAllotted}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Seat Allotment Source</p>
                     <p className="font-medium">{application.seatAllotmentSource}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-sm text-gray-600">Remarks from Student</p>
                     <p className="font-medium">
                        {application.remarksFromStudent || "No remarks"}
                     </p>
                  </div>
               </CardContent>
            </Card>

            {/* Documents */}
            <Card>
               <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {application.documents.map((doc) => (
                        <div
                           key={doc.id}
                           className="flex items-center justify-between p-3 border rounded-md"
                        >
                           <div className="flex-1">
                              <p className="font-medium">{doc.documentType.replace(/_/g, " ")}</p>
                              <p className="text-sm text-gray-600">{doc.fileName}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === "PENDING"
                                       ? "bg-yellow-100 text-yellow-800"
                                       : doc.status === "APPROVED"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                              >
                                 {doc.status}
                              </span>
                              <button
                                 onClick={() => handleViewDocument(doc.fileUrl) }
                                 className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                 View
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Status Update Section - We'll add this in Session 3 */}
         </div>
      </div>
   );
}