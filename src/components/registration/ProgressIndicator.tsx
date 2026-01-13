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
      <div className="mb-8">
         <div className="relative flex items-center">
            {steps.map((step, index) => (
               <div key={step.number} className="flex flex-col items-center" style={{ width: '33.33%' }}>
                  {/* Step Circle */}
                  <div
                     className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step.number
                           ? "bg-blue-600 text-white"
                           : "bg-gray-200 text-gray-600"
                        }`}
                  >
                     {step.number}
                  </div>
                  {/* Step Label */}
                  <span className="text-xs mt-2 text-gray-600">{step.label}</span>

                  {/* Connecting Line (not for last step) */}
                  {index < steps.length - 1 && (
                     <div
                        className="absolute top-5 h-0.5 -translate-y-1/2"
                        style={{
                           left: `${(index + 1) * 33.33 - 16.66}%`,
                           right: `${(steps.length - index - 1) * 33.33 - 16.66}%`,
                        }}
                     >
                        <div
                           className={`h-full transition-colors ${currentStep >= step.number + 1 ? "bg-blue-600" : "bg-gray-300"
                              }`}
                        />
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
 }