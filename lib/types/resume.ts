export interface ResumeExperience {
  company: string
  job_title: string
  start_date: string
  end_date: string
  bullet_points: string[]
}

export interface TemplateData {
  full_name?: string
  email?: string
  phone?: string
  location?: string
  urls?: string
  professional_summary?: string
  skills?: string
  experience?: ResumeExperience[]
  education?: string
}

import type { UserPreferences } from './userPreferences.js'

export interface ResumeModificationRequest {
  resumeText: string
  jobDescription: string
  userPreferences?: UserPreferences
}

export interface ResumeModificationResponse {
  job_title_from_jd: string
  full_name: string
  email: string
  phone: string
  location: string
  urls: string
  professional_summary: string
  skills: string
  experience: ResumeExperience[]
  education: string
  change_summary: string[]
  skills_added: string[]
  skills_removed: string[]
  skills_boosted: string[]
  experience_transformed: string[]
  warnings: string[]
  suggestions: string[]
  original_resume: TemplateData
}
