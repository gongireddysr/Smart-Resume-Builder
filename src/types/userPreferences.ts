/** Layer 4 — general tailoring options (client-side; consumed by Layer 5/6) */

export type OutputLength = 'concise' | 'balanced' | 'detailed' | 'comprehensive'

export type ResumeFocus = 'general' | 'technical' | 'leadership'

export type ResumeTone = 'professional' | 'friendly' | 'formal'

export interface UserPreferences {
  output_length: OutputLength
  focus: ResumeFocus
  ats_optimization: boolean
  tone: ResumeTone
  /** Optional free-text guidance for generation */
  custom_instructions: string
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  output_length: 'comprehensive',
  focus: 'general',
  ats_optimization: true,
  tone: 'professional',
  custom_instructions: '',
}

export const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 500
