import { Button } from "@/components/ui/button";

interface DocumentUploadFormProps {
   onBack: () => void;
}

export function DocumentUploadForm({ onBack }: DocumentUploadFormProps) {
   return (
      <div className="space-y-6">
         <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Document Uploads</h3>
            <p className="text-gray-600">
               This section will be implemented in the next session.
               <br />
               You'll upload 12 required documents here.
            </p>
         </div>
         <Button type="button" variant="outline" onClick={onBack} className="w-full">
            Back to Academic Information
         </Button>
      </div>
   );
}