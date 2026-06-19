import { useState } from 'react'
import posthog from 'posthog-js'
import {
  ArrowLeft,
  ArrowsLeftRight,
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

type ViewMode = 'single' | 'compare'
type CompareTab = 'original' | 'updated'

function Result({ modificationResult, onBackToEdit, onShowAlert }: ResultProps) {
  const [editableData, setEditableData] = useState<TemplateData>(() =>
    modificationResultToTemplateData(modificationResult)
  )
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('single')
  const [compareTab, setCompareTab] = useState<CompareTab>('updated')

  const originalResume = modificationResult.original_resume
  const jobTitle = modificationResult.job_title_from_jd || 'this role'

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'compare') {
      posthog.capture('compare_view_opened')
    }
  }

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

  const singlePreviewTemplateClass = '!max-w-none !mx-0 w-full !p-4 sm:!p-5 lg:!p-6'
  const comparePreviewTemplateClass = '!max-w-4xl !mx-auto w-full !p-4 sm:!p-5 lg:!p-6'

  const renderUpdatedResume = (variant: 'default' | 'single' | 'compare' = 'default') => {
    const className =
      variant === 'single'
        ? singlePreviewTemplateClass
        : variant === 'compare'
          ? comparePreviewTemplateClass
          : ''

    return isEditing ? (
      <EditableTemplate
        data={editableData}
        onChange={setEditableData}
        className={className}
      />
    ) : (
      <Template data={editableData} className={className} />
    )
  }

  const viewModeToggle = (
    <div className="inline-flex rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-1">
      <button
        type="button"
        onClick={() => handleViewModeChange('single')}
        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
          viewMode === 'single'
            ? 'bg-[var(--brand-header)] text-white'
            : 'text-[var(--brand-ink-secondary)] hover:text-[var(--brand-ink)]'
        }`}
      >
        Single
      </button>
      <button
        type="button"
        onClick={() => handleViewModeChange('compare')}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
          viewMode === 'compare'
            ? 'bg-[var(--brand-primary)] text-white'
            : 'text-[var(--brand-ink-secondary)] hover:text-[var(--brand-ink)]'
        }`}
      >
        <ArrowsLeftRight size={14} aria-hidden="true" />
        Compare
      </button>
    </div>
  )

  const editToggle = !isEditing ? (
    <LandingButton onClick={() => setIsEditing(true)}>
      <PencilSimple size={16} aria-hidden="true" />
      Edit resume
    </LandingButton>
  ) : (
    <LandingButton variant="secondary" onClick={() => setIsEditing(false)}>
      <Check size={16} weight="bold" aria-hidden="true" />
      Done editing
    </LandingButton>
  )

  const desktopActions = (
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
  )

  return (
    <div
      className={`app-page flex flex-col ${
        viewMode === 'compare'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-[100dvh]'
      }`}
    >
      <ApplicationHeader />
      {viewMode !== 'compare' && (
        <WorkflowProgressBar phase="results" detailsComplete />
      )}

      <main
        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${
          viewMode === 'compare'
            ? 'w-full px-3 py-2 sm:px-4 sm:py-3'
            : 'mx-auto w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-6'
        }`}
      >
        {viewMode === 'compare' ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:gap-3">
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {viewModeToggle}
              {editToggle}
            </div>

            <div className="mb-1 flex shrink-0 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-1 lg:hidden">
              <button
                type="button"
                onClick={() => setCompareTab('original')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  compareTab === 'original'
                    ? 'bg-[var(--brand-header)] text-white'
                    : 'text-[var(--brand-ink-secondary)]'
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setCompareTab('updated')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  compareTab === 'updated'
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'text-[var(--brand-ink-secondary)]'
                }`}
              >
                Tailored
              </button>
            </div>

            <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-4 overflow-hidden sm:gap-6 lg:flex-row lg:gap-8">
              <div
                className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
                  compareTab === 'original' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <p className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                  Original resume
                </p>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)] p-3 shadow-[var(--brand-shadow-sm)] sm:p-4">
                  <Template data={originalResume} className={comparePreviewTemplateClass} />
                </div>
              </div>

              <div
                className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
                  compareTab === 'updated' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <p className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                  Tailored resume
                </p>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-bg)] p-3 shadow-[var(--brand-shadow-sm)] ring-1 ring-[var(--brand-primary-soft)] sm:p-4">
                  {renderUpdatedResume('compare')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <h1 className="brand-heading text-2xl sm:text-3xl">Your tailored resume</h1>
                <p className="brand-lead mt-2 text-base">
                  Optimized for{' '}
                  <span className="font-semibold text-[var(--brand-ink)]">{jobTitle}</span>.
                  Review the optimization summary, edit if needed, then download.
                </p>
              </div>
              {desktopActions}
            </div>

            <div className="grid min-h-0 flex-1 items-stretch gap-5 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
              <aside className="brand-panel flex flex-col self-stretch p-4 sm:p-5">
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

              <section className="brand-card flex min-h-0 flex-col self-stretch overflow-hidden">
                <div className="brand-card-header px-4 py-3 sm:px-5">
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
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {viewModeToggle}
                      {editToggle}
                    </div>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--brand-surface)]">
                  {renderUpdatedResume('single')}
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {viewMode === 'single' && (
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
      )}
    </div>
  )
}

export default Result
