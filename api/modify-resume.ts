import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ResumeModificationRequest } from "../lib/types/resume.js";

export const config = {
  maxDuration: 60,
};

function getOpenAiApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: Boolean(getOpenAiApiKey()),
      openai_configured: Boolean(getOpenAiApiKey()),
      vercel: Boolean(process.env.VERCEL),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body ?? {}) as ResumeModificationRequest;
  const { resumeText, jobDescription, userPreferences } = body;

  if (!getOpenAiApiKey()) {
    return res.status(500).json({
      error:
        "OPENAI_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables for Production, then redeploy.",
    });
  }

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
  }

  if (!jobDescription || typeof jobDescription !== "string") {
    return res.status(400).json({ error: "jobDescription is required" });
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Resume text is too short. Please provide a complete resume.",
    });
  }

  if (jobDescription.trim().length < 50) {
    return res.status(400).json({
      error: "Job description is too short. Please provide a complete job description.",
    });
  }

  try {
    // Lazy-load the heavy pipeline so any import-time failure surfaces as a
    // readable JSON error instead of an opaque FUNCTION_INVOCATION_FAILED.
    const [{ createOpenAiClient }, { runResumeModificationPipeline }, { normalizeUserPreferences }] =
      await Promise.all([
        import("./lib/openaiEnv.js"),
        import("./lib/pipeline.js"),
        import("../lib/validateUserPreferences.js"),
      ]);

    const openai = createOpenAiClient();

    const result = await runResumeModificationPipeline(openai, {
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
      userPreferences: normalizeUserPreferences(userPreferences),
    });

    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("Layer 6 pipeline error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("OPENAI_API_KEY")) {
      return res.status(500).json({ error: message });
    }

    if (
      message.includes("Invalid parsed") ||
      message.includes("Invalid resume") ||
      message.includes("Invalid resume–JD") ||
      message.includes("Invalid resume generation")
    ) {
      return res.status(500).json({
        error: "Pipeline produced an invalid response. Please try again.",
        details: message,
      });
    }

    if (message.includes("401") || message.toLowerCase().includes("incorrect api key")) {
      return res.status(500).json({
        error:
          "OpenAI API key is invalid or expired. Create a new key at platform.openai.com and update OPENAI_API_KEY in Vercel, then redeploy.",
        details: message,
      });
    }

    return res.status(500).json({
      error: "Failed to modify resume. Please try again.",
      details: message,
    });
  }
}
