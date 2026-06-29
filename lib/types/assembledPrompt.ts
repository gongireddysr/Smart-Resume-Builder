import type { ParsedJobDescription } from './parsedJobDescription.js'
import type { ParsedResume } from './parsedResume.js'
import type { ResumeJdMatch } from './resumeJdMatch.js'
import type { UserPreferences } from './userPreferences.js'

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
}
