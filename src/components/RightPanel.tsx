import { useCallback, useRef, useState } from 'react'
import posthog from 'posthog-js'
import mammoth from 'mammoth'
import {
  CheckCircle,
  DownloadSimple,
  FileDoc,
  SpinnerGap,
  UploadSimple,
} from '@phosphor-icons/react'
import AppCard from './app/AppCard'
import InlineAlert from './app/InlineAlert'

interface RightPanelProps {
  uploadedFile: File | null
  resumeText: string
  resumeTextBaseline: string
  onFileChange: (file: File | null, extractedText?: string) => void
  onResumeTextChange: (text: string) => void
  onShowAlert: (message: string, title?: string) => void
}

type UploadError = {
  message: string
} | null

function RightPanel({
  onFileChange,
  onResumeTextChange,
  onShowAlert,
  uploadedFile,
  resumeText,
  resumeTextBaseline,
}: RightPanelProps) {
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<UploadError>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  const hasChanges = resumeText !== resumeTextBaseline
  const showEditor = Boolean(uploadedFile) && !isFileLoading
  const isEmptyExtract = Boolean(uploadedFile && !resumeText.trim() && !isFileLoading)

  const processFile = useCallback(
    async (file: File, inputElement?: HTMLInputElement | null) => {
      setUploadError(null)

      const isDocx =
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')

      if (!isDocx) {
        setUploadError({ message: 'Please upload a .docx file only.' })
        if (inputElement) inputElement.value = ''
        return
      }

      onFileChange(file)
      setIsFileLoading(true)

      try {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        const extractedText = result.value

        posthog.capture('resume_uploaded', {
          file_name: file.name,
          file_size: file.size,
          text_length: extractedText.length,
        })

        onFileChange(file, extractedText)
      } catch (error: unknown) {
        console.error('Error reading file:', error)
        setUploadError({
          message: 'Error reading the document. Please try again.',
        })
        onFileChange(null)
        if (inputElement) inputElement.value = ''
      } finally {
        setIsFileLoading(false)
      }
    },
    [onFileChange]
  )

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      await processFile(file, event.target)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleClearFile = () => {
    onFileChange(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (replaceInputRef.current) replaceInputRef.current.value = ''
  }

  const handleReplaceClick = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'Replacing the file will discard your edits to the extracted text. Continue?'
      )
      if (!confirmed) return
    }
    replaceInputRef.current?.click()
  }

  const handleDownload = () => {
    if (!resumeText || !uploadedFile) {
      return
    }

    try {
      const blob = new Blob([resumeText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = uploadedFile.name.replace(/\.docx$/i, '.txt') || 'resume.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error: unknown) {
      console.error('Error downloading file:', error)
      onShowAlert('Error downloading the file. Please try again.', 'Download failed')
    }
  }

  const secondaryButtonClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-sm'

  return (
    <AppCard
      title="Resume upload"
      description="Upload a .docx file. You can review and edit the extracted text before generating."
      icon={<FileDoc size={20} weight="duotone" aria-hidden="true" />}
      status={
        uploadedFile ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
              <CheckCircle size={14} weight="fill" aria-hidden="true" />
              Uploaded
            </span>
            <span className="truncate text-xs text-slate-500">{uploadedFile.name}</span>
            {resumeText.trim().length > 0 && (
              <span className="text-xs text-slate-500">
                {resumeText.trim().length.toLocaleString()} characters extracted
              </span>
            )}
          </div>
        ) : undefined
      }
      actions={
        uploadedFile ? (
          <>
            {hasChanges && (
              <button
                type="button"
                onClick={handleDownload}
                className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
                title="Download as .txt"
              >
                <DownloadSimple size={16} aria-hidden="true" />
                Download .txt
              </button>
            )}
            <button type="button" onClick={handleReplaceClick} className={secondaryButtonClass}>
              Replace
            </button>
            <button type="button" onClick={handleClearFile} className={secondaryButtonClass}>
              Remove
            </button>
          </>
        ) : undefined
      }
    >
      {uploadError && (
        <div className="mb-4">
          <InlineAlert variant="error" title="Upload failed">
            {uploadError.message}
          </InlineAlert>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {isFileLoading ? (
        <div
          className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"
          aria-live="polite"
        >
          <SpinnerGap
            size={36}
            className="animate-spin text-teal-600"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-medium text-slate-700">Reading document...</p>
        </div>
      ) : showEditor ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {isEmptyExtract && (
            <InlineAlert variant="warning" title="No text found">
              This document appears empty. Try a different .docx file or paste your
              resume text below.
            </InlineAlert>
          )}
          <label htmlFor="resume-text" className="text-sm font-medium text-slate-700">
            Review extracted text
          </label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            className="app-textarea min-h-[220px] flex-1 resize-none lg:min-h-[300px]"
          />
          {hasChanges && (
            <p className="text-xs text-slate-500">You edited the extracted text.</p>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            isDragOver
              ? 'border-teal-500 bg-teal-50'
              : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/40'
          }`}
        >
          <span className="inline-flex rounded-full bg-white p-3 text-slate-400 shadow-sm">
            <UploadSimple size={28} aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm font-medium text-slate-700">
            Drag and drop your resume here
          </p>
          <p className="mt-1 text-sm text-slate-500">or</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Choose .docx file
          </button>
          <p className="mt-4 text-xs text-slate-500">Microsoft Word .docx files only</p>
        </div>
      )}
    </AppCard>
  )
}

export default RightPanel
