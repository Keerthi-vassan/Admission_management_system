"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

            const appsData = await appsResponse.json();
            const verifiersData = await verifiersResponse.json();

            if (appsResponse.ok && verifiersResponse.ok) {
               setApplications(appsData.applications);
               setVerifiers(verifiersData.verifiers);
            } else {
               console.error("Failed to fetch data");
            }
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setIsLoading(false);
         }
      }

      fetchData();
   }, []);

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
      <div className="p-6 max-w-7xl mx-auto">
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Verifier Assignments</h1>
            <p className="text-gray-600 mt-2">
               Assign applications to verifiers for review
            </p>
         </div>

         {isLoading ? (
            <div className="text-center py-12">
               <p className="text-gray-600">Loading applications...</p>
            </div>
         ) : (
            <>
               {/* Filters Section */}
               <Card className="mb-6">
                  <CardContent className="pt-6">
                     <div className="flex flex-wrap gap-4">
                        {/* Status Filter */}
                        <div className="flex-1 min-w-[200px]">
                           <label className="block text-sm font-medium mb-2">
                              Status
                           </label>
                           <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="w-full p-2 border rounded-md"
                           >
                              <option value="all">All Applications</option>
                              <option value="unassigned">Unassigned Only</option>
                              <option value="assigned">Assigned Only</option>
                           </select>
                        </div>

                        {/* Branch Filter */}
                        <div className="flex-1 min-w-[200px]">
                           <label className="block text-sm font-medium mb-2">
                              Branch
                           </label>
                           <select
                              value={filterBranch}
                              onChange={(e) => setFilterBranch(e.target.value)}
                              className="w-full p-2 border rounded-md"
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
                        <div className="flex-1 min-w-[200px] flex items-end">
                           <div className="p-3 bg-blue-50 rounded-md w-full">
                              <p className="text-sm text-gray-600">Total Applications</p>
                              <p className="text-2xl font-bold text-blue-600">
                                 {filteredApplications.length}
                              </p>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Applications Table */}
               <Card className="p-0">
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead className="bg-gray-50 border-b">
                              <tr>
                                 <th className="p-4 text-left">
                                    <input
                                       type="checkbox"
                                       checked={allSelected}
                                       onChange={toggleSelectAll}
                                       className="w-4 h-4 cursor-pointer"
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
                                       className={`border-b hover:bg-gray-50 ${selectedApps.includes(app.id) ? "bg-blue-50" : ""
                                          }`}
                                    >
                                       <td className="p-4">
                                          <input
                                             type="checkbox"
                                             checked={selectedApps.includes(app.id)}
                                             onChange={() => toggleAppSelection(app.id)}
                                             className="w-4 h-4 cursor-pointer"
                                          />
                                       </td>
                                       <td className="p-4 font-medium">{app.name}</td>
                                       <td className="p-4 text-gray-600">{app.email}</td>
                                       <td className="p-4">{app.branchAllotted}</td>
                                       <td className="p-4">
                                          <span
                                             className={`px-2 py-1 rounded-full text-xs font-medium ${app.applicationStatus === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : app.applicationStatus === "IN_REVIEW"
                                                   ? "bg-blue-100 text-blue-800"
                                                   : app.applicationStatus === "VERIFIED"
                                                      ? "bg-green-100 text-green-800"
                                                      : "bg-gray-100 text-gray-800"
                                                }`}
                                          >
                                             {app.applicationStatus}
                                          </span>
                                       </td>
                                       <td className="p-4">
                                          {app.assignedVerifier ? (
                                             <div className="text-sm">
                                                <p className="font-medium">
                                                   {app.assignedVerifier.name ||
                                                      app.assignedVerifier.email}
                                                </p>
                                                <p className="text-gray-500 text-xs">
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
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
                     <div className="max-w-7xl mx-auto flex items-center gap-4">
                        <div className="flex-1">
                           <p className="font-medium">
                              {selectedApps.length} application(s) selected
                           </p>
                        </div>

                        <div className="flex-1">
                           <select
                              value={selectedVerifier}
                              onChange={(e) => setSelectedVerifier(e.target.value)}
                              className="w-full p-2 border rounded-md"
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

                        <button
                           onClick={handleBulkAssign}
                           disabled={!selectedVerifier || isAssigning}
                           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                           {isAssigning ? "Assigning..." : "Assign Selected"}
                        </button>

                        <button
                           onClick={() => setSelectedApps([])}
                           className="px-4 py-2 border rounded-md hover:bg-gray-50"
                           disabled={isAssigning}
                        >
                           Clear Selection
                        </button>
                     </div>
                  </div>
               )}

            </>
         )}
      </div>
   );
}