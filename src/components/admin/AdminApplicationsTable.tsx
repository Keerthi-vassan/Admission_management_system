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

      
      <div className="space-y-6">

         {/* Stats Overview Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-app-card rounded-xl shadow-sm border border-app-border p-6 text-center">
               <div className="text-3xl font-bold text-app-primary">{stats.total}</div>
               <div className="text-xs uppercase tracking-wide text-app-muted mt-2">Total Applications</div>
            </div>
            <div className="bg-app-card rounded-xl shadow-sm border border-app-border p-6 text-center">
               <div className="text-3xl font-bold text-app-primary">{stats.pending}</div>
               <div className="text-xs uppercase tracking-wide text-app-muted mt-2">Pending</div>
            </div>
            <div className="bg-app-card rounded-xl shadow-sm border border-app-border p-6 text-center">
               <div className="text-3xl font-bold text-app-primary">{stats.verified}</div>
               <div className="text-xs uppercase tracking-wide text-app-muted mt-2">Verified</div>
            </div>
            <div className="bg-app-card rounded-xl shadow-sm border border-app-border p-6 text-center">
               <div className="text-3xl font-bold text-app-primary">{stats.inReview}</div>
               <div className="text-xs uppercase tracking-wide text-app-muted mt-2">In Review</div>
            </div>
         </div>


         {/* Search and Filters */}
         <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
               <input
                  type="text"
                  placeholder="Search by name, email, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
               />
            </div>

            {/* Status Filter */}
            <div>
               <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
               >
                  <option value="ALL">All Statuses</option>
                  {uniqueStatuses.map(status => (
                     <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
               </select>
            </div>

            {/* Branch Filter */}
            <div>
               <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
               >
                  <option value="ALL">All Branches</option>
                  {uniqueBranches.map(branch => (
                     <option key={branch} value={branch}>{branch}</option>
                  ))}
               </select>
            </div>

            {/* Clear Filters */}
            {(statusFilter !== "ALL" || branchFilter !== "ALL" || searchQuery) && (
               <button
                  onClick={() => {
                     setSearchQuery("");
                     setStatusFilter("ALL");
                     setBranchFilter("ALL");
                  }}
                  className="rounded-lg px-4 py-2 text-sm bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
               >
                  Clear All
               </button>
            )}
         </div>

         {/* Results Count */}
         <div className="text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
         </div>


         {/* Applications Table */}
         <div className="bg-app-card rounded-xl shadow-sm border border-app-border overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-blue-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Branch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-primary uppercase tracking-wide">
                           Action
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white">
                     {filteredApplications.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-8 text-center text-app-muted">
                              {searchQuery ? "No applications match your search" : "No applications found"}
                           </td>
                        </tr>
                     ) : (
                        filteredApplications.map((app) => (
                           <tr
                              key={app.id}
                              className="border-b border-app-border hover:bg-gray-50"
                           >
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm font-medium text-gray-900">
                                    {app.name}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-app-muted">
                                    {app.user.email}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{app.branchAllotted}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                    ${app.applicationStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                                    ${app.applicationStatus === "IN_REVIEW" ? "bg-blue-100 text-blue-700" : ""}
                                    ${app.applicationStatus === "DOCUMENTS_REJECTED" ? "bg-red-100 text-red-700" : ""}
                                    ${app.applicationStatus === "VERIFIED" ? "bg-green-100 text-green-700" : ""}
                                    ${app.applicationStatus === "FEE_PENDING" ? "bg-orange-100 text-orange-700" : ""}
                                    ${app.applicationStatus === "CONFIRMED" ? "bg-green-200 text-green-800" : ""}
                                    ${app.applicationStatus === "REJECTED" ? "bg-red-200 text-red-800" : ""}
                                 `}>
                                    {app.applicationStatus.replace(/_/g, ' ')}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                 {new Date(app.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <button
                                    onClick={() => router.push(`/admin/applications/${app.id}`)}
                                    className="bg-app-primary text-white hover:bg-blue-900 rounded-md px-3 py-1 text-sm transition"
                                 >
                                    View
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}