import AnimatedStars from './AnimatedStars'

function LoadingSkeleton() {
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden relative">
      <AnimatedStars />
      {/* Header */}
      <header className="bg-transparent shadow-sm border-b border-gray-700/30 flex-shrink-0 relative z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/srm-logo.png" 
              alt="SRM Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-green-400/50"
            />
            <h1 className="text-2xl font-bold text-green-400 poppins-font">
              Smart Resume Modifier
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-gray-700 rounded-md w-24 h-10 animate-pulse"></div>
            <div className="px-4 py-2 bg-gray-700 rounded-md w-28 h-10 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Loading Layout: 25% + 75% */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Panel - 25% */}
        <div className="w-1/4 bg-black/10 backdrop-blur-sm border-r border-gray-700/30 flex flex-col overflow-hidden relative z-10">
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

        {/* Right Main Panel - 75% */}
        <div className="flex-1 bg-black/10 backdrop-blur-sm flex flex-col overflow-hidden relative z-10">
          <div className="px-6 py-4 border-b border-gray-700/30 flex-shrink-0">
            <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>
          <div className="flex-1 p-6 overflow-hidden">
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
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LoadingSkeleton
