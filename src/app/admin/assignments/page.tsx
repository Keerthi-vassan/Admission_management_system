"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from '@/components/ui/card';
import { Verifier, ApplicationWithAssignment } from "@/types"
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
   const router = useRouter();

   const [applications, setApplications] = useState<ApplicationWithAssignment[]>([]);
   const [verifiers, setVerifiers] = useState<Verifier[]>([]);
   const [selectedApps, setSelectedApps] = useState<string[]>([]);
   const [selectedVerifier, setSelectedVerifier] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [isAssigning, setIsAssigning] = useState(false);
   const [filterStatus, setFilterStatus] = useState("all");
   const [filterBranch, setFilterBranch] = useState("all");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   // We'll add functions here in next steps

   useEffect(() => {
      async function fetchData() {
         try {
            setIsLoading(true);

            // Fetch applications and verifiers in parallel
            const [appsResponse, verifiersResponse] = await Promise.all([
               fetch("/api/admin/assignments"),
               fetch("/api/admin/verifiers"),
            ]);

            if (!appsResponse.ok) {
               const error = await appsResponse.json();
               console.error("Applications fetch failed:", appsResponse.status, error);
               
               if (appsResponse.status === 401) {
                  setErrorMessage("Unauthorized. Please login as an admin.");
                  setTimeout(() => router.push('/login'), 2000);
               } else {
                  setErrorMessage(`Failed to fetch applications: ${error.error || 'Unknown error'}`);
               }
               return;
            }

            if (!verifiersResponse.ok) {
               const error = await verifiersResponse.json();
               console.error("Verifiers fetch failed:", verifiersResponse.status, error);
               
               if (verifiersResponse.status === 401) {
                  setErrorMessage("Unauthorized. Please login as an admin.");
                  setTimeout(() => router.push('/login'), 2000);
               } else {
                  setErrorMessage(`Failed to fetch verifiers: ${error.error || 'Unknown error'}`);
               }
               return;
            }

            const appsData = await appsResponse.json();
            const verifiersData = await verifiersResponse.json();

            setApplications(appsData.applications || []);
            setVerifiers(verifiersData.verifiers || []);
         } catch (error) {
            console.error("Error fetching data:", error);
            setErrorMessage(`Network error: ${error instanceof Error ? error.message : 'Failed to fetch data'}`);
         } finally {
            setIsLoading(false);
         }
      }

      fetchData();
   }, [router]);

   // Filter applications based on selected filters
   const filteredApplications = applications.filter((app) => {
      const statusMatch =
         filterStatus === "all" ||
         (filterStatus === "unassigned" && !app.assignedVerifier) ||
         (filterStatus === "assigned" && app.assignedVerifier);

      const branchMatch =
         filterBranch === "all" || app.branchAllotted === filterBranch;

      return statusMatch && branchMatch;
   });

   // Get unique branches for filter dropdown
   const branches = Array.from(
      new Set(applications.map((app) => app.branchAllotted))
   ).sort();

   // Handle individual checkbox toggle
   const toggleAppSelection = (appId: string) => {
      setSelectedApps((prev) =>
         prev.includes(appId)
            ? prev.filter((id) => id !== appId)
            : [...prev, appId]
      );
   };

   // Handle "select all" checkbox
   const toggleSelectAll = () => {
      if (selectedApps.length === filteredApplications.length) {
         // Deselect all
         setSelectedApps([]);
      } else {
         // Select all visible (filtered) applications
         setSelectedApps(filteredApplications.map((app) => app.id));
      }
   };

   // Check if all visible apps are selected
   const allSelected =
      filteredApplications.length > 0 &&
      selectedApps.length === filteredApplications.length;


   const handleBulkAssign = async () => {
      if (!selectedVerifier) {
         alert("Please select a verifier");
         return;
      }

      if (selectedApps.length === 0) {
         alert("No applications selected");
         return;
      }

      // Confirmation dialog
      const selectedVerifierData = verifiers.find((v) => v.id === selectedVerifier);
      const verifierName = selectedVerifierData?.name || selectedVerifierData?.email;

      const confirmed = window.confirm(
         `Assign ${selectedApps.length} application(s) to ${verifierName}?\n\nThis will update their status to IN_REVIEW.`
      );

      if (!confirmed) return;

      setIsAssigning(true);

      try {
         const response = await fetch("/api/admin/assignments/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               applicationIds: selectedApps,
               verifierId: selectedVerifier,
            }),
         });

         const data = await response.json();

         if (response.ok) {
            let message = "";

            if (data.createdCount > 0) {
               message += `✓ Assigned ${data.createdCount} new application(s) to ${data.verifierName}`;
            }

            if (data.reassignedCount > 0) {
               message += (message ? "\n" : "") + `↻ Reassigned ${data.reassignedCount} application(s) to ${data.verifierName}`;
            }

            if (data.skippedCount > 0) {
               message += (message ? "\n" : "") + `○ Skipped ${data.skippedCount} (already assigned to this verifier)`;
            }

            alert(message || "Assignment completed");

            // Clear selections and refresh
            setSelectedApps([]);
            setSelectedVerifier("");

            const appsResponse = await fetch("/api/admin/assignments");
            const appsData = await appsResponse.json();
            if (appsResponse.ok) {
               setApplications(appsData.applications);
            }
         } else {
            alert(`Error: ${data.error || "Failed to assign applications"}`);
         }
      } catch (error) {
         console.error("Error assigning applications:", error);
         alert("An error occurred while assigning applications");
      } finally {
         setIsAssigning(false);
      }
   };

   return (
      <div className={`min-h-screen bg-gray-100 py-8 px-6 md:px-8 ${selectedApps.length > 0 ? "pb-36" : ""}`}>
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-blue-700">Verifier Assignments</h1>
                  <p className="text-gray-600 mt-1">
                     Assign applications to verifiers for review
                  </p>
               </div>
               <button
                  onClick={() => router.push("/admin")}
                  className="text-blue-600 hover:underline text-sm"
               >
                  ← Back to Applications
               </button>
            </div>

            {errorMessage && (
               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
               </div>
            )}

            {isLoading ? (
               <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-600">Loading applications...</p>
               </div>
            ) : (
               <>
               {/* Filters Section */}
               <Card className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <CardContent className="p-0">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Status Filter */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                           </label>
                           <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                           >
                              <option value="all">All Applications</option>
                              <option value="unassigned">Unassigned Only</option>
                              <option value="assigned">Assigned Only</option>
                           </select>
                        </div>

                        {/* Branch Filter */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Branch
                           </label>
                           <select
                              value={filterBranch}
                              onChange={(e) => setFilterBranch(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                           >
                              <option value="all">All Branches</option>
                              {branches.map((branch) => (
                                 <option key={branch} value={branch}>
                                    {branch}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex items-end">
                           <div className="w-full bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <p className="text-sm text-blue-700">Total Applications</p>
                              <p className="text-2xl font-bold text-blue-700">
                                 {filteredApplications.length}
                              </p>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Applications Table */}
               <Card className="p-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px]">
                           <thead className="bg-blue-50 border-b border-gray-200 text-blue-700 uppercase text-xs tracking-wide">
                              <tr>
                                 <th className="p-4 text-left">
                                    <input
                                       type="checkbox"
                                       checked={allSelected}
                                       onChange={toggleSelectAll}
                                       className="w-4 h-4 cursor-pointer accent-blue-600"
                                    />
                                 </th>
                                 <th className="p-4 text-left font-medium">Name</th>
                                 <th className="p-4 text-left font-medium">Email</th>
                                 <th className="p-4 text-left font-medium">Branch</th>
                                 <th className="p-4 text-left font-medium">Status</th>
                                 <th className="p-4 text-left font-medium">
                                    Assigned Verifier
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {filteredApplications.length === 0 ? (
                                 <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                       No applications found
                                    </td>
                                 </tr>
                              ) : (
                                 filteredApplications.map((app) => (
                                    <tr
                                       key={app.id}
                                       className={`border-b border-gray-200 hover:bg-gray-50 text-sm ${selectedApps.includes(app.id) ? "bg-blue-50" : ""
                                          }`}
                                    >
                                       <td className="p-4">
                                          <input
                                             type="checkbox"
                                             checked={selectedApps.includes(app.id)}
                                             onChange={() => toggleAppSelection(app.id)}
                                             className="w-4 h-4 cursor-pointer accent-blue-600"
                                          />
                                       </td>
                                       <td className="p-4 font-medium text-gray-800">{app.name}</td>
                                       <td className="p-4 text-gray-600">{app.email}</td>
                                       <td className="p-4 text-gray-700">{app.branchAllotted}</td>
                                       <td className="p-4">
                                          <span
                                             className={`px-2 py-1 rounded-full text-xs font-medium ${app.applicationStatus === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : app.applicationStatus === "IN_REVIEW"
                                                   ? "bg-blue-100 text-blue-700"
                                                   : app.applicationStatus === "VERIFIED"
                                                      ? "bg-green-100 text-green-700"
                                                      : app.applicationStatus === "REJECTED"
                                                         ? "bg-red-100 text-red-700"
                                                         : "bg-gray-100 text-gray-700"
                                                }`}
                                          >
                                             {app.applicationStatus}
                                          </span>
                                       </td>
                                       <td className="p-4">
                                          {app.assignedVerifier ? (
                                             <div className="text-sm">
                                                <p className="font-medium text-gray-800">
                                                   {app.assignedVerifier.name ||
                                                      app.assignedVerifier.email}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                   {app.assignedVerifier.email}
                                                </p>
                                             </div>
                                          ) : (
                                             <span className="text-gray-400 italic">
                                                Unassigned
                                             </span>
                                          )}
                                       </td>
                                    </tr>
                                 ))
                              )}
                           </tbody>
                        </table>
                     </div>
                  </CardContent>
               </Card>
               {/* Bulk Assignment Panel - Shows when apps selected */}
                {selectedApps.length > 0 && (
                  <div className="fixed bottom-4 left-6 right-6 md:left-8 md:right-8 bg-white border border-gray-200 p-4 rounded-xl shadow-sm z-[70]">
                     <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-auto">
                           <p className="text-sm text-gray-600">
                              {selectedApps.length} application(s) selected
                           </p>
                        </div>

                        <div className="w-full md:flex-1">
                           <select
                              value={selectedVerifier}
                              onChange={(e) => setSelectedVerifier(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              disabled={isAssigning}
                           >
                              <option value="">-- Select Verifier --</option>
                              {verifiers.map((verifier) => (
                                 <option key={verifier.id} value={verifier.id}>
                                    {verifier.name || verifier.email}
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                           <button
                              onClick={handleBulkAssign}
                              disabled={!selectedVerifier || isAssigning}
                              className="rounded-lg px-5 py-2 font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                           >
                              {isAssigning ? "Assigning..." : "Assign Selected"}
                           </button>

                           <button
                              onClick={() => setSelectedApps([])}
                              className="rounded-lg px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                              disabled={isAssigning}
                           >
                              Clear Selection
                           </button>
                        </div>
                     </div>
                  </div>
               )}

            </>
            )}
         </div>
      </div>
   );
}