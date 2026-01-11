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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
               <p className="mt-2 text-sm text-gray-600">
                  Sign in to your account
               </p>
            </div>

            {/* Success message from signup */}
            {message && (
               <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-800">{message}</p>
               </div>
            )}

            {/* Error message */}
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

                  <Button
                     type="submit"
                     className="w-full"
                     disabled={loading}
                  >
                     {loading ? "Signing in..." : "Sign In"}
                  </Button>
               </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
               Don't have an account?{" "}
               <a
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
               >
                  Sign up
               </a>
            </p>
         </div>
      </div>
   )
}