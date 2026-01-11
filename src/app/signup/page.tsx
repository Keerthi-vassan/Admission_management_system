"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define validation schema
const formSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   name: z.string().optional(),
})

export default function SignupPage() {
   const [error, setError] = useState("")
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
            setError(data.error || "Signup failed")
            setLoading(false)
            return
         }

         // Success - redirect to login
         router.push("/login?message=Account created! Please login.")
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
               <p className="mt-2 text-sm text-gray-600">
                  Sign up to get started
               </p>
            </div>

            {error && (
               <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
               </div>
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
                              <Input
                                 type="password"
                                 placeholder="Enter password"
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
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     className="w-full"
                     disabled={loading}
                  >
                     {loading ? "Creating account..." : "Sign Up"}
                  </Button>
               </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
               Already have an account?{" "}
               <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
               >
                  Sign in
               </a>
            </p>
         </div>
      </div>
   )
}