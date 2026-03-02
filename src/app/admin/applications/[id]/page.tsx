import {auth} from "@root/auth"
import { redirect } from "next/navigation";
import ApplicationDetail from "@/components/admin/ApplicationDetail";


type Props = {
   params: Promise<{
      id: string;
   }>;
};

export default async function ApplicationDetailPage({ params }: Props) {
   const session = await auth();

   // ✅ THIS LINE IS CRITICAL
   const { id } = await params;

   if (!session?.user) {
      redirect("/login");
   }

   if (session.user.role !== "ADMIN") {
      redirect("/dashboard");
   }

   return (
      <div className="min-h-screen bg-gray-100 px-6 md:px-8 py-8">
         <div className="max-w-7xl mx-auto">
            <ApplicationDetail applicationId={id} />
         </div>
      </div>
   );
 }