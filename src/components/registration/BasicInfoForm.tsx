import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BasicInfoFormData } from "@/lib/validations/student-registration";

interface BasicInfoFormProps {
   form: UseFormReturn<BasicInfoFormData>;
   onSubmit: (data: BasicInfoFormData) => void;
}

export function BasicInfoForm({ form, onSubmit }: BasicInfoFormProps) {
   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-lg md:text-xl font-semibold text-[#2563eb] mt-8 mb-4 border-b border-gray-200 pb-2">
               PERSONAL DETAILS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Guardian Name</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="Parent/Guardian Name" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="guardianNumber"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Guardian Contact Number</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="guardianEmail"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Guardian Email</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" type="email" placeholder="guardian@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
               <button
                  type="submit"
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white font-medium px-6 py-2 rounded-md transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
               >
                  Next: Academic Information
               </button>
            </div>
         </form>
      </Form>
   );
}