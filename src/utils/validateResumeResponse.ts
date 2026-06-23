import type { ResumeExperience, ResumeModificationResponse, TemplateData } from '../types/resume'
import {
  formatEducationAndCertifications,
  formatEducationEntry,
} from './resumeData'

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

function parseExperienceDates(dates: string): { start_date: string; end_date: string } {
  const trimmed = dates.trim()
  if (!trimmed) {
    return { start_date: '', end_date: '' }
  }

  const rangeMatch = trimmed.match(/^(.+?)\s*[-–—]\s*(.+)$/)
  if (rangeMatch) {
    return {
      start_date: rangeMatch[1].trim(),
      end_date: rangeMatch[2].trim(),
    }
  }

  return { start_date: trimmed, end_date: '' }
}

function normalizeExperience(value: unknown): ResumeExperience[] {
  if (!Array.isArray(value)) return []

  const jobs: ResumeExperience[] = []
  for (const job of value) {
    if (!job || typeof job !== 'object') continue
    const entry = job as Record<string, unknown>
    const parsedDates = parseExperienceDates(toStringField(entry.dates))

    jobs.push({
      company: toStringField(entry.company),
      job_title: toStringField(entry.job_title),
      start_date: toStringField(entry.start_date) || parsedDates.start_date,
      end_date: toStringField(entry.end_date) || parsedDates.end_date,
      bullet_points: toStringArray(entry.bullet_points ?? entry.responsibilities),
    })
  }
  return jobs
}

function normalizeSkills(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean)
      .join(', ')
  }
  if (value == null) return ''
  return String(value)
}

function normalizeEducation(value: unknown, certifications: unknown): string {
  const educationLines: string[] = []

  if (Array.isArray(value)) {
    for (const item of value) {
      const formatted = formatEducationEntry(item)
      if (formatted) educationLines.push(formatted)
    }
  } else {
    const formatted = formatEducationEntry(value)
    if (formatted) {
      educationLines.push(
        ...formatted.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      )
    }
  }

  const certificationParts = toStringArray(certifications)
  const certOnly = certificationParts.filter(
    (cert) => cert.toUpperCase() !== 'CERTIFICATIONS'
  )

  return formatEducationAndCertifications(educationLines.join('\n'), certOnly)
}

function normalizeTemplateData(value: unknown): TemplateData {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

  return {
    full_name: toStringField(record.full_name),
    email: toStringField(record.email),
    phone: toStringField(record.phone),
    location: toStringField(record.location),
    urls: toStringField(record.urls),
    professional_summary: toStringField(record.professional_summary),
    skills: normalizeSkills(record.skills),
    education: toStringField(record.education),
    experience: normalizeExperience(record.experience),
  }
}

function isTemplateData(value: unknown): value is TemplateData {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  const stringFields = [
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

/** Coerce common OpenAI shape issues (null contact fields, missing arrays) before validation */
function normalizeResumeModificationResponse(data: unknown): ResumeModificationResponse {
  const record =
    data && typeof data === 'object' ? (data as Record<string, unknown>) : {}

  const alignmentScore =
    typeof record.target_role_alignment_score === 'number'
      ? record.target_role_alignment_score
      : null

  const changeSummary = toStringArray(record.change_summary)
  if (changeSummary.length === 0 && alignmentScore != null) {
    changeSummary.push(`Target role alignment score: ${alignmentScore}/100`)
  }

  return {
    job_title_from_jd: toStringField(record.job_title_from_jd, 'Position'),
    full_name: toStringField(record.full_name),
    email: toStringField(record.email),
    phone: toStringField(record.phone),
    location: toStringField(record.location),
    urls: toStringField(record.urls),
    professional_summary: toStringField(record.professional_summary),
    skills: normalizeSkills(record.skills),
    education: normalizeEducation(record.education, record.certifications),
    experience: normalizeExperience(record.experience),
    change_summary: changeSummary,
    skills_added: toStringArray(record.skills_added ?? record.ats_keywords_added),
    skills_removed: toStringArray(record.skills_removed),
    skills_boosted: toStringArray(record.skills_boosted),
    experience_transformed: toStringArray(record.experience_transformed),
    warnings: toStringArray(record.warnings),
    suggestions: toStringArray(record.suggestions),
    original_resume: normalizeTemplateData(record.original_resume),
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

  if (!isTemplateData(record.original_resume)) return false

  return true
}

export function parseResumeModificationResponse(data: unknown): ResumeModificationResponse {
  const normalized = normalizeResumeModificationResponse(data)
  if (!isResumeModificationResponse(normalized)) {
    throw new Error('Invalid resume generation response structure')
  }
  return normalized
}
