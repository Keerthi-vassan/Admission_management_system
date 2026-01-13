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
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="aadharNumber"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Aadhar Number</FormLabel>
                     <FormControl>
                        <Input placeholder="123456789012" maxLength={12} {...field} />
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
                        <Input placeholder="Hindu, Muslim, Christian, etc." {...field} />
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
                           <SelectTrigger>
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
                           <SelectTrigger>
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
                           <SelectTrigger>
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
               name="permanentAddress"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Permanent Address</FormLabel>
                     <FormControl>
                        <Textarea placeholder="Full postal address" {...field} />
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
                           <SelectTrigger>
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
               name="bloodGroup"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Blood Group (Optional)</FormLabel>
                     <FormControl>
                        <Input placeholder="A+, B-, O+, etc." {...field} />
                     </FormControl>
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
                        <Textarea placeholder="Any additional comments..." {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex gap-4 flex-col">
               <Button type="button" variant="outline" onClick={onBack} className="w-full">
                  Back
               </Button>
               <Button type="submit" className="w-full">
                  Next: Upload Documents
               </Button>
            </div>
         </form>
      </Form>
   );
}