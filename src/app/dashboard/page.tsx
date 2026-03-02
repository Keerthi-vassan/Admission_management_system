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
         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
               <CardHeader className="p-0 text-center space-y-4">
                  <div className="mx-auto text-blue-500" aria-hidden="true">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-12 w-12"
                     >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                     </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-600">Application Not Found</CardTitle>
                  <CardDescription className="mt-1 text-gray-600">{error}</CardDescription>
               </CardHeader>
               <CardContent className="p-0 mt-6 space-y-4">
                  <Button
                     onClick={() => router.push("/register")}
                     className="w-full rounded-lg bg-green-600 text-white shadow-sm transition hover:bg-green-700"
                  >
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
      <div className="min-h-screen bg-[#e9edf3] py-8 px-4">
         <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
               <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-[#1e3a8a]">Student Dashboard</h1>
                  <p className="text-sm text-gray-600 mt-1">Welcome, {profile.name}</p>
               </div>
               <button
                  onClick={() => router.push("/")}
                  className="border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-md px-4 py-1.5 transition"
               >
                  Sign Out
               </button>
            </div>

            {/* Application Status Banner */}
            <div className="bg-[#234ea5] text-white rounded-md px-6 py-4 flex justify-between items-center">
               <div>
                  <p className="text-sm opacity-90">Submitted on {new Date(profile.createdAt).toLocaleDateString()}</p>
               </div>
               <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  {profile.applicationStatus.replace(/_/g, ' ')}
               </span>
            </div>

            {/* Basic Information */}
            <div className="bg-white border border-[#cbd5e1] rounded-md overflow-hidden">
               <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#cbd5e1]">
                  <h2 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wide">Basic Information</h2>
               </div>
               <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Full Name</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.name}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Contact Number</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.contactNumber}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Aadhar Number</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.aadharNumber}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Guardian Name</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.guardianName}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Guardian Contact</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.guardianNumber}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white border border-[#cbd5e1] rounded-md overflow-hidden">
               <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#cbd5e1]">
                  <h2 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wide">Academic Information</h2>
               </div>
               <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Branch Allotted</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.branchAllotted}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Seat Allotment Source</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.seatAllotmentSource}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Category</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.casteCategory}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Religion</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.religion}</p>
                     </div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">State</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{profile.state}</p>
                     </div>
                     {profile.bloodGroup && (
                        <div>
                           <p className="text-xs uppercase text-gray-500 tracking-wide">Blood Group</p>
                           <p className="text-sm font-medium text-gray-800 mt-1">{profile.bloodGroup}</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Documents */}
            <div className="bg-white border border-[#cbd5e1] rounded-md overflow-hidden">
               <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#cbd5e1]">
                  <h2 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wide">Uploaded Documents</h2>
                  <p className="text-xs text-gray-500 mt-1">{profile.documents.length} documents submitted</p>
               </div>
               <div className="px-6 py-5">
                  <div className="space-y-3">
                     {profile.documents.map((doc) => (
                        <div
                           key={doc.id}
                           className="bg-[#f8fafc] border border-[#cbd5e1] rounded-md px-4 py-3 flex justify-between items-center hover:shadow-sm transition"
                        >
                           <div className="flex-1">
                              <h4 className="font-medium text-sm">{formatDocumentType(doc.documentType)}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                 Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="flex items-center gap-3 ml-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusColor(doc.status)}`}>
                                 {doc.status}
                              </span>
                              <button
                                 onClick={() => handleDownload(doc.fileUrl)}
                                 className="bg-[#1e3a8a] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#172554] transition"
                              >
                                 Download
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-[#cbd5e1] rounded-md overflow-hidden">
               <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#cbd5e1]">
                  <h2 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wide">Contact Information</h2>
               </div>
               <div className="px-6 py-5 space-y-6">
                  <div>
                     <p className="text-xs uppercase text-gray-500 tracking-wide">Permanent Address</p>
                     <p className="text-sm font-medium text-gray-800 mt-1">{profile.permanentAddress}</p>
                  </div>
                  <div>
                     <p className="text-xs uppercase text-gray-500 tracking-wide">Guardian Email</p>
                     <p className="text-sm font-medium text-gray-800 mt-1">{profile.guardianEmail}</p>
                  </div>
               </div>
            </div>

            {profile.remarksFromStudent && (
               <div className="bg-white border border-[#cbd5e1] rounded-md overflow-hidden">
                  <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#cbd5e1]">
                     <h2 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wide">Your Remarks</h2>
                  </div>
                  <div className="px-6 py-5">
                     <p className="text-sm text-gray-700">{profile.remarksFromStudent}</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}