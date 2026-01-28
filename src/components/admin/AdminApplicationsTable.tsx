"use client"

import { useEffect, useState } from "react"
import { Card } from '@/components/ui/card';
import { useRouter } from "next/navigation";
import { ApplicationListItem } from "@/types/index";

export default function AdminApplicationsTable() {
   const router = useRouter();

   const [applications, setApplications] = useState<ApplicationListItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<string>("ALL");
   const [branchFilter, setBranchFilter] = useState<string>("ALL");

   useEffect(() => { fetchApplications() }, []);

   // Filter applications based on search query and filters
   const filteredApplications = applications.filter((app) => {
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
         app.name.toLowerCase().includes(query) ||
         app.user.email.toLowerCase().includes(query) ||
         app.branchAllotted.toLowerCase().includes(query);

      // Status filter
      const matchesStatus = statusFilter === "ALL" || app.applicationStatus === statusFilter;

      // Branch filter
      const matchesBranch = branchFilter === "ALL" || app.branchAllotted === branchFilter;

      return matchesSearch && matchesStatus && matchesBranch;
   });

   // Get unique branches and statuses for dropdown options
   const uniqueBranches = Array.from(new Set(applications.map(app => app.branchAllotted)));
   const uniqueStatuses = Array.from(new Set(applications.map(app => app.applicationStatus)));

   const stats = {
      total: applications.length,
      pending: applications.filter(app => app.applicationStatus === "PENDING").length,
      inReview: applications.filter(app => app.applicationStatus === "IN_REVIEW").length,
      verified: applications.filter(app => app.applicationStatus === "VERIFIED").length,
      rejected: applications.filter(app => app.applicationStatus === "REJECTED").length,
   };

   

   async function fetchApplications() {
      try {
         const res = await fetch("/api/admin/applications");

         if (!res.ok) {
            throw new Error("Failed to fetch applications");
         }

         const data = await res.json();
         setApplications(data.applications);
      }
      catch (err) {
         setError(err instanceof Error ? err.message : "Error loading applications")
      } finally {
         setLoading(false);
      }
   }

   if (loading) {
      return <div className="text-center py-8">Loading Applications...</div>
   }

   if (error) {
      return (
         <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
         </Card>
      );
   }


   return (

      
      <div className="space-y-4">


         {/* Search and Filters */}
         <Card className="p-4">
            <div className="space-y-4">
               {/* Search Bar */}
               <div className="flex items-center gap-4">
                  <div className="flex-1">
                     <input
                        type="text"
                        placeholder="Search by name, email, or branch..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  {searchQuery && (
                     <button
                        onClick={() => setSearchQuery("")}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                     >
                        Clear
                     </button>
                  )}
               </div>

               {/* Filter Dropdowns */}
               <div className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                     {/* Status Filter */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Status
                        </label>
                        <select
                           value={statusFilter}
                           onChange={(e) => setStatusFilter(e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="ALL">All Statuses</option>
                           {uniqueStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                           ))}
                        </select>
                     </div>

                     {/* Branch Filter */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Branch
                        </label>
                        <select
                           value={branchFilter}
                           onChange={(e) => setBranchFilter(e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="ALL">All Branches</option>
                           {uniqueBranches.map(branch => (
                              <option key={branch} value={branch}>{branch}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {/* Clear All Filters Button */}
                  {(statusFilter !== "ALL" || branchFilter !== "ALL" || searchQuery) && (
                     <button
                        onClick={() => {
                           setSearchQuery("");
                           setStatusFilter("ALL");
                           setBranchFilter("ALL");
                        }}
                        className="px-4 py-2 text-sm mt-auto bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                     >
                        Clear All
                     </button>
                  )}
               </div>

               {/* Stats Overview Cards - Dynamic flex layout */}
               <div className="flex flex-wrap gap-2 md:gap-4">
                  {/* Total Applications - Always show */}
                  <Card className="p-3 md:p-4 flex-1 min-w-[140px] md:min-w-[160px] max-w-[300px]">
                     <div className="text-xs md:text-sm text-gray-600 mb-1">Total</div>
                     <div className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}</div>
                  </Card>

                  {/* Pending - Show if count > 0 */}
                  {stats.pending > 0 && (
                     <Card className="p-3 md:p-4 flex-1 min-w-[140px] md:min-w-[160px] bg-yellow-50 border-yellow-200 max-w-[300px]">
                        <div className="text-xs md:text-sm text-yellow-800 mb-1">Pending</div>
                        <div className="text-lg md:text-2xl font-bold text-yellow-900">{stats.pending}</div>
                     </Card>
                  )}

                  {/* In Review - Show if count > 0 */}
                  {stats.inReview > 0 && (
                     <Card className="p-3 md:p-4 flex-1 min-w-[140px] md:min-w-[160px] bg-blue-50 border-blue-200 max-w-[300px]">
                        <div className="text-xs md:text-sm text-blue-800 mb-1">In Review</div>
                        <div className="text-lg md:text-2xl font-bold text-blue-900">{stats.inReview}</div>
                     </Card>
                  )}

                  {/* Verified - Show if count > 0 */}
                  {stats.verified > 0 && (
                     <Card className="p-3 md:p-4 flex-1 min-w-[140px] md:min-w-[160px] bg-green-50 border-green-200 max-w-[300px]">
                        <div className="text-xs md:text-sm text-green-800 mb-1">Verified</div>
                        <div className="text-lg md:text-2xl font-bold text-green-900">{stats.verified}</div>
                     </Card>
                  )}

                  {/* Rejected - Show if count > 0 */}
                  {stats.rejected > 0 && (
                     <Card className="p-3 md:p-4 flex-1 min-w-[140px] md:min-w-[160px] bg-red-50 border-red-200 max-w-[300px]">
                        <div className="text-xs md:text-sm text-red-800 mb-1">Rejected</div>
                        <div className="text-lg md:text-2xl font-bold text-red-900">{stats.rejected}</div>
                     </Card>
                  )}
               </div>

               {/* Results Count */}
               <div className="text-sm text-gray-600">
                  Showing {filteredApplications.length} of {applications.length} applications
               </div>
            </div>
         </Card>



         {/* Applications Table */}
         <Card className="overflow-hidden py-0">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Branch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Documents
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {filteredApplications.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              {searchQuery ? "No applications match your search" : "No applications found"}
                           </td>
                        </tr>
                     ) : (
                        filteredApplications.map((app) => (
                           <tr
                              key={app.id}
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => router.push(`/admin/applications/${app.id}`)}
                           >
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm font-medium text-gray-900">
                                    {app.name}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-500">
                                    {app.user.email}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{app.branchAllotted}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${app.applicationStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                                    ${app.applicationStatus === "IN_REVIEW" ? "bg-blue-100 text-blue-800" : ""}
                                    ${app.applicationStatus === "VERIFIED" ? "bg-green-100 text-green-800" : ""}
                                    ${app.applicationStatus === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                                 `}>
                                    {app.applicationStatus}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {new Date(app.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {app.documents.length} uploaded
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
   );
}