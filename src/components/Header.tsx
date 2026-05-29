const titleStyle = {
  fontFamily: "'Carter One', 'Impact', cursive",
  fontWeight: 400,
} as const

interface HeaderProps {
  variant?: 'full' | 'compact'
}

function Header({ variant = 'full' }: HeaderProps) {
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
  }

  if (variant === 'compact') {
    return (
      <header className="bg-transparent shadow-sm border-b border-gray-700/30 flex-shrink-0 relative z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src="/srm-logo.png"
              alt="SRM Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-400/50"
              onError={handleLogoError}
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 poppins-font text-center">
              Smart Resume Modifier
            </h1>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="px-4 py-2 bg-gray-700 rounded-md w-24 h-10 animate-pulse" />
            <div className="px-4 py-2 bg-gray-700 rounded-md w-28 h-10 animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-transparent shadow-sm border-b border-gray-700/30 flex-shrink-0 relative z-10">
      <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex flex-col items-center gap-3 sm:hidden">
          <img
            src="/srm-logo.png"
            alt="SRM Logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-400/50"
            onError={handleLogoError}
          />
          <h1
            className="text-sm font-bold text-green-400 text-center leading-tight px-2"
            style={{ ...titleStyle, letterSpacing: '0.01em' }}
          >
            Smart Resume Modifier
            <span className="block text-xs mt-1 text-green-300/80">
              AI That Rewrites Your Resume to Match Any Job
            </span>
          </h1>
        </div>

        <div className="hidden sm:flex justify-center items-center">
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            <img
              src="/srm-logo.png"
              alt="SRM Logo"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-green-400/50"
              onError={handleLogoError}
            />
            <h1
              className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-400 text-center leading-tight"
              style={{ ...titleStyle, letterSpacing: '0.02em' }}
            >
              Smart Resume Modifier - AI That Rewrites Your Resume to Match Any Job
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
