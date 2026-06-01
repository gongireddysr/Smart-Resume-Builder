import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { LAYER1_RESUME_PARSE_PROMPT } from "../prompts/layer1-resume-parse";
import type { ParseResumeRequest } from "../src/types/parsedResume";
import { isParsedResume } from "../src/utils/validateParsedResume";

if (!process.env.OPENAI_API_KEY) {
  loadEnv({ path: resolve(process.cwd(), ".env.local") });
  loadEnv({ path: resolve(process.cwd(), ".env") });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText }: ParseResumeRequest = req.body;

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Resume text is too short. Please provide a complete resume.",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set in the environment" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: LAYER1_RESUME_PARSE_PROMPT },
        { role: "user", content: `RESUME TEXT:\n${resumeText.trim()}` },
      ],
      temperature: 0.1,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message?.content || "";

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isParsedResume(parsed)) {
        throw new Error("Invalid parsed resume structure");
      }

      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error("Layer 1 JSON parse error:", parseError);
      console.error("Raw response:", raw);
      return res.status(500).json({
        error: "Failed to parse resume extraction response. Please try again.",
        debug: process.env.NODE_ENV === "development" ? raw : undefined,
      });
    }
  } catch (err: unknown) {
    console.error("Layer 1 OpenAI error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      error: "Failed to parse resume. Please try again.",
      details: message,
    });
  }
}
