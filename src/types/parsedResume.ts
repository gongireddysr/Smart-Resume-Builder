export interface ParsedResumeExperience {
  company: string
  job_title: string
  start_date: string
  end_date: string
  bullet_points: string[]
  tools_mentioned: string[]
}

export interface ParsedResume {
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  urls: string[]
  professional_summary: string | null
  skills: string[]
  tools: string[]
  certifications: string[]
  experience: ParsedResumeExperience[]
  education: string | null
  keywords: string[]
  sections_found: string[]
  warnings: string[]
}
