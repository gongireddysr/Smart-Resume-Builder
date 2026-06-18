import { lazy, Suspense, useState } from 'react'
import posthog from 'posthog-js'
import { Sparkle } from '@phosphor-icons/react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import PreferencesPanel from './components/PreferencesPanel'
import ApplicationHeader from './components/app/ApplicationHeader'
import WorkflowProgressBar from './components/app/WorkflowProgressBar'
import InlineAlert from './components/app/InlineAlert'
import LandingButton from './components/landing/LandingButton'
import LoadingSkeleton from './utils/LoadingSkeleton'
import CustomAlert from './utils/CustomAlert'
import { isResumeModificationResponse } from './utils/validateResumeResponse'
import type { ResumeModificationResponse } from './types/resume'
import { DEFAULT_USER_PREFERENCES, type UserPreferences } from './types/userPreferences'
import './styles/product.css'

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
  const [inlineValidationMessage, setInlineValidationMessage] = useState<string | null>(
    null
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
    setInlineValidationMessage(null)
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
    setInlineValidationMessage(null)
  }

  const handleResumeTextChange = (text: string) => {
    setResumeText(text)
    setInlineValidationMessage(null)
  }

  const handleModify = async () => {
    // Validate inputs
    if (!resumeText.trim() && !jobDescription.trim()) {
      setInlineValidationMessage(
        'Add a job description and upload a resume before generating.'
      )
      return
    }

    if (!resumeText.trim()) {
      setInlineValidationMessage(
        'Upload a .docx resume file to continue.'
      )
      return
    }

    if (!jobDescription.trim()) {
      setInlineValidationMessage(
        'Paste the job description to tailor your resume.'
      )
      return
    }

    setInlineValidationMessage(null)

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

  const detailsComplete =
    jobDescription.trim().length > 0 &&
    uploadedFile !== null &&
    resumeText.trim().length > 0

  // Show input layout
  return (
    <div className="app-page flex min-h-[100dvh] flex-col">
      <ApplicationHeader />
      <WorkflowProgressBar phase="input" detailsComplete={detailsComplete} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="max-w-3xl">
          <h1 className="brand-heading text-2xl sm:text-3xl">Tailor your resume</h1>
          <p className="brand-lead mt-2 text-base">
            Paste the job description and upload your resume, then configure options
            and generate an ATS-friendly version.
          </p>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-2">
          <LeftPanel
            onJobDescriptionChange={handleJobDescriptionChange}
            jobDescription={jobDescription}
          />

          <RightPanel
            onFileChange={handleFileChange}
            onResumeTextChange={handleResumeTextChange}
            onShowAlert={showAlert}
            uploadedFile={uploadedFile}
            resumeText={resumeText}
            resumeTextBaseline={resumeTextBaseline}
          />
        </div>

        <PreferencesPanel
          preferences={userPreferences}
          onPreferencesChange={setUserPreferences}
        />
      </main>

      <div className="brand-footer-bar sticky bottom-0">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {inlineValidationMessage && (
            <InlineAlert
              variant="warning"
              title="Complete required fields"
              onDismiss={() => setInlineValidationMessage(null)}
            >
              {inlineValidationMessage}
            </InlineAlert>
          )}

          <div className="flex justify-end">
            <LandingButton onClick={handleModify} className="w-full sm:w-auto">
              <Sparkle size={18} weight="fill" aria-hidden="true" />
              Generate Resume
            </LandingButton>
          </div>
        </div>
      </div>

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
