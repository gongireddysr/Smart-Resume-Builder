import type { ParsedJobDescription } from './parsedJobDescription'
import type { ParsedResume } from './parsedResume'
import type { ResumeJdMatch } from './resumeJdMatch'
import type { UserPreferences } from './userPreferences'

/** Inputs Layer 5 needs from Layers 1–4 plus source text for grounding */
export interface AssembleGenerationPromptInput {
  parsedResume: ParsedResume
  parsedJobDescription: ParsedJobDescription
  match: ResumeJdMatch
  userPreferences: UserPreferences
  resumeText: string
  jobDescription: string
}

export interface AssembledGenerationPrompt {
  system_prompt: string
  user_prompt: string
  metadata: {
    job_title: string | null
    relevance_level: ResumeJdMatch['relevance_estimate']['level']
  }
}
