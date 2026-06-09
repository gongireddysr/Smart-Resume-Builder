export type RelevanceLevel = 'low' | 'medium' | 'high'

export type SeniorityAlignment = 'underqualified' | 'aligned' | 'overqualified' | 'unclear'

export interface PartialSkillMatch {
  jd_term: string
  resume_term: string
  note: string
}

export interface KeywordAlignment {
  matched: string[]
  missing_from_resume: string[]
  resume_only: string[]
}

export interface RelevanceEstimate {
  level: RelevanceLevel
  /** 0–100 rough fit estimate — not a real ATS score */
  score_estimate: number | null
  rationale: string
}

export interface ExperienceFit {
  seniority_alignment: SeniorityAlignment
  summary: string
}

export interface ResumeJdMatch {
  matching_skills: string[]
  missing_required_skills: string[]
  missing_preferred_skills: string[]
  partial_matches: PartialSkillMatch[]
  strengths: string[]
  gaps: string[]
  keyword_alignment: KeywordAlignment
  relevance_estimate: RelevanceEstimate
  experience_fit: ExperienceFit
  /** Actionable hints for Layer 6 generation — do not rewrite resume here */
  tailoring_hints: string[]
  warnings: string[]
}
