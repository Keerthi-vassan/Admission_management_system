import { auth } from "@root/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
   // Check authentication on server
   const session = await auth()

   // No session? Redirect to login
   if (!session?.user) {
      redirect("/login")
   }

   // User is authenticated - show dashboard
   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                     Dashboard
                  </h1>
                  <form action="/api/auth/signout" method="POST">
                     <Button type="submit" variant="outline">
                        Sign Out
                     </Button>
                  </form>
               </div>
            </div>
         </header>

         {/* Main Content */}
         <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow">
               <h2 className="text-xl font-semibold mb-4">
                  Welcome to Your Dashboard
               </h2>

               <div className="space-y-3 text-gray-700">
                  <p>
                     <span className="font-medium">Email:</span> {session.user.email}
                  </p>
                  <p>
                     <span className="font-medium">Role:</span> {session.user.role}
                  </p>
                  <p>
                     <span className="font-medium">Name:</span>{" "}
                     {session.user.name || "Not provided"}
                  </p>
               </div>

               <div className="mt-6 rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                     ✅ Authentication is working! You are successfully logged in.
                  </p>
               </div>

               <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p className="font-medium">What this proves:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                     <li>User signup works (password hashing)</li>
                     <li>Login authentication works (password comparison)</li>
                     <li>Session management works (JWT with role)</li>
                     <li>Protected routes work (server-side check)</li>
                  </ul>
               </div>
            </div>
         </main>
      </div>
   )
}