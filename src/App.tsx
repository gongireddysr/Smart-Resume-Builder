import { lazy, Suspense, useState } from 'react'
import posthog from 'posthog-js'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import PreferencesPanel from './components/PreferencesPanel'
import Header from './components/Header'
import LoadingSkeleton from './utils/LoadingSkeleton'
import AnimatedStars from './utils/AnimatedStars'
import CustomAlert from './utils/CustomAlert'
import { isResumeModificationResponse } from './utils/validateResumeResponse'
import type { ResumeModificationResponse } from './types/resume'
import { DEFAULT_USER_PREFERENCES, type UserPreferences } from './types/userPreferences'
import './App.css'

const Result = lazy(() => import('./components/Result'))

function App() {
  const [jobDescription, setJobDescription] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState<string>('')
  const [resumeTextBaseline, setResumeTextBaseline] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modificationResult, setModificationResult] = useState<ResumeModificationResponse | null>(null)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTitle, setAlertTitle] = useState('Notice')
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(
    DEFAULT_USER_PREFERENCES
  )

  const showAlert = (message: string, title = 'Missing Information') => {
    setAlertMessage(message)
    setAlertTitle(title)
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
    setAlertMessage('')
    setAlertTitle('Notice')
  }

  const handleJobDescriptionChange = (text: string) => {
    setJobDescription(text)
  }

  const handleFileChange = (file: File | null, extractedText?: string) => {
    setUploadedFile(file)
    if (extractedText !== undefined) {
      setResumeText(extractedText)
      setResumeTextBaseline(extractedText)
    } else if (!file) {
      setResumeText('')
      setResumeTextBaseline('')
    }
  }

  const handleResumeTextChange = (text: string) => {
    setResumeText(text)
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

    // Track modify button click
    posthog.capture('modify_clicked', {
      resume_length: resumeText.trim().length,
      jd_length: jobDescription.trim().length,
      output_length: userPreferences.output_length,
      focus: userPreferences.focus,
      ats_optimization: userPreferences.ats_optimization,
      tone: userPreferences.tone,
      has_custom_instructions: userPreferences.custom_instructions.trim().length > 0,
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/modify-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
          userPreferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const result: unknown = await response.json()

      if (!isResumeModificationResponse(result)) {
        throw new Error('Invalid response from server. Please try again.')
      }

      // Track successful modification
      posthog.capture('modification_completed', {
        job_title: result.job_title_from_jd,
        skills_added_count: result.skills_added?.length || 0,
        skills_removed_count: result.skills_removed?.length || 0,
        experience_count: result.experience?.length || 0
      })
      
      // Store results and show the new layout
      setModificationResult(result)
      setShowResults(true)
    } catch (error: unknown) {
      console.error('Modification error:', error)

      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      // Track modification failure
      posthog.capture('modification_failed', {
        error_message: message,
      })

      showAlert(
        `Failed to modify resume: ${message}. Please try again or check your internet connection.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEdit = () => {
    // Track back to edit action
    posthog.capture('back_to_edit_clicked')
    
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
      <>
        <Suspense fallback={<LoadingSkeleton />}>
          <Result
            modificationResult={modificationResult}
            onBackToEdit={handleBackToEdit}
            onShowAlert={showAlert}
          />
        </Suspense>
        <CustomAlert
          isVisible={alertVisible}
          message={alertMessage}
          title={alertTitle}
          onClose={hideAlert}
        />
      </>
    )
  }

  // Show input layout
  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <AnimatedStars />
      <Header />

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
          onResumeTextChange={handleResumeTextChange}
          onShowAlert={showAlert}
          isLoading={isLoading}
          uploadedFile={uploadedFile}
          resumeText={resumeText}
          resumeTextBaseline={resumeTextBaseline}
        />
      </div>

      <PreferencesPanel
        preferences={userPreferences}
        onPreferencesChange={setUserPreferences}
      />

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
        title={alertTitle}
        onClose={hideAlert}
      />
    </div>
  )
}

export default App
