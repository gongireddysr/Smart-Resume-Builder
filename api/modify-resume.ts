// api/modify-resume.ts
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ResumeModificationRequest {
  resumeText: string;
  jobDescription: string;
}

interface ResumeModificationResponse {
  rewritten_resume: string;
  change_summary: string[];
  skills_added: string[];
  skills_boosted: string[];
  warnings: string[];
  suggestions: string[];
}

const EXPERT_HR_SYSTEM_PROMPT = `You are an expert HR lead and resume writer with 15+ years hiring experience across tech and non-tech roles, and a deep understanding of Applicant Tracking Systems (ATS). Be precise, factual, professional and conservative: never fabricate or invent personal facts (names, dates, employers, degrees). Work only with the information provided. If data is missing that is required by the job, mark it as a suggestion and do not add it into the resume text as fact.

Your objectives:
1. Read the provided Job Description (JD) and extract: role title, responsibilities, required skills, preferred skills, minimum qualifications, years of experience, industry, certifications, location/remote requirements (if present).
2. Read the provided Resume text and extract: candidate full name (if present), contact info (do not change), current role & company (do not invent replacements), past roles & dates (do not invent), projects, skills, certifications, education and graduation years (only if present).
3. Produce a rewritten resume text that:
   - Aligns the resume to the JD (keywords, responsibilities, and required skills).
   - Keeps all verified personal facts unchanged (name, email, phone, company names, dates); do not invent new employers, dates, or certifications.
   - Reframes and reorders existing content to highlight relevant experience, add ATS keywords, and quantify achievements when numbers are already present or can be derived from the provided text. Do NOT fabricate quantifiable achievements.
   - Prefer short, strong bullet points that start with action verbs.
   - Maintain a clean, ATS-friendly structure: simple headings (PROFESSIONAL SUMMARY, EXPERIENCE, PROJECTS, SKILLS, EDUCATION, CERTIFICATIONS), no headers/footers, avoid images, avoid unusual characters or emojis.
4. Provide a concise change summary (3–10 bullets) describing what changed and why (e.g., "Added AWS keywords to Skills to match JD", "Rewrote Professional Summary to emphasize 5+ years in fintech").
5. Provide structured metadata: skills_added[], skills_boosted[], warnings[], suggestions[] (e.g., suggestion: "Pursue AWS Solutions Architect if JD requires certification"; warning: "No graduation year found").
6. If the resume lacks required qualifications that cannot be created (e.g., missing degree), do NOT fabricate — produce a suggestion entry (not integrated into the resume text) like: "Suggestion: add 'Pursuing X' or obtain Y certification". Do not add "fake" certifications, companies, or dates.

You must respond with valid JSON matching this exact schema:
{
  "rewritten_resume": "string - The complete rewritten resume text",
  "change_summary": ["string array - 3-10 bullets describing what changed and why"],
  "skills_added": ["string array - New skills/keywords added to match JD"],
  "skills_boosted": ["string array - Existing skills that were emphasized or repositioned"],
  "warnings": ["string array - Missing critical information that couldn't be fabricated"],
  "suggestions": ["string array - Recommendations for candidate to improve their profile"]
}

Do not output any text outside the JSON response.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText, jobDescription }: ResumeModificationRequest = req.body;

  // Validate inputs
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ 
      error: "Both resumeText and jobDescription are required" 
    });
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({ 
      error: "Resume text is too short. Please provide a complete resume." 
    });
  }

  if (jobDescription.trim().length < 50) {
    return res.status(400).json({ 
      error: "Job description is too short. Please provide a complete job description." 
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
        {
          role: "system",
          content: EXPERT_HR_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME TEXT:\n${resumeText}`,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent, professional output
      max_tokens: 4000,
    });

    const result = response.choices[0].message?.content || "";
    
    // Parse and validate JSON response
    try {
      const parsedResult: ResumeModificationResponse = JSON.parse(result);
      
      // Validate required fields
      if (!parsedResult.rewritten_resume || !Array.isArray(parsedResult.change_summary)) {
        throw new Error("Invalid response structure");
      }
      
      return res.status(200).json(parsedResult);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", result);
      return res.status(500).json({ 
        error: "Failed to parse AI response. Please try again.",
        debug: process.env.NODE_ENV === 'development' ? result : undefined
      });
    }
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ 
      error: "Failed to modify resume. Please try again.",
      details: err.message
    });
  }
}
