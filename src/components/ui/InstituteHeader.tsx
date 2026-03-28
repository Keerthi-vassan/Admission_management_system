import Image from "next/image";

export function InstituteHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-center relative gap-2 md:gap-0">
          <div className="md:absolute md:left-0 flex justify-center w-full md:w-auto">
            <Image
              src="/iiitdwd-logo.png"
              alt="IIIT Dharwad Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="text-app-primary font-semibold text-base sm:text-lg md:text-xl leading-tight">
              Indian Institute of Information Technology, Dharwad
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-snug">
              Institute of National Importance by An Act of Parliament
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
