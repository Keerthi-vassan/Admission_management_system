import {auth} from "@root/auth";
import { redirect } from 'next/navigation';
import AdminApplicationsTable from '@/components/admin/AdminApplicationsTable';

export default async function AdminPage() {
   const session = await auth();

   


   if(!session?.user){
      redirect('/login');
   }
   if(session.user.role !== "ADMIN"){
      redirect('/dashboard');
   }

   return(
      <div className="min-h-screen bg-gray-50 p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-3xl font-bold">Admin Dashboard</h1>
               <p className="text-gray-600 mt-2">
                  Manage student applications
               </p>
            </div>

            <AdminApplicationsTable />
         </div>
      </div>

   );



}