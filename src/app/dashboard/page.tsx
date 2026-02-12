"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Document , StudentProfile , DocumentStatus , ApplicationStatus } from "@/types";

export default function DashboardPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [profile, setProfile] = useState<StudentProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/login");
         return;
      }

      if (status === "authenticated") {
         fetchProfile();
      }
   }, [status, router]);

   const fetchProfile = async () => {
      try {
         const response = await fetch("/api/student/profile");
         const data = await response.json();

         if (!response.ok) {
            if (response.status === 404) {
               setError("No application found. Please complete registration.");
               setLoading(false);
               return;
            }
            throw new Error(data.error || "Failed to fetch profile");
         }

         setProfile(data.profile);
         setLoading(false);
      } catch (err) {
         console.error("Fetch error:", err);
         setError(err instanceof Error ? err.message : "Failed to load dashboard");
         setLoading(false);
      }
   };

   const handleDownload = async (fileUrl: string) => {
      try {
         // Generate a signed URL (valid for 1 hour)
         const { data } = await supabase.storage
            .from('student-documents')
            .createSignedUrl(fileUrl, 10*60); // 10 minutes

         if (data?.signedUrl) {
            window.open(data.signedUrl, '_blank');
         } else {
            alert('Failed to generate download link');
         }
      } catch (error) {
         console.error('Download error:', error);
         alert('Failed to download file');
      }
    };




   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Loading your dashboard...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
               <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
               </CardHeader>
               <CardContent>
                  <Button onClick={() => router.push("/register")} className="w-full">
                     Go to Registration
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   if (!profile) {
      return null;
   }

   const getStatusColor = (status: ApplicationStatus) => {
      const colors = {
         PENDING: "bg-yellow-100 text-yellow-800",
         IN_REVIEW: "bg-blue-100 text-blue-800",
         DOCUMENTS_REJECTED: "bg-red-100 text-red-800",
         VERIFIED: "bg-green-100 text-green-800",
         FEE_PENDING: "bg-orange-100 text-orange-800",
         CONFIRMED: "bg-green-200 text-green-900",
         REJECTED: "bg-red-200 text-red-900",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
   };

   const getDocumentStatusColor = (status: DocumentStatus) => {
      const colors = {
         PENDING: "bg-yellow-100 text-yellow-800",
         APPROVED: "bg-green-100 text-green-800",
         REJECTED: "bg-red-100 text-red-800",
         SUPERSEDED: "bg-gray-100 text-gray-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
   };

   const formatDocumentType = (type: string) => {
      return type.split('_').map(word =>
         word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ');
   };

   return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold">Student Dashboard</h1>
                  <p className="text-gray-600">Welcome, {profile.name}</p>
               </div>
               <Button variant="outline" onClick={() => router.push("/")}>
                  Sign Out
               </Button>
            </div>

            {/* Application Status Banner */}
            <Card>
               <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-lg font-semibold">Application Status</h3>
                        <p className="text-sm text-gray-600">
                           Submitted on {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                     <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(profile.applicationStatus)}`}>
                        {profile.applicationStatus.replace(/_/g, ' ')}
                     </span>
                  </div>
               </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">{profile.name}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-semibold">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Contact Number</p>
                        <p className="font-semibold">{profile.contactNumber}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Aadhar Number</p>
                        <p className="font-semibold">{profile.aadharNumber}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Guardian Name</p>
                        <p className="font-semibold">{profile.guardianName}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Guardian Contact</p>
                        <p className="font-semibold">{profile.guardianNumber}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <p className="text-sm text-gray-600">Branch Allotted</p>
                        <p className="font-semibold">{profile.branchAllotted}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Seat Allotment Source</p>
                        <p className="font-semibold">{profile.seatAllotmentSource}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold">{profile.casteCategory}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Religion</p>
                        <p className="font-semibold">{profile.religion}</p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-semibold">{profile.state}</p>
                     </div>
                     {profile.bloodGroup && (
                        <div>
                           <p className="text-sm text-gray-600">Blood Group</p>
                           <p className="font-semibold">{profile.bloodGroup}</p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Documents */}
            <Card>
               <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>
                     {profile.documents.length} documents submitted
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {profile.documents.map((doc) => (
                        <div
                           key={doc.id}
                           className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                           <div className="flex-1">
                              <h4 className="font-semibold">{formatDocumentType(doc.documentType)}</h4>
                              <p className="text-sm text-gray-600">
                                 Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusColor(doc.status)}`}>
                                 {doc.status}
                              </span>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleDownload(doc.fileUrl)}
                              >
                                 Download
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Address */}
            <Card>
               <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
               </CardHeader>
               <CardContent>
                  <div>
                     <p className="text-sm text-gray-600">Permanent Address</p>
                     <p className="font-semibold">{profile.permanentAddress}</p>
                  </div>
                  <div className="mt-4">
                     <p className="text-sm text-gray-600">Guardian Email</p>
                     <p className="font-semibold">{profile.guardianEmail}</p>
                  </div>
               </CardContent>
            </Card>

            {profile.remarksFromStudent && (
               <Card>
                  <CardHeader>
                     <CardTitle>Your Remarks</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-gray-700">{profile.remarksFromStudent}</p>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}