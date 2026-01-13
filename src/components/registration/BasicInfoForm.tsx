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
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Full Name</FormLabel>
                     <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input type="date" {...field} />
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
                        <Input placeholder="9876543210" {...field} />
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
                        <Input placeholder="Parent/Guardian Name" {...field} />
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
                        <Input placeholder="9876543210" {...field} />
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
                        <Input type="email" placeholder="guardian@example.com" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full mt-6">
               Next: Academic Information
            </Button>
         </form>
      </Form>
   );
}