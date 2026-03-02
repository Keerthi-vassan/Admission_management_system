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
      const fileName = `${userId}/${docType}/${timestamp}-${sanitizedFileName}`;

      const { data, error } = await supabase.storage
         .from('student-documents')
         .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
         });

      if (error) {
         throw new Error(`Upload failed: ${error.message}`);
      }

      // ✅ CHANGE THIS LINE - return path, not URL
      return fileName; // Changed from: urlData.publicUrl
   };

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
      <div>
         <h2 className="text-lg md:text-xl font-semibold text-[#2563eb] mt-8 mb-4 border-b border-gray-200 pb-2">
            DOCUMENTS
         </h2>

         <div className="grid grid-cols-1 gap-6">
            {DOCUMENT_TYPES.map((doc) => (
               <div key={doc.type}>
                  <Label htmlFor={doc.type} className="block mb-2">
                     {doc.label}
                     {uploadProgress[doc.type] && (
                        <span className="ml-2 text-[#16a34a] text-sm">✓ Uploaded</span>
                     )}
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#3b82f6] transition cursor-pointer">
                     <Input
                        id={doc.type}
                        type="file"
                        accept={doc.accept}
                        onChange={(e) => handleFileSelect(doc.type, e.target.files?.[0] || null)}
                        disabled={uploading}
                        className="cursor-pointer"
                     />
                     {!selectedFiles[doc.type] && (
                        <p className="text-sm text-[#6b7280]">Click to select {doc.label.toLowerCase()}</p>
                     )}
                  </div>
                  {errors[doc.type] && (
                     <p className="text-sm text-red-600 mt-2">{errors[doc.type]}</p>
                  )}
                  {selectedFiles[doc.type] && !errors[doc.type] && (
                     <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedFiles[doc.type].name} ({(selectedFiles[doc.type].size / 1024 / 1024).toFixed(2)} MB)
                     </p>
                  )}
               </div>
            ))}
         </div>

         <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
               type="button"
               onClick={onBack}
               disabled={uploading}
               className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium px-6 py-2 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed order-2 sm:order-1"
            >
               Back
            </button>
            <button
               type="button"
               onClick={handleSubmit}
               disabled={uploading || Object.keys(selectedFiles).length !== DOCUMENT_TYPES.length}
               className="bg-[#16a34a] hover:bg-[#15803d] text-white font-medium px-6 py-2 rounded-md transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed order-1 sm:order-2"
            >
               {uploading ? "Uploading..." : "Submit Application"}
            </button>
         </div>
      </div>
   );
}