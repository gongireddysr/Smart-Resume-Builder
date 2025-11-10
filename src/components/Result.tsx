
import AnimatedStars from '../../public/AnimatedStars'

interface ResumeModificationResponse {
  rewritten_resume: string;
  change_summary: string[];
  skills_added: string[];
  skills_boosted: string[];
  warnings: string[];
  suggestions: string[];
}

interface ResultProps {
  modificationResult: ResumeModificationResponse;
  onBackToEdit: () => void;
  onDownload: () => void;
}

function Result({ modificationResult, onBackToEdit, onDownload }: ResultProps) {
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
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white rounded-md font-medium flex items-center gap-2 border border-green-500/30 transition-all duration-200 poppins-font"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onBackToEdit}
              className="px-4 py-2 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white rounded-md font-medium border border-green-500/30 transition-all duration-200 poppins-font"
            >
              Back to Edit
            </button>
          </div>
        </div>
      </header>

      {/* Results Layout: 25% + 75% */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Panel - 25% */}
        <div className="w-1/4 bg-black/10 backdrop-blur-sm border-r border-gray-700/30 flex flex-col overflow-hidden relative z-10">
          {/* Changes Made Section */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-green-400 mb-4 poppins-font">Changes Made</h3>
            <ul className="space-y-2 mb-6">
              {modificationResult.change_summary.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-sm">•</span>
                  <span className="text-sm text-gray-300 leading-relaxed poppins-font">{change}</span>
                </li>
              ))}
            </ul>

            {/* Suggestions Section */}
            <h3 className="text-lg font-semibold text-green-400 mb-4 poppins-font">AI Suggestions</h3>
            <ul className="space-y-2">
              {modificationResult.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-sm">•</span>
                  <span className="text-sm text-gray-300 leading-relaxed poppins-font">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Main Panel - 75% */}
        <div className="flex-1 bg-black/10 backdrop-blur-sm flex flex-col overflow-hidden relative z-10">
          <div className="px-6 py-4 border-b border-gray-700/30 flex-shrink-0">
            <h2 className="text-xl font-semibold text-green-400 poppins-font">Modified Resume</h2>
          </div>
          <div className="flex-1 p-6 overflow-hidden">
            <textarea
              value={modificationResult.rewritten_resume}
              readOnly
              className="w-full h-full p-4 text-base bg-black/10 backdrop-blur-sm text-white border border-gray-600/30 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent overflow-y-auto custom-scrollbar poppins-font"
              style={{ fontSize: '15px', lineHeight: '1.6' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
