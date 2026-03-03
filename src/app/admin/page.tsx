import {auth} from "@root/auth";
import { redirect } from 'next/navigation';
import AdminApplicationsTable from '@/components/admin/AdminApplicationsTable';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';

export default async function AdminPage() {
   const session = await auth();

   


   if(!session?.user){
      redirect('/login');
   }
   if(session.user.role !== "ADMIN"){
      redirect('/dashboard');
   }

   return(
      <div className="min-h-screen bg-app-background px-6 md:px-8 py-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-app-primary">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                     Manage student applications
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <Link
                     href="/admin/assignments"
                     className="border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 text-sm font-medium transition"
                  >
                     Assignments
                  </Link>
                  <LogoutButton />
               </div>
            </div>

            <AdminApplicationsTable />
         </div>
      </div>

   );



}