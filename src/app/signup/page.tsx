"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert } from "@/components/ui/alert"

// Define validation schema
const formSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   name: z.string().optional(),
})

export default function SignupPage() {
   const [error, setError] = useState("")
   const [success, setSuccess] = useState("")
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   // Initialize form with RHF
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
         name: "",
      },
   })

   // Submit handler
   async function onSubmit(values: z.infer<typeof formSchema>) {
      setError("")
      setLoading(true)

      try {
         const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
         })

         const data = await response.json()

         if (!response.ok) {
            setError(data.error || "Email already in use, please use another.")
            setLoading(false)
            return
         }

         // Success - redirect to login
         setSuccess("Account created! Please login.")
         setTimeout(() => {
            setSuccess("")
            router.push("/login")
         }, 2500)
      } catch (error) {
         console.error("Signup error:", error) // This line already exists
         console.error("Full error details:", JSON.stringify(error, null, 2)) // ADD THIS LINE
         return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
         )
       }
   }

   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f2f4f8] px-4">
         <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="text-center">
               <h1 className="mb-2 text-3xl font-semibold text-[#0f3d91]">Create Account</h1>
               <p className="text-center text-gray-500 mb-6">
                  Sign up to get started
               </p>
            </div>

            {error && (
               <Alert message={error} type="error" onClose={() => setError("")} />
            )}

            {success && (
               <Alert message={success} type="success" onClose={() => setSuccess("")} />
            )}

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="your.email@example.com"
                                 className="border-gray-300 focus:ring-2 focus:ring-[#0f3d91] focus:border-[#0f3d91] rounded-md transition"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <PasswordInput
                                 placeholder="Enter password"
                                 className="border-gray-300 focus:ring-2 focus:ring-[#0f3d91] focus:border-[#0f3d91] rounded-md transition"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name (Optional)</FormLabel>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="Your name"
                                 className="border-gray-300 focus:ring-2 focus:ring-[#0f3d91] focus:border-[#0f3d91] rounded-md transition"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     className="w-full bg-[#0f3d91] hover:bg-[#0c2f70] text-white font-medium rounded-md py-2 transition shadow-sm"
                     disabled={loading}
                  >
                     {loading ? "Creating account..." : "Sign Up"}
                  </Button>
               </form>
            </Form>
         </div>

         <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
               href="/login"
               className="font-medium text-[#0f3d91] hover:underline"
            >
               Sign in
            </a>
         </p>
      </div>
   )
}