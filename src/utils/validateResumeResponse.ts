import type { ResumeExperience, ResumeModificationResponse } from '../types/resume'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function toStringField(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (value == null) return fallback
  return String(value)
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => (typeof item === 'string' ? item : String(item)))
}

function normalizeExperience(value: unknown): ResumeExperience[] {
  if (!Array.isArray(value)) return []

  const jobs: ResumeExperience[] = []
  for (const job of value) {
    if (!job || typeof job !== 'object') continue
    const entry = job as Record<string, unknown>
    jobs.push({
      company: toStringField(entry.company),
      job_title: toStringField(entry.job_title),
      start_date: toStringField(entry.start_date),
      end_date: toStringField(entry.end_date),
      bullet_points: toStringArray(entry.bullet_points),
    })
  }
  return jobs
}

/** Coerce common OpenAI shape issues (null contact fields, missing arrays) before validation */
function normalizeResumeModificationResponse(data: unknown): ResumeModificationResponse {
  const record =
    data && typeof data === 'object' ? (data as Record<string, unknown>) : {}

  return {
    job_title_from_jd: toStringField(record.job_title_from_jd, 'Position'),
    full_name: toStringField(record.full_name),
    email: toStringField(record.email),
    phone: toStringField(record.phone),
    location: toStringField(record.location),
    urls: toStringField(record.urls),
    professional_summary: toStringField(record.professional_summary),
    skills: toStringField(record.skills),
    education: toStringField(record.education),
    experience: normalizeExperience(record.experience),
    change_summary: toStringArray(record.change_summary),
    skills_added: toStringArray(record.skills_added),
    skills_removed: toStringArray(record.skills_removed),
    skills_boosted: toStringArray(record.skills_boosted),
    experience_transformed: toStringArray(record.experience_transformed),
    warnings: toStringArray(record.warnings),
    suggestions: toStringArray(record.suggestions),
  }
}

export function isResumeModificationResponse(
  data: unknown
): data is ResumeModificationResponse {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  const stringFields = [
    'job_title_from_jd',
    'full_name',
    'email',
    'phone',
    'location',
    'urls',
    'professional_summary',
    'skills',
    'education',
  ] as const

  for (const key of stringFields) {
    if (typeof record[key] !== 'string') return false
  }

  const arrayFields = [
    'change_summary',
    'skills_added',
    'skills_removed',
    'skills_boosted',
    'experience_transformed',
    'warnings',
    'suggestions',
  ] as const

  for (const key of arrayFields) {
    if (!isStringArray(record[key])) return false
  }

  if (!Array.isArray(record.experience)) return false

  for (const job of record.experience) {
    if (!job || typeof job !== 'object') return false
    const entry = job as Record<string, unknown>
    if (typeof entry.company !== 'string') return false
    if (typeof entry.job_title !== 'string') return false
    if (typeof entry.start_date !== 'string') return false
    if (typeof entry.end_date !== 'string') return false
    if (!isStringArray(entry.bullet_points)) return false
  }

  return true
}

export function parseResumeModificationResponse(data: unknown): ResumeModificationResponse {
  const normalized = normalizeResumeModificationResponse(data)
  if (!isResumeModificationResponse(normalized)) {
    throw new Error('Invalid resume generation response structure')
  }
  return normalized
}
