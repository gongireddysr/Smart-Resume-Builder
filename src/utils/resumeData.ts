import type { ParsedResume } from '../types/parsedResume'
import type { ResumeModificationResponse, TemplateData } from '../types/resume'

export function parsedResumeToTemplateData(parsed: ParsedResume): TemplateData {
  const skillItems = [...parsed.skills, ...parsed.tools]
    .map((skill) => skill.trim())
    .filter(Boolean)
  const uniqueSkills = [...new Set(skillItems)]

  const educationParts = [parsed.education, ...parsed.certifications].filter(
    (part): part is string => Boolean(part?.trim())
  )

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
    education: educationParts.join('\n'),
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
