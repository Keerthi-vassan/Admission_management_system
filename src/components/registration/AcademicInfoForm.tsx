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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AcademicInfoFormData } from "@/lib/validations/student-registration";

interface AcademicInfoFormProps {
   form: UseFormReturn<AcademicInfoFormData>;
   onSubmit: (data: AcademicInfoFormData) => void;
   onBack: () => void;
}

const BRANCHES = [
   { value: "CSE", label: "Computer Science and Engineering" },
   { value: "ECE", label: "Electronics and Communication Engineering" },
   { value: "DSAI", label: "Data Science and Artificial Intelligence" },
];

const INDIAN_STATES = [
   "Andhra Pradesh",
   "Arunachal Pradesh",
   "Assam",
   "Bihar",
   "Chhattisgarh",
   "Goa",
   "Gujarat",
   "Haryana",
   "Himachal Pradesh",
   "Jharkhand",
   "Karnataka",
   "Kerala",
   "Madhya Pradesh",
   "Maharashtra",
   "Manipur",
   "Meghalaya",
   "Mizoram",
   "Nagaland",
   "Odisha",
   "Punjab",
   "Rajasthan",
   "Sikkim",
   "Tamil Nadu",
   "Telangana",
   "Tripura",
   "Uttar Pradesh",
   "Uttarakhand",
   "West Bengal",
   "Andaman and Nicobar Islands",
   "Chandigarh",
   "Dadra and Nagar Haveli and Daman and Diu",
   "Delhi",
   "Jammu and Kashmir",
   "Ladakh",
   "Lakshadweep",
   "Puducherry",
];

export function AcademicInfoForm({ form, onSubmit, onBack }: AcademicInfoFormProps) {
   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-lg md:text-xl font-semibold text-[#2563eb] mt-8 mb-4 border-b border-gray-200 pb-2">
               ACADEMIC DETAILS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Aadhar Number</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="123456789012" maxLength={12} {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="Hindu, Muslim, Christian, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="casteCategory"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Caste Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition">
                                 <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value="GENERAL">General</SelectItem>
                              <SelectItem value="GENERAL_EWS">General-EWS</SelectItem>
                              <SelectItem value="OBC_NCL">OBC-NCL</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="ST">ST</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="branchAllotted"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Branch Allotted</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition">
                                 <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {BRANCHES.map((branch) => (
                                 <SelectItem key={branch.value} value={branch.value}>
                                    {branch.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="seatAllotmentSource"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Seat Allotment Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition">
                                 <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value="JOSSA">JOSSA</SelectItem>
                              <SelectItem value="CSAB">CSAB</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Blood Group (Optional)</FormLabel>
                        <FormControl>
                           <Input className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition" placeholder="A+, B-, O+, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
               <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Permanent Address</FormLabel>
                        <FormControl>
                           <Textarea className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition resize-none min-h-[100px]" placeholder="Full postal address" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition">
                                 <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {INDIAN_STATES.map((state) => (
                                 <SelectItem key={state} value={state}>
                                    {state}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="remarksFromStudent"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Remarks (Optional)</FormLabel>
                        <FormControl>
                           <Textarea className="border-gray-300 focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] rounded-md transition resize-none min-h-[100px]" placeholder="Any additional comments..." {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
               <button
                  type="button"
                  onClick={onBack}
                  className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium px-6 py-2 rounded-md transition order-2 sm:order-1"
               >
                  Back
               </button>
               <button
                  type="submit"
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white font-medium px-6 py-2 rounded-md transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed order-1 sm:order-2"
               >
                  Next: Upload Documents
               </button>
            </div>
         </form>
      </Form>
   );
}