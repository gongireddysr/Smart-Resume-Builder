export interface ParsedJobDescription {
  job_title: string | null
  seniority_level: string | null
  company_name: string | null
  location: string | null
  employment_type: string | null
  required_skills: string[]
  preferred_skills: string[]
  responsibilities: string[]
  qualifications: string[]
  required_certifications: string[]
  years_experience: string | null
  education_requirements: string | null
  soft_skills: string[]
  keywords: string[]
  sections_found: string[]
  warnings: string[]
}

export interface ParseJobDescriptionRequest {
  jobDescription: string
}
