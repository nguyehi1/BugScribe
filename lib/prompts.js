/**
 * Builds the prompt for generating user flows from a feature list.
 * @param {string[]} features
 * @returns {string}
 */
export function buildFlowPrompt(features) {
  return `You are a senior QA analyst writing detailed user flows for a software product.

Given the following list of features, generate a step-by-step user flow for each one.
Each step should describe a concrete, UI-level action a real user would perform.

Features:
${features.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Return a JSON object in this exact shape:
{
  "flows": [
    {
      "feature": "<feature name>",
      "steps": ["<step 1>", "<step 2>", "..."]
    }
  ]
}

Rules:
- Steps must be specific and action-oriented (e.g. "Click the 'Upload' button")
- Each feature should have between 4 and 10 steps
- Do not include any text outside the JSON`;
}

/**
 * Builds the prompt for generating a structured bug ticket.
 * @param {string} bugDescription
 * @param {Array<{feature: string, steps: string[]}>} flows
 * @returns {string}
 */
export function buildTicketPrompt(bugDescription, flows) {
  return `You are a senior QA engineer writing structured Jira-style bug tickets.

Bug description from a product manager:
"${bugDescription}"

Available approved feature flows:
${JSON.stringify(flows, null, 2)}

Instructions:
1. Identify the single most relevant feature flow based on the bug description.
2. Use that flow's steps as the basis for "Steps to Reproduce", adapting them to describe how the bug would be encountered.
3. Generate a complete, professional bug ticket.

Return a JSON object in this exact shape:
{
  "title": "<concise bug title>",
  "featureAffected": "<matched feature name>",
  "stepsToReproduce": ["<step 1>", "<step 2>", "..."],
  "expectedResult": "<what should happen>",
  "actualResult": "<what actually happens based on the bug description>",
  "severity": "<Critical | High | Medium | Low>",
  "notes": "<any additional context, edge cases, or suggestions for investigation>"
}

Severity guide:
- Critical: App crash, data loss, login/auth broken, complete feature failure
- High: Core feature broken for most users, no workaround
- Medium: Feature partially broken, workaround exists
- Low: Minor UI issue, cosmetic bug, edge case

Do not include any text outside the JSON.`;
}
