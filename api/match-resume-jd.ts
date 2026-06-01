import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { LAYER3_MATCH_PROMPT } from "../prompts/layer3-match";
import type { MatchResumeJdRequest } from "../src/types/resumeJdMatch";
import { isParsedJobDescription } from "../src/utils/validateParsedJobDescription";
import { isParsedResume } from "../src/utils/validateParsedResume";
import { isResumeJdMatch } from "../src/utils/validateResumeJdMatch";

if (!process.env.OPENAI_API_KEY) {
  loadEnv({ path: resolve(process.cwd(), ".env.local") });
  loadEnv({ path: resolve(process.cwd(), ".env") });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { parsedResume, parsedJobDescription }: MatchResumeJdRequest = req.body;

  if (!isParsedResume(parsedResume)) {
    return res.status(400).json({
      error: "parsedResume is required and must be a valid Layer 1 parse result",
    });
  }

  if (!isParsedJobDescription(parsedJobDescription)) {
    return res.status(400).json({
      error: "parsedJobDescription is required and must be a valid Layer 2 parse result",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set in the environment" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userContent = `PARSED RESUME (Layer 1):\n${JSON.stringify(parsedResume)}\n\nPARSED JOB DESCRIPTION (Layer 2):\n${JSON.stringify(parsedJobDescription)}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: LAYER3_MATCH_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message?.content || "";

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isResumeJdMatch(parsed)) {
        throw new Error("Invalid resume–JD match structure");
      }

      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error("Layer 3 JSON parse error:", parseError);
      console.error("Raw response:", raw);
      return res.status(500).json({
        error: "Failed to parse match analysis response. Please try again.",
        debug: process.env.NODE_ENV === "development" ? raw : undefined,
      });
    }
  } catch (err: unknown) {
    console.error("Layer 3 OpenAI error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      error: "Failed to match resume to job description. Please try again.",
      details: message,
    });
  }
}
