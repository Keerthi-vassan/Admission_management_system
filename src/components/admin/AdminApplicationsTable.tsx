"use client"

import { useEffect , useState } from "react"
import { Card } from '@/components/ui/card';
import { DocumentType } from '../../lib/constants/documents';

type Application = {
   id : string,
   name :  string , 
   branchAllotted : string ,
   applicationStatus : string,
   createdAt : string ,
   user : {
      email : string ,
   },
   documents : Array<{
      id : string,
      DocumentType : string,
      status : string,
   }>
};

export default function AdminApplicationsTable(){
   const [applications , setApplications ] = useState<Application[]>([]);
   const [loading ,setLoading] = useState(true);
   const [error , setError] = useState("");

   useEffect(()=> {fetchApplications() }, []);

   async function fetchApplications(){
      try{
         const res = await fetch("/api/admin/applications");

         if(!res.ok){
            throw new Error("Failed to fetch applications");
         }

         const data = await res.json();

         setApplications(data.applications);
      }
      catch(err){
         setError(err instanceof Error ? err.message : "Error loading applications" )
      }finally{
         setLoading(false);
      }
   }

   if(loading){
      return  <div className="text-center py-8">Loading Applications...</div>
   }

   if(error){
      return(
         <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
         </Card>
      );
   }


   return(
      <Card className="overflow-hidden">
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
                  {applications.map((app) => (
                     <tr
                        key={app.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                           // We'll add detail view routing in Session 2
                           console.log("Clicked application:", app.id);
                        }}
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
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
   );

}