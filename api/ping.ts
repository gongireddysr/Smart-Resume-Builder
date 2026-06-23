import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Minimal health check — no OpenAI or src/ imports. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    ok: true,
    service: "smart-resume-builder",
    openai_configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
  });
}
