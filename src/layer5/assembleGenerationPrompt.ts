import { LAYER5_GENERATION_BASE_PROMPT } from '../../prompts/layer5-generation-base'
import type {
  AssembleGenerationPromptInput,
  AssembledGenerationPrompt,
} from '../types/assembledPrompt'
import type { UserPreferences } from '../types/userPreferences'
import type { ParsedJobDescription } from '../types/parsedJobDescription'
import type { ResumeJdMatch } from '../types/resumeJdMatch'
import { normalizeUserPreferences } from '../utils/validateUserPreferences'

function formatPreferenceInstructions(prefs: UserPreferences): string {
  const lengthGuide = {
    concise:
      'Keep the professional summary to 2–3 sentences. Use at most 3 bullet points per role unless the source had fewer.',
    balanced:
      'Use a moderate summary (3–4 sentences) and about 4–5 bullets per role where the source supports it.',
    detailed:
      'Allow a fuller summary and up to 6 bullets per role when the original resume provides enough material.',
  }[prefs.output_length]

  const focusGuide = {
    general: 'Balance technical and business outcomes.',
    technical: 'Lead with tools, architecture, and measurable technical outcomes.',
    leadership: 'Lead with scope, stakeholders, team impact, and ownership — without inventing management titles.',
  }[prefs.focus]

  const toneGuide = {
    professional: 'Clear, confident, neutral professional tone.',
    friendly: 'Approachable and clear while staying professional.',
    formal: 'Formal, precise wording suitable for conservative industries.',
  }[prefs.tone]

  const atsLine = prefs.ats_optimization
    ? 'Where truthful, weave JD keywords from the match analysis into summary, skills, and bullets — no keyword stuffing.'
    : 'Prioritize natural readability over keyword density.'

  const custom =
    prefs.custom_instructions.trim().length > 0
      ? `\n- User custom instructions: ${prefs.custom_instructions.trim()}`
      : ''

  return [
    `- Output length (${prefs.output_length}): ${lengthGuide}`,
    `- Focus (${prefs.focus}): ${focusGuide}`,
    `- Tone (${prefs.tone}): ${toneGuide}`,
    `- ATS emphasis: ${atsLine}`,
    custom,
  ].join('\n')
}

function formatJdSection(jd: ParsedJobDescription): string {
  const lines = [
    `Title: ${jd.job_title ?? 'Not specified'}`,
    `Seniority: ${jd.seniority_level ?? 'Not specified'}`,
    `Company: ${jd.company_name ?? 'Not specified'}`,
    `Required skills: ${jd.required_skills.join(', ') || 'None listed'}`,
    `Preferred skills: ${jd.preferred_skills.join(', ') || 'None listed'}`,
    `Key responsibilities: ${jd.responsibilities.slice(0, 8).join(' | ') || 'None listed'}`,
    `Qualifications: ${jd.qualifications.slice(0, 6).join(' | ') || 'None listed'}`,
    `JD keywords: ${jd.keywords.slice(0, 25).join(', ') || 'None listed'}`,
  ]
  return lines.join('\n')
}

function formatMatchSection(match: ResumeJdMatch): string {
  const rel = match.relevance_estimate
  const scoreNote =
    rel.score_estimate != null
      ? ` (rough estimate ${rel.score_estimate}/100 — not an official ATS score)`
      : ''

  return [
    `Relevance: ${rel.level}${scoreNote} — ${rel.rationale}`,
    `Experience fit (${match.experience_fit.seniority_alignment}): ${match.experience_fit.summary}`,
    `Matching skills: ${match.matching_skills.join(', ') || 'None'}`,
    `Missing required: ${match.missing_required_skills.join(', ') || 'None'}`,
    `Missing preferred: ${match.missing_preferred_skills.join(', ') || 'None'}`,
    `Strengths: ${match.strengths.join('; ') || 'None'}`,
    `Gaps: ${match.gaps.join('; ') || 'None'}`,
    `Keywords to weave (if truthful): ${match.keyword_alignment.matched.join(', ') || 'None'}`,
    `Keywords missing from resume: ${match.keyword_alignment.missing_from_resume.join(', ') || 'None'}`,
    `Tailoring hints: ${match.tailoring_hints.join('; ') || 'None'}`,
    match.warnings.length > 0 ? `Match warnings: ${match.warnings.join('; ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Layer 5 — assemble system + user prompts for Layer 6 (no LLM call).
 */
export function assembleGenerationPrompt(
  input: AssembleGenerationPromptInput
): AssembledGenerationPrompt {
  const prefs = normalizeUserPreferences(input.userPreferences)
  const preferenceBlock = formatPreferenceInstructions(prefs)

  const system_prompt = `${LAYER5_GENERATION_BASE_PROMPT}

## Active user preferences
${preferenceBlock}`

  const user_prompt = [
    '## User preferences',
    preferenceBlock,
    '',
    '## Target job (parsed)',
    formatJdSection(input.parsedJobDescription),
    '',
    '## Resume vs job match',
    formatMatchSection(input.match),
    '',
    '## Parsed resume (structured)',
    JSON.stringify(input.parsedResume, null, 2),
    '',
    '## Source resume text (ground truth — do not contradict)',
    input.resumeText.trim(),
    '',
    '## Job description (reference)',
    input.jobDescription.trim(),
  ].join('\n')

  return {
    system_prompt,
    user_prompt,
  }
}
