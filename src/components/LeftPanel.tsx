import { ClipboardText } from "@phosphor-icons/react";
import AppCard from "./app/AppCard";

interface LeftPanelProps {
  jobDescription: string
  onJobDescriptionChange: (text: string) => void
}

function LeftPanel({ jobDescription, onJobDescriptionChange }: LeftPanelProps) {
  const charCount = jobDescription.length
  const isEmpty = jobDescription.trim().length === 0

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onJobDescriptionChange(e.target.value)
  }

  const handleClearJobDescription = () => {
    onJobDescriptionChange('')
  }

  return (
    <AppCard
      title="Job description"
      description="Paste the full posting including requirements and responsibilities."
      icon={<ClipboardText size={20} weight="duotone" aria-hidden="true" />}
      status={
        <p className="text-xs text-[var(--brand-muted)]">
          {charCount.toLocaleString()} {charCount === 1 ? "character" : "characters"}
        </p>
      }
      actions={
        jobDescription ? (
          <button
            type="button"
            onClick={handleClearJobDescription}
            className="brand-action-btn"
          >
            Clear
          </button>
        ) : undefined
      }
      footer={
        isEmpty ? (
          <p className="text-xs text-[var(--brand-muted)]">
            Copy the listing from a job board, company careers page, or recruiter email.
          </p>
        ) : undefined
      }
    >
      <label htmlFor="job-description" className="sr-only">
        Job description
      </label>
      <textarea
        id="job-description"
        value={jobDescription}
        onChange={handleJobDescriptionChange}
        placeholder="Paste the job description here..."
        className="app-textarea min-h-[220px] flex-1 resize-none lg:min-h-[300px]"
      />
    </AppCard>
  )
}

export default LeftPanel
