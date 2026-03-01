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
2. Use ALL steps from that flow as "stepsToReproduce", from the very first step (e.g. login) through to the bug.
3. For each step, append a status suffix:
   - If the step completes without issue, append " — successful"
   - If the step is where the bug occurs, append " — issue: <describe exactly what goes wrong>"
4. There must be exactly one step marked as issue. All steps before it are marked successful.
5. Generate a complete, professional bug ticket.

Return a JSON object in this exact shape:
{
  "title": "<concise bug title>",
  "featureAffected": "<matched feature name>",
  "stepsToReproduce": ["<step> — successful", "<step> — successful", "<step> — issue: <what goes wrong>"],
  "expectedResult": "<what should happen>",
  "actualResult": "<what actually happens based on the bug description>",
  "severity": "<Critical | High | Medium | Low>",
  "notes": "<any additional context, edge cases, or suggestions for investigation>"
}

Step format guide:
- "Log in with valid credentials — successful"
- "Navigate to the Documents tab and click Upload — successful"
- "Click the Process button — issue: the spinner runs indefinitely and the page becomes unresponsive"

Severity guide:
- Critical: App crash, data loss, login/auth broken, complete feature failure
- High: Core feature broken for most users, no workaround
- Medium: Feature partially broken, workaround exists
- Low: Minor UI issue, cosmetic bug, edge case

Do not include any text outside the JSON.`;
}
