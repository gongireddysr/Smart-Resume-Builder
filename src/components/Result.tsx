import posthog from 'posthog-js'
import { ArrowLeft, DownloadSimple, FileText } from '@phosphor-icons/react'
import ApplicationHeader from './app/ApplicationHeader'
import WorkflowProgressBar from './app/WorkflowProgressBar'
import ResultAnalysisPanel from './app/ResultAnalysisPanel'
import LandingButton from './landing/LandingButton'
import Template from './Template'
import { generateDocx } from '../utils/docxGenerator'
import type { ResumeModificationResponse } from '../types/resume'
import '../styles/product.css'

interface ResultProps {
  modificationResult: ResumeModificationResponse
  onBackToEdit: () => void
  onShowAlert: (message: string, title?: string) => void
}

function Result({ modificationResult, onBackToEdit, onShowAlert }: ResultProps) {
  const templateData = {
    full_name: modificationResult.full_name,
    email: modificationResult.email,
    phone: modificationResult.phone,
    location: modificationResult.location,
    urls: modificationResult.urls,
    professional_summary: modificationResult.professional_summary,
    skills: modificationResult.skills,
    experience: modificationResult.experience,
    education: modificationResult.education,
  }

  const jobTitle = modificationResult.job_title_from_jd || 'this role'

  const handleDocxDownload = async () => {
    try {
      const docxBlob = await generateDocx(templateData)
      const url = URL.createObjectURL(docxBlob)
      const link = document.createElement('a')
      link.href = url

      const candidateName = templateData.full_name || 'Resume'
      const sanitizedJobTitle = jobTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
      const sanitizedName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')

      posthog.capture('docx_downloaded', {
        job_title: jobTitle,
        candidate_name: candidateName,
      })

      link.download = `${sanitizedName}_${sanitizedJobTitle}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error: unknown) {
      console.error('Error generating DOCX:', error)
      onShowAlert('Error generating DOCX file. Please try again.', 'Download failed')
    }
  }

  return (
    <div className="app-page flex min-h-[100dvh] flex-col">
      <ApplicationHeader />
      <WorkflowProgressBar phase="results" detailsComplete />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your tailored resume
            </h1>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              Optimized for{' '}
              <span className="font-medium text-slate-800">{jobTitle}</span>. Review
              the changes, then download your ATS-friendly resume.
            </p>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <LandingButton variant="secondary" onClick={onBackToEdit}>
              <ArrowLeft size={18} aria-hidden="true" />
              Back to edit
            </LandingButton>
            <LandingButton onClick={handleDocxDownload}>
              <DownloadSimple size={18} weight="bold" aria-hidden="true" />
              Download .docx
            </LandingButton>
          </div>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-white p-5 lg:max-h-[calc(100dvh-16rem)] lg:overflow-y-auto">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">
                <FileText size={20} weight="duotone" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">
                Optimization summary
              </h2>
            </div>
            <ResultAnalysisPanel result={modificationResult} />
          </aside>

          <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Modified resume preview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This is the formatted version that will be included in your download.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Template data={templateData} />
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
          <LandingButton onClick={handleDocxDownload}>
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            Download .docx
          </LandingButton>
          <LandingButton variant="secondary" onClick={onBackToEdit}>
            <ArrowLeft size={18} aria-hidden="true" />
            Back to edit
          </LandingButton>
        </div>
      </div>
    </div>
  )
}

export default Result
