import type { ResumeJdMatch } from '../types/resumeJdMatch'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

const RELEVANCE_LEVELS = new Set(['low', 'medium', 'high'])
const SENIORITY_ALIGNMENTS = new Set(['underqualified', 'aligned', 'overqualified', 'unclear'])

export function isResumeJdMatch(data: unknown): data is ResumeJdMatch {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  const topArrays = [
    'matching_skills',
    'missing_required_skills',
    'missing_preferred_skills',
    'strengths',
    'gaps',
    'tailoring_hints',
    'warnings',
  ] as const

  for (const key of topArrays) {
    if (!isStringArray(record[key])) return false
  }

  if (!Array.isArray(record.partial_matches)) return false
  for (const item of record.partial_matches) {
    if (!item || typeof item !== 'object') return false
    const match = item as Record<string, unknown>
    if (typeof match.jd_term !== 'string') return false
    if (typeof match.resume_term !== 'string') return false
    if (typeof match.note !== 'string') return false
  }

  const keywordAlignment = record.keyword_alignment
  if (!keywordAlignment || typeof keywordAlignment !== 'object') return false
  const kw = keywordAlignment as Record<string, unknown>
  if (!isStringArray(kw.matched)) return false
  if (!isStringArray(kw.missing_from_resume)) return false
  if (!isStringArray(kw.resume_only)) return false

  const relevance = record.relevance_estimate
  if (!relevance || typeof relevance !== 'object') return false
  const rel = relevance as Record<string, unknown>
  if (typeof rel.level !== 'string' || !RELEVANCE_LEVELS.has(rel.level)) return false
  if (rel.score_estimate !== null) {
    if (typeof rel.score_estimate !== 'number' || rel.score_estimate < 0 || rel.score_estimate > 100) {
      return false
    }
  }
  if (typeof rel.rationale !== 'string') return false

  const experienceFit = record.experience_fit
  if (!experienceFit || typeof experienceFit !== 'object') return false
  const exp = experienceFit as Record<string, unknown>
  if (typeof exp.seniority_alignment !== 'string' || !SENIORITY_ALIGNMENTS.has(exp.seniority_alignment)) {
    return false
  }
  if (typeof exp.summary !== 'string') return false

  return true
}
