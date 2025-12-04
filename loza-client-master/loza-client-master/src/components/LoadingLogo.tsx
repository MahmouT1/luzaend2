"use client";

const LoadingLogo = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative">
        {/* Modern LC Logo - Elegant and Professional with Rotation */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 animate-spin-slow">
          {/* L Letter - Modern serif style */}
          <div className="absolute inset-0 flex items-center justify-start pl-1">
            <svg
              width="64"
              height="80"
              viewBox="0 0 64 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90 animate-fade-in-out"
            >
              <path
                d="M8 8V72H56V64H16V8H8Z"
                fill="currentColor"
                className="text-black"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          
          {/* C Letter - Overlapping with L, elegant serif style */}
          <div className="absolute inset-0 flex items-center justify-start translate-x-10 sm:translate-x-12">
            <svg
              width="64"
              height="80"
              viewBox="0 0 64 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90 animate-fade-in-out-delayed"
            >
              <path
                d="M40 8C52.1503 8 64 19.8497 64 32C64 44.1503 52.1503 56 40 56H32V48H40C48.8366 48 56 40.8366 56 32C56 23.1634 48.8366 16 40 16H32V8H40Z"
                fill="currentColor"
                className="text-black"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;

