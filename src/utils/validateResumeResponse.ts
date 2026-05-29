import type { ResumeModificationResponse } from '../types/resume'

export function isResumeModificationResponse(
  data: unknown
): data is ResumeModificationResponse {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  return (
    typeof record.full_name === 'string' &&
    typeof record.professional_summary === 'string' &&
    Array.isArray(record.change_summary) &&
    Array.isArray(record.experience) &&
    Array.isArray(record.suggestions)
  )
}
