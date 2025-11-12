import AnimatedStars from './AnimatedStars'

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <AnimatedStars />
      {/* Header */}
      <header className="bg-transparent shadow-sm border-b border-gray-700/30 flex-shrink-0 relative z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/srm-logo.png" 
              alt="SRM Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-400/50"
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 poppins-font text-center">
              Smart Resume Modifier
            </h1>
          </div>
          {/* Desktop/Tablet Button Skeletons - Hidden on Mobile */}
          <div className="hidden sm:flex gap-3">
            <div className="px-4 py-2 bg-gray-700 rounded-md w-24 h-10 animate-pulse"></div>
            <div className="px-4 py-2 bg-gray-700 rounded-md w-28 h-10 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Loading Layout: Responsive */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Left Side Panel - Analysis */}
        <div className="w-full lg:w-1/4 bg-black/10 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-700/30 flex flex-col overflow-hidden relative z-10 mx-1 lg:mx-0 mb-2 lg:mb-0 rounded-lg lg:rounded-none">
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Changes Made Section Skeleton */}
            <div className="mb-6">
              <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions Section Skeleton */}
            <div>
              <div className="h-6 bg-gray-700 rounded w-28 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Panel - Resume Display */}
        <div className="flex-1 bg-black/10 backdrop-blur-sm flex flex-col overflow-hidden relative z-10 mx-1 lg:mx-0 rounded-lg lg:rounded-none">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/30 flex-shrink-0">
            <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>
          <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-hidden">
            <div className="w-full h-full border border-gray-600/30 rounded-md p-4 bg-black/10 backdrop-blur-sm">
              {/* Resume content skeleton */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((line) => (
                  <div key={line} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Button Skeletons - Bottom of Resume */}
              <div className="sm:hidden mt-6 flex flex-col gap-3 w-full">
                <div className="w-full px-4 py-3 bg-gray-700 rounded-md h-12 animate-pulse"></div>
                <div className="w-full px-4 py-3 bg-gray-700 rounded-md h-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LoadingSkeleton
