"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert } from "@/components/ui/alert"

// Validation schema (simpler - only email and password)
const formSchema = z.object({
   email: z.email("Please enter a valid email address"),
   password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const router = useRouter()
   const searchParams = useSearchParams()

   // Get success message from signup redirect
   const message = searchParams.get("message")

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   })

   async function onSubmit(values: z.infer<typeof formSchema>) {
      setError("")
      setLoading(true)

      try {
         const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
            callbackUrl: "/dashboard",
         })

         if (result?.error) {
            setError("Invalid email or password")
            setLoading(false)
            return
         }

         if (result?.ok) {
            // Force page reload to get fresh session
            window.location.href = "/dashboard"
         }
      } catch (error) {
         setError("Something went wrong")
         setLoading(false)
      }
   }

   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f2f4f8] px-4">
         <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="text-center">
               <h1 className="mb-2 text-3xl font-semibold text-[#0f3d91]">Welcome Back</h1>
               <p className="text-center text-gray-500 mb-6">
                  Sign in to your account
               </p>
            </div>

            {/* Success message from signup */}
            {message && (
               <Alert message={message} type="success" onClose={() => {}} />
            )}

            {/* Error message */}
            {error && (
               <Alert message={error} type="error" onClose={() => setError("")} />
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

                  <Button
                     type="submit"
                     className="w-full bg-[#0f3d91] hover:bg-[#0c2f70] text-white font-medium rounded-md py-2 transition shadow-sm"
                     disabled={loading}
                  >
                     {loading ? "Signing in..." : "Sign In"}
                  </Button>
               </form>
            </Form>
         </div>

         <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
               href="/signup"
               className="font-medium text-[#0f3d91] hover:underline"
            >
               Sign up
            </a>
         </p>
      </div>
   )
}