interface ProgressIndicatorProps {
   currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
   const steps = [
      { number: 1, label: "Basic Info" },
      { number: 2, label: "Academic" },
      { number: 3, label: "Documents" },
   ];

   return (
      <div className="flex items-center justify-between mt-6 mb-8 gap-4">
         {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
               {/* Step Circle */}
               <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                     currentStep > step.number
                        ? "bg-[#16a34a] text-white border-2 border-[#16a34a]"
                        : currentStep === step.number
                        ? "bg-[#3b82f6] text-white border-2 border-[#3b82f6]"
                        : "border-2 border-gray-300 text-gray-500"
                  }`}
               >
                  {currentStep > step.number ? "✓" : step.number}
               </div>

               {/* Connector Line (not for last step) */}
               {index < steps.length - 1 && (
                  <div
                     className={`flex-1 h-1 mx-2 transition-colors ${
                        currentStep > step.number ? "bg-[#16a34a]" : "bg-gray-300"
                     }`}
                  />
               )}
            </div>
         ))}
      </div>
   );
 }