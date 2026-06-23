import {
  DEFAULT_USER_PREFERENCES,
  MAX_CUSTOM_INSTRUCTIONS_LENGTH,
  type UserPreferences,
} from './types/userPreferences'

const OUTPUT_LENGTHS = new Set(['concise', 'balanced', 'detailed', 'comprehensive'])
const FOCUS_OPTIONS = new Set(['general', 'technical', 'leadership'])
const TONE_OPTIONS = new Set(['professional', 'friendly', 'formal'])

export function isUserPreferences(data: unknown): data is UserPreferences {
  if (!data || typeof data !== 'object') return false

  const record = data as Record<string, unknown>

  if (typeof record.output_length !== 'string' || !OUTPUT_LENGTHS.has(record.output_length)) {
    return false
  }
  if (typeof record.focus !== 'string' || !FOCUS_OPTIONS.has(record.focus)) {
    return false
  }
  if (typeof record.ats_optimization !== 'boolean') return false
  if (typeof record.tone !== 'string' || !TONE_OPTIONS.has(record.tone)) return false
  if (typeof record.custom_instructions !== 'string') return false
  if (record.custom_instructions.length > MAX_CUSTOM_INSTRUCTIONS_LENGTH) return false

  return true
}

/** Normalize partial or API input; falls back to defaults for invalid fields */
export function normalizeUserPreferences(
  input?: Partial<UserPreferences> | null
): UserPreferences {
  if (!input) return { ...DEFAULT_USER_PREFERENCES }

  const merged: UserPreferences = {
    ...DEFAULT_USER_PREFERENCES,
    ...input,
    custom_instructions: (input.custom_instructions ?? '').slice(0, MAX_CUSTOM_INSTRUCTIONS_LENGTH),
  }

  return isUserPreferences(merged) ? merged : { ...DEFAULT_USER_PREFERENCES }
}
