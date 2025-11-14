import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import Result from './components/Result'
import LoadingSkeleton from './utils/LoadingSkeleton'
import AnimatedStars from './utils/AnimatedStars'
import CustomAlert from './utils/CustomAlert'
import './App.css'

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


function App() {
  const [jobDescription, setJobDescription] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modificationResult, setModificationResult] = useState<ResumeModificationResponse | null>(null)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const showAlert = (message: string) => {
    setAlertMessage(message)
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
    setAlertMessage('')
  }

  const handleJobDescriptionChange = (text: string) => {
    setJobDescription(text)
  }

  const handleFileChange = (file: File | null, extractedText?: string) => {
    setUploadedFile(file)
    if (extractedText) {
      setResumeText(extractedText)
    } else if (!file) {
      setResumeText('')
    }
  }

  const handleModify = async () => {
    // Validate inputs
    if (!resumeText.trim() && !jobDescription.trim()) {
      showAlert('Both job description and resume file are required.')
      return
    }
    
    if (!resumeText.trim()) {
      showAlert('Please upload a .docx resume file in the right panel to get started.')
      return
    }
    
    if (!jobDescription.trim()) {
      showAlert('Please enter a job description in the left panel to tailor your resume.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/modify-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const result: ResumeModificationResponse = await response.json()
      
      // Store results and show the new layout
      setModificationResult(result)
      setShowResults(true)
    } catch (error: any) {
      console.error('Modification error:', error)
      showAlert(`Failed to modify resume: ${error.message}. Please try again or check your internet connection.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEdit = () => {
    setShowResults(false)
    setModificationResult(null)
    // Keep the uploaded file and extracted text intact
    // Don't reset jobDescription, uploadedFile, or resumeText
  }


  // Show loading skeleton while processing
  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Show results layout
  if (showResults && modificationResult) {
    return (
      <Result 
        modificationResult={modificationResult}
        onBackToEdit={handleBackToEdit}
      />
    )
  }

  // Show input layout
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <AnimatedStars />
      {/* Header */}
      <header className="bg-transparent shadow-sm border-b border-gray-700/30 flex-shrink-0 relative z-10">
        <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col items-center gap-3 sm:hidden">
            <img 
              src="/srm-logo.png" 
              alt="SRM Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-green-400/50"
              onError={(e) => {
                console.error('Logo failed to load:', e)
                e.currentTarget.style.display = 'none'
              }}
            />
            <h1 
              className="text-sm font-bold text-green-400 text-center leading-tight px-2"
              style={{ 
                fontFamily: "'Carter One', 'Impact', cursive",
                fontWeight: 400,
                letterSpacing: '0.01em'
              }}
            >
              Smart Resume Modifier
              <span className="block text-xs mt-1 text-green-300/80">
                AI That Rewrites Your Resume to Match Any Job
              </span>
            </h1>
          </div>
          
          {/* Tablet & Desktop Layout - Horizontal */}
          <div className="hidden sm:flex justify-center items-center">
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
              <img 
                src="/srm-logo.png" 
                alt="SRM Logo" 
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-green-400/50"
                onError={(e) => {
                  console.error('Logo failed to load:', e)
                  e.currentTarget.style.display = 'none'
                }}
              />
              <h1 
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-400 text-center leading-tight"
                style={{ 
                  fontFamily: "'Carter One', 'Impact', cursive",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                Smart Resume Modifier - AI That Rewrites Your Resume to Match Any Job
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Split Screen Container - Responsive */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-2 lg:gap-4 p-1 sm:p-4 overflow-auto">
        {/* Left Side - Job Description Input */}
        <LeftPanel 
          onJobDescriptionChange={handleJobDescriptionChange}
          jobDescription={jobDescription}
        />

        {/* Right Side - File Upload */}
        <RightPanel 
          onFileChange={handleFileChange}
          isLoading={isLoading}
          uploadedFile={uploadedFile}
          resumeText={resumeText}
        />
      </div>

      {/* Modify Button - Bottom Center */}
      <div className="flex-shrink-0 bg-transparent border-t border-gray-700/30 px-2 sm:px-4 py-3 sm:py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={handleModify}
            disabled={isLoading}
            className={`px-4 sm:px-8 py-2 sm:py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 poppins-font text-sm sm:text-base ${
              isLoading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            )}
            {isLoading ? 'Modifying...' : 'Modify Resume'}
          </button>
        </div>
      </div>

      {/* Custom Alert Modal */}
      <CustomAlert 
        isVisible={alertVisible}
        message={alertMessage}
        onClose={hideAlert}
      />
    </div>
  )
}

export default App
