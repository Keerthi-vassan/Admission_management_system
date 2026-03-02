"use client"

import { redirect } from 'next/navigation';
import AdminApplicationsTable from '@/components/admin/AdminApplicationsTable';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
   const session = useSession();




   if (!session) {
      redirect('/login');
   }
   if (session?.data?.user.role !== "ADMIN") {
      redirect('/dashboard');
   }

   return (
      <div className="min-h-screen bg-gray-50 p-8">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between">

               <div className="mb-8">
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-2">
                     Manage student applications
                  </p>
               </div>
               <Button variant={'outline'} onClick={() => signOut({redirectTo : "/"})}>
                  Sign Out 
               </Button>

            </div>



            <AdminApplicationsTable />
         </div>
      </div>

   );



}