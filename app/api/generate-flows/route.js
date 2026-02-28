import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { buildFlowPrompt } from "@/lib/prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { features } = body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: "features must be a non-empty array of strings." },
        { status: 400 }
      );
    }

    const prompt = buildFlowPrompt(features);
    const parsed = await generateJSON(prompt);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[generate-flows]", error);
    const message =
      error?.status === 429
        ? "Gemini quota exceeded. Wait a minute and try again, or switch to a paid plan."
        : error?.message || "Failed to generate flows. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
