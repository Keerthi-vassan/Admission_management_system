import { redirect } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
   return (
      <div className="min-h-screen bg-[#f2f4f8] flex items-center justify-center px-4 py-12">
         <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-[#0f3d91] mb-4">
               Admission Management System
            </h1>
            <p className="text-lg text-gray-600 mb-8">
               Welcome to IIIT Dharwad's centralized admission platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link
                  href="/login"
                  className="bg-[#0f3d91] hover:bg-[#0c2f70] text-white font-medium rounded-md px-8 py-3 transition shadow-sm"
               >
                  Sign In
               </Link>
               <Link
                  href="/signup"
                  className="border-2 border-[#0f3d91] text-[#0f3d91] hover:bg-[#f2f4f8] font-medium rounded-md px-8 py-3 transition"
               >
                  Sign Up
               </Link>
            </div>
         </div>
      </div>
   )
}