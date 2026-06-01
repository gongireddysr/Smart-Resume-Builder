import type { ParsedJobDescription } from '../types/parsedJobDescription'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function isParsedJobDescription(data: unknown): data is ParsedJobDescription {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  const nullableStrings = [
    'job_title',
    'seniority_level',
    'company_name',
    'location',
    'employment_type',
    'years_experience',
    'education_requirements',
  ] as const

  for (const key of nullableStrings) {
    const value = record[key]
    if (value !== null && typeof value !== 'string') return false
  }

  const arrayFields = [
    'required_skills',
    'preferred_skills',
    'responsibilities',
    'qualifications',
    'required_certifications',
    'soft_skills',
    'keywords',
    'sections_found',
    'warnings',
  ] as const

  for (const key of arrayFields) {
    if (!isStringArray(record[key])) return false
  }

  return true
}
