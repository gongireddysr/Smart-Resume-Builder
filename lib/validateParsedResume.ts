import type { ParsedResume } from './types/parsedResume.js'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function isParsedResume(data: unknown): data is ParsedResume {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  if (!isStringArray(record.skills)) return false
  if (!isStringArray(record.tools)) return false
  if (!isStringArray(record.certifications)) return false
  if (!isStringArray(record.keywords)) return false
  if (!isStringArray(record.sections_found)) return false
  if (!isStringArray(record.warnings)) return false
  if (!isStringArray(record.urls)) return false

  if (!Array.isArray(record.experience)) return false

  for (const job of record.experience) {
    if (!job || typeof job !== 'object') return false
    const entry = job as Record<string, unknown>
    if (typeof entry.company !== 'string') return false
    if (typeof entry.job_title !== 'string') return false
    if (typeof entry.start_date !== 'string') return false
    if (typeof entry.end_date !== 'string') return false
    if (!isStringArray(entry.bullet_points)) return false
    if (!isStringArray(entry.tools_mentioned)) return false
  }

  return true
}
