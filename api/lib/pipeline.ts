import type OpenAI from "openai";
import { LAYER1_RESUME_PARSE_PROMPT } from "../../prompts/layer1-resume-parse";
import { LAYER2_JD_PARSE_PROMPT } from "../../prompts/layer2-jd-parse";
import { LAYER3_MATCH_PROMPT } from "../../prompts/layer3-match";
import { assembleGenerationPrompt } from "../../src/layer5/assembleGenerationPrompt";
import { parsedResumeToTemplateData } from "../../src/utils/resumeData";
import type { ParsedJobDescription } from "../../src/types/parsedJobDescription";
import type { ParsedResume } from "../../src/types/parsedResume";
import type { ResumeModificationResponse } from "../../src/types/resume";
import type { ResumeJdMatch } from "../../src/types/resumeJdMatch";
import type { UserPreferences } from "../../src/types/userPreferences";
import { isParsedJobDescription } from "../../src/utils/validateParsedJobDescription";
import { isParsedResume } from "../../src/utils/validateParsedResume";
import { isResumeJdMatch } from "../../src/utils/validateResumeJdMatch";
import { parseResumeModificationResponse } from "../../src/utils/validateResumeResponse";
import { normalizeUserPreferences } from "../../src/utils/validateUserPreferences";

export interface PipelineInput {
  resumeText: string;
  jobDescription: string;
  userPreferences?: UserPreferences | null;
}

async function chatJson(
  openai: OpenAI,
  system: string,
  user: string,
  options: { temperature: number; max_tokens: number }
): Promise<unknown> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: options.temperature,
    max_tokens: options.max_tokens,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message?.content ?? "";
  return JSON.parse(raw) as unknown;
}

async function parseResumeLayer(
  openai: OpenAI,
  resumeText: string
): Promise<ParsedResume> {
  const parsed = await chatJson(
    openai,
    LAYER1_RESUME_PARSE_PROMPT,
    `RESUME TEXT:\n${resumeText}`,
    { temperature: 0.1, max_tokens: 3000 }
  );
  if (!isParsedResume(parsed)) {
    throw new Error("Invalid parsed resume structure");
  }
  return parsed;
}

async function parseJobDescriptionLayer(
  openai: OpenAI,
  jobDescription: string
): Promise<ParsedJobDescription> {
  const parsed = await chatJson(
    openai,
    LAYER2_JD_PARSE_PROMPT,
    `JOB DESCRIPTION:\n${jobDescription}`,
    { temperature: 0.1, max_tokens: 2500 }
  );
  if (!isParsedJobDescription(parsed)) {
    throw new Error("Invalid parsed job description structure");
  }
  return parsed;
}

async function matchResumeJdLayer(
  openai: OpenAI,
  parsedResume: ParsedResume,
  parsedJobDescription: ParsedJobDescription
): Promise<ResumeJdMatch> {
  const userContent = `PARSED RESUME (Layer 1):\n${JSON.stringify(parsedResume)}\n\nPARSED JOB DESCRIPTION (Layer 2):\n${JSON.stringify(parsedJobDescription)}`;
  const parsed = await chatJson(openai, LAYER3_MATCH_PROMPT, userContent, {
    temperature: 0.2,
    max_tokens: 3000,
  });
  if (!isResumeJdMatch(parsed)) {
    throw new Error("Invalid resume–JD match structure");
  }
  return parsed;
}

async function generateResumeLayer(
  openai: OpenAI,
  systemPrompt: string,
  userPrompt: string,
  parsedResume: ParsedResume,
  parsedJobDescription: ParsedJobDescription
): Promise<ResumeModificationResponse> {
  const parsed = await chatJson(openai, systemPrompt, userPrompt, {
    temperature: 0.3,
    max_tokens: 4000,
  });
  const result = parseResumeModificationResponse(parsed);

  return {
    ...result,
    job_title_from_jd:
      result.job_title_from_jd === 'Position'
        ? parsedJobDescription.job_title ?? 'Position'
        : result.job_title_from_jd,
    full_name: result.full_name || parsedResume.full_name || '',
    email: result.email || parsedResume.email || '',
    phone: result.phone || parsedResume.phone || '',
    location: result.location || parsedResume.location || '',
    urls:
      result.urls ||
      (parsedResume.urls.length > 0 ? parsedResume.urls.join(', ') : ''),
  };
}

/**
 * Layer 6 — run full pipeline: L1 + L2 (parallel) → L3 → L5 → L6
 */
export async function runResumeModificationPipeline(
  openai: OpenAI,
  input: PipelineInput
): Promise<ResumeModificationResponse> {
  const resumeText = input.resumeText.trim();
  const jobDescription = input.jobDescription.trim();
  const userPreferences = normalizeUserPreferences(input.userPreferences);

  const [parsedResume, parsedJobDescription] = await Promise.all([
    parseResumeLayer(openai, resumeText),
    parseJobDescriptionLayer(openai, jobDescription),
  ]);

  const match = await matchResumeJdLayer(openai, parsedResume, parsedJobDescription);

  const { system_prompt, user_prompt } = assembleGenerationPrompt({
    parsedResume,
    parsedJobDescription,
    match,
    userPreferences,
    resumeText,
    jobDescription,
  });

  const modificationResult = await generateResumeLayer(
    openai,
    system_prompt,
    user_prompt,
    parsedResume,
    parsedJobDescription
  );

  return {
    ...modificationResult,
    original_resume: parsedResumeToTemplateData(parsedResume),
  };
}
