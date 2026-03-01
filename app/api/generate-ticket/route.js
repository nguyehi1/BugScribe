import { NextResponse } from "next/server";
import { generateJSON, resolveErrorMessage } from "@/lib/gemini";
import { buildTicketPrompt } from "@/lib/prompts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { bugDescription, flows } = body;

    if (!bugDescription || typeof bugDescription !== "string") {
      return NextResponse.json(
        { error: "bugDescription must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!flows || !Array.isArray(flows) || flows.length === 0) {
      return NextResponse.json(
        { error: "flows must be a non-empty array of approved feature flows." },
        { status: 400 }
      );
    }

    // Strip internal fields before sending to the LLM
    const cleanFlows = flows.map(({ feature, steps }) => ({ feature, steps }));
    const prompt = buildTicketPrompt(bugDescription, cleanFlows);
    const parsed = await generateJSON(prompt);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[generate-ticket]", error);
    const message = resolveErrorMessage(error, "Failed to generate ticket. Please try again.");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
