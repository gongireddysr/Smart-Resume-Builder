import type { ParsedResume } from './types/parsedResume'
import type { ResumeModificationResponse, TemplateData } from './types/resume'

function toTrimmedString(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}

/** Format a single education entry from string or object shapes returned by the LLM. */
export function formatEducationEntry(item: unknown): string {
  if (typeof item === 'string') return item.trim()
  if (!item || typeof item !== 'object') return ''

  const entry = item as Record<string, unknown>

  if (typeof entry.text === 'string') return entry.text.trim()
  if (typeof entry.description === 'string') return entry.description.trim()

  const degree = toTrimmedString(
    entry.degree ?? entry.degree_name ?? entry.title ?? entry.program
  )
  const school = toTrimmedString(
    entry.school ?? entry.institution ?? entry.university ?? entry.college
  )
  const year = toTrimmedString(
    entry.year ?? entry.graduation_year ?? entry.end_date ?? entry.date
  )
  const location = toTrimmedString(entry.location ?? entry.city)

  const parts = [degree, school, location, year].filter(Boolean)
  if (parts.length > 0) return parts.join(', ')

  const stringValues = Object.values(entry)
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim())

  return stringValues.join(', ')
}

/** Build the education + certifications block exactly as it should appear on the resume. */
export function formatEducationAndCertifications(
  education: string | null | undefined,
  certifications: string[]
): string {
  const lines: string[] = []

  if (education?.trim()) {
    lines.push(...education.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
  }

  if (certifications.length > 0) {
    if (lines.length > 0) lines.push('')
    lines.push('CERTIFICATIONS')
    lines.push(...certifications.map((cert) => cert.trim()).filter(Boolean))
  }

  return lines.join('\n')
}

export function buildEducationFromParsedResume(parsed: ParsedResume): string {
  return formatEducationAndCertifications(parsed.education, parsed.certifications)
}

export function parsedResumeToTemplateData(parsed: ParsedResume): TemplateData {
  const skillItems = [...parsed.skills, ...parsed.tools]
    .map((skill) => skill.trim())
    .filter(Boolean)
  const uniqueSkills = [...new Set(skillItems)]

  return {
    full_name: parsed.full_name ?? '',
    email: parsed.email ?? '',
    phone: parsed.phone ?? '',
    location: parsed.location ?? '',
    urls: parsed.urls.join(', '),
    professional_summary: parsed.professional_summary ?? '',
    skills: uniqueSkills.join(', '),
    experience: parsed.experience.map((job) => ({
      company: job.company,
      job_title: job.job_title,
      start_date: job.start_date,
      end_date: job.end_date,
      bullet_points: [...job.bullet_points],
    })),
    education: buildEducationFromParsedResume(parsed),
  }
}

export function modificationResultToTemplateData(
  result: ResumeModificationResponse
): TemplateData {
  return {
    full_name: result.full_name,
    email: result.email,
    phone: result.phone,
    location: result.location,
    urls: result.urls,
    professional_summary: result.professional_summary,
    skills: result.skills,
    experience: result.experience.map((job) => ({
      ...job,
      bullet_points: [...job.bullet_points],
    })),
    education: result.education,
  }
}

export function parseSkills(skillsString: string): string[] {
  if (!skillsString) return []
  return skillsString
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
}

/** Flat lines for display — preserves "Category: a, b, c" groups when pipe-separated. */
export function parseSkillDisplayLines(skillsString: string): string[] {
  if (!skillsString) return []

  if (skillsString.includes(' | ')) {
    return skillsString
      .split(' | ')
      .map((group) => group.trim())
      .filter(Boolean)
  }

  return parseSkills(skillsString)
}

export function usesCategorizedSkills(skillsString: string): boolean {
  return skillsString.includes(' | ') || /[A-Za-z][^:]{0,40}:\s/.test(skillsString)
}

export function skillsToString(skills: string[]): string {
  return skills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .join(', ')
}

export function splitSkillsIntoColumns(skills: string[]) {
  const midpoint = Math.ceil(skills.length / 2)
  return {
    leftColumn: skills.slice(0, midpoint),
    rightColumn: skills.slice(midpoint),
  }
}
