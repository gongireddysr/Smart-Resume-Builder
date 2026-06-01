import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import OpenAI from "openai";

let envLoaded = false;

export function loadOpenAiEnv(): void {
  if (envLoaded || process.env.OPENAI_API_KEY) {
    envLoaded = true;
    return;
  }
  loadEnv({ path: resolve(process.cwd(), ".env.local") });
  loadEnv({ path: resolve(process.cwd(), ".env") });
  envLoaded = true;
}

export function createOpenAiClient(): OpenAI {
  loadOpenAiEnv();
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in the environment");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
