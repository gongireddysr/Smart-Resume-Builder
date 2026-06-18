import { useState } from 'react'
import posthog from 'posthog-js'
import {
  ArrowLeft,
  Check,
  DownloadSimple,
  FileText,
  PencilSimple,
} from '@phosphor-icons/react'
import ApplicationHeader from './app/ApplicationHeader'
import WorkflowProgressBar from './app/WorkflowProgressBar'
import ResultAnalysisPanel from './app/ResultAnalysisPanel'
import LandingButton from './landing/LandingButton'
import EditableTemplate from './EditableTemplate'
import Template from './Template'
import { generateDocx } from '../utils/docxGenerator'
import { modificationResultToTemplateData } from '../utils/resumeData'
import type { ResumeModificationResponse, TemplateData } from '../types/resume'
import '../styles/product.css'

interface ResultProps {
  modificationResult: ResumeModificationResponse
  onBackToEdit: () => void
  onShowAlert: (message: string, title?: string) => void
}

function Result({ modificationResult, onBackToEdit, onShowAlert }: ResultProps) {
  const [editableData, setEditableData] = useState<TemplateData>(() =>
    modificationResultToTemplateData(modificationResult)
  )
  const [isEditing, setIsEditing] = useState(false)

  const jobTitle = modificationResult.job_title_from_jd || 'this role'

  const handleDocxDownload = async () => {
    try {
      const docxBlob = await generateDocx(editableData)
      const url = URL.createObjectURL(docxBlob)
      const link = document.createElement('a')
      link.href = url

      const candidateName = editableData.full_name || 'Resume'
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
            <h1 className="brand-heading text-2xl sm:text-3xl">Your tailored resume</h1>
            <p className="brand-lead mt-2 text-base">
              Optimized for{' '}
              <span className="font-semibold text-[var(--brand-ink)]">{jobTitle}</span>. Review
              the changes, enable edit mode to tweak the resume, then download.
            </p>
          </div>

          <div className="hidden shrink-0 flex-wrap justify-end gap-2 sm:flex">
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

        <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <aside className="brand-panel flex flex-col self-stretch p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="brand-icon-wrap">
                <FileText size={20} weight="duotone" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                Optimization summary
              </h2>
            </div>
            <ResultAnalysisPanel result={modificationResult} />
          </aside>

          <section className="brand-card flex min-h-0 flex-col self-stretch">
            <div className="brand-card-header px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                    Modified resume preview
                  </h2>
                  <p className="mt-1 text-sm text-[var(--brand-muted)]">
                    {isEditing
                      ? 'Edit mode is on. Your changes are included in the download.'
                      : 'Enable edit mode to make changes before downloading.'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  {!isEditing ? (
                    <LandingButton onClick={() => setIsEditing(true)}>
                      <PencilSimple size={16} aria-hidden="true" />
                      Edit resume
                    </LandingButton>
                  ) : (
                    <LandingButton variant="secondary" onClick={() => setIsEditing(false)}>
                      <Check size={16} weight="bold" aria-hidden="true" />
                      Done editing
                    </LandingButton>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[var(--brand-bg-subtle)] p-4 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] shadow-[var(--brand-shadow-sm)]">
                {isEditing ? (
                  <EditableTemplate data={editableData} onChange={setEditableData} />
                ) : (
                  <Template data={editableData} />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="brand-footer-bar sticky bottom-0 sm:hidden">
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
