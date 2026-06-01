import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { LAYER2_JD_PARSE_PROMPT } from "../prompts/layer2-jd-parse";
import type { ParseJobDescriptionRequest } from "../src/types/parsedJobDescription";
import { isParsedJobDescription } from "../src/utils/validateParsedJobDescription";

if (!process.env.OPENAI_API_KEY) {
  loadEnv({ path: resolve(process.cwd(), ".env.local") });
  loadEnv({ path: resolve(process.cwd(), ".env") });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobDescription }: ParseJobDescriptionRequest = req.body;

  if (!jobDescription || typeof jobDescription !== "string") {
    return res.status(400).json({ error: "jobDescription is required" });
  }

  if (jobDescription.trim().length < 50) {
    return res.status(400).json({
      error: "Job description is too short. Please provide a complete job description.",
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
        { role: "system", content: LAYER2_JD_PARSE_PROMPT },
        { role: "user", content: `JOB DESCRIPTION:\n${jobDescription.trim()}` },
      ],
      temperature: 0.1,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message?.content || "";

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isParsedJobDescription(parsed)) {
        throw new Error("Invalid parsed job description structure");
      }

      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error("Layer 2 JSON parse error:", parseError);
      console.error("Raw response:", raw);
      return res.status(500).json({
        error: "Failed to parse job description extraction response. Please try again.",
        debug: process.env.NODE_ENV === "development" ? raw : undefined,
      });
    }
  } catch (err: unknown) {
    console.error("Layer 2 OpenAI error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      error: "Failed to parse job description. Please try again.",
      details: message,
    });
  }
}
