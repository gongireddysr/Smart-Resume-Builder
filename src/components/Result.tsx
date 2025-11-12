
import { useRef } from 'react'
import AnimatedStars from '../utils/AnimatedStars'
import Template from './Template'
import { generateDocx } from '../utils/docxGenerator'

interface ResumeModificationResponse {
  job_title_from_jd: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  urls: string;
  professional_summary: string;
  skills: string;
  experience: Array<{
    company: string;
    job_title: string;
    start_date: string;
    end_date: string;
    bullet_points: string[];
  }>;
  education: string;
  change_summary: string[];
  skills_added: string[];
  skills_removed: string[];
  skills_boosted: string[];
  experience_transformed: string[];
  warnings: string[];
  suggestions: string[];
}

interface ResultProps {
  modificationResult: ResumeModificationResponse;
  onBackToEdit: () => void;
}

function Result({ modificationResult, onBackToEdit }: ResultProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  
  // Use the structured data directly from API response
  const templateData = {
    full_name: modificationResult.full_name,
    email: modificationResult.email,
    phone: modificationResult.phone,
    location: modificationResult.location,
    urls: modificationResult.urls,
    professional_summary: modificationResult.professional_summary,
    skills: modificationResult.skills,
    experience: modificationResult.experience,
    education: modificationResult.education
  }


  // DOCX download function
  const handleDocxDownload = async () => {
    try {
      const docxBlob = await generateDocx(templateData)
      const url = URL.createObjectURL(docxBlob)
      const link = document.createElement('a')
      link.href = url
      
      // Create filename with candidate name and job title for easy recognition
      const candidateName = templateData.full_name || 'Resume'
      const jobTitle = modificationResult.job_title_from_jd || 'Position'
      const sanitizedJobTitle = jobTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
      const sanitizedName = candidateName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
      
      link.download = `${sanitizedName}_${sanitizedJobTitle}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating DOCX:', error)
      alert('Error generating DOCX file. Please try again.')
    }
  }
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 poppins-font">
              Smart Resume Modifier
            </h1>
          </div>
          {/* Desktop/Tablet Buttons - Hidden on Mobile */}
          <div className="hidden sm:flex flex-row gap-3">
            <button
              onClick={handleDocxDownload}
              className="px-4 py-2 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white rounded-md font-medium flex items-center justify-center gap-2 border border-green-500/30 transition-all duration-200 poppins-font"
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

      {/* Results Layout: Responsive */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Left Side Panel - Analysis */}
        <div className="w-full lg:w-1/4 bg-black/10 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-700/30 flex flex-col overflow-hidden relative z-10 mx-1 lg:mx-0 mb-2 lg:mb-0 rounded-lg lg:rounded-none">
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

            {/* Skills Changes Section */}
            {(modificationResult.skills_added?.length > 0 || modificationResult.skills_removed?.length > 0) && (
              <>
                <h3 className="text-lg font-semibold text-blue-400 mb-4 poppins-font">Skills Optimization</h3>
                {modificationResult.skills_added?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-400 mb-2">Added Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {modificationResult.skills_added.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded border border-green-500/30">
                          +{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {modificationResult.skills_removed?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Removed Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {modificationResult.skills_removed.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded border border-red-500/30">
                          -{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Experience Transformation Section */}
            {modificationResult.experience_transformed?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-purple-400 mb-4 poppins-font">Experience Transformed</h3>
                <ul className="space-y-2 mb-6">
                  {modificationResult.experience_transformed.map((role, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1 text-sm">•</span>
                      <span className="text-sm text-gray-300 leading-relaxed poppins-font">{role}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

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

        {/* Right Main Panel - Resume Display */}
        <div className="flex-1 bg-black/10 backdrop-blur-sm flex flex-col overflow-hidden relative z-10 mx-1 lg:mx-0 rounded-lg lg:rounded-none">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/30 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold text-green-400 poppins-font">Modified Resume</h2>
          </div>
          <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto custom-scrollbar">
            <div ref={templateRef} className="bg-white rounded-lg shadow-lg">
              <Template data={templateData} />
            </div>
            
            {/* Mobile Buttons - Bottom of Resume */}
            <div className="sm:hidden mt-6 flex flex-col gap-3 w-full">
              <button
                onClick={handleDocxDownload}
                className="w-full px-4 py-3 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white rounded-md font-medium flex items-center justify-center gap-2 border border-green-500/30 transition-all duration-200 poppins-font"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={onBackToEdit}
                className="w-full px-4 py-3 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white rounded-md font-medium border border-green-500/30 transition-all duration-200 poppins-font"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
