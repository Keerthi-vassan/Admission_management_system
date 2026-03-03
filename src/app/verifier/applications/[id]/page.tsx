"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, Remark } from "@/types";
import { error } from 'console';

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
   const [selectedStatus, setSelectedStatus] = useState<string>("");
   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
   const [statusError, setStatusError] = useState("");
   const [remarks, setRemarks] = useState<Remark[]>([]);
   const [remarkText, setRemarkText] = useState("");
   const [isAddingRemark, setIsAddingRemark] = useState(false);
   const [remarkError, setRemarkError] = useState("");

   const handleStatusUpdate = async () => {
      if (!selectedStatus) {
         setStatusError("please select a status");
         return;
      }

      const confirmed = window.confirm(`Are you sure you want to mark this application as ${selectedStatus} `);

      if (!confirmed) return;

      setIsUpdatingStatus(true);
      setStatusError("");

      try {
         const response = await fetch(`/api/verifier/applications/${resolvedParams.id}/status`, {
            method: "PATCH",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ status: selectedStatus }),
         });

         const data = response.json();

         if (response.ok) {
            alert(`Application succesfully marked as ${selectedStatus}`),
               window.location.reload();
         } else {
            setStatusError(data.error || "Failed to update status");
         }
      } catch (error) {
         console.error("Error updating status : ", error);
      } finally {
         setIsUpdatingStatus(false);
      }
   };


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

   useEffect(() => {
      async function fetchRemarks() {
         if (!session?.user || session.user.role != "VERIFIER") {
            return;
         }

         try {
            const response = await fetch(`/api/verifier/applications/${resolvedParams.id}/remarks`);
            const data = await response.json();

            if (response.ok) {
               setRemarks(data.remarks);
            }
         } catch (error) {
            console.error("error fetching remaks : ", error);
         }

      }

      if (application) {
         fetchRemarks();
      }


   }, [application, resolvedParams.id, session]);

   const handleAddRemark = async () => {
      if (!remarkText.trim()) {
         setRemarkError("Please enter a remark");
         return;
      }

      setIsAddingRemark(true);
      setRemarkError("");

      try {
         const response = await fetch(`/api/verifier/applications/${resolvedParams.id}/remarks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: remarkText })
         });

         const data = await response.json();

         if (response.ok) {
            setRemarks([data.remark, ...remarks]);
            setRemarkText("");
            alert("remark added successfully");
         } else {
            setRemarkError(data.error || "Failed to add remark");
         }
      } catch (error) {
         console.error("Error adding remark : ", error);
         setRemarkError("An error occured while adding remark ");
      } finally {
         setIsAddingRemark(false);
      }
   }


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
      <div className="p-6 flex-col gap-4 max-w-6xl mx-auto">
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
            {/* Assignment Information */}
            {application.assignment && (
               <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                     <CardTitle className="text-blue-900">Assignment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <p className="text-sm text-blue-700 font-medium">Assigned By</p>
                        <p className="text-blue-900 font-semibold">
                           {application.assignment.assignedBy.name ||
                              application.assignment.assignedBy.email}
                        </p>
                        <p className="text-xs text-blue-600">
                           {application.assignment.assignedBy.email}
                        </p>
                     </div>

                     <div>
                        <p className="text-sm text-blue-700 font-medium">Assigned On</p>
                        <p className="text-blue-900 font-semibold">
                           {new Date(application.assignment.assignedAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                           })}
                        </p>
                     </div>

                     <div>
                        <p className="text-sm text-blue-700 font-medium">Days Assigned</p>
                        <p className="text-blue-900 font-semibold">
                           {Math.floor(
                              (new Date().getTime() -
                              new Date(application.assignment.assignedAt).getTime()) /
                              (1000 * 60 * 60 * 24)
                           )}{" "}
                           days
                        </p>
                     </div>
                  </CardContent>
               </Card>
            )}

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
                                 onClick={() => handleViewDocument(doc.fileUrl)}
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

         <div className="space-y-6 mt-6">
            {/* Remarks Section */}
            <Card>
               <CardHeader>
                  <CardTitle>Verifier Remarks</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {/* Add Remark Form */}
                  <div className="space-y-3">
                     <div>
                        <label className="block text-sm font-medium mb-2">
                           Add a remark or note
                        </label>
                        <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)}
                           placeholder="E.g., 'Documents verified successfully' or 'Class 10 marksheet needs reupload'"
                           className="w-full p-3 border rounded-md resize-none"
                           rows={3} disabled={isAddingRemark} maxLength={5000} />
                        <p className="text-xs text-gray-500 mt-1">
                           {remarkText.length}/5000 characters
                        </p>
                     </div>

                     {remarkError && (
                        <p className="text-sm text-red-600">{remarkError}</p>
                     )}

                     <button onClick={handleAddRemark} disabled={isAddingRemark || !remarkText.trim()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium" >
                        {isAddingRemark ? "Adding..." : "Add Remark"}
                     </button>
                  </div>

                  {/* Remarks List */}
                  <div className="border-t pt-4">
                     <h4 className="font-medium mb-3">Previous Remarks</h4>
                     {remarks.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                           No remarks yet. Add the first one above.
                        </p>
                     ) : (
                        <div className="space-y-3">
                           {remarks.map((remark) => (
                              <div key={remark.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500" >
                                 <p className="text-sm text-gray-800 mb-2">
                                    {remark.text}
                                 </p>
                                 <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span className="font-medium">
                                       {remark.author.name || remark.author.email}
                                       {remark.authorId === session?.user?.id && " (You)"}
                                    </span>
                                    <span>
                                       {new Date(remark.createdAt).toLocaleString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                       })}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
            {/* Status Update Section */}

            <Card>
               <CardHeader>
                  <CardTitle>Update Application Status</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {/* Current Status */}
                  <div className="p-3 bg-gray-50 rounded-md">
                     <p className="text-sm text-gray-600 mb-1">Current Status:</p>
                     <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${application.applicationStatus === "PENDING"
                           ? "bg-yellow-100 text-yellow-800"
                           : application.applicationStatus === "IN_REVIEW"
                              ? "bg-blue-100 text-blue-800"
                              : application.applicationStatus === "VERIFIED"
                                 ? "bg-green-100 text-green-800"
                                 : application.applicationStatus === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                           }`}
                     >
                        {application.applicationStatus}
                     </span>
                  </div>

                  {/* Show update controls only if not already final status */}
                  {application.applicationStatus !== "VERIFIED" && application.applicationStatus !== "REJECTED" && (
                     <>
                        <div>
                           <p className="text-sm font-medium mb-3">
                              Change status to:
                           </p>
                           <div className="space-y-2">
                              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                 <input
                                    type="radio"
                                    name="status"
                                    value="VERIFIED"
                                    checked={selectedStatus === "VERIFIED"}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-4 h-4"
                                 />
                                 <div>
                                    <p className="font-medium text-green-700">Verified</p>
                                    <p className="text-xs text-gray-600">
                                       All documents are correct and complete
                                    </p>
                                 </div>
                              </label>

                              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                 <input
                                    type="radio"
                                    name="status"
                                    value="REJECTED"
                                    checked={selectedStatus === "REJECTED"}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-4 h-4"
                                 />
                                 <div>
                                    <p className="font-medium text-red-700">Rejected</p>
                                    <p className="text-xs text-gray-600">
                                       Documents need corrections
                                    </p>
                                 </div>
                              </label>
                           </div>
                        </div>

                        {statusError && (
                           <p className="text-sm text-red-600">{statusError}</p>
                        )}

                        <button onClick={handleStatusUpdate} disabled={!selectedStatus || isUpdatingStatus}
                           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium" >
                           {isUpdatingStatus ? "Updating..." : "Update Status"}
                        </button>
                     </>
                  )}

                  {/* Show message if status is final */}
                  {(application.applicationStatus === "VERIFIED" || application.applicationStatus === "REJECTED") && (
                     <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                           ℹ️ This application has been finalized and cannot be changed.
                        </p>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

      </div>
   );
}