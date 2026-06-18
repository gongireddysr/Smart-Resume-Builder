import type { ResumeModificationResponse, TemplateData } from '../types/resume'

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
