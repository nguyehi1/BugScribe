import { NextResponse } from "next/server";
import { generateJSON, resolveErrorMessage } from "@/lib/gemini";
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
    const message = resolveErrorMessage(error, "Failed to generate flows. Please try again.");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
