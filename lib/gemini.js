import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Sends a prompt to Gemini and returns parsed JSON.
 * Model can be overridden via GEMINI_MODEL env var (default: gemini-2.5-flash).
 * @param {string} prompt
 * @returns {Promise<object>}
 */
export async function generateJSON(prompt) {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

/**
 * Extracts a user-friendly error message from a caught API error.
 * Returns a quota-specific message for HTTP 429; otherwise falls back to the
 * error's own message or the provided fallback string.
 * @param {unknown} error
 * @param {string} fallback
 * @returns {string}
 */
export function resolveErrorMessage(error, fallback) {
  if (error?.status === 429) {
    return "Gemini quota exceeded. Wait a minute and try again, or switch to a paid plan.";
  }
  return error?.message || fallback;
}
