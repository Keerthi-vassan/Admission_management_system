import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOCUMENT_TYPES } from "@/lib/constants/documents";
import { supabase } from "@/lib/supabase";
import { set } from "zod";



interface DocumentUploadFormProps {
   onBack: () => void;
   onSubmit: (documentUrls: Record<string, string>) => void;
   userId: string;
}

export function DocumentUploadForm({ onBack, onSubmit, userId }: DocumentUploadFormProps) {

   const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
   const [uploading, setUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});
   const [errors, setErrors] = useState<Record<string, string>>({});

   const validateFile = (file: File, docType: string) => {
      const doc = DOCUMENT_TYPES.find(d => d.type === docType);

      if (!doc) return "Invalid document type";

      const maxSizeBytes = doc.maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
         return `File size must be less than ${doc.maxSize} MB`;
      }

      const acceptedTypes = doc.accept.split(',');
      if (!acceptedTypes.includes(file.type)) {
         return `Invalid file type. Accepted types: ${doc.accept}`;
      }

      return null;
   }


   const handleFileSelect = (docType: string, file: File | null) => {
      if (!file) {
         setSelectedFiles(prev => {
            const updated = { ...prev };
            delete updated[docType];
            return updated;
         })
         setErrors(prev => {
            const updated = { ...prev };
            delete updated[docType];
            return updated;
         })

         return;
      }

      const error = validateFile(file, docType);
      if (error) {
         setErrors(prev => ({ ...prev, [docType]: error }))
         return;
      }

      setSelectedFiles(prev => ({ ...prev, [docType]: file }));
      setErrors(prev => {
         const updated = { ...prev };
         delete updated[docType];
         return updated;
      });
   }

   const uploadFile = async (docType: string, file: File): Promise<string> => {

      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${userId}/${docType}/${timestamp}_${sanitizedFileName}`;

      const { data, error } = await supabase.storage.from('student-documents').upload(fileName, file, {
         cacheControl: '3600',
         upsert: false,
      })

      if (error) {
         throw new Error(`Failed to upload file: ${error.message}`);
      }

      const { data: urlData } = supabase.storage.from('student-documents').getPublicUrl(fileName);

      return urlData.publicUrl;
   }

   const handleSubmit = async () => {
      const missingDocs = DOCUMENT_TYPES.filter(
         doc => !selectedFiles[doc.type]
      );

      if (missingDocs.length > 0) {
         alert(`Please select all required documents. Missing: ${missingDocs.map(d => d.label).join(', ')}`);
         return;
      }

      setUploading(true);
      const documentUrls: Record<string, string> = {};

      try {
         for (const docType of Object.keys(selectedFiles)) {
            setUploadProgress(prev => ({ ...prev, [docType]: true }));
            const url = await uploadFile(docType, selectedFiles[docType]);
            documentUrls[docType] = url;
         }

         onSubmit(documentUrls);
      } catch (error) {
         console.error('Upload error:', error);
         alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
         setUploading(false);
      }
   };

   return (
      <div className="space-y-6">
         <div className="space-y-4">
            {DOCUMENT_TYPES.map((doc) => (
               <div key={doc.type} className="space-y-2">
                  <Label htmlFor={doc.type}>
                     {doc.label}
                     {uploadProgress[doc.type] && (
                        <span className="ml-2 text-green-600 text-sm">✓ Uploaded</span>
                     )}
                  </Label>
                  <Input
                     id={doc.type}
                     type="file"
                     accept={doc.accept}
                     onChange={(e) => handleFileSelect(doc.type, e.target.files?.[0] || null)}
                     disabled={uploading}
                  />
                  {errors[doc.type] && (
                     <p className="text-sm text-red-600">{errors[doc.type]}</p>
                  )}
                  {selectedFiles[doc.type] && !errors[doc.type] && (
                     <p className="text-sm text-gray-600">
                        Selected: {selectedFiles[doc.type].name} ({(selectedFiles[doc.type].size / 1024 / 1024).toFixed(2)} MB)
                     </p>
                  )}
               </div>
            ))}
         </div>

         <div className="flex gap-4 flex-col">
            <Button
               type="button"
               variant="outline"
               onClick={onBack}
               disabled={uploading}
               className="w-full"
            >
               Back
            </Button>
            <Button
               type="button"
               onClick={handleSubmit}
               disabled={uploading || Object.keys(selectedFiles).length !== DOCUMENT_TYPES.length}
               className="w-full"
            >
               {uploading ? "Uploading..." : "Submit Application"}
            </Button>
         </div>
      </div>
   );
}