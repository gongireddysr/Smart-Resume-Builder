// api/modify-resume.ts
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, role } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set in the environment" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if you prefer cheaper
      messages: [
        {
          role: "system",
          content: "You are a professional resume improvement assistant.",
        },
        {
          role: "user",
          content: `Improve this resume for ${role || "a job"}:\n${text}`,
        },
      ],
    });

    const result = response.choices[0].message?.content || "";
    return res.status(200).json({ result });
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to modify resume" });
  }
}
