import { useState, useEffect } from 'react'

interface LeftPanelProps {
  onJobDescriptionChange?: (text: string) => void
  jobDescription?: string
}

function LeftPanel({ onJobDescriptionChange, jobDescription: propJobDescription }: LeftPanelProps) {
  const [jobDescription, setJobDescription] = useState<string>(propJobDescription || '')

  // Sync local state with props when they change (when coming back from results view)
  useEffect(() => {
    if (propJobDescription !== undefined) {
      setJobDescription(propJobDescription)
    }
  }, [propJobDescription])

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setJobDescription(newText)
    onJobDescriptionChange?.(newText)
  }

  const handleClearJobDescription = () => {
    setJobDescription('')
    onJobDescriptionChange?.('')
  }

  return (
    <div className="flex flex-col bg-black/10 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/30 overflow-hidden relative z-10 h-80 lg:h-auto w-full">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700/30 flex-shrink-0">
        <h2 className="text-sm sm:text-base font-semibold text-green-400 poppins-font">
          📋 Paste the Job Description Here
        </h2>
        {jobDescription && (
          <button
            onClick={handleClearJobDescription}
            className="text-xs sm:text-sm text-green-400 hover:text-green-300 font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-black/20 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-200 poppins-font"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex-1 p-2 sm:p-4 overflow-hidden">
        <textarea
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Copy any job posting from job boards, company websites, or anywhere online and paste it here. We'll analyze it and tailor your resume to match perfectly!"
          className="w-full h-full p-2 sm:p-4 text-sm sm:text-base bg-black/10 text-white border border-gray-600/30 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent overflow-y-auto placeholder-gray-400 custom-scrollbar backdrop-blur-sm poppins-font"
          style={{ fontSize: '14px', lineHeight: '1.5' }}
        />
      </div>
    </div>
  )
}

export default LeftPanel

